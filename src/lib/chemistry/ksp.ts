export class KspError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KspError";
  }
}

/**
 * Salt stoichiometry for MxAy(s) ⇌ x M^{n+} + y A^{m-}
 * solubility s in mol/L of formula unit dissolved.
 */
export type SaltType = "AB" | "AB2" | "A2B" | "AB3" | "A3B" | "A2B3";

export const SALT_TYPES: Array<{
  id: SaltType;
  label: string;
  /** Ksp = (x s)^x (y s)^y = coeff * s^(x+y) */
  cationCoeff: number;
  anionCoeff: number;
  example: string;
}> = [
  { id: "AB", label: "AB (1:1)", cationCoeff: 1, anionCoeff: 1, example: "AgCl" },
  { id: "AB2", label: "AB₂ (1:2)", cationCoeff: 1, anionCoeff: 2, example: "PbCl₂" },
  { id: "A2B", label: "A₂B (2:1)", cationCoeff: 2, anionCoeff: 1, example: "Ag₂CrO₄" },
  { id: "AB3", label: "AB₃ (1:3)", cationCoeff: 1, anionCoeff: 3, example: "Fe(OH)₃" },
  { id: "A3B", label: "A₃B (3:1)", cationCoeff: 3, anionCoeff: 1, example: "Ag₃PO₄" },
  { id: "A2B3", label: "A₂B₃ (2:3)", cationCoeff: 2, anionCoeff: 3, example: "Bi₂S₃" },
];

function saltParams(type: SaltType) {
  const row = SALT_TYPES.find((s) => s.id === type);
  if (!row) throw new KspError("Unknown salt type.");
  return row;
}

/** Ksp = (x^x)(y^y) s^(x+y) */
export function kspFromSolubility(type: SaltType, s: number): number {
  if (!(s >= 0) || !Number.isFinite(s)) {
    throw new KspError("Solubility s must be a non-negative number (mol/L).");
  }
  const { cationCoeff: x, anionCoeff: y } = saltParams(type);
  return x ** x * y ** y * s ** (x + y);
}

export function solubilityFromKsp(type: SaltType, ksp: number): number {
  if (!(ksp > 0) || !Number.isFinite(ksp)) {
    throw new KspError("Ksp must be a positive number.");
  }
  const { cationCoeff: x, anionCoeff: y } = saltParams(type);
  const power = x + y;
  const prefactor = x ** x * y ** y;
  return (ksp / prefactor) ** (1 / power);
}

export interface IonProductInput {
  type: SaltType;
  /** Actual ion concentrations (mol/L) */
  cation: number;
  anion: number;
  ksp: number;
}

export interface IonProductResult {
  Q: number;
  Ksp: number;
  comparison: "precipitate" | "unsaturated" | "equilibrium";
  label: string;
  expression: string;
}

export function ionProduct(input: IonProductInput): IonProductResult {
  const { type, cation, anion, ksp } = input;
  if (!(cation >= 0) || !(anion >= 0) || !Number.isFinite(cation) || !Number.isFinite(anion)) {
    throw new KspError("Ion concentrations must be non-negative numbers.");
  }
  if (!(ksp > 0) || !Number.isFinite(ksp)) {
    throw new KspError("Ksp must be a positive number.");
  }

  const { cationCoeff: x, anionCoeff: y } = saltParams(type);
  const Q = cation ** x * anion ** y;

  let comparison: IonProductResult["comparison"];
  let label: string;
  const rel = (Q - ksp) / ksp;
  if (Math.abs(rel) < 1e-4) {
    comparison = "equilibrium";
    label = "Q ≈ Ksp — saturated (at equilibrium).";
  } else if (Q > ksp) {
    comparison = "precipitate";
    label = "Q > Ksp — precipitation is expected.";
  } else {
    comparison = "unsaturated";
    label = "Q < Ksp — unsaturated; no precipitation expected.";
  }

  return {
    Q,
    Ksp: ksp,
    comparison,
    label,
    expression: `Q = [cation]^${x}[anion]^${y}`,
  };
}

export const KSP_PRESETS = [
  {
    id: "agcl",
    name: "AgCl (AB), Ksp = 1.8×10⁻¹⁰",
    type: "AB" as const,
    ksp: 1.8e-10,
  },
  {
    id: "pbcl2",
    name: "PbCl₂ (AB₂), Ksp = 1.7×10⁻⁵",
    type: "AB2" as const,
    ksp: 1.7e-5,
  },
  {
    id: "ag2cro4",
    name: "Ag₂CrO₄ (A₂B), Ksp = 1.2×10⁻¹²",
    type: "A2B" as const,
    ksp: 1.2e-12,
  },
];
