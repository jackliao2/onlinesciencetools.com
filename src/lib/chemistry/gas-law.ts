export class GasLawError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GasLawError";
  }
}

/** R in L·atm/(mol·K) — default classroom constant. */
export const R_LATM = 0.082057;
/** R in J/(mol·K) = L·kPa/(mol·K) approximately with P in kPa, V in L. */
export const R_KPA = 8.314462618;

export type GasField = "P" | "V" | "n" | "T";

export type PressureUnit = "atm" | "kPa" | "mmHg";
export type VolumeUnit = "L" | "mL";
export type TempUnit = "K" | "C";

export interface GasLawInput {
  P: number | null;
  V: number | null;
  n: number | null;
  T: number | null;
  pressureUnit: PressureUnit;
  volumeUnit: VolumeUnit;
  tempUnit: TempUnit;
}

export interface GasLawResult {
  P: number;
  V: number;
  n: number;
  T: number;
  solved: GasField;
  R: number;
  expression: string;
  /** Display values in the user's chosen units */
  display: { P: number; V: number; T: number };
}

function toKelvin(value: number, unit: TempUnit): number {
  return unit === "C" ? value + 273.15 : value;
}

function fromKelvin(kelvin: number, unit: TempUnit): number {
  return unit === "C" ? kelvin - 273.15 : kelvin;
}

function toLiters(value: number, unit: VolumeUnit): number {
  return unit === "mL" ? value / 1000 : value;
}

function fromLiters(liters: number, unit: VolumeUnit): number {
  return unit === "mL" ? liters * 1000 : liters;
}

function toAtm(value: number, unit: PressureUnit): number {
  if (unit === "atm") return value;
  if (unit === "kPa") return value / 101.325;
  return value / 760; // mmHg
}

function fromAtm(atm: number, unit: PressureUnit): number {
  if (unit === "atm") return atm;
  if (unit === "kPa") return atm * 101.325;
  return atm * 760;
}

/**
 * Solve PV = nRT for exactly one missing field.
 * Internally uses P in atm, V in L, T in K, R = 0.082057.
 */
export function solveIdealGas(input: GasLawInput): GasLawResult {
  const fields: GasField[] = ["P", "V", "n", "T"];
  const raw = {
    P: input.P,
    V: input.V,
    n: input.n,
    T: input.T,
  };

  const missing = fields.filter((f) => raw[f] === null || raw[f] === undefined);
  if (missing.length !== 1) {
    throw new GasLawError("Leave exactly one of P, V, n, T blank to solve for it.");
  }

  for (const f of fields) {
    if (raw[f] === null || raw[f] === undefined) continue;
    if (!Number.isFinite(raw[f]!)) {
      throw new GasLawError(`${f} must be a valid number.`);
    }
    if (f !== "T" && !(raw[f]! > 0)) {
      throw new GasLawError(`${f} must be a positive number.`);
    }
  }

  const R = R_LATM;
  let P_atm = raw.P === null ? null : toAtm(raw.P, input.pressureUnit);
  let V_L = raw.V === null ? null : toLiters(raw.V, input.volumeUnit);
  let n = raw.n;
  let T_K = raw.T === null ? null : toKelvin(raw.T, input.tempUnit);

  if (T_K !== null && !(T_K > 0)) {
    throw new GasLawError("Temperature must be above 0 K.");
  }

  const solved = missing[0];

  switch (solved) {
    case "P":
      P_atm = (n! * R * T_K!) / V_L!;
      break;
    case "V":
      V_L = (n! * R * T_K!) / P_atm!;
      break;
    case "n":
      n = (P_atm! * V_L!) / (R * T_K!);
      break;
    case "T":
      T_K = (P_atm! * V_L!) / (n! * R);
      break;
  }

  if ([P_atm, V_L, n, T_K].some((v) => v === null || !Number.isFinite(v!) || !(v! > 0))) {
    throw new GasLawError("Could not compute a positive physical result.");
  }

  return {
    P: P_atm!,
    V: V_L!,
    n: n!,
    T: T_K!,
    solved,
    R,
    expression: "PV = nRT",
    display: {
      P: fromAtm(P_atm!, input.pressureUnit),
      V: fromLiters(V_L!, input.volumeUnit),
      T: fromKelvin(T_K!, input.tempUnit),
    },
  };
}

/** Molar mass from density: M = dRT/P (d in g/L, P atm, T K). */
export function molarMassFromDensity(
  density_g_per_L: number,
  P: number,
  T: number,
  pressureUnit: PressureUnit,
  tempUnit: TempUnit,
): number {
  if (!(density_g_per_L > 0) || !Number.isFinite(density_g_per_L)) {
    throw new GasLawError("Density must be a positive number (g/L).");
  }
  if (!(P > 0) || !(Number.isFinite(P))) {
    throw new GasLawError("Pressure must be positive.");
  }
  const T_K = toKelvin(T, tempUnit);
  if (!(T_K > 0)) throw new GasLawError("Temperature must be above 0 K.");
  const P_atm = toAtm(P, pressureUnit);
  return (density_g_per_L * R_LATM * T_K) / P_atm;
}
