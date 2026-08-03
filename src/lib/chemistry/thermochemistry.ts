export class ThermoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ThermoError";
  }
}

/** Calorimetry: q = m c ΔT (same units throughout). */
export function calorimetryHeat(
  mass: number,
  specificHeat: number,
  deltaT: number,
): number {
  if (!Number.isFinite(mass) || !(mass > 0)) {
    throw new ThermoError("Mass must be a positive number.");
  }
  if (!Number.isFinite(specificHeat) || !(specificHeat > 0)) {
    throw new ThermoError("Specific heat must be a positive number.");
  }
  if (!Number.isFinite(deltaT)) {
    throw new ThermoError("ΔT must be a valid number.");
  }
  return mass * specificHeat * deltaT;
}

/**
 * Hess's law: ΔH_rxn = Σ (coeff × ΔH) for listed steps.
 * Sign of each step's ΔH should match the direction as written.
 */
export function hessSum(
  steps: Array<{ coefficient: number; deltaH: number }>,
): number {
  if (steps.length === 0) {
    throw new ThermoError("Add at least one thermochemical step.");
  }
  let sum = 0;
  for (const step of steps) {
    if (!Number.isFinite(step.coefficient) || !Number.isFinite(step.deltaH)) {
      throw new ThermoError("Each step needs a valid coefficient and ΔH.");
    }
    sum += step.coefficient * step.deltaH;
  }
  return sum;
}

/**
 * Standard enthalpy of reaction from formation enthalpies:
 * ΔH° = Σ n ΔHf°(products) − Σ n ΔHf°(reactants)
 */
export function enthalpyFromFormation(
  species: Array<{ role: "reactant" | "product"; moles: number; deltaHf: number }>,
): number {
  if (species.length === 0) {
    throw new ThermoError("Add at least one reactant or product.");
  }
  let products = 0;
  let reactants = 0;
  let hasP = false;
  let hasR = false;
  for (const s of species) {
    if (!Number.isFinite(s.moles) || !(s.moles > 0) || !Number.isFinite(s.deltaHf)) {
      throw new ThermoError("Each species needs positive moles and a ΔHf° value.");
    }
    if (s.role === "product") {
      products += s.moles * s.deltaHf;
      hasP = true;
    } else {
      reactants += s.moles * s.deltaHf;
      hasR = true;
    }
  }
  if (!hasP || !hasR) {
    throw new ThermoError("Include at least one reactant and one product.");
  }
  return products - reactants;
}

/** Reaction heat for n moles when ΔH is per mole of reaction as written. */
export function heatFromEnthalpy(molesReaction: number, deltaH: number): number {
  if (!Number.isFinite(molesReaction) || !(molesReaction >= 0)) {
    throw new ThermoError("Moles of reaction must be a non-negative number.");
  }
  if (!Number.isFinite(deltaH)) {
    throw new ThermoError("ΔH must be a valid number.");
  }
  return molesReaction * deltaH;
}
