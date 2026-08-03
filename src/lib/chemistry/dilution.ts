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
