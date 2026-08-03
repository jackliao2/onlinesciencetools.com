import { parseFormula, FormulaParseError } from "@/lib/chemistry/molar-mass";

export interface BalancedSpecies {
  formula: string;
  coefficient: number;
  side: "reactant" | "product";
}

export interface BalanceResult {
  reactants: BalancedSpecies[];
  products: BalancedSpecies[];
  equation: string;
}

export class BalanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BalanceError";
  }
}

function splitEquation(raw: string): { left: string[]; right: string[] } {
  const normalized = raw
    .replace(/\s+/g, " ")
    .replace(/<=>|⇌|↔|→|⇒|=/g, "=")
    .trim();

  const parts = normalized.split("=");
  if (parts.length !== 2) {
    throw new BalanceError(
      'Enter an equation like "H2 + O2 = H2O" or "Fe + O2 → Fe2O3".',
    );
  }

  const left = parts[0]
    .split("+")
    .map((s) => s.trim())
    .filter(Boolean);
  const right = parts[1]
    .split("+")
    .map((s) => s.trim())
    .filter(Boolean);

  if (left.length === 0 || right.length === 0) {
    throw new BalanceError("Both sides of the equation need at least one species.");
  }

  return { left, right };
}

function stripLeadingCoefficient(token: string): string {
  return token.replace(/^\d+/, "").trim() || token;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Best rational approximation n/d with d ≤ maxDen (continued fractions). */
function toRational(
  value: number,
  maxDen = 1000,
): { n: number; d: number } {
  if (!Number.isFinite(value)) return { n: 0, d: 1 };
  const sign = value < 0 ? -1 : 1;
  let x = Math.abs(value);
  let a0 = Math.floor(x);
  if (Math.abs(x - a0) < 1e-12) return { n: sign * a0, d: 1 };

  let p0 = 1;
  let q0 = 0;
  let p1 = a0;
  let q1 = 1;

  let remaining = x - a0;
  for (let i = 0; i < 40 && remaining > 1e-14; i += 1) {
    x = 1 / remaining;
    const a = Math.floor(x + 1e-12);
    const p = a * p1 + p0;
    const q = a * q1 + q0;
    if (q > maxDen) break;
    p0 = p1;
    q0 = q1;
    p1 = p;
    q1 = q;
    remaining = x - a;
    if (Math.abs(value - sign * (p1 / q1)) < 1e-10) break;
  }

  return { n: sign * p1, d: q1 || 1 };
}

/** Convert null-space floats to the smallest positive integer coefficient set. */
function toIntegerCoefficients(values: number[]): number[] {
  const rats = values.map((v) => toRational(v));
  const den = rats.reduce((acc, r) => lcm(acc, r.d), 1);
  let ints = rats.map((r) => (r.n * den) / r.d);
  const g = ints.reduce((acc, n) => gcd(acc, n), ints[0] || 1);
  ints = ints.map((n) => n / g);
  if (ints.some((n) => n < 0)) {
    ints = ints.map((n) => -n);
  }
  if (ints.every((n) => n === 0) || ints.some((n) => !Number.isInteger(n))) {
    throw new BalanceError("Could not find a non-trivial balancing solution.");
  }
  return ints;
}

/**
 * Balance a chemical equation using linear algebra on elemental composition.
 * Reactants contribute +coeff·atoms, products contribute −coeff·atoms → sum 0.
 */
export function balanceEquation(raw: string): BalanceResult {
  const { left, right } = splitEquation(raw);
  const formulas = [
    ...left.map(stripLeadingCoefficient),
    ...right.map(stripLeadingCoefficient),
  ];

  const compositions = formulas.map((formula) => {
    try {
      return parseFormula(formula);
    } catch (error) {
      if (error instanceof FormulaParseError) {
        throw new BalanceError(`${formula}: ${error.message}`);
      }
      throw error;
    }
  });

  const elements = [
    ...new Set(compositions.flatMap((c) => c.composition.map((e) => e.element))),
  ].sort();

  const n = formulas.length;
  const m = elements.length;

  // Matrix A (m × n): atom counts; products negated
  const A: number[][] = Array.from({ length: m }, () => Array(n).fill(0));
  for (let j = 0; j < n; j += 1) {
    const sign = j < left.length ? 1 : -1;
    for (const row of compositions[j].composition) {
      const i = elements.indexOf(row.element);
      A[i][j] = sign * row.count;
    }
  }

  // Augment with zeros and row-reduce A x = 0; free variable x_n = 1
  const rows = A.map((row) => [...row]);
  const h = rows.length;
  const w = n;

  let rank = 0;
  const colPivot: number[] = [];

  for (let col = 0; col < w - 1 && rank < h; col += 1) {
    let pivot = rank;
    for (let r = rank + 1; r < h; r += 1) {
      if (Math.abs(rows[r][col]) > Math.abs(rows[pivot][col])) pivot = r;
    }
    if (Math.abs(rows[pivot][col]) < 1e-12) continue;

    [rows[rank], rows[pivot]] = [rows[pivot], rows[rank]];
    const div = rows[rank][col];
    for (let c = col; c < w; c += 1) rows[rank][c] /= div;

    for (let r = 0; r < h; r += 1) {
      if (r === rank) continue;
      const factor = rows[r][col];
      for (let c = col; c < w; c += 1) {
        rows[r][c] -= factor * rows[rank][c];
      }
    }

    colPivot[rank] = col;
    rank += 1;
  }

  const x = Array(n).fill(0);
  x[n - 1] = 1;

  for (let r = rank - 1; r >= 0; r -= 1) {
    const col = colPivot[r];
    let sum = 0;
    for (let c = col + 1; c < n; c += 1) {
      sum += rows[r][c] * x[c];
    }
    x[col] = -sum;
  }

  // If leading species got 0, try another free variable
  if (Math.abs(x[0]) < 1e-9) {
    for (let free = n - 2; free >= 0; free -= 1) {
      const trial = Array(n).fill(0);
      trial[free] = 1;
      for (let r = rank - 1; r >= 0; r -= 1) {
        const col = colPivot[r];
        if (col === undefined) continue;
        let sum = 0;
        for (let c = col + 1; c < n; c += 1) {
          sum += rows[r][c] * trial[c];
        }
        trial[col] = -sum;
      }
      if (trial.every((v) => Math.abs(v) > 1e-9 || v === 0) && trial.some((v) => Math.abs(v) > 1e-9)) {
        for (let i = 0; i < n; i += 1) x[i] = trial[i];
        break;
      }
    }
  }

  const coeffs = toIntegerCoefficients(x);

  // Verify balance
  for (const el of elements) {
    let sum = 0;
    for (let j = 0; j < n; j += 1) {
      const count =
        compositions[j].composition.find((c) => c.element === el)?.count ?? 0;
      const sign = j < left.length ? 1 : -1;
      sum += sign * coeffs[j] * count;
    }
    if (Math.abs(sum) > 1e-6) {
      throw new BalanceError(
        "Unable to balance this equation automatically. Check formulas and try again.",
      );
    }
  }

  const reactants = left.map((formula, i) => ({
    formula: stripLeadingCoefficient(formula),
    coefficient: coeffs[i],
    side: "reactant" as const,
  }));
  const products = right.map((formula, i) => ({
    formula: stripLeadingCoefficient(formula),
    coefficient: coeffs[left.length + i],
    side: "product" as const,
  }));

  const fmt = (items: BalancedSpecies[]) =>
    items
      .map((s) => (s.coefficient === 1 ? s.formula : `${s.coefficient}${s.formula}`))
      .join(" + ");

  return {
    reactants,
    products,
    equation: `${fmt(reactants)} → ${fmt(products)}`,
  };
}
