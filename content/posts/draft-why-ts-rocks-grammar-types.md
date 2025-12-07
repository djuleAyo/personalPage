+++ 
draft = false
date = 2025-07-24T11:13:48+02:00
title = "Parser types"
description = ""
slug = "parser-types"
authors = []
tags = ["typescript", "meta-programming", "generics"]
categories = []
externalLink = ""
series = []
+++

# Parser types


## Intro — formal languages and parsing

All programming languages are specified by a grammar. A grammar tells us whether a piece of text is a valid sentence in that language. A parser generator can take such a grammar and produce a parser. Parsing is the “front end” of compilation: it turns raw text into structure. That’s the basis of how formal languages work.

Simplistic grammar example:

```bison
%token <int> NUMBER

expression: expression '+' expression
          | expression '-' expression
          | expression '*' expression
          | expression '/' expression
          | '(' expression ')'
          | NUMBER
          ;
```

This grammar can generate a parser for simple arithmetic. Before parsing, the input is just text. After parsing, we both 
* (a) know whether it’s valid under this grammar and 
* (b) obtain a structured representation of it.

Input:
```
1 + 2 * (3 - 4)
```
Parsed tree:
```
        +
       / \
      1   *
         / \
        2   -
           / \
          3   4
```

Operator precedence and associativity are encoded in how the tree “leans.” This is an Abstract Syntax Tree (AST). Every program you’ve ever written is, at some level, an AST.

## Declarative vs. imperative (why we like trees-as-data)

An AST is a tree, and a tree is data. Code can be seen as data laid out in a shape that captures meaning. The tree is a constant shape that other parts of the system can consume. That’s powerful.

Take an Express router:

```javascript
router.get('/users', (req, res) => {
  res.send('Users list');
});
```

You’re not imperatively pushing bytes through sockets; you declare what should happen on /users. The framework consumes that declaration at the right time.

Declarative style usually means: you state what you want; the machinery figures out how. The more capable the machinery, the richer the configuration language must be.

## Parser types

Configurations aren’t always free-form; values often depend on each other. Not every config that “type-checks” at the top level is semantically valid. Think of a configuration as:

> a constant value that must satisfy a language (expressed as an AST)

If that clicks, good. TypeScript lets us enforce such languages at compile time. I call these parser types: recursive TS types that act like a grammar. They don’t parse tokens; they constrain shape the way a grammar constrains sentences.

Consider:

```typescript
type Test = Record<string, Test> // ❌ can't do
```

TS sees a naked, non-terminating recursion and bails.

Even:

```typescript
type Test = Record<string, Test | string>
```

still trips the checker.

But:

```typescript
type Test = { 
  [key: string]: Test | string // ✅ can do
}
```

works. The index signature form delays evaluation enough for TS to accept the recursion. That’s our recursive hook. Depth is unbounded (until compiler limits), so it can “eat” arbitrarily deep objects. The remaining task is to encode your language rules with unions and recursion.

TypeScript even nudges us syntactically—the leading pipes look exactly like grammar alternatives:

```typescript
type Literal =
  | string
  | number
  | boolean
  ;
```

Now, your arithmetic example as a type-level grammar:

```typescript
type Literal_t = 'number';
const ops = ['+', '-', '*', '/'] as const;
type Op = typeof ops[number];

// 1) leaf
interface NumberLiteral {
  type: 'number';
  value: number;
}

// 2) binary
interface BinaryExpr {
  type: 'binary';
  op: Op;
  left: Expression;
  right: Expression;
}

// 3) grouping
interface ParenExpr {
  type: 'group';
  expression: Expression;
}

// 4) the one non-recursive alias
export type Expression =
  | NumberLiteral
  | BinaryExpr
  | ParenExpr
  ;

// type annotation assures the object matches the grammar as AST
const ast: Expression = {
  type: 'binary',
  op: '+',
  left: { type: 'number', value: 1 },
  right: {
    type: 'binary',
    test: 'asdf', // ❌ type error
    op: '*',
    left: { type: 'number', value: 2 },
    right: { type: 'number', value: 3 },
  }
};
```

That stray test: 'asdf' is illegal under the grammar and TypeScript tells you immediately. Bonus: editor autocomplete now “knows” exactly what belongs where in your config/AST.


## Why would you care?

Already mentioned: grammar can check more then any type union can.
But another area is COMPOSITE PATTERN constants. IE JSX is composite.
Child of a node is again JSX node. Composite patterns are omnipresent yet 
constants of composite patterns are very error prone. Especially written by hand
without assistance of language server. Now JSX is solved as it is. Syntax sugar
for function calls. Thats runtime in essence and not a constant.

I'll hint another example of composite that with some effort of defining 
proper "parser type", we can declare as constants with full type support.
Server routers. They are composable. and leafs are controllers.
Such constant would be SSOT which is effectively shared contract between server and client.
Out of the box both api client and controller functions would have full type support.
You can say, well we can use open API spec for that. But such a type would
allow full type support just out of declaration and nothing more. No generate types
step, code gen, eventual DRY hell retyping schemas and so on. 
In next post I'll show how to do that with a real example. Stay tuned.