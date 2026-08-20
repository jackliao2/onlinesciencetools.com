import { parseFormula, FormulaParseError } from "@/lib/chemistry/molar-mass";

export interface BalancedSpecies {
  formula: string;
  coefficient: number;
  side: "reactant" | "product";
}

export interface AtomCheckRow {
  element: string;
  reactantAtoms: number;
  productAtoms: number;
}

export interface BalanceResult {
  reactants: BalancedSpecies[];
  products: BalancedSpecies[];
  equation: string;
  /** Short inspection-style notes for teaching / SEO “with steps”. */
  steps: string[];
  /** Atom inventory after applying coefficients (should match left/right). */
  atomCheck: AtomCheckRow[];
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

/** Split an equation and strip any typed leading coefficients from each species. */
export function parseEquationSides(raw: string): {
  left: string[];
  right: string[];
} {
  const { left, right } = splitEquation(raw);
  return {
    left: left.map(stripLeadingCoefficient),
    right: right.map(stripLeadingCoefficient),
  };
}

export function atomCheckForCoefficients(
  left: string[],
  right: string[],
  coeffs: number[],
): AtomCheckRow[] {
  if (coeffs.length !== left.length + right.length) {
    throw new BalanceError(
      "Coefficient count does not match the number of species.",
    );
  }

  const formulas = [...left, ...right];
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

  return elements.map((el) => {
    let reactantAtoms = 0;
    let productAtoms = 0;
    for (let j = 0; j < left.length; j += 1) {
      const count =
        compositions[j].composition.find((c) => c.element === el)?.count ?? 0;
      reactantAtoms += coeffs[j] * count;
    }
    for (let j = 0; j < right.length; j += 1) {
      const idx = left.length + j;
      const count =
        compositions[idx].composition.find((c) => c.element === el)?.count ?? 0;
      productAtoms += coeffs[idx] * count;
    }
    return { element: el, reactantAtoms, productAtoms };
  });
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
  const a0 = Math.floor(x);
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
  if (
    ints.every((n) => n === 0) ||
    ints.some((n) => !Number.isInteger(n) || n === 0)
  ) {
    throw new BalanceError("Could not find a non-trivial balancing solution.");
  }
  return ints;
}

/**
 * Balance a chemical equation using linear algebra on elemental composition.
 * Reactants contribute +coeff·atoms, products contribute −coeff·atoms → sum 0.
 */
export function balanceEquation(raw: string): BalanceResult {
  const { left, right } = parseEquationSides(raw);
  const formulas = [...left, ...right];

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

  // Row-reduce A x = 0 and recover a positive null-space vector.
  const rows = A.map((row) => [...row]);
  const h = rows.length;
  const w = n;

  let rank = 0;
  const pivotOfRow: number[] = [];
  const isPivotCol = Array(w).fill(false);

  for (let col = 0; col < w && rank < h; col += 1) {
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
      if (Math.abs(factor) < 1e-14) continue;
      for (let c = col; c < w; c += 1) {
        rows[r][c] -= factor * rows[rank][c];
      }
    }

    pivotOfRow[rank] = col;
    isPivotCol[col] = true;
    rank += 1;
  }

  const freeCols = Array.from({ length: w }, (_, i) => i).filter(
    (c) => !isPivotCol[c],
  );
  if (freeCols.length === 0) {
    throw new BalanceError(
      "This equation is over-constrained or already inconsistent. Check the formulas.",
    );
  }

  function nullVector(freeCol: number): number[] {
    const trial = Array(n).fill(0);
    trial[freeCol] = 1;
    for (let r = 0; r < rank; r += 1) {
      const col = pivotOfRow[r];
      let sum = 0;
      for (const free of freeCols) {
        sum += rows[r][free] * trial[free];
      }
      trial[col] = -sum;
    }
    return trial;
  }

  let x: number[] | null = null;
  for (const free of [...freeCols].reverse()) {
    const trial = nullVector(free);
    if (trial.every((v) => Math.abs(v) > 1e-9)) {
      x = trial;
      break;
    }
  }
  if (!x && freeCols.length > 1) {
    // A single null-space basis vector may contain zero entries even though a
    // positive combination of basis vectors balances every listed species.
    // Search small positive free-variable ratios and retain the simplest
    // positive integer result.
    let bestScore = Number.POSITIVE_INFINITY;
    const weights = Array(freeCols.length).fill(1);
    const consider = () => {
      const trial = Array(n).fill(0);
      freeCols.forEach((free, i) => {
        trial[free] = weights[i];
      });
      for (let r = 0; r < rank; r += 1) {
        const col = pivotOfRow[r];
        let sum = 0;
        for (const free of freeCols) sum += rows[r][free] * trial[free];
        trial[col] = -sum;
      }
      if (!trial.every((v) => v > 1e-9)) return;
      try {
        const ints = toIntegerCoefficients(trial);
        const score = ints.reduce((sum, value) => sum + value, 0);
        if (score < bestScore) {
          bestScore = score;
          x = trial;
        }
      } catch {
        // Skip free-variable weights that do not clear to integers.
      }
    };
    const search = (index: number) => {
      if (index === weights.length) {
        consider();
        return;
      }
      for (let value = 1; value <= 12; value += 1) {
        weights[index] = value;
        search(index + 1);
      }
    };
    if (freeCols.length <= 3) search(0);
  }
  if (!x) {
    // Fall back to any non-zero null vector and let integer conversion report
    // an informative error if it cannot represent every listed species.
    for (const free of freeCols) {
      const trial = nullVector(free);
      if (trial.some((v) => Math.abs(v) > 1e-9)) {
        x = trial;
        break;
      }
    }
  }
  if (!x) {
    throw new BalanceError("Could not find a non-trivial balancing solution.");
  }

  const coeffs = toIntegerCoefficients(x);

  if (coeffs.some((c) => c <= 0) || !coeffs.every((c) => Number.isInteger(c))) {
    throw new BalanceError(
      "Unable to balance this equation automatically. Check formulas and try again.",
    );
  }

  // Verify atom balance
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
    formula,
    coefficient: coeffs[i],
    side: "reactant" as const,
  }));
  const products = right.map((formula, i) => ({
    formula,
    coefficient: coeffs[left.length + i],
    side: "product" as const,
  }));

  const fmt = (items: BalancedSpecies[]) =>
    items
      .map((s) => (s.coefficient === 1 ? s.formula : `${s.coefficient}${s.formula}`))
      .join(" + ");

  const atomCheck = atomCheckForCoefficients(left, right, coeffs);

  const steps = [
    `Parse species: ${[...left, ...right].join(", ")}.`,
    `Identify elements to conserve: ${elements.join(", ")}.`,
    `Solve for the smallest positive integer coefficients that balance every element.`,
    `Balanced equation: ${fmt(reactants)} → ${fmt(products)}.`,
    `Verify atom counts match on both sides for each element.`,
  ];

  return {
    reactants,
    products,
    equation: `${fmt(reactants)} → ${fmt(products)}`,
    steps,
    atomCheck,
  };
}
