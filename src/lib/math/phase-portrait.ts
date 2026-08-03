export type Vec2 = { x: number; y: number };
export type VectorField = (x: number, y: number) => Vec2;

export interface PhasePreset {
  id: string;
  name: string;
  description: string;
  fx: string;
  fy: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const PHASE_PRESETS: PhasePreset[] = [
  {
    id: "saddle",
    name: "Saddle Point",
    description: "Linear saddle: unstable along one axis, stable along the other.",
    fx: "x",
    fy: "-y",
    xMin: -3,
    xMax: 3,
    yMin: -3,
    yMax: 3,
  },
  {
    id: "spiral",
    name: "Spiral Sink",
    description: "Damped spiral converging to the origin.",
    fx: "-0.3*x - y",
    fy: "x - 0.3*y",
    xMin: -3,
    xMax: 3,
    yMin: -3,
    yMax: 3,
  },
  {
    id: "vanderpol",
    name: "Van der Pol",
    description: "Classic nonlinear oscillator with a stable limit cycle.",
    fx: "y",
    fy: "1.5*(1 - x*x)*y - x",
    xMin: -4,
    xMax: 4,
    yMin: -4,
    yMax: 4,
  },
  {
    id: "predator",
    name: "Predator–Prey",
    description: "Classic Lotka–Volterra predator–prey cycles between two populations.",
    fx: "x*(1 - y)",
    fy: "y*(x - 1)",
    xMin: -0.5,
    xMax: 3,
    yMin: -0.5,
    yMax: 3,
  },
  {
    id: "center",
    name: "Center (Circles)",
    description: "Conservative linear center producing closed orbits.",
    fx: "-y",
    fy: "x",
    xMin: -3,
    xMax: 3,
    yMin: -3,
    yMax: 3,
  },
];

import { compileExpression } from "@/lib/math/expression";

export function compileVectorField(fx: string, fy: string): VectorField {
  const f = compileExpression(fx, ["x", "y"]);
  const g = compileExpression(fy, ["x", "y"]);
  return (x, y) => {
    const dx = f(x, y);
    const dy = g(x, y);
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
      return { x: Number.NaN, y: Number.NaN };
    }
    return { x: dx, y: dy };
  };
}

export function rk4Step(
  field: VectorField,
  point: Vec2,
  dt: number,
): Vec2 {
  const k1 = field(point.x, point.y);
  const k2 = field(point.x + 0.5 * dt * k1.x, point.y + 0.5 * dt * k1.y);
  const k3 = field(point.x + 0.5 * dt * k2.x, point.y + 0.5 * dt * k2.y);
  const k4 = field(point.x + dt * k3.x, point.y + dt * k3.y);

  return {
    x: point.x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    y: point.y + (dt / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
  };
}

export function integrateTrajectory(
  field: VectorField,
  start: Vec2,
  options: {
    steps?: number;
    dt?: number;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  },
): Vec2[] {
  const steps = options.steps ?? 800;
  const dt = options.dt ?? 0.02;
  const forward: Vec2[] = [start];
  const backward: Vec2[] = [];

  let p = { ...start };
  for (let i = 0; i < steps; i += 1) {
    p = rk4Step(field, p, dt);
    if (
      !Number.isFinite(p.x) ||
      !Number.isFinite(p.y) ||
      p.x < options.xMin - 1 ||
      p.x > options.xMax + 1 ||
      p.y < options.yMin - 1 ||
      p.y > options.yMax + 1
    ) {
      break;
    }
    forward.push(p);
  }

  p = { ...start };
  for (let i = 0; i < steps; i += 1) {
    p = rk4Step(field, p, -dt);
    if (
      !Number.isFinite(p.x) ||
      !Number.isFinite(p.y) ||
      p.x < options.xMin - 1 ||
      p.x > options.xMax + 1 ||
      p.y < options.yMin - 1 ||
      p.y > options.yMax + 1
    ) {
      break;
    }
    backward.push(p);
  }

  return [...backward.reverse(), ...forward];
}

export function sampleVectorField(
  field: VectorField,
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
  density: number,
): Array<{ x: number; y: number; dx: number; dy: number; mag: number }> {
  const samples = [];
  for (let i = 0; i <= density; i += 1) {
    for (let j = 0; j <= density; j += 1) {
      const x = bounds.xMin + (i / density) * (bounds.xMax - bounds.xMin);
      const y = bounds.yMin + (j / density) * (bounds.yMax - bounds.yMin);
      const v = field(x, y);
      const mag = Math.hypot(v.x, v.y);
      if (Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(mag)) {
        samples.push({ x, y, dx: v.x, dy: v.y, mag });
      }
    }
  }
  return samples;
}

export type EquilibriumClass =
  | "sink"
  | "source"
  | "saddle"
  | "spiral-sink"
  | "spiral-source"
  | "center"
  | "degenerate";

export interface EquilibriumPoint {
  x: number;
  y: number;
  classification: EquilibriumClass;
  trace: number;
  det: number;
}

function numericalJacobian(
  field: VectorField,
  x: number,
  y: number,
  h = 1e-5,
): [[number, number], [number, number]] {
  const fxp = field(x + h, y);
  const fxm = field(x - h, y);
  const fyp = field(x, y + h);
  const fym = field(x, y - h);
  return [
    [(fxp.x - fxm.x) / (2 * h), (fyp.x - fym.x) / (2 * h)],
    [(fxp.y - fxm.y) / (2 * h), (fyp.y - fym.y) / (2 * h)],
  ];
}

function classifyJacobian(J: [[number, number], [number, number]]): {
  classification: EquilibriumClass;
  trace: number;
  det: number;
} {
  const trace = J[0][0] + J[1][1];
  const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
  const disc = trace * trace - 4 * det;

  if (Math.abs(det) < 1e-10) {
    return { classification: "degenerate", trace, det };
  }
  if (det < 0) return { classification: "saddle", trace, det };
  if (disc < 0) {
    if (Math.abs(trace) < 1e-8) return { classification: "center", trace, det };
    return {
      classification: trace < 0 ? "spiral-sink" : "spiral-source",
      trace,
      det,
    };
  }
  if (trace < 0) return { classification: "sink", trace, det };
  if (trace > 0) return { classification: "source", trace, det };
  return { classification: "center", trace, det };
}

function newtonEquilibria(
  field: VectorField,
  start: Vec2,
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
): Vec2 | null {
  let x = start.x;
  let y = start.y;
  for (let i = 0; i < 20; i += 1) {
    const v = field(x, y);
    if (!Number.isFinite(v.x) || !Number.isFinite(v.y)) return null;
    if (Math.hypot(v.x, v.y) < 1e-10) return { x, y };
    const J = numericalJacobian(field, x, y);
    const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
    if (Math.abs(det) < 1e-14) return null;
    const dx = (J[1][1] * v.x - J[0][1] * v.y) / det;
    const dy = (-J[1][0] * v.x + J[0][0] * v.y) / det;
    x -= dx;
    y -= dy;
    if (
      x < bounds.xMin - 1 ||
      x > bounds.xMax + 1 ||
      y < bounds.yMin - 1 ||
      y > bounds.yMax + 1
    ) {
      return null;
    }
    if (Math.hypot(dx, dy) < 1e-10) break;
  }
  const v = field(x, y);
  if (!Number.isFinite(v.x) || !Number.isFinite(v.y) || Math.hypot(v.x, v.y) > 1e-6) {
    return null;
  }
  if (x < bounds.xMin || x > bounds.xMax || y < bounds.yMin || y > bounds.yMax) {
    return null;
  }
  return { x, y };
}

/** Find equilibria by coarse grid seeds + Newton polish. */
export function findEquilibria(
  field: VectorField,
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
  grid = 24,
): EquilibriumPoint[] {
  const found: EquilibriumPoint[] = [];
  const tol = Math.min(bounds.xMax - bounds.xMin, bounds.yMax - bounds.yMin) * 0.02;

  for (let i = 0; i <= grid; i += 1) {
    for (let j = 0; j <= grid; j += 1) {
      const seed = {
        x: bounds.xMin + (i / grid) * (bounds.xMax - bounds.xMin),
        y: bounds.yMin + (j / grid) * (bounds.yMax - bounds.yMin),
      };
      const eq = newtonEquilibria(field, seed, bounds);
      if (!eq) continue;
      if (found.some((p) => Math.hypot(p.x - eq.x, p.y - eq.y) < tol)) continue;
      const J = numericalJacobian(field, eq.x, eq.y);
      const cls = classifyJacobian(J);
      found.push({ x: eq.x, y: eq.y, ...cls });
    }
  }
  return found;
}

/** Sample approximate nullcline polylines where |f| or |g| is near zero. */
export function sampleNullclines(
  field: VectorField,
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
  density = 80,
): { fZero: Vec2[]; gZero: Vec2[] } {
  const fZero: Vec2[] = [];
  const gZero: Vec2[] = [];
  const dx = (bounds.xMax - bounds.xMin) / density;
  const dy = (bounds.yMax - bounds.yMin) / density;
  const tol =
    0.02 *
    Math.max(
      Math.abs(bounds.xMax - bounds.xMin),
      Math.abs(bounds.yMax - bounds.yMin),
      1,
    );

  for (let i = 0; i <= density; i += 1) {
    for (let j = 0; j <= density; j += 1) {
      const x = bounds.xMin + i * dx;
      const y = bounds.yMin + j * dy;
      const v = field(x, y);
      if (!Number.isFinite(v.x) || !Number.isFinite(v.y)) continue;
      if (Math.abs(v.x) < tol) fZero.push({ x, y });
      if (Math.abs(v.y) < tol) gZero.push({ x, y });
    }
  }
  return { fZero, gZero };
}
