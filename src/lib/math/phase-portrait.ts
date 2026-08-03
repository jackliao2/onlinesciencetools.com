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
      return { x: 0, y: 0 };
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
      samples.push({ x, y, dx: v.x, dy: v.y, mag });
    }
  }
  return samples;
}
