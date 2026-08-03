import {
  ATOMIC_MASSES,
  parseFormula,
  FormulaParseError,
  type FormulaResult,
} from "@/lib/chemistry/molar-mass";

export class CompositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompositionError";
  }
}

export interface ElementAmount {
  element: string;
  /** Mass in grams, or mass percent — depending on mode */
  value: number;
}

export interface EmpiricalResult {
  ratios: Array<{ element: string; moles: number; index: number }>;
  empiricalFormula: string;
  molarMassEmpirical: number;
  /** If molecular mass given */
  molecularFormula?: string;
  multiplier?: number;
}

function gcdInt(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/** Find a small integer multiplier that clears near-rational mole ratios. */
function toIntegerSubscripts(ratios: number[]): number[] {
  const maxMult = 12;
  let bestMult = 1;
  let bestScore = Infinity;

  for (let m = 1; m <= maxMult; m += 1) {
    let score = 0;
    for (const r of ratios) {
      const scaled = r * m;
      const nearest = Math.round(scaled);
      if (nearest < 1) {
        score = Infinity;
        break;
      }
      score += Math.abs(scaled - nearest);
    }
    if (score < bestScore - 1e-9) {
      bestScore = score;
      bestMult = m;
    }
  }

  const ints = ratios.map((r) => Math.max(1, Math.round(r * bestMult)));
  let g = ints[0] ?? 1;
  for (const n of ints) g = gcdInt(g, n);
  return ints.map((n) => n / g);
}

export function percentCompositionFromFormula(formula: string): FormulaResult {
  try {
    return parseFormula(formula);
  } catch (error) {
    if (error instanceof FormulaParseError) {
      throw new CompositionError(error.message);
    }
    throw error;
  }
}

/**
 * Empirical formula from element masses or mass percents.
 * If values look like percents (sum ≈ 100), treat as percent; otherwise as grams.
 */
export function empiricalFromElements(
  amounts: ElementAmount[],
  molecularMass?: number,
): EmpiricalResult {
  if (amounts.length === 0) {
    throw new CompositionError("Add at least one element with a positive amount.");
  }

  for (const row of amounts) {
    const el = row.element.trim();
    if (!el || !(el in ATOMIC_MASSES)) {
      throw new CompositionError(`Unknown element: ${row.element || "(empty)"}.`);
    }
    if (!(row.value > 0) || !Number.isFinite(row.value)) {
      throw new CompositionError(`Amount for ${el} must be a positive number.`);
    }
  }

  const sum = amounts.reduce((s, a) => s + a.value, 0);
  const asPercent = Math.abs(sum - 100) < 2 || amounts.every((a) => a.value <= 100);
  // Prefer grams if sum is clearly not near 100 and some values > 100
  const usePercent =
    Math.abs(sum - 100) <= 2.5 ||
    (asPercent && sum <= 105 && amounts.every((a) => a.value <= 100));

  const masses = amounts.map((a) => ({
    element: a.element.trim(),
    mass: usePercent ? a.value : a.value, // both work as relative masses
  }));

  const moles = masses.map((m) => ({
    element: m.element,
    moles: m.mass / ATOMIC_MASSES[m.element],
  }));

  const minMoles = Math.min(...moles.map((m) => m.moles));
  if (!(minMoles > 0)) {
    throw new CompositionError("Could not compute mole ratios.");
  }

  const relative = moles.map((m) => m.moles / minMoles);
  const indices = toIntegerSubscripts(relative);

  const ratios = moles.map((m, i) => ({
    element: m.element,
    moles: m.moles,
    index: indices[i],
  }));

  // Stable formula order: C, H, then alphabetical (common organic convention when present)
  const order = (el: string) => {
    if (el === "C") return 0;
    if (el === "H") return 1;
    return 10 + el.charCodeAt(0);
  };
  const sorted = [...ratios].sort((a, b) => order(a.element) - order(b.element));

  const empiricalFormula = sorted
    .map((r) => (r.index === 1 ? r.element : `${r.element}${r.index}`))
    .join("");

  const molarMassEmpirical = sorted.reduce(
    (s, r) => s + ATOMIC_MASSES[r.element] * r.index,
    0,
  );

  let molecularFormula: string | undefined;
  let multiplier: number | undefined;

  if (molecularMass !== undefined && molecularMass !== null) {
    if (!(molecularMass > 0) || !Number.isFinite(molecularMass)) {
      throw new CompositionError("Molecular mass must be a positive number.");
    }
    multiplier = Math.max(1, Math.round(molecularMass / molarMassEmpirical));
    const check = Math.abs(multiplier * molarMassEmpirical - molecularMass) / molecularMass;
    if (check > 0.08) {
      throw new CompositionError(
        `Molecular mass ${molecularMass} is not close to an integer multiple of the empirical mass (${molarMassEmpirical.toFixed(2)} g/mol).`,
      );
    }
    molecularFormula = sorted
      .map((r) => {
        const n = r.index * multiplier!;
        return n === 1 ? r.element : `${r.element}${n}`;
      })
      .join("");
  }

  return {
    ratios: sorted,
    empiricalFormula,
    molarMassEmpirical,
    molecularFormula,
    multiplier,
  };
}

/** Re-export atomic mass table keys for UI selectors. */
export const COMMON_ELEMENTS = [
  "C",
  "H",
  "O",
  "N",
  "S",
  "P",
  "Cl",
  "Br",
  "F",
  "I",
  "Na",
  "K",
  "Ca",
  "Mg",
  "Fe",
  "Cu",
  "Zn",
  "Al",
] as const;
