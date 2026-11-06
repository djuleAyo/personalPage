import {
  DEFAULT_SCENE_SOURCE,
  THRONE_SCENE_MODELS,
  clearPackedCircleCache,
  clamp,
  compileSceneSource,
  fullTurn,
  inwardRecursionNodes,
  packedCircleNodes,
  projectRingPoint,
  ringMarkerFootprint,
  visibleMarkerSide,
} from "./model.mjs";

const canvas = document.getElementById("throne-canvas");
const ctx = canvas.getContext("2d");
const controls = document.querySelector(".controls");
const sceneModelControls = document.querySelector("[data-scene-models]");
const sceneModelSummary = document.querySelector("[data-scene-model-summary]");
const sceneSourceInput = document.querySelector("[data-scene-source]");
const applySceneButton = document.querySelector("[data-apply-scene]");
const sceneError = document.querySelector("[data-scene-error]");
const ringControls = document.querySelector("[data-ring-controls]");
const centerWidthInput = document.querySelector("[data-center-width]");
const ellipseToggle = document.querySelector("[data-ellipse-toggle]");
const weatherToggle = document.querySelector("[data-weather-toggle]");

const palette = {
  background: "#070b12",
  centerStroke: "rgba(248, 250, 252, 0.9)",
  centerFill: "rgba(248, 250, 252, 0.08)",
  cockpitBackground: "#080b0f",
  cockpitCenterFill: "rgba(156, 163, 175, 0.11)",
  cockpitRingFill: "rgb(54, 60, 68)",
  cockpitRingFillAlt: "rgb(44, 50, 58)",
  cockpitNodeFill: "rgba(170, 180, 190, 0.72)",
  cockpitRingBackgroundTop: "#111821",
  cockpitRingBackgroundBottom: "#303842",
};

const animationState = {};
let scene;
let activeSceneModelId = "default";

const fitCanvas = () => {
  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const strokePath = ({
  stroke = palette.centerStroke,
  lineWidth = 2,
  fill,
} = {}) => {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (!stroke || lineWidth <= 0) return;

  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
};

const circle = (x, y, radius, options) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  strokePath(options);
};

const drawCirclePath = (x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, fullTurn);
};

const colorCache = new Map();

const hexToRgb = (hex) => {
  if (colorCache.has(hex)) return colorCache.get(hex);

  const value = hex.replace("#", "");

  const color = {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };

  colorCache.set(hex, color);

  return color;
};

const mix = (left, right, amount) => left + (right - left) * amount;

const mixRgb = (left, right, amount) => ({
  r: mix(left.r, right.r, amount),
  g: mix(left.g, right.g, amount),
  b: mix(left.b, right.b, amount),
});

const rgbToCss = (color) =>
  `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;

const weatherIsEnabled = () => scene?.weatherEnabled !== false;

const controlledWeatherColor = (color, strength) =>
  rgbToCss(mixRgb(hexToRgb(palette.background), color, strength));

const colorStops = (colors) =>
  typeof colors[0] === "string"
    ? colors.map((color, index) => ({
        at: colors.length === 1 ? 0 : index / (colors.length - 1),
        color,
      }))
    : colors;

const gradientRgb = (colors, position) => {
  const clamped = Math.min(1, Math.max(0, position));
  const stops = colorStops(colors);
  const rightIndex = stops.findIndex((stop) => stop.at >= clamped);

  if (rightIndex === -1) return hexToRgb(stops[stops.length - 1].color);
  if (rightIndex <= 0) return hexToRgb(stops[0].color);

  const left = stops[rightIndex - 1];
  const right = stops[rightIndex] ?? stops[rightIndex - 1];
  const span = right.at - left.at || 1;
  const amount = (clamped - left.at) / span;

  return mixRgb(hexToRgb(left.color), hexToRgb(right.color), amount);
};

const scaledWeather = (background) => ({
  sunHeight: clamp(background.sunHeight, -1, 1),
  cloudiness: clamp(background.cloudiness, 0, 1),
});

const skyStopsForSunHeight = (sunHeight) => {
  if (sunHeight < -0.35) {
    return [
      { at: 0, color: "#050918" },
      { at: 0.55, color: "#0b1430" },
      { at: 1, color: "#162247" },
    ];
  }

  if (sunHeight < 0.08) {
    return [
      { at: 0, color: "#0c1235" },
      { at: 0.58, color: "#263a73" },
      { at: 1, color: "#d0a75b" },
    ];
  }

  if (sunHeight < 0.34) {
    return [
      { at: 0, color: "#12133f" },
      { at: 0.16, color: "#452765" },
      { at: 0.3, color: "#2b75a5" },
      { at: 0.36, color: "#71957b" },
      { at: 0.44, color: "#efc76e" },
      { at: 0.66, color: "#e98555" },
      { at: 1, color: "#aa4650" },
    ];
  }

  return [
    { at: 0, color: "#1d4776" },
    { at: 0.5, color: "#4f8bb4" },
    { at: 1, color: "#b7d7e8" },
  ];
};

const cloudColorForWeather = (sunHeight, cloudiness) => {
  if (sunHeight < -0.25) return "#18243a";
  if (sunHeight < 0.2) return cloudiness > 0.7 ? "#5c6174" : "#cfb8b5";
  return cloudiness > 0.72 ? "#77828d" : "#eef5f8";
};

const cloudsForWeather = (sunHeight, cloudiness) => {
  if (cloudiness <= 0.04) return [];

  const count = Math.max(1, Math.round(1 + cloudiness * 5));
  const color = cloudColorForWeather(sunHeight, cloudiness);
  const cloudBase = [
    { x: 0.22, y: 0.24, width: 0.34, height: 0.12 },
    { x: 0.6, y: 0.34, width: 0.46, height: 0.14 },
    { x: 0.35, y: 0.58, width: 0.42, height: 0.13 },
    { x: 0.74, y: 0.68, width: 0.5, height: 0.16 },
    { x: 0.18, y: 0.8, width: 0.52, height: 0.17 },
    { x: 0.5, y: 0.14, width: 0.62, height: 0.13 },
  ];

  return cloudBase.slice(0, count).map((cloud, index) => {
    const overcast = Math.max(0, (cloudiness - 0.58) / 0.42);
    const scale = 0.78 + cloudiness * 0.65 + overcast * 0.7;

    return {
      ...cloud,
      width: Math.min(0.92, cloud.width * scale),
      height: Math.min(0.28, cloud.height * (0.85 + cloudiness * 0.75)),
      color,
      strength: clamp(0.32 + cloudiness * 0.52 - index * 0.03, 0.22, 0.82),
    };
  });
};

const starField = Array.from({ length: 90 }, (_, index) => {
  const left = Math.sin(index * 127.1) * 43758.5453;
  const top = Math.sin(index * 311.7 + 13.2) * 24634.6345;
  const radius = Math.sin(index * 47.3 + 5.1) * 0.5 + 0.5;

  return {
    x: left - Math.floor(left),
    y: top - Math.floor(top),
    radius: 0.55 + radius * 1.15,
    strength: 0.35 + ((index * 37) % 63) / 100,
  };
});

const starsForWeather = (sunHeight) => {
  const strength = Math.pow(clamp((-sunHeight - 0.02) / 0.38, 0, 1), 2.6);

  return {
    strength,
    stars: strength <= 0.01 ? [] : starField,
  };
};

const weatherPatternFromParams = (background) => {
  const { sunHeight, cloudiness } = scaledWeather(background);
  const nightDimming = sunHeight < 0 ? Math.abs(sunHeight) * 0.18 : 0;
  const stars = starsForWeather(sunHeight);

  return {
    colors: skyStopsForSunHeight(sunHeight),
    strength: clamp(0.42 + Math.max(0, sunHeight) * 0.22 - nightDimming, 0.24, 0.68),
    clouds: cloudsForWeather(sunHeight, cloudiness),
    starStrength: stars.strength,
    stars: stars.stars,
  };
};

const verticalWeatherGradient = (pattern, top, bottom) => {
  const gradient = ctx.createLinearGradient(0, top, 0, bottom);

  colorStops(pattern.colors).forEach((stop) => {
    gradient.addColorStop(
      stop.at,
      controlledWeatherColor(hexToRgb(stop.color), pattern.strength)
    );
  });

  return gradient;
};

const drawCloudLayer = (pattern, centerX, centerY, radius, width) => {
  if (!pattern.clouds) return;

  const left = centerX - radius - width / 2;
  const top = centerY - radius - width / 2;
  const size = radius * 2 + width;

  pattern.clouds.forEach((cloud) => {
    const cloudX = left + cloud.x * size;
    const cloudY = top + cloud.y * size;
    const cloudWidth = cloud.width * size;
    const cloudHeight = cloud.height * size;

    ctx.beginPath();
    ctx.ellipse(cloudX, cloudY, cloudWidth / 2, cloudHeight / 2, 0, 0, fullTurn);
    ctx.fillStyle = controlledWeatherColor(hexToRgb(cloud.color), cloud.strength);
    ctx.fill();
  });
};

const drawStarLayer = (pattern, centerX, centerY, radius, width) => {
  if (!pattern.stars?.length) return;

  const left = centerX - radius - width / 2;
  const top = centerY - radius - width / 2;
  const size = radius * 2 + width;

  pattern.stars.forEach((star) => {
    const opacity = pattern.starStrength * star.strength;

    ctx.beginPath();
    ctx.arc(left + star.x * size, top + star.y * size, star.radius, 0, fullTurn);
    ctx.fillStyle = `rgba(226, 232, 240, ${opacity})`;
    ctx.fill();
  });
};

const drawProjectedRing = (
  centerX,
  centerY,
  radius,
  phase,
  perspective,
  axis,
  options = {},
  zRotation = 0
) => {
  const steps = 192;
  const points = Array.from({ length: steps + 1 }, (_, step) => {
    const angle = (step / steps) * Math.PI * 2;
    const point = projectRingPoint(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      phase,
      perspective,
      axis,
      zRotation
    );

    return {
      x: centerX + point.x,
      y: centerY + point.y,
      z: point.z,
    };
  });

  points
    .slice(0, -1)
    .map((point, index) => ({
      from: point,
      to: points[index + 1],
      z: (point.z + points[index + 1].z) / 2,
    }))
    .sort((left, right) => left.z - right.z)
    .forEach((segment) => {
      const depth = (segment.z + radius) / (radius * 2);

      ctx.beginPath();
      ctx.moveTo(segment.from.x, segment.from.y);
      ctx.lineTo(segment.to.x, segment.to.y);
      strokePath({
        stroke: options.stroke(depth),
        lineWidth: options.lineWidth(depth),
      });
    });
};

const drawWeatherRingBackground = (
  centerX,
  centerY,
  radius,
  width,
  phase,
  perspective,
  axis,
  zRotation,
  background
) => {
  const steps = 144;
  const innerRadius = radius - width / 2;
  const outerRadius = radius + width / 2;
  const verticalTop = centerY - radius - width / 2;
  const verticalHeight = radius * 2 + width;
  const verticalBottom = verticalTop + verticalHeight;
  const pattern = weatherPatternFromParams(background);
  const projectAt = (angle, pointRadius) => {
    const point = projectRingPoint(
      Math.cos(angle) * pointRadius,
      Math.sin(angle) * pointRadius,
      phase,
      perspective,
      axis,
      zRotation
    );

    return {
      x: centerX + point.x,
      y: centerY + point.y,
      z: point.z,
    };
  };

  ctx.save();
  ctx.beginPath();
  for (let step = 0; step <= steps; step += 1) {
    const point = projectAt((step / steps) * fullTurn, outerRadius);

    if (step === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  }
  for (let step = steps; step >= 0; step -= 1) {
    const point = projectAt((step / steps) * fullTurn, innerRadius);
    ctx.lineTo(point.x, point.y);
  }
  ctx.closePath();
  ctx.clip();

  if (!weatherIsEnabled()) {
    const cockpitGradient = ctx.createLinearGradient(0, verticalTop, 0, verticalBottom);

    cockpitGradient.addColorStop(0, palette.cockpitRingBackgroundTop);
    cockpitGradient.addColorStop(0.52, "#222932");
    cockpitGradient.addColorStop(1, palette.cockpitRingBackgroundBottom);
    ctx.fillStyle = cockpitGradient;
    const fillPadding = Math.max(window.innerWidth, window.innerHeight) * 2;
    ctx.fillRect(
      -fillPadding,
      -fillPadding,
      window.innerWidth + fillPadding * 2,
      window.innerHeight + fillPadding * 2
    );
    ctx.restore();
    return;
  }

  ctx.fillStyle = verticalWeatherGradient(pattern, verticalTop, verticalBottom);
  const fillPadding = Math.max(window.innerWidth, window.innerHeight) * 2;
  ctx.fillRect(
    -fillPadding,
    -fillPadding,
    window.innerWidth + fillPadding * 2,
    window.innerHeight + fillPadding * 2
  );
  drawStarLayer(pattern, centerX, centerY, radius, width);
  drawCloudLayer(pattern, centerX, centerY, radius, width);

  ctx.restore();
};

const projectedEllipsePath = (
  centerX,
  centerY,
  localX,
  localY,
  markerAngle,
  tangentRadius,
  radialRadius,
  phase,
  perspective,
  axis,
  zRotation = 0
) => {
  const steps = 36;
  const radialX = Math.cos(markerAngle);
  const radialY = Math.sin(markerAngle);
  const tangentX = -radialY;
  const tangentY = radialX;

  ctx.beginPath();
  for (let step = 0; step <= steps; step += 1) {
    const angle = (step / steps) * fullTurn;
    const tangentOffset = Math.cos(angle) * tangentRadius;
    const radialOffset = Math.sin(angle) * radialRadius;
    const point = projectRingPoint(
      localX + tangentX * tangentOffset + radialX * radialOffset,
      localY + tangentY * tangentOffset + radialY * radialOffset,
      phase,
      perspective,
      axis,
      zRotation
    );
    const screenX = centerX + point.x;
    const screenY = centerY + point.y;

    if (step === 0) ctx.moveTo(screenX, screenY);
    else ctx.lineTo(screenX, screenY);
  }
};

const projectedPoint = (
  centerX,
  centerY,
  localX,
  localY,
  phase,
  perspective,
  axis,
  zRotation = 0
) => {
  const point = projectRingPoint(localX, localY, phase, perspective, axis, zRotation);

  return {
    x: centerX + point.x,
    y: centerY + point.y,
    z: point.z,
  };
};

const drawInwardRecursion = (centerX, centerY, radius, recursion) => {
  const nodes = inwardRecursionNodes(radius * 0.98, recursion);

  nodes.forEach((node) => {
    const opacity = weatherIsEnabled()
      ? 0.42 * Math.pow(0.58, node.level - 1)
      : 0.34 * Math.pow(0.62, node.level - 1);
    const fill = weatherIsEnabled()
      ? `rgba(148, 163, 184, ${opacity})`
      : `rgba(174, 184, 194, ${opacity})`;

    drawCirclePath(centerX + node.x, centerY + node.y, node.radius);
    strokePath({
      stroke: undefined,
      fill,
      lineWidth: 0,
    });
  });
};

const drawProjectedInwardRecursion = (
  centerX,
  centerY,
  localX,
  localY,
  markerAngle,
  tangentRadius,
  radialRadius,
  phase,
  perspective,
  axis,
  zRotation,
  config
) => {
  if (!config) return;

  const nodes = inwardRecursionNodes(0.98, config);
  const radialX = Math.cos(markerAngle);
  const radialY = Math.sin(markerAngle);
  const tangentX = -radialY;
  const tangentY = radialX;

  nodes.forEach((node) => {
    const opacity = weatherIsEnabled()
      ? 0.22 * Math.pow(0.58, node.level - 1)
      : 0.26 * Math.pow(0.62, node.level - 1);
    const fill = weatherIsEnabled()
      ? `rgba(148, 163, 184, ${opacity})`
      : `rgba(178, 188, 198, ${opacity})`;
    const nodeLocalX = localX + tangentX * node.x * tangentRadius + radialX * node.y * radialRadius;
    const nodeLocalY = localY + tangentY * node.x * tangentRadius + radialY * node.y * radialRadius;

    projectedEllipsePath(
      centerX,
      centerY,
      nodeLocalX,
      nodeLocalY,
      markerAngle,
      node.radius * tangentRadius,
      node.radius * radialRadius,
      phase,
      perspective,
      axis,
      zRotation
    );
    strokePath({
      stroke: undefined,
      fill,
      lineWidth: 0,
    });
  });
};

const drawPackedProjectedCircle = (
  centerX,
  centerY,
  localX,
  localY,
  markerAngle,
  tangentRadius,
  radialRadius,
  phase,
  perspective,
  axis,
  zRotation,
  options
) => {
  const center = projectRingPoint(localX, localY, phase, perspective, axis, zRotation);
  const depth = options.depth(center.z);
  const nodes = packedCircleNodes(1, options.n, options.outwardRecursion);
  const radialX = Math.cos(markerAngle);
  const radialY = Math.sin(markerAngle);
  const tangentX = -radialY;
  const tangentY = radialX;
  const toRingPoint = (node) => ({
    x: localX + tangentX * node.x * tangentRadius + radialX * node.y * radialRadius,
    y: localY + tangentY * node.x * tangentRadius + radialY * node.y * radialRadius,
  });
  const projectedNodes = nodes.map((node) => ({
    ...projectedPoint(
      centerX,
      centerY,
      toRingPoint(node).x,
      toRingPoint(node).y,
      phase,
      perspective,
      axis,
      zRotation
    ),
    parent: node.parent,
    level: node.level,
    angle: node.angle,
    localX: toRingPoint(node).x,
    localY: toRingPoint(node).y,
    radius: node.radius,
  }));

  projectedEllipsePath(
    centerX,
    centerY,
    localX,
    localY,
    markerAngle,
    tangentRadius,
    radialRadius,
    phase,
    perspective,
    axis,
    zRotation
  );
  strokePath({
    stroke: undefined,
    fill: options.fill(depth),
    lineWidth: 0,
  });

  projectedNodes
    .slice()
    .sort((left, right) => right.radius - left.radius)
    .forEach((node) => {
      projectedEllipsePath(
        centerX,
        centerY,
        node.localX,
        node.localY,
        markerAngle,
        node.radius * tangentRadius,
        node.radius * radialRadius,
        phase,
        perspective,
        axis,
        zRotation
      );
      strokePath({
        stroke: undefined,
        fill: node.level === 0 ? options.fill(depth) : options.nodeFill(depth, node.level),
        lineWidth: 0,
      });
      drawProjectedInwardRecursion(
        centerX,
        centerY,
        node.localX,
        node.localY,
        markerAngle,
        node.radius * tangentRadius,
        node.radius * radialRadius,
        phase,
        perspective,
        axis,
        zRotation,
        options.inwardRecursion
      );
    });
};

const drawRecursiveProjectedCircle = (
  centerX,
  centerY,
  localX,
  localY,
  markerAngle,
  tangentRadius,
  radialRadius,
  phase,
  perspective,
  axis,
  zRotation,
  options
) => {
  drawPackedProjectedCircle(
    centerX,
    centerY,
    localX,
    localY,
    markerAngle,
    tangentRadius,
    radialRadius,
    phase,
    perspective,
    axis,
    zRotation,
    options
  );
};


const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

const startRingFlip = (ringIndex, direction, time) => {
  const ring = scene.rings[ringIndex];
  if (!ring) return;

  const from = ring.phase ?? ring.phaseOffset;
  const step = Math.PI * direction;

  ring.flip = {
    from,
    to: from + step,
    startedAt: time,
  };
};

const spinningRingSystem = ({ x, y, radius, width, phase, base, ring }) => {
  const perspective = base * 1.15;
  const band = width / 2;
  const outerRadius = radius + band;
  const zRotation = ring.zRotation ?? 0;
  const visibleSide = visibleMarkerSide(phase);
  const visibleMarkers = ring.sides[visibleSide];
  const markerFootprint = ringMarkerFootprint(radius, width, visibleMarkers.length);
  const markerStroke = weatherIsEnabled()
    ? (visibleSide === "near" ? ring.colors.nearMarker : ring.colors.farMarker)
    : "rgba(180, 190, 200, 0.54)";
  const markerFill = weatherIsEnabled()
    ? (visibleSide === "near" ? ring.colors.nearFill : ring.colors.farFill)
    : (ring.axis === "x" ? palette.cockpitRingFill : palette.cockpitRingFillAlt);

  drawWeatherRingBackground(
    x,
    y,
    radius,
    width,
    phase,
    perspective,
    ring.axis,
    zRotation,
    ring.backgrounds[visibleSide]
  );

  visibleMarkers
    .map((marker) => {
      const localX = Math.cos(marker.angle) * radius;
      const localY = Math.sin(marker.angle) * radius;
      const point = projectRingPoint(localX, localY, phase, perspective, ring.axis, zRotation);

      return {
        angle: marker.angle,
        localX,
        localY,
        z: point.z,
        radialRadius: markerFootprint.radialRadius,
        tangentRadius: markerFootprint.tangentRadius,
        n: marker.n,
        outwardRecursion: marker.outwardRecursion,
        inwardRecursion: marker.inwardRecursion,
      };
    })
    .sort((left, right) => left.z - right.z)
    .forEach((marker) => {
      drawRecursiveProjectedCircle(
        x,
        y,
        marker.localX,
        marker.localY,
        marker.angle,
        marker.tangentRadius,
        marker.radialRadius,
        phase,
        perspective,
        ring.axis,
        zRotation,
        {
          depth: (z) => (z + outerRadius) / (outerRadius * 2),
          stroke: () => markerStroke,
          fill: () => markerFill,
          nodeFill: () => markerFill,
          lineWidth: (depth) => 1 + depth * 1.4,
          n: marker.n,
          outwardRecursion: marker.outwardRecursion,
          inwardRecursion: marker.inwardRecursion,
        }
      );
    });
};

const clear = () => {
  ctx.fillStyle = weatherIsEnabled() ? palette.background : palette.cockpitBackground;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
};

const applySceneTransform = (centerX, centerY) => {
  if (!scene.ellipse.enabled) return;

  ctx.translate(centerX, centerY);
  ctx.scale(1, scene.ellipse.yScale);
  ctx.translate(-centerX, -centerY);
};

const hasActiveAnimation = () =>
  scene.rings.some((ring) => ring.flip || ring.zSpinEnabled);

const updateAnimation = (time) => {
  const elapsedSeconds =
    animationState.lastTime === undefined
      ? 0
      : Math.min((time - animationState.lastTime) / 1000, 0.05);

  animationState.lastTime = time;

  scene.rings.forEach((ring) => {
    if (ring.zSpinEnabled) {
      ring.zRotation = (ring.zRotation ?? 0) + elapsedSeconds * ring.zSpinSpeed;
    }

    if (!ring.flip) {
      ring.phase ??= ring.phaseOffset;
      return;
    }

    const flipElapsedSeconds = (time - ring.flip.startedAt) / 1000;
    const flitProgress = Math.min(flipElapsedSeconds / scene.flitDuration, 1);
    const easedProgress = easeOutCubic(flitProgress);

    ring.phase = ring.flip.from + (ring.flip.to - ring.flip.from) * easedProgress;

    if (flitProgress === 1) {
      ring.phase = ring.flip.to;
      ring.flip = undefined;
    }
  });
};

const draw = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  const base = Math.min(width, height);
  const centerRadiusUnit = scene.centerDiameter / 2;
  const ringWidthUnits = scene.rings.map((ring) => ring.width ?? scene.ringWidth);
  const gapUnit = scene.ringGap;
  const maxOuterRadius =
    centerRadiusUnit +
    ringWidthUnits.reduce((total, ringWidthUnit) => total + ringWidthUnit + gapUnit, 0);
  const sceneYScale = scene.ellipse.enabled ? scene.ellipse.yScale : 1;
  const horizontalFit = (width * 0.49) / maxOuterRadius;
  const verticalFit = (height * 0.49) / (maxOuterRadius * sceneYScale);
  const scale = Math.min(horizontalFit, verticalFit);
  const centerRadius = centerRadiusUnit * scale;
  const gap = gapUnit * scale;
  let innerRadius = centerRadius + gap;

  clear();

  ctx.save();
  applySceneTransform(centerX, centerY);

  scene.rings.forEach((ring, index) => {
    const ringWidth = ringWidthUnits[index] * scale;
    const ringRadius = innerRadius + ringWidth / 2;

    spinningRingSystem({
      x: centerX,
      y: centerY,
      radius: ringRadius,
      width: ringWidth,
      phase: ring.phase ?? ring.phaseOffset,
      base,
      ring,
    });
    innerRadius += ringWidth + gap;
  });

  drawCirclePath(centerX, centerY, centerRadius);
  strokePath({
    stroke: "rgba(0, 0, 0, 0)",
    lineWidth: 0,
    fill: weatherIsEnabled() ? palette.centerFill : palette.cockpitCenterFill,
  });
  drawInwardRecursion(centerX, centerY, centerRadius, scene.centerRecursion);
  drawCirclePath(centerX, centerY, centerRadius);
  strokePath({
    stroke: undefined,
    lineWidth: 0,
  });

  ctx.restore();
  updateSideIndicators();
};

const animate = (time) => {
  animationState.frameRequest = undefined;
  updateAnimation(time);
  draw();

  if (hasActiveAnimation()) {
    animationState.frameRequest = requestAnimationFrame(animate);
  } else {
    animationState.lastTime = undefined;
  }
};

const requestAnimationUpdate = () => {
  if (animationState.frameRequest) return;

  animationState.frameRequest = requestAnimationFrame(animate);
};

const updateSideIndicators = () => {
  scene.rings.forEach((ring, index) => {
    const activeSide = visibleMarkerSide(ring.phase ?? ring.phaseOffset);

    ringControls.querySelectorAll("[data-active-ring]").forEach((indicator) => {
      if (Number(indicator.dataset.activeRing) !== index) return;

      indicator.textContent = activeSide;
      indicator.dataset.side = activeSide;
    });

    ringControls.querySelectorAll("[data-weather-row-ring]").forEach((row) => {
      if (Number(row.dataset.weatherRowRing) !== index) return;

      row.dataset.activeSide = row.dataset.weatherRowSide === activeSide ? "true" : "false";
    });
  });
};

const ringTitle = (ring, index) =>
  `${index + 1}. ${ring.axis === "x" ? "Horizontal" : "Vertical"} ring`;

const flipButtonsForRing = (ring, index) => {
  const left = ring.axis === "x" ? "&larr;" : "&uarr;";
  const right = ring.axis === "x" ? "&rarr;" : "&darr;";

  return `<div class="turn-buttons">
    <button type="button" data-ring-index="${index}" data-direction="-1" aria-label="Flip ${ringTitle(ring, index)} backward" title="Flip backward">${left}</button>
    <button type="button" data-ring-index="${index}" data-direction="1" aria-label="Flip ${ringTitle(ring, index)} forward" title="Flip forward">${right}</button>
  </div>`;
};

const weatherSlider = (ring, index, side, key, label, min, max) => `
  <label class="slider-row" data-weather-row-ring="${index}" data-weather-row-side="${side}">
    <span>${label}</span>
    <input data-weather-ring="${index}" data-weather-side="${side}" data-weather-key="${key}" type="range" min="${min}" max="${max}" value="${ring.backgrounds[side][key]}" step="0.01" ${weatherIsEnabled() ? "" : "disabled"}>
  </label>`;

const renderRingControls = () => {
  ringControls.innerHTML = scene.rings.map((ring, index) => `
    <section class="ring-settings" aria-labelledby="ring-${index}-settings">
      <div class="ring-heading" id="ring-${index}-settings">${ringTitle(ring, index)}</div>
      <div class="side-row">
        <span>Visible</span>
        <span class="side-indicator" data-active-ring="${index}">Near</span>
      </div>
      <div class="control-row">
        <span>Flip</span>
        ${flipButtonsForRing(ring, index)}
      </div>
      <label class="toggle-row">
        <span>Z rotation</span>
        <input data-ring-z-toggle="${index}" type="checkbox" ${ring.zSpinEnabled ? "checked" : ""}>
      </label>
      <label class="slider-row">
        <span>Width</span>
        <input data-ring-width-index="${index}" type="range" min="180" max="460" value="${ring.width}" step="1">
      </label>
      ${weatherSlider(ring, index, "near", "sunHeight", "Near Sun", -1, 1)}
      ${weatherSlider(ring, index, "near", "cloudiness", "Near Clouds", 0, 1)}
      ${weatherSlider(ring, index, "far", "sunHeight", "Far Sun", -1, 1)}
      ${weatherSlider(ring, index, "far", "cloudiness", "Far Clouds", 0, 1)}
    </section>
  `).join("");

  updateSideIndicators();
};

const renderSceneModelControls = () => {
  sceneModelControls.innerHTML = THRONE_SCENE_MODELS.map((model) => `
    <button
      type="button"
      data-scene-model="${model.id}"
      data-active="${model.id === activeSceneModelId ? "true" : "false"}"
    >${model.label}</button>
  `).join("");
};

const renderSceneModelSummary = () => {
  const model = THRONE_SCENE_MODELS.find((candidate) => candidate.id === activeSceneModelId);
  const label = model?.label ?? "Custom";
  const ringCount = scene?.rings?.length ?? 0;
  const markerCount = scene?.rings?.reduce(
    (sum, ring) => sum + ring.sides.near.length + ring.sides.far.length,
    0,
  ) ?? 0;

  sceneModelSummary.textContent = `${label} / ${ringCount} ring${ringCount === 1 ? "" : "s"} / ${markerCount} markers`;
};

const setSceneError = (message) => {
  sceneError.hidden = !message;
  sceneError.textContent = message ?? "";
};

const applySceneSource = ({ preserveRuntime = true } = {}) => {
  try {
    scene = compileSceneSource(sceneSourceInput.value, preserveRuntime ? scene : undefined);
    centerWidthInput.value = scene.centerDiameter;
    ellipseToggle.checked = scene.ellipse.enabled;
    weatherToggle.checked = scene.weatherEnabled;
    clearPackedCircleCache();
    setSceneError(undefined);
    renderRingControls();
    renderSceneModelSummary();
    draw();

    if (hasActiveAnimation()) requestAnimationUpdate();
  } catch (error) {
    setSceneError(error.message);
  }
};

const applySceneModel = (modelId) => {
  const model = THRONE_SCENE_MODELS.find((candidate) => candidate.id === modelId);
  if (!model) return;

  activeSceneModelId = model.id;
  sceneSourceInput.value = model.source;
  applySceneSource({ preserveRuntime: false });
  renderSceneModelControls();
};

controls.addEventListener("input", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;

  if (input.dataset.centerWidth !== undefined) {
    scene.centerDiameter = Number(input.value);
    draw();
    return;
  }

  if (input.dataset.ringWidthIndex !== undefined) {
    const ring = scene.rings[Number(input.dataset.ringWidthIndex)];
    if (!ring) return;

    ring.width = Number(input.value);
    draw();
    return;
  }

  if (input.dataset.weatherRing !== undefined) {
    if (!weatherIsEnabled()) return;

    const ring = scene.rings[Number(input.dataset.weatherRing)];
    const background = ring?.backgrounds[input.dataset.weatherSide];
    if (!background) return;

    background[input.dataset.weatherKey] = Number(input.value);
    draw();
  }
});

controls.addEventListener("change", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;

  if (input.dataset.ellipseToggle !== undefined) {
    scene.ellipse.enabled = input.checked;
    draw();
    return;
  }

  if (input.dataset.weatherToggle !== undefined) {
    scene.weatherEnabled = input.checked;
    renderRingControls();
    draw();
    return;
  }

  if (input.dataset.ringZToggle !== undefined) {
    const ring = scene.rings[Number(input.dataset.ringZToggle)];
    if (!ring) return;

    ring.zSpinEnabled = input.checked;

    if (ring.zSpinEnabled) requestAnimationUpdate();
    else draw();
  }
});

controls.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.sceneModel !== undefined) {
    applySceneModel(button.dataset.sceneModel);
    return;
  }

  if (button.dataset.applyScene !== undefined) {
    activeSceneModelId = "";
    applySceneSource();
    renderSceneModelControls();
    return;
  }

  if (button.dataset.ringIndex !== undefined) {
    startRingFlip(
      Number(button.dataset.ringIndex),
      Number(button.dataset.direction),
      performance.now()
    );
    requestAnimationUpdate();
  }
});

window.addEventListener("resize", () => {
  fitCanvas();
  draw();
});

sceneSourceInput.value = DEFAULT_SCENE_SOURCE;
scene = compileSceneSource(DEFAULT_SCENE_SOURCE);
centerWidthInput.value = scene.centerDiameter;
ellipseToggle.checked = scene.ellipse.enabled;
weatherToggle.checked = scene.weatherEnabled;
renderSceneModelControls();
renderSceneModelSummary();
renderRingControls();
fitCanvas();
draw();
