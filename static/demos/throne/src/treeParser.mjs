export const ROOT_BINDING_SENTINEL = "__ROOT__";

export default function parseTree(input) {
  return {
    source: input.replace(/\r\n?/g, "\n"),
  };
}

export function formatError(error) {
  switch (error.kind) {
    case "mixed-indentation":
      return `Inconsistent indentation at line ${error.line}: mixed tabs and spaces`;
    case "invalid-indent-size":
      return `Inconsistent indentation at line ${error.line}: indent ${error.indent} is not a multiple of ${error.indentSize}`;
    case "indented-root":
      return `Invalid indentation at line ${error.line}: root level node must have no indentation`;
    case "indent-jump":
      return `Invalid indentation at line ${error.line}: cannot jump from level ${error.from} to level ${error.to}`;
    default:
      return "Invalid tree source";
  }
}

export function hasError(session) {
  buildTree(session);
  return Boolean(session.error);
}

export function getError(session) {
  buildTree(session);
  return session.error;
}

export function getRoot(session) {
  buildTree(session);
  return session.root;
}

function tokenizeLines(session) {
  if (session.lineTokens) return;

  session.lineTokens = session.source
    .split("\n")
    .map((line, index) => {
      const indent = line.match(/^\s*/)?.[0].length ?? 0;

      return {
        line,
        indent,
        content: line.slice(indent),
        lineNumber: index + 1,
      };
    })
    .filter((token) => token.content.trim().length > 0);
}

function detectIndent(session) {
  if (session.indentDetected) return;

  tokenizeLines(session);

  const indented = session.lineTokens.find((token) => token.indent > 0);
  if (!indented) {
    session.indentChar = " ";
    session.indentSize = 2;
    session.indentDetected = true;
    return;
  }

  const whitespace = indented.line.slice(0, indented.indent);

  session.indentChar = whitespace[0] === "\t" ? "\t" : " ";
  session.indentSize = session.indentChar === "\t" ? 1 : indented.indent;
  session.indentDetected = true;
}

function validateIndentation(session) {
  if (session.isConsistentIndent !== undefined) return;

  tokenizeLines(session);
  detectIndent(session);

  const indentChar = session.indentChar;
  const indentSize = session.indentSize;

  for (const token of session.lineTokens) {
    const whitespace = token.line.slice(0, token.indent);

    if (whitespace.includes(" ") && whitespace.includes("\t")) {
      session.error = { kind: "mixed-indentation", line: token.lineNumber };
      session.isConsistentIndent = false;
      return;
    }

    if (whitespace.length > 0 && whitespace[0] !== indentChar) {
      session.error = { kind: "mixed-indentation", line: token.lineNumber };
      session.isConsistentIndent = false;
      return;
    }

    if (token.indent % indentSize !== 0) {
      session.error = {
        kind: "invalid-indent-size",
        line: token.lineNumber,
        indent: token.indent,
        indentSize,
      };
      session.isConsistentIndent = false;
      return;
    }
  }

  session.isConsistentIndent = true;
}

function buildTree(session) {
  if (session.treeBuilt) return;

  validateIndentation(session);
  if (session.error) {
    session.treeBuilt = true;
    return;
  }

  const rootNodes = [];
  const stack = [];

  for (const token of session.lineTokens) {
    const level = token.indent / session.indentSize;

    if (level > stack.length) {
      session.error = {
        kind: "indent-jump",
        line: token.lineNumber,
        from: stack.length - 1,
        to: level,
      };
      session.treeBuilt = true;
      return;
    }

    if (level === 0 && token.indent > 0) {
      session.error = { kind: "indented-root", line: token.lineNumber };
      session.treeBuilt = true;
      return;
    }

    const parent = level > 0 ? stack[level - 1] : undefined;
    const node = {
      value: token.content.trim(),
      line: token.lineNumber,
    };

    if (parent) {
      parent.children ??= [];
      parent.children.push(node);
      node.parent = parent;
    } else {
      rootNodes.push(node);
    }

    stack[level] = node;
    stack.length = level + 1;
  }

  if (rootNodes.length === 1) {
    session.root = rootNodes[0];
  } else if (rootNodes.length > 1) {
    session.root = {
      value: ROOT_BINDING_SENTINEL,
      line: 0,
      isSyntheticRoot: true,
      children: rootNodes,
    };
    rootNodes.forEach((node) => {
      node.parent = session.root;
    });
  }

  session.treeBuilt = true;
}
