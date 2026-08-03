export class NernstError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NernstError";
  }
}

/** Faraday constant C/mol */
export const F = 96485.3321;
/** Gas constant J/(mol·K) */
export const R = 8.314462618;

export interface NernstInput {
  E0: number;
  n: number;
  /** Reaction quotient Q (dimensionless as written) */
  Q: number;
  /** Temperature in °C (default 25) */
  temperatureC?: number;
  /** Use classroom 0.0591/n log10 form at 25 °C */
  useClassroomForm?: boolean;
}

export interface NernstResult {
  E: number;
  E0: number;
  n: number;
  Q: number;
  T: number;
  expression: string;
  logTerm: number;
  notes: string[];
}

export function calculateNernst(input: NernstInput): NernstResult {
  const { E0, n, Q } = input;
  const temperatureC = input.temperatureC ?? 25;
  const useClassroom = input.useClassroomForm ?? temperatureC === 25;

  if (!Number.isFinite(E0)) throw new NernstError("E° must be a valid number.");
  if (!Number.isInteger(n) || !(n > 0)) {
    throw new NernstError("n (electrons transferred) must be a positive integer.");
  }
  if (!Number.isFinite(Q) || !(Q > 0)) {
    throw new NernstError("Q must be a positive number.");
  }
  if (!Number.isFinite(temperatureC)) {
    throw new NernstError("Temperature must be a valid number (°C).");
  }

  const T = temperatureC + 273.15;
  if (!(T > 0)) throw new NernstError("Temperature must be above −273.15 °C.");

  const notes: string[] = [];
  let E: number;
  let expression: string;
  let logTerm: number;

  if (useClassroom && Math.abs(temperatureC - 25) < 0.5) {
    logTerm = Math.log10(Q);
    E = E0 - (0.05916 / n) * logTerm;
    expression = "E = E° − (0.05916/n) log₁₀ Q   (25 °C)";
    notes.push("Classroom form at 25 °C using 2.303RT/F ≈ 0.05916 V.");
  } else {
    logTerm = Math.log(Q);
    E = E0 - ((R * T) / (n * F)) * logTerm;
    expression = "E = E° − (RT/nF) ln Q";
    notes.push("Full Nernst equation with R = 8.314 J/(mol·K), F = 96485 C/mol.");
  }

  if (Q < 1) notes.push("Q < 1 → log term negative → E > E° (products favored less than standards).");
  if (Q > 1) notes.push("Q > 1 → E < E° compared with standard conditions.");

  return { E, E0, n, Q, T, expression, logTerm, notes };
}

/** ΔG = −nFE (J/mol if E in V) */
export function deltaGFromE(n: number, E: number): number {
  if (!Number.isInteger(n) || !(n > 0)) {
    throw new NernstError("n must be a positive integer.");
  }
  if (!Number.isFinite(E)) throw new NernstError("E must be a valid number.");
  return -n * F * E;
}

export const NERNST_PRESETS = [
  {
    id: "zn-cu",
    name: "Zn–Cu cell, Q = 1 (standard)",
    E0: 1.1,
    n: 2,
    Q: 1,
  },
  {
    id: "zn-cu-q",
    name: "Zn–Cu, Q = 0.010",
    E0: 1.1,
    n: 2,
    Q: 0.01,
  },
  {
    id: "daniell-nonstd",
    name: "Daniell cell, E° = 1.10 V, Q = 10",
    E0: 1.1,
    n: 2,
    Q: 10,
  },
];
