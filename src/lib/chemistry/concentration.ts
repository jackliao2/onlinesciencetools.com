import { parseFormula, FormulaParseError } from "@/lib/chemistry/molar-mass";

export class ConcentrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConcentrationError";
  }
}

export type ConcentrationKind =
  | "molarity"
  | "millimolar"
  | "micromolar"
  | "gramsPerLiter"
  | "milligramsPerMl"
  | "massPercent"
  | "ppm"
  | "molality";

export interface ConcentrationInput {
  /** g/mol — supply directly or via formula */
  molarMass: number;
  /** Solution density in g/mL */
  density: number;
  kind: ConcentrationKind;
  value: number;
}

export interface ConcentrationResult {
  molarMass: number;
  density: number;
  molarity: number;
  millimolar: number;
  micromolar: number;
  gramsPerLiter: number;
  massPercent: number;
  ppm: number;
  molality: number;
  molesPerLiterSolution: number;
  gramsSolutePerLiter: number;
  kgSolventPerLiter: number;
}

export function resolveMolarMass(formulaOrBlank: string, manual?: number): number {
  const trimmed = formulaOrBlank.trim();
  if (trimmed) {
    try {
      return parseFormula(trimmed).molarMass;
    } catch (error) {
      if (error instanceof FormulaParseError) throw new ConcentrationError(error.message);
      throw error;
    }
  }
  if (manual !== undefined && Number.isFinite(manual) && manual > 0) {
    return manual;
  }
  throw new ConcentrationError("Enter a formula or a positive molar mass (g/mol).");
}

/**
 * Convert among common concentration units for a liquid solution.
 * Basis: 1.000 L of solution.
 */
export function convertConcentration(input: ConcentrationInput): ConcentrationResult {
  const { molarMass, density, kind, value } = input;

  if (!(molarMass > 0) || !Number.isFinite(molarMass)) {
    throw new ConcentrationError("Molar mass must be a positive number.");
  }
  if (!(density > 0) || !Number.isFinite(density)) {
    throw new ConcentrationError("Density must be a positive number (g/mL).");
  }
  if (!(value >= 0) || !Number.isFinite(value)) {
    throw new ConcentrationError("Concentration value must be non-negative.");
  }

  const massSolutionPerL = density * 1000; // g / L solution
  let molarity = 0;

  switch (kind) {
    case "molarity":
      molarity = value;
      break;
    case "millimolar":
      molarity = value / 1000;
      break;
    case "micromolar":
      molarity = value / 1e6;
      break;
    case "gramsPerLiter":
    case "milligramsPerMl":
      // 1 mg/mL = 1 g/L
      molarity = value / molarMass;
      break;
    case "massPercent": {
      if (value >= 100) {
        throw new ConcentrationError(
          "Mass percent must be below 100% so the solution contains solvent.",
        );
      }
      const gramsSolute = (value / 100) * massSolutionPerL;
      molarity = gramsSolute / molarMass;
      break;
    }
    case "ppm": {
      // mass ppm ≈ mg solute / kg solution; for dilute aqueous ≈ mg/L
      const gramsSolute = (value / 1e6) * massSolutionPerL;
      molarity = gramsSolute / molarMass;
      break;
    }
    case "molality": {
      // m = mol / kg solvent; for 1 L solution:
      // moles = m * kg_solvent; mass_solute = moles * MM
      // mass_solution = mass_solute + mass_solvent = density*1000
      // kg_solvent + (m*kg_solvent*MM)/1000 = density  (masses in kg... use grams)
      // Let w = kg solvent. moles = m*w. g_solute = m*w*MM
      // g_solution = g_solute + 1000*w = density*1000
      // m*w*MM + 1000*w = density*1000
      // w*(m*MM + 1000) = density*1000
      const denom = value * molarMass + 1000;
      if (!(denom > 0)) {
        throw new ConcentrationError("Invalid molality / molar mass combination.");
      }
      const kgSolvent = (density * 1000) / denom;
      molarity = value * kgSolvent;
      break;
    }
    default:
      throw new ConcentrationError("Unsupported concentration unit.");
  }

  if (!(molarity >= 0) || !Number.isFinite(molarity)) {
    throw new ConcentrationError("Could not compute molarity from the given inputs.");
  }

  const gramsPerLiter = molarity * molarMass;
  if (gramsPerLiter >= massSolutionPerL * (1 - 1e-12)) {
    throw new ConcentrationError(
      "Solute mass must be less than solution mass so the solution contains solvent.",
    );
  }

  const kgSolventPerLiter = (massSolutionPerL - gramsPerLiter) / 1000;
  const massPercent = (gramsPerLiter / massSolutionPerL) * 100;
  const ppm = (gramsPerLiter / massSolutionPerL) * 1e6;
  const molality = molarity / kgSolventPerLiter;

  return {
    molarMass,
    density,
    molarity,
    millimolar: molarity * 1000,
    micromolar: molarity * 1e6,
    gramsPerLiter,
    massPercent,
    ppm,
    molality,
    molesPerLiterSolution: molarity,
    gramsSolutePerLiter: gramsPerLiter,
    kgSolventPerLiter,
  };
}
