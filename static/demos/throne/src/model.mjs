import parseTree, {
  formatError,
  getError,
  getRoot,
  hasError,
  ROOT_BINDING_SENTINEL,
} from "./treeParser.mjs";

export const fullTurn = Math.PI * 2;
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const DEFAULT_SCENE_SOURCE = `scene
  center
    inner
      _
        _
          4
        _
          3
      _
        5
      _
        6
  ring
    near
      outer
        _
          _
            5
          _
            3
        _
          4
        _
          5
        _
          3
      inner
        _
          6
        _
          4
    far
      outer
        _
          4
        _
          _
            5
          _
            3
        _
          5
        _
          4
        _
          3
        _
          5
      inner
        _
          5
        _
          4
  ring
    near
      outer
        _
          5
        _
          3
        _
          4
      inner
        _
          7
        _
          5
    far
      outer
        _
          4
        _
          5
        _
          _
            3
          _
            4
        _
          5
        _
          3
      inner
        _
          6
        _
          5`;

export const THRONE_SCENE_MODELS = [
  {
    id: "default",
    label: "Default",
    source: DEFAULT_SCENE_SOURCE,
  },
  {
    id: "single",
    label: "Single",
    source: `scene
  center
    inner
      7
  ring x
    width 360
    near
      sun 0.62
      clouds 0.18
      outer
        2
        3
        4
      inner
        5
    far
      sun -0.38
      clouds 0.72
      outer
        6
        4
      inner
        3`,
  },
  {
    id: "stack",
    label: "Stack",
    source: `scene
  center
    inner
      _
        5
        3
      _
        4
  ring x
    width 260
    near
      outer
        _
          2
          2
        _
          3
        5
      inner
        4
    far
      outer
        5
        _
          3
          3
        4
      inner
        2
  ring y
    width 320
    near
      outer
        4
        4
        4
        4
      inner
        6
    far
      outer
        _
          3
        _
          5
        _
          3
      inner
        5
  ring x
    width 210
    near
      outer
        3
        5
      inner
        2
    far
      outer
        2
        4
        6
      inner
        3`,
  },
  {
    id: "dense",
    label: "Dense",
    source: `scene
  center
    inner
      8
  ring y
    width 430
    near
      sun 0.28
      clouds 0.96
      outer
        8
        7
        6
        5
        4
        3
      inner
        7
    far
      sun -0.72
      clouds 0.2
      outer
        _
          2
          2
        _
          3
          3
        _
          4
          4
        _
          5
      inner
        8
  ring x
    width 280
    near
      outer
        6
        6
        6
        6
      inner
        4
    far
      outer
        5
        5
        5
        5
      inner
        5`,
  },
  {
    id: "weather",
    label: "Weather",
    source: `scene
  center
    inner
      _
        4
      _
        6
  ring x
    width 410
    near
      sun 0.78
      clouds 0.08
      outer
        4
        4
        4
    far
      sun -0.86
      clouds 0.88
      outer
        5
        5
        5
        5
  ring y
    width 330
    near
      sun 0.12
      clouds 1
      outer
        _
          3
          4
        6
    far
      sun -0.22
      clouds 0.36
      outer
        4
        _
          2
          2
        4`,
  },
];

export const markerParams = [
  { n: 2, cutoff: 4, branching: 5 },
  { n: 3, cutoff: 4, branching: 4 },
  { n: 4, cutoff: 5, branching: 3 },
  { n: 5, cutoff: 5, branching: 4 },
];

export const sideWeatherBackgrounds = {
  near: {
    sunHeight: 0.52,
    cloudiness: 0.45,
  },
  far: {
    sunHeight: -0.03,
    cloudiness: 0.3,
  },
};

export const nodeChildren = (node) => node?.children ?? [];
export const nodeText = (node) => String(node?.value ?? "").trim();
export const nodeParts = (node) => nodeText(node).split(/\s+/).filter(Boolean);
export const nodeName = (node) => nodeParts(node)[0] ?? "";
export const nodeArgs = (node) => nodeParts(node).slice(1);
export const isNumberText = (value) => /^-?\d+(?:\.\d+)?$/.test(value);

export const numericValue = (node) => {
  const direct = nodeArgs(node).find(isNumberText) ?? nodeText(node);

  if (isNumberText(direct)) return Number(direct);

  const childValue = nodeChildren(node).map(nodeText).find(isNumberText);
  return childValue === undefined ? undefined : Number(childValue);
};

export const firstChildNamed = (node, name) =>
  nodeChildren(node).find((child) => nodeName(child) === name);

export const childrenNamed = (node, name) =>
  nodeChildren(node).filter((child) => nodeName(child) === name);

const cloneBackground = (background) => ({ ...background });

export const emptyRecursion = {
  value: "_",
  children: [],
};

export const defaultRecursion = {
  value: "_",
  children: [
    { value: "_", children: [{ value: "5", children: [] }] },
    { value: "_", children: [{ value: "4", children: [] }] },
  ],
};

export const defaultOuter = {
  value: "outer",
  children: [
    { value: "_", children: [{ value: "5", children: [] }] },
    { value: "_", children: [{ value: "4", children: [] }] },
    { value: "_", children: [{ value: "3", children: [] }] },
    { value: "_", children: [{ value: "5", children: [] }] },
  ],
};

export const cleanRecursionNode = (node) => {
  if (!node) return emptyRecursion;

  const value = nodeName(node) || "_";

  if (value === "...") return { value: "...", children: [] };

  return {
    value,
    children: nodeChildren(node).map(cleanRecursionNode),
  };
};

export const recursionBlock = (node, name, fallback = defaultRecursion) => {
  const block = firstChildNamed(node, name);
  if (!block) return fallback;

  const children = nodeChildren(block).map(cleanRecursionNode);
  return {
    value: "_",
    children: children.length ? children : fallback.children,
  };
};

export const recursionKey = (spec) =>
  `${spec.value}[${nodeChildren(spec).map(recursionKey).join(",")}]`;

export const expandedRecursionChildren = (spec, fallback = defaultRecursion) => {
  if (!spec) return [];
  if (spec.value === "...") return nodeChildren(fallback);
  if (isNumberText(spec.value)) {
    return Array.from({ length: clamp(Number(spec.value), 0, 24) }, () => emptyRecursion);
  }

  return nodeChildren(spec);
};

export const compileMarkerSide = (ringNode, sideNode, side, _ringIndex, previousRing) => {
  const sideSource = sideNode ?? ringNode;
  const outer = recursionBlock(sideSource, "outer", defaultOuter);
  const inner = recursionBlock(sideSource, "inner", defaultRecursion);
  const markerSpecs = nodeChildren(outer).length ? nodeChildren(outer) : nodeChildren(defaultOuter);
  const previousSide = previousRing?.sides?.[side];
  const count = markerSpecs.length || previousSide?.length || 4;

  return Array.from({ length: count }, (_, index) => ({
    side,
    angle: (index / count) * fullTurn + fullTurn / (count * 2),
    ...markerParams[index % markerParams.length],
    outwardRecursion: markerSpecs[index % markerSpecs.length] ?? defaultRecursion,
    inwardRecursion: inner,
  }));
};

export const backgroundFromNode = (node, fallback) => ({
  sunHeight: Number(numericValue(firstChildNamed(node, "sun")) ?? fallback.sunHeight),
  cloudiness: Number(numericValue(firstChildNamed(node, "clouds")) ?? fallback.cloudiness),
});

export const compileRing = (ringNode, index, previousRing) => {
  const axis = nodeArgs(ringNode).find((arg) => arg === "x" || arg === "y")
    ?? previousRing?.axis
    ?? (index % 2 === 0 ? "x" : "y");
  const nearNode = firstChildNamed(ringNode, "near");
  const farNode = firstChildNamed(ringNode, "far");
  const previousWidth = previousRing?.width;
  const width = numericValue(firstChildNamed(ringNode, "width")) ?? previousWidth ?? 300;
  const nearFallback = previousRing?.backgrounds?.near
    ?? (index === 0 ? sideWeatherBackgrounds.near : { sunHeight: 0.16, cloudiness: 1 });
  const farFallback = previousRing?.backgrounds?.far
    ?? (index === 0 ? sideWeatherBackgrounds.far : { sunHeight: -0.51, cloudiness: 0.53 });

  return {
    axis,
    width,
    phaseOffset: 0,
    phase: previousRing?.phase ?? previousRing?.phaseOffset ?? 0,
    zRotation: previousRing?.zRotation ?? 0,
    zSpinEnabled: previousRing?.zSpinEnabled ?? false,
    zSpinSpeed: previousRing?.zSpinSpeed ?? (axis === "x" ? 0.38 : -0.32),
    sides: {
      near: compileMarkerSide(ringNode, nearNode, "near", index, previousRing),
      far: compileMarkerSide(ringNode, farNode, "far", index, previousRing),
    },
    backgrounds: {
      near: backgroundFromNode(nearNode ?? ringNode, cloneBackground(nearFallback)),
      far: backgroundFromNode(farNode ?? ringNode, cloneBackground(farFallback)),
    },
    colors: index % 2 === 0
      ? {
          nearMarker: "rgba(125, 211, 252, 0.9)",
          nearFill: "rgb(40, 67, 84)",
          farMarker: "rgba(167, 139, 250, 0.84)",
          farFill: "rgb(52, 47, 83)",
        }
      : {
          nearMarker: "rgba(45, 212, 191, 0.86)",
          nearFill: "rgb(18, 67, 66)",
          farMarker: "rgba(251, 191, 36, 0.84)",
          farFill: "rgb(75, 61, 23)",
        },
  };
};

export const compileSceneSource = (source, previousScene) => {
  const session = parseTree(source);

  if (hasError(session)) {
    throw new Error(formatError(getError(session)));
  }

  const root = getRoot(session);
  const sceneNode = nodeName(root) === ROOT_BINDING_SENTINEL
    ? nodeChildren(root).find((child) => nodeName(child) === "scene")
    : root;

  if (!sceneNode || nodeName(sceneNode) !== "scene") {
    throw new Error("Scene tree must start with `scene`.");
  }

  const centerNode = firstChildNamed(sceneNode, "center");
  const ringNodes = childrenNamed(sceneNode, "ring");
  const effectiveRingNodes = ringNodes.length
    ? ringNodes
    : [{ value: "ring x", children: [] }, { value: "ring y", children: [] }];
  const rings = effectiveRingNodes.map((ringNode, index) =>
    compileRing(ringNode, index, previousScene?.rings?.[index])
  );

  return {
    source,
    centerDiameter: previousScene?.centerDiameter ?? 300,
    ellipse: {
      enabled: previousScene?.ellipse?.enabled ?? false,
      yScale: 9 / 16,
    },
    weatherEnabled: previousScene?.weatherEnabled ?? true,
    centerRecursion: recursionBlock(centerNode, "inner", defaultRecursion),
    ringWidth: 300,
    ringGap: 24,
    flitDuration: 0.3,
    settleDuration: 0.7,
    rings,
  };
};

export const projectRingPoint = (x, y, phase, perspective, axis, zRotation = 0) => {
  const zCos = Math.cos(zRotation);
  const zSin = Math.sin(zRotation);
  const zRotatedX = x * zCos - y * zSin;
  const zRotatedY = x * zSin + y * zCos;
  const rotatedX = axis === "y" ? zRotatedX * Math.cos(phase) : zRotatedX;
  const rotatedY = axis === "x" ? zRotatedY * Math.cos(phase) : zRotatedY;
  const z = axis === "y"
    ? -zRotatedX * Math.sin(phase)
    : zRotatedY * Math.sin(phase);
  const perspectiveScale = perspective / (perspective - z);

  return {
    x: rotatedX * perspectiveScale,
    y: rotatedY * perspectiveScale,
    z,
  };
};

export const childCircleInRemainingSpace = (parent, boundaryRadius, angle) => {
  const remainingSpace = parent.spaceRadius - parent.radius;
  if (remainingSpace <= 0) return undefined;

  const childSpaceRadius = remainingSpace / 2;
  const distance = parent.radius + childSpaceRadius;
  const x = parent.x + Math.cos(angle) * distance;
  const y = parent.y + Math.sin(angle) * distance;
  let childRadius = Math.min(parent.radius / parent.n, childSpaceRadius * 0.82);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (Math.hypot(x, y) + childRadius <= boundaryRadius * 0.985) {
      return { x, y, radius: childRadius, spaceRadius: childSpaceRadius };
    }

    childRadius *= 0.82;
  }

  return undefined;
};

const packedCircleCache = new Map();

export const clearPackedCircleCache = () => {
  packedCircleCache.clear();
};

export const packedCircleNodes = (radius, n, recursion) => {
  const cacheKey = `${radius}:${n}:${recursionKey(recursion)}`;
  if (packedCircleCache.has(cacheKey)) return packedCircleCache.get(cacheKey);

  const rootRadius = radius * ((n - 1) / n);
  const nodes = [
    {
      x: 0,
      y: 0,
      radius: rootRadius,
      spaceRadius: radius,
      parent: undefined,
      level: 0,
      angle: 0,
      n,
      recursion,
    },
  ];
  let frontier = [0];

  for (let level = 1; level <= 5; level += 1) {
    const nextFrontier = [];

    frontier.forEach((parentIndex) => {
      const parent = nodes[parentIndex];
      const childSpecs = expandedRecursionChildren(parent.recursion);
      if (!childSpecs.length) return;

      const depthGrowth = Math.max(0, level - 1);
      const childCount = childSpecs.length;
      const fan =
        parentIndex === 0
          ? fullTurn
          : Math.min(fullTurn, Math.PI * (0.9 + depthGrowth * 0.45));
      const start = parentIndex === 0 ? 0 : parent.angle - fan / 2;

      for (let child = 0; child < childCount; child += 1) {
        const angle =
          parentIndex === 0
            ? (child / childCount) * fullTurn
            : start + ((child + 0.5) / childCount) * fan;
        const childCircle = childCircleInRemainingSpace(parent, radius, angle);

        if (!childCircle || childCircle.radius < radius * 0.01) continue;

        nodes.push({
          ...childCircle,
          parent: parentIndex,
          level,
          angle,
          n,
          recursion: childSpecs[child],
        });
        nextFrontier.push(nodes.length - 1);
      }
    });

    frontier = nextFrontier;
    if (!frontier.length) break;
  }

  packedCircleCache.set(cacheKey, nodes);

  return nodes;
};

export const inwardChildCircles = (parent, count) => {
  if (count <= 0) return [];
  if (count === 1) return [{ x: parent.x, y: parent.y, radius: parent.radius * 0.5 }];

  const hasCenter = count >= 6;
  const ringCount = hasCenter ? count - 1 : count;
  const spacing = Math.sin(Math.PI / ringCount);
  const ringRadius = parent.radius * (spacing / (1 + spacing));
  const centerRadius = parent.radius - ringRadius * 2;
  const orbitRadius = parent.radius - ringRadius;
  const rotation = ringCount % 2 === 0 ? Math.PI / ringCount : -Math.PI / 2;
  const children = [];

  if (hasCenter) {
    children.push({ x: parent.x, y: parent.y, radius: centerRadius });
  }

  for (let index = 0; index < ringCount; index += 1) {
    const angle = rotation + (index / ringCount) * fullTurn;

    children.push({
      x: parent.x + Math.cos(angle) * orbitRadius,
      y: parent.y + Math.sin(angle) * orbitRadius,
      radius: ringRadius,
    });
  }

  return children;
};

export const inwardRecursionNodes = (radius, recursion) => {
  const nodes = [];
  let frontier = [{ x: 0, y: 0, radius, recursion }];

  for (let level = 1; level <= 4; level += 1) {
    const nextFrontier = [];

    frontier.forEach((parent) => {
      const childSpecs = expandedRecursionChildren(parent.recursion);
      if (!childSpecs.length) return;

      inwardChildCircles(parent, childSpecs.length).forEach((child, index) => {
        if (child.radius < radius * 0.012) return;

        const nextNode = { ...child, level, recursion: childSpecs[index] };

        nodes.push(nextNode);
        nextFrontier.push(nextNode);
      });
    });

    frontier = nextFrontier;
    if (!frontier.length) break;
  }

  return nodes;
};

export const visibleMarkerSide = (phase) => (Math.cos(phase) >= 0 ? "near" : "far");

export const ringMarkerFootprint = (radius, width, markerCount) => {
  const band = width / 2;
  const innerRadius = radius - band;
  const outerRadius = radius + band;
  const radialMargin = Math.max(1, width * 0.025);
  const minRadius = innerRadius + radialMargin;
  const maxRadius = outerRadius - radialMargin;
  const angularLimit = (Math.PI / markerCount) * 0.96;
  const radialRadius = Math.max(1, band - radialMargin);
  const maxTangentRadius = Math.max(1, Math.sin(Math.PI / markerCount) * radius * 0.98);
  const fits = (tangentRadius) => {
    const steps = 28;

    for (let step = 0; step < steps; step += 1) {
      const angle = (step / steps) * fullTurn;
      const tangentOffset = Math.cos(angle) * tangentRadius;
      const radialOffset = Math.sin(angle) * radialRadius;
      const localRadius = Math.hypot(tangentOffset, radius + radialOffset);
      const localAngle = Math.abs(Math.atan2(tangentOffset, radius + radialOffset));

      if (localRadius < minRadius || localRadius > maxRadius || localAngle > angularLimit) {
        return false;
      }
    }

    return true;
  };
  let low = 1;
  let high = maxTangentRadius;

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const middle = (low + high) / 2;

    if (fits(middle)) low = middle;
    else high = middle;
  }

  return {
    radialRadius,
    tangentRadius: low,
  };
};
