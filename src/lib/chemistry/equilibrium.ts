export type SpeciesRole = "reactant" | "product";

export interface SpeciesInput {
  id: string;
  label: string;
  coefficient: number;
  role: SpeciesRole;
  initial: number;
  /**
   * When false, the species is treated as a pure solid/liquid (activity ≈ 1)
   * and is omitted from Q and K.
   */
  includeInK?: boolean;
}

export interface EquilibriumResult {
  Q: number;
  K: number;
  direction: "forward" | "reverse" | "equilibrium";
  directionLabel: string;
  x: number;
  species: Array<{
    id: string;
    label: string;
    coefficient: number;
    role: SpeciesRole;
    initial: number;
    change: number;
    equilibrium: number;
    includeInK: boolean;
  }>;
  expression: string;
  /** Present when Kp/Kc conversion was requested. */
  converted?: {
    from: "Kc" | "Kp";
    to: "Kc" | "Kp";
    value: number;
    deltaN: number;
    temperatureK: number;
  };
}

export class EquilibriumError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EquilibriumError";
  }
}

/** Gas constant for concentration–pressure conversion, L·atm/(mol·K). */
export const R_LATM = 0.082057;

function activeSpecies(species: SpeciesInput[]): SpeciesInput[] {
  return species.filter((s) => s.includeInK !== false);
}

function reactionQuotient(species: SpeciesInput[]): number {
  const active = activeSpecies(species);
  let num = 1;
  let den = 1;
  let hasProduct = false;
  let hasReactant = false;

  for (const s of active) {
    const c = Math.max(s.initial, 0);
    const term = c ** s.coefficient;
    if (s.role === "product") {
      num *= term;
      hasProduct = true;
    } else {
      den *= term;
      hasReactant = true;
    }
  }

  if (!hasProduct || !hasReactant) {
    throw new EquilibriumError(
      "Include at least one reactant and one product in the K expression (uncheck solids/liquids only).",
    );
  }

  if (den === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return num / den;
}

function equilibriumConcentrations(
  species: SpeciesInput[],
  x: number,
): number[] {
  return species.map((s) => {
    const signed = s.role === "product" ? s.coefficient * x : -s.coefficient * x;
    return s.initial + signed;
  });
}

function isFeasible(species: SpeciesInput[], x: number): boolean {
  return equilibriumConcentrations(species, x).every((c) => c >= -1e-10);
}

function maxForwardX(species: SpeciesInput[]): number {
  let maxX = Number.POSITIVE_INFINITY;
  for (const s of species) {
    if (s.role === "reactant" && s.coefficient > 0) {
      maxX = Math.min(maxX, s.initial / s.coefficient);
    }
  }
  return Number.isFinite(maxX) ? Math.max(maxX, 0) : 0;
}

function maxReverseX(species: SpeciesInput[]): number {
  let maxX = Number.POSITIVE_INFINITY;
  for (const s of species) {
    if (s.role === "product" && s.coefficient > 0) {
      maxX = Math.min(maxX, s.initial / s.coefficient);
    }
  }
  return Number.isFinite(maxX) ? Math.max(maxX, 0) : 0;
}

function evalQAtX(species: SpeciesInput[], x: number): number {
  const eqs = equilibriumConcentrations(species, x).map((c) => Math.max(c, 0));
  const withEq = species.map((s, i) => ({ ...s, initial: eqs[i] }));
  return reactionQuotient(withEq);
}

/** Solve Q(x) = K for extent x (positive = forward). */
function solveExtent(species: SpeciesInput[], K: number): number {
  const forwardMax = maxForwardX(species);
  const reverseMax = maxReverseX(species);

  const qAt = (x: number) => evalQAtX(species, x);
  const target = (x: number) => qAt(x) - K;

  let lo = -reverseMax;
  let hi = forwardMax;

  const eps = 1e-12;
  lo += eps;
  hi -= eps;
  if (hi <= lo) {
    throw new EquilibriumError(
      "No feasible extent of reaction — check initial concentrations and coefficients.",
    );
  }

  let flo = target(lo);
  let fhi = target(hi);

  if (!Number.isFinite(flo)) flo = Math.sign(flo || 1) * 1e100;
  if (!Number.isFinite(fhi)) fhi = Math.sign(fhi || 1) * 1e100;

  const q0 = reactionQuotient(species);
  if (Math.abs(q0 - K) / Math.max(K, 1) < 1e-8) return 0;

  if (flo * fhi > 0) {
    let bestX = 0;
    let bestErr = Math.abs(q0 - K);
    const samples = 200;
    for (let i = 0; i <= samples; i += 1) {
      const x = lo + ((hi - lo) * i) / samples;
      if (!isFeasible(species, x)) continue;
      const err = Math.abs(qAt(x) - K);
      if (err < bestErr) {
        bestErr = err;
        bestX = x;
      }
    }
    if (bestErr / Math.max(K, 1) < 1e-4) return bestX;
    throw new EquilibriumError(
      "Could not bracket a physical root for this K and ICE setup. Try different initials or K.",
    );
  }

  let a = lo;
  let b = hi;
  let fa = flo;
  let fb = fhi;
  let mid = 0;

  for (let i = 0; i < 80; i += 1) {
    mid = (a + b) / 2;
    const fm = target(mid);
    if (!Number.isFinite(fm) || Math.abs(fm) < 1e-10) return mid;
    if (fa * fm <= 0) {
      b = mid;
      fb = fm;
    } else {
      a = mid;
      fa = fm;
    }
    if (Math.abs(b - a) < 1e-12) break;
  }

  void fb;
  return mid;
}

export function buildExpression(
  species: SpeciesInput[],
  constantLabel: string,
): string {
  const active = activeSpecies(species);
  const products = active
    .filter((s) => s.role === "product")
    .map((s) =>
      s.coefficient === 1 ? `[${s.label}]` : `[${s.label}]^${s.coefficient}`,
    )
    .join(" · ");
  const reactants = active
    .filter((s) => s.role === "reactant")
    .map((s) =>
      s.coefficient === 1 ? `[${s.label}]` : `[${s.label}]^${s.coefficient}`,
    )
    .join(" · ");

  return `${constantLabel} = (${products || "1"}) / (${reactants || "1"})`;
}

/** Δn for Kp = Kc (RT)^Δn using only species included in K (gases). */
export function gasDeltaN(species: SpeciesInput[]): number {
  let delta = 0;
  for (const s of activeSpecies(species)) {
    delta += s.role === "product" ? s.coefficient : -s.coefficient;
  }
  return delta;
}

/**
 * Convert between Kc and Kp.
 * Convention: Kp = Kc (RT)^Δn with R = 0.082057 L·atm/(mol·K), T in kelvin.
 */
export function convertKcKp(
  value: number,
  from: "Kc" | "Kp",
  deltaN: number,
  temperatureK: number,
): number {
  if (!(value > 0) || !Number.isFinite(value)) {
    throw new EquilibriumError("K must be a positive number.");
  }
  if (!(temperatureK > 0) || !Number.isFinite(temperatureK)) {
    throw new EquilibriumError("Temperature must be above 0 K.");
  }
  if (!Number.isFinite(deltaN)) {
    throw new EquilibriumError("Δn must be a finite number.");
  }
  const factor = (R_LATM * temperatureK) ** deltaN;
  if (!(factor > 0) || !Number.isFinite(factor)) {
    throw new EquilibriumError("Could not compute (RT)^Δn for this temperature and Δn.");
  }
  return from === "Kc" ? value * factor : value / factor;
}

/** Compute K directly from equilibrium amounts (no ICE solve). */
export function computeKFromEquilibrium(
  species: SpeciesInput[],
  constantLabel: "Kc" | "Kp" = "Kc",
): { K: number; expression: string; Q: number } {
  for (const s of species) {
    if (!(s.coefficient > 0) || !Number.isInteger(s.coefficient)) {
      throw new EquilibriumError(
        `Coefficient for ${s.label || "a species"} must be a positive integer.`,
      );
    }
    if (!(s.initial >= 0) || !Number.isFinite(s.initial)) {
      throw new EquilibriumError(
        `Equilibrium amount for ${s.label || "a species"} must be non-negative.`,
      );
    }
    if (!s.label.trim()) {
      throw new EquilibriumError("Every species needs a label.");
    }
  }
  if (!species.some((s) => s.initial > 0 && s.includeInK !== false)) {
    throw new EquilibriumError(
      "Enter at least one non-zero equilibrium amount for a species included in K.",
    );
  }

  const K = reactionQuotient(species);
  if (!Number.isFinite(K) || !(K > 0)) {
    throw new EquilibriumError(
      "Could not compute a finite positive K from these equilibrium amounts (check zeros in the denominator).",
    );
  }
  return {
    K,
    Q: K,
    expression: buildExpression(species, constantLabel),
  };
}

export function solveEquilibrium(
  species: SpeciesInput[],
  K: number,
  constantLabel: "Kc" | "Kp" = "Kc",
): EquilibriumResult {
  if (!(K > 0) || !Number.isFinite(K)) {
    throw new EquilibriumError("Equilibrium constant K must be a positive number.");
  }

  for (const s of species) {
    if (!(s.coefficient > 0) || !Number.isInteger(s.coefficient)) {
      throw new EquilibriumError(
        `Coefficient for ${s.label || "a species"} must be a positive integer.`,
      );
    }
    if (!(s.initial >= 0) || !Number.isFinite(s.initial)) {
      throw new EquilibriumError(
        `Initial amount for ${s.label || "a species"} must be non-negative.`,
      );
    }
    if (!s.label.trim()) {
      throw new EquilibriumError("Every species needs a label.");
    }
  }
  if (!species.some((s) => s.initial > 0)) {
    throw new EquilibriumError(
      "At least one species must have a non-zero initial concentration or partial pressure.",
    );
  }

  const Q = reactionQuotient(species);
  let direction: EquilibriumResult["direction"];
  let directionLabel: string;

  if (!Number.isFinite(Q)) {
    direction = "reverse";
    directionLabel =
      "Q is infinite (a reactant is absent) — net reaction proceeds in reverse to form reactants.";
  } else if (Math.abs(Q - K) / Math.max(K, 1) < 1e-6) {
    direction = "equilibrium";
    directionLabel = "Q ≈ K — the system is already at equilibrium.";
  } else if (Q < K) {
    direction = "forward";
    directionLabel = "Q < K — net reaction proceeds forward (reactants → products).";
  } else {
    direction = "reverse";
    directionLabel = "Q > K — net reaction proceeds in reverse (products → reactants).";
  }

  const x = solveExtent(species, K);
  const eqs = equilibriumConcentrations(species, x);

  return {
    Q: Number.isFinite(Q) ? Q : Number.POSITIVE_INFINITY,
    K,
    direction,
    directionLabel,
    x,
    expression: buildExpression(species, constantLabel),
    species: species.map((s, i) => ({
      id: s.id,
      label: s.label,
      coefficient: s.coefficient,
      role: s.role,
      initial: s.initial,
      change: s.role === "product" ? s.coefficient * x : -s.coefficient * x,
      equilibrium: Math.max(eqs[i], 0),
      includeInK: s.includeInK !== false,
    })),
  };
}

export const EQUILIBRIUM_PRESETS = [
  {
    id: "haber",
    name: "Haber: N₂ + 3H₂ ⇌ 2NH₃",
    K: 0.06,
    constant: "Kc" as const,
    species: [
      { label: "N2", coefficient: 1, role: "reactant" as const, initial: 1 },
      { label: "H2", coefficient: 3, role: "reactant" as const, initial: 3 },
      { label: "NH3", coefficient: 2, role: "product" as const, initial: 0 },
    ],
  },
  {
    id: "ester",
    name: "Esterification: A + B ⇌ C + D",
    K: 4,
    constant: "Kc" as const,
    species: [
      { label: "A", coefficient: 1, role: "reactant" as const, initial: 1 },
      { label: "B", coefficient: 1, role: "reactant" as const, initial: 1 },
      { label: "C", coefficient: 1, role: "product" as const, initial: 0 },
      { label: "D", coefficient: 1, role: "product" as const, initial: 0 },
    ],
  },
  {
    id: "dissociation",
    name: "Dissociation: PCl₅ ⇌ PCl₃ + Cl₂",
    K: 0.021,
    constant: "Kc" as const,
    species: [
      { label: "PCl5", coefficient: 1, role: "reactant" as const, initial: 1 },
      { label: "PCl3", coefficient: 1, role: "product" as const, initial: 0 },
      { label: "Cl2", coefficient: 1, role: "product" as const, initial: 0 },
    ],
  },
];
