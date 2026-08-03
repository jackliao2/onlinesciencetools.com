export class PhError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PhError";
  }
}

export type PhMode =
  | "strong-acid"
  | "strong-base"
  | "weak-acid"
  | "weak-base"
  | "buffer";

export interface PhInput {
  mode: PhMode;
  /** Analytical concentration of acid/base (M), or HA for buffer */
  concentration: number;
  /** Ka for weak acid / buffer; Kb for weak base */
  constant?: number;
  /** Conjugate concentration for buffer (A⁻), M */
  conjugate?: number;
  /** Temperature Kw approximation at 25 °C */
  kw?: number;
}

export interface PhResult {
  mode: PhMode;
  pH: number;
  pOH: number;
  hPlus: number;
  ohMinus: number;
  notes: string[];
  expression: string;
}

const KW_25C = 1.0e-14;

function validatePositive(value: number, label: string): void {
  if (!(value > 0) || !Number.isFinite(value)) {
    throw new PhError(`${label} must be a positive number.`);
  }
}

function solveWaterAwareIonConcentration(
  concentration: number,
  constant: number,
  kw: number,
): number {
  // For a weak acid, h - CKa/(Ka + h) - Kw/h = 0. The same equation
  // applies to [OH−] for a weak base with Kb. It is strictly increasing for
  // positive h, so bisection gives the physical root without an approximation.
  const residual = (ion: number) =>
    ion - (concentration * constant) / (constant + ion) - kw / ion;
  let low = Number.MIN_VALUE;
  let high = Math.max(1, concentration + constant + Math.sqrt(kw));

  while (residual(high) <= 0) high *= 2;
  for (let i = 0; i < 200; i += 1) {
    const mid = (low + high) / 2;
    if (residual(mid) > 0) high = mid;
    else low = mid;
  }
  return (low + high) / 2;
}

/** Strong monoprotic acid with water autoionization when dilute. */
function strongAcid(c: number, kw: number): Omit<PhResult, "mode" | "expression"> {
  validatePositive(c, "Concentration");
  // Charge balance: [H+] = c + [OH-] = c + kw/[H+] → [H+]^2 − c[H+] − kw = 0
  const h = (c + Math.sqrt(c * c + 4 * kw)) / 2;
  const oh = kw / h;
  const notes: string[] = [];
  if (c < 1e-5) {
    notes.push(
      "Concentration is very low — water’s autoionization is included so pH does not exceed ~7.",
    );
  } else {
    notes.push("For a strong monoprotic acid at typical lab concentrations, pH ≈ −log₁₀(C).");
  }
  return {
    pH: -Math.log10(h),
    pOH: -Math.log10(oh),
    hPlus: h,
    ohMinus: oh,
    notes,
  };
}

function strongBase(c: number, kw: number): Omit<PhResult, "mode" | "expression"> {
  validatePositive(c, "Concentration");
  const oh = (c + Math.sqrt(c * c + 4 * kw)) / 2;
  const h = kw / oh;
  const notes: string[] = [];
  if (c < 1e-5) {
    notes.push(
      "Concentration is very low — water’s autoionization is included so pH does not fall below ~7.",
    );
  } else {
    notes.push("For a strong monoprotic base, pOH ≈ −log₁₀(C) and pH = 14 − pOH (25 °C).");
  }
  return {
    pH: -Math.log10(h),
    pOH: -Math.log10(oh),
    hPlus: h,
    ohMinus: oh,
    notes,
  };
}

/** Weak monoprotic acid with water autoionization. */
function weakAcid(
  c: number,
  ka: number,
  kw: number,
): Omit<PhResult, "mode" | "expression"> {
  validatePositive(c, "Concentration");
  validatePositive(ka, "Ka");
  if (ka >= 1) {
    throw new PhError("Ka ≥ 1 looks like a strong acid — use Strong acid mode.");
  }

  const h = solveWaterAwareIonConcentration(c, ka, kw);
  const notes = [
    "Solved with acid mass balance, charge balance, and water autoionization.",
  ];

  if (h < 10 * Math.sqrt(kw)) {
    notes.push(
      "Solution is near-neutral, so water autoionization materially affects the pH.",
    );
  }

  const oh = kw / h;

  return {
    pH: -Math.log10(h),
    pOH: -Math.log10(oh),
    hPlus: h,
    ohMinus: oh,
    notes,
  };
}

function weakBase(
  c: number,
  kb: number,
  kw: number,
): Omit<PhResult, "mode" | "expression"> {
  validatePositive(c, "Concentration");
  validatePositive(kb, "Kb");
  if (kb >= 1) {
    throw new PhError("Kb ≥ 1 looks like a strong base — use Strong base mode.");
  }

  const oh = solveWaterAwareIonConcentration(c, kb, kw);
  const notes = [
    "Solved with base mass balance, charge balance, and water autoionization.",
  ];

  if (oh < 10 * Math.sqrt(kw)) {
    notes.push(
      "Solution is near-neutral, so water autoionization materially affects the pH.",
    );
  }

  const h = kw / oh;
  return {
    pH: -Math.log10(h),
    pOH: -Math.log10(oh),
    hPlus: h,
    ohMinus: oh,
    notes,
  };
}

function buffer(
  ha: number,
  aMinus: number,
  ka: number,
  kw: number,
): Omit<PhResult, "mode" | "expression"> {
  validatePositive(ha, "[HA]");
  validatePositive(aMinus, "[A⁻]");
  validatePositive(ka, "Ka");

  // The formal concentrations represent HA and the conjugate-base salt before
  // dissociation. Charge balance is [H+] + C_A = [A−] + [OH−], while acid
  // mass balance gives [A−] = Ka(C_HA + C_A)/(Ka + [H+]). Solving their
  // combination avoids the Henderson–Hasselbalch approximation at extreme
  // ratios and near-neutral concentrations.
  const totalAcid = ha + aMinus;
  const residual = (h: number) =>
    h +
    aMinus -
    (ka * totalAcid) / (ka + h) -
    kw / h;
  let low = Number.MIN_VALUE;
  let high = Math.max(1, totalAcid + ka + Math.sqrt(kw));
  while (residual(high) <= 0) high *= 2;
  for (let i = 0; i < 200; i += 1) {
    const mid = (low + high) / 2;
    if (residual(mid) > 0) high = mid;
    else low = mid;
  }
  const h = (low + high) / 2;
  const oh = kw / h;

  return {
    pH: -Math.log10(h),
    pOH: -Math.log10(oh),
    hPlus: h,
    ohMinus: oh,
    notes: [
      "Solved from monoprotic-acid mass balance, charge balance, and water autoionization.",
      "Uses concentrations as activities; activity coefficients are not included.",
    ],
  };
}

export function calculatePh(input: PhInput): PhResult {
  const kw = input.kw ?? KW_25C;
  validatePositive(kw, "Kw");

  switch (input.mode) {
    case "strong-acid": {
      const core = strongAcid(input.concentration, kw);
      return {
        mode: input.mode,
        expression: "Strong acid: charge balance [H⁺]² − C[H⁺] − Kw = 0",
        ...core,
      };
    }
    case "strong-base": {
      const core = strongBase(input.concentration, kw);
      return {
        mode: input.mode,
        expression: "Strong base: charge balance [OH⁻]² − C[OH⁻] − Kw = 0",
        ...core,
      };
    }
    case "weak-acid": {
      if (input.constant === undefined) throw new PhError("Enter Ka for a weak acid.");
      const core = weakAcid(input.concentration, input.constant, kw);
      return {
        mode: input.mode,
        expression: "Ka = x² / (C − x)",
        ...core,
      };
    }
    case "weak-base": {
      if (input.constant === undefined) throw new PhError("Enter Kb for a weak base.");
      const core = weakBase(input.concentration, input.constant, kw);
      return {
        mode: input.mode,
        expression: "Kb = x² / (C − x)",
        ...core,
      };
    }
    case "buffer": {
      if (input.constant === undefined) throw new PhError("Enter Ka for the buffer acid.");
      if (input.conjugate === undefined) {
        throw new PhError("Enter the conjugate base concentration [A⁻].");
      }
      const core = buffer(
        input.concentration,
        input.conjugate,
        input.constant,
        kw,
      );
      return {
        mode: input.mode,
        expression: "Ka = [H⁺][A⁻]/[HA] with mass and charge balance",
        ...core,
      };
    }
    default:
      throw new PhError("Unknown pH calculation mode.");
  }
}

export const PH_PRESETS = [
  {
    id: "hcl",
    name: "0.010 M HCl (strong acid)",
    mode: "strong-acid" as const,
    concentration: 0.01,
  },
  {
    id: "naoh",
    name: "0.010 M NaOH (strong base)",
    mode: "strong-base" as const,
    concentration: 0.01,
  },
  {
    id: "acetic",
    name: "0.10 M acetic acid (Ka = 1.8×10⁻⁵)",
    mode: "weak-acid" as const,
    concentration: 0.1,
    constant: 1.8e-5,
  },
  {
    id: "ammonia",
    name: "0.10 M ammonia (Kb = 1.8×10⁻⁵)",
    mode: "weak-base" as const,
    concentration: 0.1,
    constant: 1.8e-5,
  },
  {
    id: "acetate-buffer",
    name: "Acetate buffer 0.10 M HA / 0.10 M A⁻",
    mode: "buffer" as const,
    concentration: 0.1,
    conjugate: 0.1,
    constant: 1.8e-5,
  },
];
