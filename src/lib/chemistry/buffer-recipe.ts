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
    id: "k-phosphate",
    name: "Potassium phosphate (H₂PO₄⁻ / HPO₄²⁻)",
    label: "K-phosphate",
    pKa: 7.2,
    acidFormula: "KH2PO4",
    baseFormula: "K2HPO4",
    pHMin: 6.2,
    pHMax: 8.2,
    notes:
      "Same H₂PO₄⁻/HPO₄²⁻ pair as sodium phosphate (pKa₂ ≈ 7.20) with KH₂PO₄ / K₂HPO₄. PBS still needs extra NaCl from your protocol.",
  },
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
  {
    id: "carbonate-pka2",
    name: "Carbonate (HCO₃⁻ / CO₃²⁻)",
    label: "Carbonate",
    pKa: 10.33,
    acidFormula: "NaHCO3",
    baseFormula: "Na2CO3",
    pHMin: 9.3,
    pHMax: 11.3,
    notes:
      "Bicarbonate / carbonate, pKa₂ ≈ 10.33. Use this pair for carbonate–bicarbonate buffers near pH 10; the bicarbonate chip is pKa₁.",
  },
  {
    id: "histidine",
    name: "Histidine (HisH⁺ / His)",
    label: "Histidine",
    pKa: 6.04,
    acidFormula: "C6H10ClN3O2",
    baseFormula: "C6H9N3O2",
    pHMin: 5.0,
    pHMax: 7.0,
    notes:
      "Imidazole side-chain pKa ≈ 6.04. Recipe uses histidine hydrochloride / free histidine as a single-pKa teaching model.",
  },
  {
    id: "imidazole",
    name: "Imidazole (ImH⁺ / Im)",
    label: "Imidazole",
    pKa: 7.0,
    acidFormula: "C3H5ClN2",
    baseFormula: "C3H4N2",
    pHMin: 6.2,
    pHMax: 7.8,
    notes:
      "Imidazole pKa ≈ 7.00 at 25 °C. Recipe uses imidazole hydrochloride / imidazole free base.",
  },
];

/**
 * Classic McIlvaine citrate–phosphate mixing table (0.2 M Na₂HPO₄ + 0.1 M
 * citric acid) tabulated for a 20 mL mix, pH 2.2–8.0.
 * Source: McIlvaine (1921) as commonly reproduced in biochemical methods.
 */
export const MCILVAINE_TABLE_20ML: Array<{
  pH: number;
  phosphateMl: number;
  citrateMl: number;
}> = [
  { pH: 2.2, phosphateMl: 0.4, citrateMl: 19.6 },
  { pH: 2.4, phosphateMl: 1.24, citrateMl: 18.76 },
  { pH: 2.6, phosphateMl: 2.18, citrateMl: 17.82 },
  { pH: 2.8, phosphateMl: 3.17, citrateMl: 16.83 },
  { pH: 3.0, phosphateMl: 4.11, citrateMl: 15.89 },
  { pH: 3.2, phosphateMl: 4.94, citrateMl: 15.06 },
  { pH: 3.4, phosphateMl: 5.7, citrateMl: 14.3 },
  { pH: 3.6, phosphateMl: 6.44, citrateMl: 13.56 },
  { pH: 3.8, phosphateMl: 7.1, citrateMl: 12.9 },
  { pH: 4.0, phosphateMl: 7.71, citrateMl: 12.29 },
  { pH: 4.2, phosphateMl: 8.28, citrateMl: 11.72 },
  { pH: 4.4, phosphateMl: 8.82, citrateMl: 11.18 },
  { pH: 4.6, phosphateMl: 9.35, citrateMl: 10.65 },
  { pH: 4.8, phosphateMl: 9.86, citrateMl: 10.14 },
  { pH: 5.0, phosphateMl: 10.3, citrateMl: 9.7 },
  { pH: 5.2, phosphateMl: 10.72, citrateMl: 9.28 },
  { pH: 5.4, phosphateMl: 11.15, citrateMl: 8.85 },
  { pH: 5.6, phosphateMl: 11.6, citrateMl: 8.4 },
  { pH: 5.8, phosphateMl: 12.09, citrateMl: 7.91 },
  { pH: 6.0, phosphateMl: 12.63, citrateMl: 7.37 },
  { pH: 6.2, phosphateMl: 13.22, citrateMl: 6.78 },
  { pH: 6.4, phosphateMl: 13.85, citrateMl: 6.15 },
  { pH: 6.6, phosphateMl: 14.55, citrateMl: 5.45 },
  { pH: 6.8, phosphateMl: 15.45, citrateMl: 4.55 },
  { pH: 7.0, phosphateMl: 16.47, citrateMl: 3.53 },
  { pH: 7.2, phosphateMl: 17.39, citrateMl: 2.61 },
  { pH: 7.4, phosphateMl: 18.17, citrateMl: 1.83 },
  { pH: 7.6, phosphateMl: 18.73, citrateMl: 1.27 },
  { pH: 7.8, phosphateMl: 19.15, citrateMl: 0.85 },
  { pH: 8.0, phosphateMl: 19.45, citrateMl: 0.55 },
];

export interface McIlvaineResult {
  targetPh: number;
  volumeMl: number;
  phosphateMl: number;
  citrateMl: number;
  tabulated: boolean;
  expression: string;
  notes: string[];
}

export function calculateMcIlvaine(targetPh: number, volumeMl: number): McIlvaineResult {
  if (!Number.isFinite(targetPh)) {
    throw new BufferRecipeError("Enter a valid target pH.");
  }
  if (!(volumeMl > 0) || !Number.isFinite(volumeMl)) {
    throw new BufferRecipeError("Final volume must be a positive number (mL).");
  }
  const table = MCILVAINE_TABLE_20ML;
  const lo = table[0].pH;
  const hi = table[table.length - 1].pH;
  if (targetPh < lo || targetPh > hi) {
    throw new BufferRecipeError(
      `McIlvaine citrate–phosphate is tabulated for pH ${lo}–${hi}.`,
    );
  }

  let phosphate20 = table[0].phosphateMl;
  let citrate20 = table[0].citrateMl;
  let tabulated = false;
  for (let i = 0; i < table.length; i += 1) {
    const row = table[i];
    if (Math.abs(row.pH - targetPh) < 1e-9) {
      phosphate20 = row.phosphateMl;
      citrate20 = row.citrateMl;
      tabulated = true;
      break;
    }
    const next = table[i + 1];
    if (next && targetPh > row.pH && targetPh < next.pH) {
      const t = (targetPh - row.pH) / (next.pH - row.pH);
      phosphate20 = row.phosphateMl + t * (next.phosphateMl - row.phosphateMl);
      citrate20 = row.citrateMl + t * (next.citrateMl - row.citrateMl);
      break;
    }
  }

  const scale = volumeMl / 20;
  return {
    targetPh,
    volumeMl,
    phosphateMl: phosphate20 * scale,
    citrateMl: citrate20 * scale,
    tabulated,
    expression: "McIlvaine mix: 0.2 M Na₂HPO₄ + 0.1 M citric acid (scaled from a 20 mL table)",
    notes: [
      tabulated
        ? "This pH is a published table point."
        : "Volumes are linearly interpolated between adjacent table points (0.2 pH steps).",
      "Make the two stocks first (0.2 M Na₂HPO₄ and 0.1 M citric acid), mix the volumes below, then verify pH with a meter.",
    ],
  };
}

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
