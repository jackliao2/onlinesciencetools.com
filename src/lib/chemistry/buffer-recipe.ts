import { parseFormula, FormulaParseError } from "@/lib/chemistry/molar-mass";

export class BufferRecipeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BufferRecipeError";
  }
}

export interface BufferSystem {
  id: string;
  name: string;
  /** Short label for chips */
  label: string;
  pKa: number;
  /** Weak acid formula (HA) */
  acidFormula: string;
  /** Conjugate base formula (A⁻), often the salt anion part */
  baseFormula: string;
  /** Typical useful pH window */
  pHMin: number;
  pHMax: number;
  notes: string;
}

export const BUFFER_SYSTEMS: BufferSystem[] = [
  {
    id: "acetate",
    name: "Acetate (CH₃COOH / CH₃COO⁻)",
    label: "Acetate",
    pKa: 4.76,
    acidFormula: "CH3COOH",
    baseFormula: "NaCH3COO",
    pHMin: 3.8,
    pHMax: 5.8,
    notes: "Use acetic acid + sodium acetate. pKa ≈ 4.76 (25 °C).",
  },
  {
    id: "phosphate",
    name: "Phosphate (H₂PO₄⁻ / HPO₄²⁻)",
    label: "Phosphate",
    pKa: 7.2,
    acidFormula: "NaH2PO4",
    baseFormula: "Na2HPO4",
    pHMin: 6.2,
    pHMax: 8.2,
    notes:
      "Monobasic/dibasic sodium phosphates. pKa₂ ≈ 7.20. PBS is this same pair plus NaCl (and often KCl)—this calculator gives the phosphate recipe, not the saline.",
  },
  {
    id: "hepes",
    name: "HEPES (HEPES / HEPES⁻)",
    label: "HEPES",
    pKa: 7.48,
    acidFormula: "C8H18N2O4S",
    baseFormula: "NaC8H17N2O4S",
    pHMin: 6.8,
    pHMax: 8.2,
    notes:
      "Good’s buffer, pKa ≈ 7.48 at 25 °C. Recipe uses HEPES free acid + HEPES sodium salt. pKa is temperature-sensitive; verify with a meter.",
  },
  {
    id: "mes",
    name: "MES (MES / MES⁻)",
    label: "MES",
    pKa: 6.15,
    acidFormula: "C6H13NO4S",
    baseFormula: "NaC6H12NO4S",
    pHMin: 5.5,
    pHMax: 6.7,
    notes:
      "Good’s buffer, pKa ≈ 6.15 at 25 °C. Useful near pH 6. Recipe uses MES free acid + MES sodium salt.",
  },
  {
    id: "citrate",
    name: "Citrate (approx. pKa₂)",
    label: "Citrate",
    pKa: 4.76,
    acidFormula: "C6H8O7",
    baseFormula: "Na3C6H5O7",
    pHMin: 3.0,
    pHMax: 6.2,
    notes: "Simplified single-pKa recipe near citric acid pKa₂; real citrate buffers are polyprotic.",
  },
  {
    id: "tris",
    name: "Tris (TrisH⁺ / Tris)",
    label: "Tris",
    pKa: 8.07,
    acidFormula: "C4H12ClNO3", // Tris-HCl approx as acid form
    baseFormula: "C4H11NO3", // Tris base
    pHMin: 7.0,
    pHMax: 9.0,
    notes: "Approximate Tris buffer using pKa ≈ 8.07. Prefer lab protocols for critical work.",
  },
  {
    id: "borate",
    name: "Borate (H₃BO₃ / B(OH)₄⁻)",
    label: "Borate",
    pKa: 9.24,
    acidFormula: "H3BO3",
    baseFormula: "NaBO2",
    pHMin: 8.2,
    pHMax: 10.2,
    notes:
      "Boric acid / borate, pKa ≈ 9.24. Approximate single-pKa recipe (H₃BO₃ / NaBO₂). Lab protocols often use boric acid + NaOH or borax.",
  },
  {
    id: "ammonium",
    name: "Ammonia (NH₄⁺ / NH₃)",
    label: "Ammonia",
    pKa: 9.25,
    acidFormula: "NH4Cl",
    baseFormula: "NH3",
    pHMin: 8.2,
    pHMax: 10.2,
    notes: "Ammonium chloride + aqueous ammonia. pKa of NH₄⁺ ≈ 9.25.",
  },
  {
    id: "carbonate",
    name: "Bicarbonate (H₂CO₃* / HCO₃⁻)",
    label: "Bicarbonate",
    pKa: 6.35,
    acidFormula: "H2CO3",
    baseFormula: "NaHCO3",
    pHMin: 5.4,
    pHMax: 7.4,
    notes: "Carbonic acid / bicarbonate approximate pKa₁ ≈ 6.35.",
  },
];

export interface BufferRecipeInput {
  systemId: string;
  targetPh: number;
  /** Total analytical concentration C = [HA] + [A⁻] (M) */
  totalMolarity: number;
  /** Final volume (L) */
  volumeL: number;
  /** Optional override molar masses (g/mol) */
  acidMolarMass?: number;
  baseMolarMass?: number;
}

export interface BufferRecipeResult {
  system: BufferSystem;
  targetPh: number;
  ratioBaseOverAcid: number;
  acidMolarity: number;
  baseMolarity: number;
  acidMoles: number;
  baseMoles: number;
  acidMolarMass: number;
  baseMolarMass: number;
  acidMassG: number;
  baseMassG: number;
  hhCheckPh: number;
  expression: string;
  warnings: string[];
}

function resolveMass(formula: string, override?: number): number {
  if (override !== undefined && override > 0) return override;
  try {
    return parseFormula(formula).molarMass;
  } catch (error) {
    if (error instanceof FormulaParseError) {
      throw new BufferRecipeError(error.message);
    }
    throw error;
  }
}

/**
 * Henderson–Hasselbalch buffer recipe:
 * pH = pKa + log10([A-]/[HA]), C = [HA]+[A-].
 */
export function calculateBufferRecipe(
  input: BufferRecipeInput,
): BufferRecipeResult {
  const system = BUFFER_SYSTEMS.find((s) => s.id === input.systemId);
  if (!system) throw new BufferRecipeError("Unknown buffer system.");

  const { targetPh, totalMolarity, volumeL } = input;
  if (!(totalMolarity > 0) || !(volumeL > 0)) {
    throw new BufferRecipeError("Total concentration and volume must be positive.");
  }
  if (!Number.isFinite(targetPh)) {
    throw new BufferRecipeError("Enter a valid target pH.");
  }

  const warnings: string[] = [];
  if (targetPh < system.pHMin || targetPh > system.pHMax) {
    warnings.push(
      `Target pH ${targetPh} is outside the usual window ${system.pHMin}–${system.pHMax} for ${system.label}. Capacity will be poor.`,
    );
  }

  const ratio = 10 ** (targetPh - system.pKa); // [A-]/[HA]
  if (!(ratio > 0) || !Number.isFinite(ratio)) {
    throw new BufferRecipeError("Could not compute [A⁻]/[HA] from pH and pKa.");
  }

  const acidMolarity = totalMolarity / (1 + ratio);
  const baseMolarity = totalMolarity - acidMolarity;
  const acidMoles = acidMolarity * volumeL;
  const baseMoles = baseMolarity * volumeL;

  const acidMolarMass = resolveMass(system.acidFormula, input.acidMolarMass);
  const baseMolarMass = resolveMass(system.baseFormula, input.baseMolarMass);
  const acidMassG = acidMoles * acidMolarMass;
  const baseMassG = baseMoles * baseMolarMass;

  const hhCheckPh = system.pKa + Math.log10(baseMolarity / acidMolarity);

  return {
    system,
    targetPh,
    ratioBaseOverAcid: ratio,
    acidMolarity,
    baseMolarity,
    acidMoles,
    baseMoles,
    acidMolarMass,
    baseMolarMass,
    acidMassG,
    baseMassG,
    hhCheckPh,
    expression: "pH = pKa + log₁₀([A⁻]/[HA])",
    warnings,
  };
}
