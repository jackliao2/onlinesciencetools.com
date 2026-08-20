export class DilutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DilutionError";
  }
}

export type DilutionField = "c1" | "v1" | "c2" | "v2";

export interface DilutionInput {
  c1: number | null;
  v1: number | null;
  c2: number | null;
  v2: number | null;
}

export interface DilutionResult {
  c1: number;
  v1: number;
  c2: number;
  v2: number;
  solved: DilutionField;
  dilutionFactor: number;
  expression: string;
}

/** Convert volume to liters. */
export function toLiters(value: number, unit: "L" | "mL"): number {
  return unit === "mL" ? value / 1000 : value;
}

export function fromLiters(liters: number, unit: "L" | "mL"): number {
  return unit === "mL" ? liters * 1000 : liters;
}

/**
 * Solve C₁V₁ = C₂V₂ for exactly one missing positive value.
 * Concentrations must use the same unit; volumes are compared in liters.
 */
export function solveDilution(input: DilutionInput): DilutionResult {
  const entries = (["c1", "v1", "c2", "v2"] as DilutionField[]).map((key) => ({
    key,
    value: input[key],
  }));

  const missing = entries.filter((e) => e.value === null || e.value === undefined);
  const known = entries.filter(
    (e) => e.value !== null && e.value !== undefined && Number.isFinite(e.value),
  );

  if (missing.length !== 1) {
    throw new DilutionError("Leave exactly one field blank to solve for it.");
  }

  for (const item of known) {
    if (!(item.value! > 0)) {
      throw new DilutionError("All known values must be positive numbers.");
    }
  }

  const solved = missing[0].key;
  let c1 = input.c1;
  let v1 = input.v1;
  let c2 = input.c2;
  let v2 = input.v2;

  switch (solved) {
    case "c1":
      c1 = (c2! * v2!) / v1!;
      break;
    case "v1":
      v1 = (c2! * v2!) / c1!;
      break;
    case "c2":
      c2 = (c1! * v1!) / v2!;
      break;
    case "v2":
      v2 = (c1! * v1!) / c2!;
      break;
  }

  if (![c1, v1, c2, v2].every((v) => v !== null && Number.isFinite(v) && v > 0)) {
    throw new DilutionError("Could not compute a positive physical result.");
  }

  if (c2! > c1! + 1e-12) {
    throw new DilutionError(
      "Stock concentration C₁ must be greater than or equal to diluted C₂.",
    );
  }

  return {
    c1: c1!,
    v1: v1!,
    c2: c2!,
    v2: v2!,
    solved,
    dilutionFactor: c1! / c2!,
    expression: "C₁V₁ = C₂V₂",
  };
}

export interface SerialDilutionInput {
  /** Stock concentration (same units throughout). */
  stockC: number;
  /** Dilution factor per step (e.g. 10 for a 1:10 step). */
  factor: number;
  /** Number of successive dilution steps (≥ 1). */
  steps: number;
  /** Aliquot transferred each step (same volume unit as finalV). */
  transferV: number;
  /** Final volume after each step (must be > transferV). */
  finalV: number;
}

export interface SerialDilutionStep {
  step: number;
  concentration: number;
  dilutionFactorFromStock: number;
}

export interface SerialDilutionResult {
  factor: number;
  steps: SerialDilutionStep[];
  overallFactor: number;
  expression: string;
}

/**
 * Plan a geometric serial dilution: each step dilutes by `factor`
 * using transferV into finalV (so factor should equal finalV / transferV).
 */
export function solveSerialDilution(
  input: SerialDilutionInput,
): SerialDilutionResult {
  const { stockC, factor, steps, transferV, finalV } = input;

  if (!(stockC > 0) || !(factor > 1) || !(transferV > 0) || !(finalV > 0)) {
    throw new DilutionError(
      "Stock concentration, factor (>1), transfer volume, and final volume must be positive.",
    );
  }
  if (!Number.isInteger(steps) || steps < 1 || steps > 20) {
    throw new DilutionError("Use between 1 and 20 serial dilution steps.");
  }
  if (transferV >= finalV) {
    throw new DilutionError(
      "Transfer volume must be smaller than the final volume of each tube.",
    );
  }

  const volumeFactor = finalV / transferV;
  if (Math.abs(volumeFactor - factor) > 1e-6 * factor) {
    throw new DilutionError(
      `For a ${factor}× step, final volume / transfer should equal ${factor} (got ${volumeFactor.toPrecision(6)}).`,
    );
  }

  const out: SerialDilutionStep[] = [];
  let c = stockC;
  for (let i = 1; i <= steps; i += 1) {
    c = c / factor;
    out.push({
      step: i,
      concentration: c,
      dilutionFactorFromStock: stockC / c,
    });
  }

  return {
    factor,
    steps: out,
    overallFactor: factor ** steps,
    expression: `Each step: C_out = C_in / ${factor}  (transfer ${transferV} into ${finalV})`,
  };
}

/** Common ratio chips → dilution factor (V₂/V₁ or C₁/C₂). */
export const DILUTION_RATIO_PRESETS = [
  { id: "1:2", label: "1:2", factor: 2 },
  { id: "1:5", label: "1:5", factor: 5 },
  { id: "1:10", label: "1:10", factor: 10 },
  { id: "10x", label: "10×", factor: 10 },
  { id: "1:20", label: "1:20", factor: 20 },
  { id: "1:100", label: "1:100", factor: 100 },
  { id: "1:200", label: "1:200", factor: 200 },
] as const;

export const DILUTION_LAB_PRESETS = [
  {
    id: "hcl-1m",
    label: "HCl 12 M → 1 M",
    c1: "12",
    c2: "1",
    v2: "1000",
    concUnit: "M",
  },
  {
    id: "h2so4-1m",
    label: "H₂SO₄ 18 M → 1 M",
    c1: "18",
    c2: "1",
    v2: "1000",
    concUnit: "M",
  },
  {
    id: "alcohol-70",
    label: "Alcohol 95% → 70%",
    c1: "95",
    c2: "70",
    v2: "100",
    concUnit: "% (v/v)",
  },
  {
    id: "bleach-0.1",
    label: "Bleach 5% → 0.1%",
    c1: "5",
    c2: "0.1",
    v2: "1000",
    concUnit: "%",
  },
  {
    id: "h2o2-3",
    label: "H₂O₂ 30% → 3%",
    c1: "30",
    c2: "3",
    v2: "100",
    concUnit: "%",
  },
] as const;
