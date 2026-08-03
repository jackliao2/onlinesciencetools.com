export class KineticsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KineticsError";
  }
}

export type RateOrder = 0 | 1 | 2;

export interface KineticsInput {
  order: RateOrder;
  /** Rate constant; units depend on order */
  k: number;
  /** Initial concentration (mol/L) — required for 0th/2nd; optional display for 1st */
  c0?: number;
  /** Elapsed time */
  t?: number;
  /** Concentration at time t — if solving for t or k */
  c?: number;
  /** Solve target when multiple knowns */
  solveFor?: "c" | "t" | "k" | "halfLife";
}

export interface KineticsResult {
  order: RateOrder;
  k: number;
  c0: number | null;
  t: number | null;
  c: number | null;
  halfLife: number;
  expression: string;
  notes: string[];
}

function requirePositive(value: number, label: string): void {
  if (!Number.isFinite(value) || !(value > 0)) {
    throw new KineticsError(`${label} must be a positive number.`);
  }
}

export function halfLife(order: RateOrder, k: number, c0?: number): number {
  requirePositive(k, "Rate constant k");
  if (order === 0) {
    if (c0 === undefined) throw new KineticsError("Zero-order half-life needs [A]₀.");
    requirePositive(c0, "[A]₀");
    return c0 / (2 * k);
  }
  if (order === 1) {
    return Math.LN2 / k;
  }
  // second order
  if (c0 === undefined) throw new KineticsError("Second-order half-life needs [A]₀.");
  requirePositive(c0, "[A]₀");
  return 1 / (k * c0);
}

/** Integrated rate laws — solve for remaining concentration given t. */
export function concentrationAtTime(
  order: RateOrder,
  k: number,
  c0: number,
  t: number,
): number {
  requirePositive(k, "k");
  requirePositive(c0, "[A]₀");
  if (!Number.isFinite(t) || t < 0) {
    throw new KineticsError("Time must be a non-negative number.");
  }

  if (order === 0) {
    const c = c0 - k * t;
    if (c < 0) {
      throw new KineticsError("At this time the zero-order reactant would be fully consumed.");
    }
    return c;
  }
  if (order === 1) {
    return c0 * Math.exp(-k * t);
  }
  const denom = 1 + k * c0 * t;
  if (!(denom > 0)) throw new KineticsError("Invalid second-order parameters.");
  return c0 / denom;
}

export function timeToConcentration(
  order: RateOrder,
  k: number,
  c0: number,
  c: number,
): number {
  requirePositive(k, "k");
  requirePositive(c0, "[A]₀");
  if (!Number.isFinite(c) || !(c > 0)) {
    throw new KineticsError("[A]ₜ must be a positive number.");
  }
  if (c > c0 + 1e-12) {
    throw new KineticsError("[A]ₜ cannot exceed [A]₀ for a decaying reactant.");
  }

  if (order === 0) {
    return (c0 - c) / k;
  }
  if (order === 1) {
    return Math.log(c0 / c) / k;
  }
  return (1 / c - 1 / c0) / k;
}

export function solveKinetics(input: KineticsInput): KineticsResult {
  const { order, k: kIn, c0, t, c, solveFor = "c" } = input;
  const notes: string[] = [];

  let expression =
    order === 0
      ? "[A] = [A]₀ − kt"
      : order === 1
        ? "ln[A] = ln[A]₀ − kt"
        : "1/[A] = 1/[A]₀ + kt";

  if (solveFor === "halfLife") {
    requirePositive(kIn, "k");
    const tHalf = halfLife(order, kIn, c0);
    return {
      order,
      k: kIn,
      c0: c0 ?? null,
      t: null,
      c: null,
      halfLife: tHalf,
      expression:
        order === 0
          ? "t½ = [A]₀ / (2k)"
          : order === 1
            ? "t½ = ln 2 / k"
            : "t½ = 1 / (k[A]₀)",
      notes: ["Half-life for the selected integrated rate law."],
    };
  }

  if (solveFor === "c") {
    if (c0 === undefined || t === undefined) {
      throw new KineticsError("Solving for [A]ₜ needs [A]₀, k, and t.");
    }
    requirePositive(kIn, "k");
    const ct = concentrationAtTime(order, kIn, c0, t);
    const tHalf = halfLife(order, kIn, c0);
    if (order === 1) notes.push("First-order half-life is independent of [A]₀.");
    return {
      order,
      k: kIn,
      c0,
      t,
      c: ct,
      halfLife: tHalf,
      expression,
      notes,
    };
  }

  if (solveFor === "t") {
    if (c0 === undefined || c === undefined) {
      throw new KineticsError("Solving for t needs [A]₀, [A]ₜ, and k.");
    }
    requirePositive(kIn, "k");
    const time = timeToConcentration(order, kIn, c0, c);
    return {
      order,
      k: kIn,
      c0,
      t: time,
      c,
      halfLife: halfLife(order, kIn, c0),
      expression,
      notes,
    };
  }

  // solve for k
  if (c0 === undefined || c === undefined || t === undefined) {
    throw new KineticsError("Solving for k needs [A]₀, [A]ₜ, and t.");
  }
  requirePositive(c0, "[A]₀");
  requirePositive(c, "[A]ₜ");
  if (!(t > 0)) throw new KineticsError("Time must be positive to solve for k.");
  if (c > c0) throw new KineticsError("[A]ₜ cannot exceed [A]₀.");

  let k: number;
  if (order === 0) {
    k = (c0 - c) / t;
  } else if (order === 1) {
    k = Math.log(c0 / c) / t;
  } else {
    k = (1 / c - 1 / c0) / t;
  }
  if (!(k > 0)) throw new KineticsError("Computed k is not positive — check inputs.");

  return {
    order,
    k,
    c0,
    t,
    c,
    halfLife: halfLife(order, k, c0),
    expression,
    notes: ["k was computed from the integrated rate law and your [A]₀, [A]ₜ, t."],
  };
}
