/** Atomic masses (IUPAC conventional / most common isotope averages). */
export const ATOMIC_MASSES: Record<string, number> = {
  H: 1.00794,
  He: 4.002602,
  Li: 6.941,
  Be: 9.012182,
  B: 10.811,
  C: 12.0107,
  N: 14.0067,
  O: 15.9994,
  F: 18.9984032,
  Ne: 20.1797,
  Na: 22.98976928,
  Mg: 24.305,
  Al: 26.9815386,
  Si: 28.0855,
  P: 30.973762,
  S: 32.065,
  Cl: 35.453,
  Ar: 39.948,
  K: 39.0983,
  Ca: 40.078,
  Sc: 44.955912,
  Ti: 47.867,
  V: 50.9415,
  Cr: 51.9961,
  Mn: 54.938045,
  Fe: 55.845,
  Co: 58.933195,
  Ni: 58.6934,
  Cu: 63.546,
  Zn: 65.38,
  Ga: 69.723,
  Ge: 72.64,
  As: 74.9216,
  Se: 78.96,
  Br: 79.904,
  Kr: 83.798,
  Rb: 85.4678,
  Sr: 87.62,
  Y: 88.90585,
  Zr: 91.224,
  Nb: 92.90638,
  Mo: 95.96,
  Tc: 98,
  Ru: 101.07,
  Rh: 102.9055,
  Pd: 106.42,
  Ag: 107.8682,
  Cd: 112.411,
  In: 114.818,
  Sn: 118.71,
  Sb: 121.76,
  Te: 127.6,
  I: 126.90447,
  Xe: 131.293,
  Cs: 132.9054519,
  Ba: 137.327,
  La: 138.90547,
  Ce: 140.116,
  Pr: 140.90765,
  Nd: 144.242,
  Pm: 145,
  Sm: 150.36,
  Eu: 151.964,
  Gd: 157.25,
  Tb: 158.92535,
  Dy: 162.5,
  Ho: 164.93032,
  Er: 167.259,
  Tm: 168.93421,
  Yb: 173.054,
  Lu: 174.9668,
  Hf: 178.49,
  Ta: 180.94788,
  W: 183.84,
  Re: 186.207,
  Os: 190.23,
  Ir: 192.217,
  Pt: 195.084,
  Au: 196.966569,
  Hg: 200.59,
  Tl: 204.3833,
  Pb: 207.2,
  Bi: 208.9804,
  Po: 209,
  At: 210,
  Rn: 222,
  Fr: 223,
  Ra: 226,
  Ac: 227,
  Th: 232.03806,
  Pa: 231.03588,
  U: 238.02891,
};

export const AVOGADRO = 6.02214076e23;

export interface ElementCount {
  element: string;
  count: number;
  atomicMass: number;
  totalMass: number;
  percent: number;
}

export interface FormulaResult {
  formula: string;
  molarMass: number;
  composition: ElementCount[];
}

export class FormulaParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormulaParseError";
  }
}

function tokenize(formula: string): string[] {
  const tokens: string[] = [];
  const re = /([A-Z][a-z]?|\d+|[()[\]{}·•.])/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = re.exec(formula)) !== null) {
    if (match.index !== lastIndex) {
      throw new FormulaParseError(
        `Unexpected character "${formula[lastIndex]}" in formula.`,
      );
    }
    tokens.push(match[0]);
    lastIndex = re.lastIndex;
  }

  if (lastIndex !== formula.length) {
    throw new FormulaParseError(
      `Unexpected character "${formula[lastIndex]}" in formula.`,
    );
  }

  return tokens;
}

function parseGroup(
  tokens: string[],
  index: { value: number },
  stop?: string,
): Map<string, number> {
  const counts = new Map<string, number>();

  const add = (map: Map<string, number>, multiplier = 1) => {
    for (const [el, n] of map) {
      counts.set(el, (counts.get(el) ?? 0) + n * multiplier);
    }
  };

  while (index.value < tokens.length) {
    const token = tokens[index.value];

    if (stop && token === stop) {
      index.value += 1;
      break;
    }

    if (token === "(" || token === "[" || token === "{") {
      const closer = token === "(" ? ")" : token === "[" ? "]" : "}";
      index.value += 1;
      const group = parseGroup(tokens, index, closer);
      const mult = readMultiplier(tokens, index);
      add(group, mult);
      continue;
    }

    if (token === "·" || token === "•" || token === ".") {
      index.value += 1;
      const hydrateMult = readMultiplier(tokens, index, 1);
      const hydrate = parseGroup(tokens, index, stop);
      add(hydrate, hydrateMult);
      break;
    }

    if (/^[A-Z][a-z]?$/.test(token)) {
      if (!(token in ATOMIC_MASSES)) {
        throw new FormulaParseError(`Unknown element symbol: ${token}`);
      }
      index.value += 1;
      const mult = readMultiplier(tokens, index);
      counts.set(token, (counts.get(token) ?? 0) + mult);
      continue;
    }

    throw new FormulaParseError(`Unexpected token "${token}" in formula.`);
  }

  return counts;
}

function readMultiplier(
  tokens: string[],
  index: { value: number },
  fallback = 1,
): number {
  if (index.value < tokens.length && /^\d+$/.test(tokens[index.value])) {
    const n = Number(tokens[index.value]);
    index.value += 1;
    if (!Number.isFinite(n) || n <= 0) {
      throw new FormulaParseError("Element or group multipliers must be positive.");
    }
    return n;
  }
  return fallback;
}

export function parseFormula(raw: string): FormulaResult {
  const formula = raw.replace(/\s+/g, "");
  if (!formula) {
    throw new FormulaParseError("Enter a chemical formula (e.g. H2SO4, Ca(OH)2).");
  }

  const tokens = tokenize(formula);
  const index = { value: 0 };
  const counts = parseGroup(tokens, index);

  if (index.value < tokens.length) {
    throw new FormulaParseError("Could not fully parse the chemical formula.");
  }

  if (counts.size === 0) {
    throw new FormulaParseError("No elements found in the formula.");
  }

  let molarMass = 0;
  const composition: ElementCount[] = [];

  for (const [element, count] of [...counts.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    const atomicMass = ATOMIC_MASSES[element];
    const totalMass = atomicMass * count;
    molarMass += totalMass;
    composition.push({ element, count, atomicMass, totalMass, percent: 0 });
  }

  for (const item of composition) {
    item.percent = (item.totalMass / molarMass) * 100;
  }

  return { formula, molarMass, composition };
}

export function massFromMoles(moles: number, molarMass: number): number {
  return moles * molarMass;
}

export function molesFromMass(mass: number, molarMass: number): number {
  if (molarMass === 0) return 0;
  return mass / molarMass;
}

export function particlesFromMoles(moles: number): number {
  return moles * AVOGADRO;
}

export function molesFromParticles(particles: number): number {
  return particles / AVOGADRO;
}

export function formatScientific(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e4 || abs < 1e-3) return value.toExponential(digits);
  return Number(value.toPrecision(digits + 2)).toString();
}
