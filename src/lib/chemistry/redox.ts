import { parseFormula, FormulaParseError } from "@/lib/chemistry/molar-mass";

export type RedoxMedium = "acidic" | "basic";

export class RedoxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RedoxError";
  }
}

export interface RedoxSpecies {
  formula: string;
  display: string;
  charge: number;
  coefficient: number;
  side: "reactant" | "product";
  composition: Record<string, number>;
}

export interface RedoxResult {
  medium: RedoxMedium;
  reactants: RedoxSpecies[];
  products: RedoxSpecies[];
  equation: string;
  steps: string[];
  atomCheck: Array<{
    element: string;
    reactantAtoms: number;
    productAtoms: number;
  }>;
  chargeReactants: number;
  chargeProducts: number;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function toRational(value: number, maxDen = 1000): { n: number; d: number } {
  if (!Number.isFinite(value)) return { n: 0, d: 1 };
  const sign = value < 0 ? -1 : 1;
  let x = Math.abs(value);
  const a0 = Math.floor(x);
  if (Math.abs(x - a0) < 1e-12) return { n: sign * a0, d: 1 };

  let p0 = 1;
  let q0 = 0;
  let p1 = a0;
  let q1 = 1;
  let remaining = x - a0;
  for (let i = 0; i < 40 && remaining > 1e-14; i += 1) {
    x = 1 / remaining;
    const a = Math.floor(x + 1e-12);
    const p = a * p1 + p0;
    const q = a * q1 + q0;
    if (q > maxDen) break;
    p0 = p1;
    q0 = q1;
    p1 = p;
    q1 = q;
    remaining = x - a;
    if (Math.abs(sign * (p1 / q1) - value) < 1e-10) break;
  }
  return { n: sign * p1, d: q1 };
}

function toIntegerCoefficients(values: number[]): number[] {
  const rats = values.map((v) => toRational(v));
  let den = 1;
  for (const r of rats) den = (den * r.d) / gcd(den, r.d);
  let ints = rats.map((r) => Math.round((r.n * den) / r.d));
  let g = ints.reduce((a, b) => gcd(a, b), 0) || 1;
  ints = ints.map((n) => n / g);
  if (ints.some((n) => n < 0)) ints = ints.map((n) => -n);
  g = ints.reduce((a, b) => gcd(a, b), 0) || 1;
  return ints.map((n) => n / g);
}

/** Parse ions like MnO4-, Fe2+, SO4^2-, e-, H+. */
export function parseIonToken(raw: string): {
  formula: string;
  display: string;
  charge: number;
  composition: Record<string, number>;
} {
  let token = raw.trim().replace(/^\d+/, "").trim();
  if (!token) throw new RedoxError("Empty species in equation.");

  token = token
    .replace(/−/g, "-")
    .replace(/–/g, "-")
    .replace(/⁺/g, "+")
    .replace(/⁻/g, "-");

  if (/^e-?$/i.test(token) || token === "e^-") {
    return { formula: "e-", display: "e⁻", charge: -1, composition: {} };
  }

  type Cand = { formula: string; charge: number };
  const candidates: Cand[] = [];

  const add = (formula: string, charge: number) => {
    if (formula) candidates.push({ formula, charge });
  };

  if (/^(.*)\^\{(\d+)([+-])\}$/.test(token)) {
    const m = token.match(/^(.*)\^\{(\d+)([+-])\}$/)!;
    add(m[1], m[3] === "-" ? -Number(m[2]) : Number(m[2]));
  } else if (/^(.*)\^(\d+)([+-])$/.test(token)) {
    const m = token.match(/^(.*)\^(\d+)([+-])$/)!;
    add(m[1], m[3] === "-" ? -Number(m[2]) : Number(m[2]));
  } else if (/^(.*)\^([+-])(\d+)$/.test(token)) {
    const m = token.match(/^(.*)\^([+-])(\d+)$/)!;
    add(m[1], m[2] === "-" ? -Number(m[3]) : Number(m[3]));
  } else if (/^(.*)\^([+-])$/.test(token)) {
    const m = token.match(/^(.*)\^([+-])$/)!;
    add(m[1], m[2] === "-" ? -1 : 1);
  } else if (/^(.*)\((\d+)([+-])\)$/.test(token)) {
    const m = token.match(/^(.*)\((\d+)([+-])\)$/)!;
    add(m[1], m[3] === "-" ? -Number(m[2]) : Number(m[2]));
  } else {
    const mono = token.match(/^([A-Z][a-z]?)(\d+)([+-])$/);
    const mono1 = token.match(/^([A-Z][a-z]?)([+-])$/);
    if (mono) {
      add(mono[1], mono[3] === "-" ? -Number(mono[2]) : Number(mono[2]));
    } else if (mono1) {
      add(mono1[1], mono1[2] === "-" ? -1 : 1);
    } else {
      const single = token.match(/^(.*)([+-])$/);
      if (single) add(single[1], single[2] === "-" ? -1 : 1);
      else add(token, 0); // neutral molecule / formula (Zn, H2, MnO2)
    }
  }

  const scored: Array<
    Cand & { composition: Record<string, number>; atoms: number }
  > = [];

  for (const cand of candidates) {
    const { formula, charge } = cand;
    if (formula === "H" && charge === 1) {
      scored.push({
        formula: "H+",
        charge: 1,
        composition: { H: 1 },
        atoms: 1,
      });
      continue;
    }
    if (formula === "OH" && charge === -1) {
      scored.push({
        formula: "OH-",
        charge: -1,
        composition: { O: 1, H: 1 },
        atoms: 2,
      });
      continue;
    }
    if (formula === "H2O" || formula === "H₂O") {
      scored.push({
        formula: "H2O",
        charge: 0,
        composition: { H: 2, O: 1 },
        atoms: 3,
      });
      continue;
    }
    try {
      const parsed = parseFormula(formula);
      const composition: Record<string, number> = {};
      let atoms = 0;
      let maxSub = 1;
      for (const row of parsed.composition) {
        composition[row.element] = row.count;
        atoms += row.count;
        maxSub = Math.max(maxSub, row.count);
      }
      if (maxSub > 12) continue;
      scored.push({ formula, charge, composition, atoms });
    } catch {
      // invalid
    }
  }

  if (scored.length === 0) {
    throw new RedoxError(
      `Could not parse species "${raw}". Use Fe2+, MnO4-, or SO4^2-.`,
    );
  }

  scored.sort((a, b) => {
    if (b.atoms !== a.atoms) return b.atoms - a.atoms;
    return Math.abs(a.charge) - Math.abs(b.charge);
  });

  const best = scored[0];
  let display = best.formula;
  if (best.formula === "H+") display = "H⁺";
  else if (best.formula === "OH-") display = "OH⁻";
  else if (best.charge === 1) display = `${best.formula}⁺`;
  else if (best.charge === -1) display = `${best.formula}⁻`;
  else if (best.charge > 1) display = `${best.formula}^{${best.charge}+}`;
  else if (best.charge < -1)
    display = `${best.formula}^{${Math.abs(best.charge)}-}`;

  return {
    formula: best.formula,
    display,
    charge: best.charge,
    composition: best.composition,
  };
}

function splitSpeciesList(side: string): string[] {
  // Protect charge pluses so "Fe2+ + Cl-" does not split inside Fe2+.
  const protectedSide = side
    .replace(/\^\{(\d+)\+\}/g, "^{$1«P»}")
    .replace(/\^(\d+)\+/g, "^$1«P»")
    .replace(/\^\+/g, "^«P»")
    .replace(/(\d)\+/g, "$1«P»")
    .replace(/([A-Za-z)\]])\+(?=\s|$)/g, "$1«P»");

  return protectedSide
    .split("+")
    .map((s) => s.replace(/«P»/g, "+").trim())
    .filter(Boolean);
}

function splitEquation(raw: string): { left: string[]; right: string[] } {
  const normalized = raw
    .replace(/\s+/g, " ")
    .replace(/<=>|⇌|↔|→|⇒|=/g, "=")
    .trim();
  const parts = normalized.split("=");
  if (parts.length !== 2) {
    throw new RedoxError(
      'Enter a redox equation like "MnO4- + Fe2+ = Mn2+ + Fe3+" (acidic/basic auxiliaries added automatically).',
    );
  }
  const left = splitSpeciesList(parts[0]);
  const right = splitSpeciesList(parts[1]);
  if (!left.length || !right.length) {
    throw new RedoxError("Both sides need at least one species.");
  }
  return { left, right };
}

function formatSpecies(s: { coefficient: number; display: string }): string {
  return s.coefficient === 1 ? s.display : `${s.coefficient}${s.display}`;
}

/**
 * Balance a redox equation in acidic medium (adds H2O / H+ as needed),
 * optionally converting H+ → H2O/OH- for basic medium.
 */
export function balanceRedox(
  raw: string,
  medium: RedoxMedium = "acidic",
): RedoxResult {
  const { left, right } = splitEquation(raw);

  const userLeft = left.map(parseIonToken);
  const userRight = right.map(parseIonToken);

  // Reject if user already put electrons — we balance atoms+charge without e-.
  if ([...userLeft, ...userRight].some((s) => s.formula === "e-")) {
    throw new RedoxError(
      "Omit free electrons; this balancer uses atom and charge conservation with H₂O / H⁺ (or OH⁻).",
    );
  }

  // Columns: userLeft..., userRight..., H2O_L, H2O_R, H+_L, H+_R (all ≥ 0)
  const nUser = userLeft.length + userRight.length;
  const wL = nUser;
  const wR = nUser + 1;
  const hL = nUser + 2;
  const hR = nUser + 3;
  const n = nUser + 4;

  const elements = new Set<string>();
  for (const s of [...userLeft, ...userRight]) {
    for (const el of Object.keys(s.composition)) elements.add(el);
  }
  elements.add("H");
  elements.add("O");
  const elementList = [...elements];

  const rows: number[][] = [];
  for (const el of elementList) {
    const row = Array(n).fill(0);
    userLeft.forEach((s, i) => {
      row[i] = s.composition[el] ?? 0;
    });
    userRight.forEach((s, i) => {
      row[userLeft.length + i] = -(s.composition[el] ?? 0);
    });
    const waterAtoms = el === "H" ? 2 : el === "O" ? 1 : 0;
    const hAtoms = el === "H" ? 1 : 0;
    row[wL] = waterAtoms;
    row[wR] = -waterAtoms;
    row[hL] = hAtoms;
    row[hR] = -hAtoms;
    rows.push(row);
  }

  const chargeRow = Array(n).fill(0);
  userLeft.forEach((s, i) => {
    chargeRow[i] = s.charge;
  });
  userRight.forEach((s, i) => {
    chargeRow[userLeft.length + i] = -s.charge;
  });
  chargeRow[hL] = 1;
  chargeRow[hR] = -1;
  rows.push(chargeRow);

  const h = rows.length;
  const w = n;
  const mat = rows.map((r) => [...r]);
  const pivotOfRow = Array(h).fill(-1);
  const isPivotCol = Array(w).fill(false);
  let rank = 0;

  for (let col = 0; col < w && rank < h; col += 1) {
    let pivot = rank;
    for (let r = rank + 1; r < h; r += 1) {
      if (Math.abs(mat[r][col]) > Math.abs(mat[pivot][col])) pivot = r;
    }
    if (Math.abs(mat[pivot][col]) < 1e-12) continue;
    [mat[rank], mat[pivot]] = [mat[pivot], mat[rank]];
    const div = mat[rank][col];
    for (let c = col; c < w; c += 1) mat[rank][c] /= div;
    for (let r = 0; r < h; r += 1) {
      if (r === rank) continue;
      const factor = mat[r][col];
      if (Math.abs(factor) < 1e-14) continue;
      for (let c = col; c < w; c += 1) mat[r][c] -= factor * mat[rank][c];
    }
    pivotOfRow[rank] = col;
    isPivotCol[col] = true;
    rank += 1;
  }

  const freeCols = Array.from({ length: w }, (_, i) => i).filter(
    (c) => !isPivotCol[c],
  );
  if (freeCols.length === 0) {
    throw new RedoxError(
      "Could not find a balancing solution. Check formulas and charges.",
    );
  }

  function buildTrial(weights: number[]): number[] {
    const trial = Array(n).fill(0);
    freeCols.forEach((free, i) => {
      trial[free] = weights[i] ?? 0;
    });
    for (let r = 0; r < rank; r += 1) {
      const col = pivotOfRow[r];
      let sum = 0;
      for (const free of freeCols) sum += mat[r][free] * trial[free];
      trial[col] = -sum;
    }
    return trial;
  }

  const found: { coeffs: number[] | null; score: number } = {
    coeffs: null,
    score: Number.POSITIVE_INFINITY,
  };

  const consider = (trial: number[]) => {
    if (!trial.every((v) => v > -1e-9)) return;
    if (!trial.slice(0, nUser).every((v) => v > 1e-9)) return;
    try {
      const ints = toIntegerCoefficients(trial);
      if (!ints.every((v) => v >= 0)) return;
      if (!ints.slice(0, nUser).every((v) => v > 0)) return;
      // Cancel water/H on both sides already represented as separate cols —
      // prefer solutions that don't put the same aux on both sides heavily.
      const score =
        ints.reduce((s, v) => s + v, 0) +
        5 * (Math.min(ints[wL], ints[wR]) + Math.min(ints[hL], ints[hR]));
      if (score < found.score) {
        found.score = score;
        found.coeffs = ints;
      }
    } catch {
      // skip
    }
  };

  const maxFree = freeCols.length <= 2 ? 12 : freeCols.length === 3 ? 8 : 5;
  const weights = Array(freeCols.length).fill(0);
  const search = (index: number) => {
    if (index === weights.length) {
      // At least one free weight must be positive
      if (weights.every((v) => v === 0)) return;
      consider(buildTrial(weights));
      return;
    }
    for (let value = 0; value <= maxFree; value += 1) {
      weights[index] = value;
      search(index + 1);
    }
  };
  if (freeCols.length <= 4) search(0);
  else {
    for (const free of freeCols) {
      const wts = Array(freeCols.length).fill(0);
      wts[freeCols.indexOf(free)] = 1;
      consider(buildTrial(wts));
    }
  }

  if (!found.coeffs) {
    throw new RedoxError(
      "Unable to balance this redox equation automatically. Check charges (e.g. Fe2+, MnO4-) and try acidic/basic.",
    );
  }

  // Cancel auxiliaries appearing on both sides
  const coeffs = found.coeffs.slice();
  const cancel = Math.min(coeffs[wL], coeffs[wR]);
  coeffs[wL] -= cancel;
  coeffs[wR] -= cancel;
  const cancelH = Math.min(coeffs[hL], coeffs[hR]);
  coeffs[hL] -= cancelH;
  coeffs[hR] -= cancelH;

  let usedMedium: RedoxMedium = "acidic";

  const makeAcidic = (c: number[]) => {
    const reactants: RedoxSpecies[] = userLeft.map((s, i) => ({
      ...s,
      coefficient: c[i],
      side: "reactant" as const,
    }));
    const products: RedoxSpecies[] = userRight.map((s, i) => ({
      ...s,
      coefficient: c[userLeft.length + i],
      side: "product" as const,
    }));
    if (c[wL] > 0) {
      reactants.push({
        formula: "H2O",
        display: "H₂O",
        charge: 0,
        coefficient: c[wL],
        side: "reactant",
        composition: { H: 2, O: 1 },
      });
    }
    if (c[wR] > 0) {
      products.push({
        formula: "H2O",
        display: "H₂O",
        charge: 0,
        coefficient: c[wR],
        side: "product",
        composition: { H: 2, O: 1 },
      });
    }
    if (c[hL] > 0) {
      reactants.push({
        formula: "H+",
        display: "H⁺",
        charge: 1,
        coefficient: c[hL],
        side: "reactant",
        composition: { H: 1 },
      });
    }
    if (c[hR] > 0) {
      products.push({
        formula: "H+",
        display: "H⁺",
        charge: 1,
        coefficient: c[hR],
        side: "product",
        composition: { H: 1 },
      });
    }
    return { reactants, products };
  };

  let { reactants, products } = makeAcidic(coeffs);

  if (medium === "basic") {
    usedMedium = "basic";
    // Convert: each H+ on a side → add OH- same side and H2O opposite (or combine)
    // Standard: add n OH- to both sides for each H+, combine H++OH- → H2O on that side
    const hReact = reactants.find((s) => s.formula === "H+");
    const hProd = products.find((s) => s.formula === "H+");
    const nH = (hReact?.coefficient ?? 0) - (hProd?.coefficient ?? 0);
    // Remove H+
    reactants = reactants.filter((s) => s.formula !== "H+");
    products = products.filter((s) => s.formula !== "H+");

    const addOrMerge = (
      list: RedoxSpecies[],
      side: "reactant" | "product",
      formula: string,
      display: string,
      charge: number,
      composition: Record<string, number>,
      amount: number,
    ) => {
      if (amount === 0) return;
      const existing = list.find((s) => s.formula === formula);
      if (existing) existing.coefficient += amount;
      else
        list.push({
          formula,
          display,
          charge,
          coefficient: amount,
          side,
          composition,
        });
    };

    if (nH > 0) {
      // net H+ was on reactants in acidic form... 
      // Actually hReact means H+ consumed (on left). Add nH OH- to left and nH H2O to right? 
      // Textbook: add n OH- to BOTH sides; H+ + OH- → H2O on the side that had H+.
      if (hReact) {
        // H+ was on reactants: become H2O on reactants; add OH- on products
        addOrMerge(reactants, "reactant", "H2O", "H₂O", 0, { H: 2, O: 1 }, hReact.coefficient);
        addOrMerge(products, "product", "OH-", "OH⁻", -1, { O: 1, H: 1 }, hReact.coefficient);
      }
      if (hProd) {
        addOrMerge(products, "product", "H2O", "H₂O", 0, { H: 2, O: 1 }, hProd.coefficient);
        addOrMerge(reactants, "reactant", "OH-", "OH⁻", -1, { O: 1, H: 1 }, hProd.coefficient);
      }
    } else {
      // nH computed unused; handle via hReact/hProd only
      if (hReact) {
        addOrMerge(reactants, "reactant", "H2O", "H₂O", 0, { H: 2, O: 1 }, hReact.coefficient);
        addOrMerge(products, "product", "OH-", "OH⁻", -1, { O: 1, H: 1 }, hReact.coefficient);
      }
      if (hProd) {
        addOrMerge(products, "product", "H2O", "H₂O", 0, { H: 2, O: 1 }, hProd.coefficient);
        addOrMerge(reactants, "reactant", "OH-", "OH⁻", -1, { O: 1, H: 1 }, hProd.coefficient);
      }
    }

    // Cancel H2O appearing on both sides
    const wR = reactants.find((s) => s.formula === "H2O");
    const wP = products.find((s) => s.formula === "H2O");
    if (wR && wP) {
      const m = Math.min(wR.coefficient, wP.coefficient);
      wR.coefficient -= m;
      wP.coefficient -= m;
    }
    reactants = reactants.filter((s) => s.coefficient > 0);
    products = products.filter((s) => s.coefficient > 0);
  }

  const chargeReactants = reactants.reduce(
    (s, x) => s + x.coefficient * x.charge,
    0,
  );
  const chargeProducts = products.reduce(
    (s, x) => s + x.coefficient * x.charge,
    0,
  );

  const allElements = new Set<string>();
  for (const s of [...reactants, ...products]) {
    for (const el of Object.keys(s.composition)) allElements.add(el);
  }
  const atomCheck = [...allElements].sort().map((el) => {
    let reactantAtoms = 0;
    let productAtoms = 0;
    for (const s of reactants)
      reactantAtoms += s.coefficient * (s.composition[el] ?? 0);
    for (const s of products)
      productAtoms += s.coefficient * (s.composition[el] ?? 0);
    return { element: el, reactantAtoms, productAtoms };
  });

  if (
    !atomCheck.every((r) => r.reactantAtoms === r.productAtoms) ||
    chargeReactants !== chargeProducts
  ) {
    throw new RedoxError(
      "Internal balance check failed. Try the other medium or simplify the equation.",
    );
  }

  const equation = `${reactants.map(formatSpecies).join(" + ")} → ${products
    .map(formatSpecies)
    .join(" + ")}`;

  const steps = [
    `Parse ions and charges from the skeleton equation.`,
    `Enforce atom conservation for every element and overall charge conservation.`,
    medium === "acidic"
      ? `Add H₂O / H⁺ as needed (acidic half-reaction style auxiliaries).`
      : `Balance in acidic form, then convert H⁺ to H₂O / OH⁻ for basic medium.`,
    `Scale to the smallest positive integer coefficients.`,
    `Balanced (${usedMedium}): ${equation}`,
  ];

  return {
    medium: usedMedium,
    reactants,
    products,
    equation,
    steps,
    atomCheck,
    chargeReactants,
    chargeProducts,
  };
}

export const REDOX_EXAMPLES = [
  {
    id: "permanganate-iron",
    label: "MnO₄⁻ + Fe²⁺ (acidic)",
    equation: "MnO4- + Fe2+ = Mn2+ + Fe3+",
    medium: "acidic" as const,
  },
  {
    id: "dichromate-fe",
    label: "Cr₂O₇²⁻ + Fe²⁺ (acidic)",
    equation: "Cr2O7^2- + Fe2+ = Cr3+ + Fe3+",
    medium: "acidic" as const,
  },
  {
    id: "zinc-h",
    label: "Zn + H⁺",
    equation: "Zn + H+ = Zn2+ + H2",
    medium: "acidic" as const,
  },
  {
    id: "permanganate-basic",
    label: "MnO₄⁻ + SO₃²⁻ (basic)",
    equation: "MnO4- + SO3^2- = MnO2 + SO4^2-",
    medium: "basic" as const,
  },
];
