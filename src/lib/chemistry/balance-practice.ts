import {
  atomCheckForCoefficients,
  balanceEquation,
  parseEquationSides,
  type AtomCheckRow,
} from "@/lib/chemistry/balance-equation";

export type PracticeLevel = "intro" | "combustion" | "polyatomic" | "challenge";

export const PRACTICE_LEVELS: Array<{
  id: PracticeLevel | "all";
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "intro", label: "Intro" },
  { id: "combustion", label: "Combustion" },
  { id: "polyatomic", label: "Polyatomic" },
  { id: "challenge", label: "Challenge" },
];

export interface BalancePracticeProblem {
  id: string;
  level: PracticeLevel;
  title: string;
  /** Unbalanced equation, e.g. "Fe + O2 = Fe2O3". */
  equation: string;
  /** First hint — strategy, not the answer. */
  hint: string;
  /** Second hint — which element to start with. */
  strategy: string;
}

export type GradeStatus =
  | "incomplete"
  | "invalid"
  | "unbalanced"
  | "reducible"
  | "correct";

export interface GradeResult {
  status: GradeStatus;
  message: string;
  atomCheck: AtomCheckRow[];
  unmatched: string[];
  factor?: number;
  coach: string[];
}

export const BALANCE_PRACTICE_PROBLEMS: BalancePracticeProblem[] = [
  {
    id: "water",
    level: "intro",
    title: "Formation of water",
    equation: "H2 + O2 = H2O",
    hint: "Hydrogen is even on the left (H₂) but odd on the right until you scale water.",
    strategy: "Balance H first (an even number of H₂O), then set O₂.",
  },
  {
    id: "ammonia",
    level: "intro",
    title: "Haber ammonia",
    equation: "N2 + H2 = NH3",
    hint: "Nitrogen comes in pairs as N₂, so NH₃ must be scaled to an even N count.",
    strategy: "Put 2 NH₃ to match N₂, then six H atoms set H₂ to 3.",
  },
  {
    id: "hcl",
    level: "intro",
    title: "Hydrogen chloride",
    equation: "H2 + Cl2 = HCl",
    hint: "Both elements arrive as diatomic molecules.",
    strategy: "One H₂ and one Cl₂ make two HCl.",
  },
  {
    id: "nacl",
    level: "intro",
    title: "Sodium chloride",
    equation: "Na + Cl2 = NaCl",
    hint: "Chlorine is diatomic; NaCl is 1:1 Na:Cl.",
    strategy: "Balance Cl first with 2 NaCl, then match Na.",
  },
  {
    id: "mgo",
    level: "intro",
    title: "Magnesium oxide",
    equation: "Mg + O2 = MgO",
    hint: "Oxygen is diatomic; MgO has one O per formula unit.",
    strategy: "2 MgO uses one O₂; then put 2 Mg.",
  },
  {
    id: "li2o",
    level: "intro",
    title: "Lithium oxide",
    equation: "Li + O2 = Li2O",
    hint: "Li₂O already has two lithium atoms per formula unit.",
    strategy: "2 Li₂O uses one O₂; lithium then needs 4 Li.",
  },
  {
    id: "p4o10",
    level: "intro",
    title: "Phosphorus(V) oxide",
    equation: "P + O2 = P4O10",
    hint: "The product formula already fixes 4 P and 10 O.",
    strategy: "Put 4 P to match P₄O₁₀, then 10 O atoms means 5 O₂.",
  },
  {
    id: "alumina",
    level: "intro",
    title: "Aluminum oxide",
    equation: "Al + O2 = Al2O3",
    hint: "Al₂O₃ has 3 O while O₂ is even — scale the whole equation.",
    strategy: "2 Al₂O₃ (6 O) uses 3 O₂; then 4 Al.",
  },
  {
    id: "rust",
    level: "intro",
    title: "Iron(III) oxide",
    equation: "Fe + O2 = Fe2O3",
    hint: "Same odd-oxygen pattern as aluminum oxide.",
    strategy: "2 Fe₂O₃ needs 3 O₂ and 4 Fe.",
  },
  {
    id: "zn-hcl",
    level: "intro",
    title: "Zinc + hydrochloric acid",
    equation: "Zn + HCl = ZnCl2 + H2",
    hint: "ZnCl₂ needs two chlorides; hydrogen leaves as H₂.",
    strategy: "Balance Cl with 2 HCl; H₂ on the right is then already even.",
  },
  {
    id: "methane",
    level: "combustion",
    title: "Methane combustion",
    equation: "CH4 + O2 = CO2 + H2O",
    hint: "Complete combustion: C → CO₂, H → H₂O, then count O.",
    strategy: "Carbon is already 1. Four H need 2 H₂O. Right-side O is 4, so 2 O₂.",
  },
  {
    id: "ethane",
    level: "combustion",
    title: "Ethane combustion",
    equation: "C2H6 + O2 = CO2 + H2O",
    hint: "Oxygen will come out as a half-coefficient until you double everything.",
    strategy: "2 CO₂ and 3 H₂O use 7 O atoms → (7/2) O₂; multiply the equation by 2.",
  },
  {
    id: "propane",
    level: "combustion",
    title: "Propane combustion",
    equation: "C3H8 + O2 = CO2 + H2O",
    hint: "C, then H, then O. This one stays whole-number without doubling.",
    strategy: "3 CO₂ and 4 H₂O use 10 O atoms → 5 O₂.",
  },
  {
    id: "butane",
    level: "combustion",
    title: "Butane combustion",
    equation: "C4H10 + O2 = CO2 + H2O",
    hint: "Like ethane, O₂ is half-integral until you clear the fraction.",
    strategy: "4 CO₂ + 5 H₂O = 13 O atoms → 13/2 O₂; multiply through by 2.",
  },
  {
    id: "ethene",
    level: "combustion",
    title: "Ethene combustion",
    equation: "C2H4 + O2 = CO2 + H2O",
    hint: "Alkene: fewer hydrogens than ethane, so fewer H₂O.",
    strategy: "2 CO₂ and 2 H₂O use 6 O → 3 O₂.",
  },
  {
    id: "ethyne",
    level: "combustion",
    title: "Ethyne (acetylene) combustion",
    equation: "C2H2 + O2 = CO2 + H2O",
    hint: "Very little hydrogen; oxygen will need doubling.",
    strategy: "2 CO₂ + 1 H₂O = 5 O atoms → 5/2 O₂; multiply by 2.",
  },
  {
    id: "ethanol",
    level: "combustion",
    title: "Ethanol combustion",
    equation: "C2H5OH + O2 = CO2 + H2O",
    hint: "Ethanol already contains oxygen — include it when you count O on the left.",
    strategy: "2 CO₂ and 3 H₂O need 7 O total; ethanol supplies 1, so 3 O₂.",
  },
  {
    id: "glucose",
    level: "combustion",
    title: "Glucose combustion",
    equation: "C6H12O6 + O2 = CO2 + H2O",
    hint: "The sugar already brings 6 oxygen atoms.",
    strategy: "6 CO₂ + 6 H₂O = 18 O on the right; glucose has 6, so 6 O₂.",
  },
  {
    id: "octane",
    level: "combustion",
    title: "Octane combustion",
    equation: "C8H18 + O2 = CO2 + H2O",
    hint: "Same C–H–O order; expect a doubled equation.",
    strategy: "8 CO₂ + 9 H₂O = 25 O → 25/2 O₂; multiply by 2.",
  },
  {
    id: "cs2",
    level: "combustion",
    title: "Carbon disulfide combustion",
    equation: "CS2 + O2 = CO2 + SO2",
    hint: "Sulfur becomes SO₂, not water. Balance C and S before oxygen.",
    strategy: "1 CO₂ and 2 SO₂ use 6 O atoms → 3 O₂.",
  },
  {
    id: "agno3-cacl2",
    level: "polyatomic",
    title: "Silver nitrate + calcium chloride",
    equation: "AgNO3 + CaCl2 = AgCl + Ca(NO3)2",
    hint: "NO₃⁻ and Cl⁻ transfer as groups — balance the polyatomic ion as a unit.",
    strategy: "Ca(NO₃)₂ needs two nitrates → 2 AgNO₃ and 2 AgCl.",
  },
  {
    id: "bacl2-na2so4",
    level: "polyatomic",
    title: "Barium chloride + sodium sulfate",
    equation: "BaCl2 + Na2SO4 = BaSO4 + NaCl",
    hint: "SO₄²⁻ stays intact; sodium chloride will need a 2.",
    strategy: "One BaSO₄; two Cl on the left need 2 NaCl.",
  },
  {
    id: "naoh-h2so4",
    level: "polyatomic",
    title: "Sodium hydroxide + sulfuric acid",
    equation: "NaOH + H2SO4 = Na2SO4 + H2O",
    hint: "H₂SO₄ is diprotic: two NaOH per sulfuric acid.",
    strategy: "Na₂SO₄ needs 2 Na → 2 NaOH, which also makes 2 H₂O.",
  },
  {
    id: "caoh2-hcl",
    level: "polyatomic",
    title: "Calcium hydroxide + HCl",
    equation: "Ca(OH)2 + HCl = CaCl2 + H2O",
    hint: "Two hydroxides mean two HCl and two waters.",
    strategy: "CaCl₂ needs 2 HCl; the two OH⁻ become 2 H₂O.",
  },
  {
    id: "al-hcl",
    level: "polyatomic",
    title: "Aluminum + hydrochloric acid",
    equation: "Al + HCl = AlCl3 + H2",
    hint: "AlCl₃ needs 3 Cl, but H₂ requires an even hydrogen count — scale the equation.",
    strategy: "2 AlCl₃ needs 6 HCl and gives 6 H → 3 H₂.",
  },
  {
    id: "na2co3-hcl",
    level: "polyatomic",
    title: "Sodium carbonate + HCl",
    equation: "Na2CO3 + HCl = NaCl + H2O + CO2",
    hint: "Carbonate + acid releases CO₂ and water. Two sodium ions need two NaCl.",
    strategy: "2 HCl for 2 NaCl; C and O then already fit 1 H₂O + 1 CO₂.",
  },
  {
    id: "fecl3-naoh",
    level: "polyatomic",
    title: "Iron(III) chloride + NaOH",
    equation: "FeCl3 + NaOH = Fe(OH)3 + NaCl",
    hint: "Fe(OH)₃ and FeCl₃ both need a coefficient pattern of 3 for the anions.",
    strategy: "3 NaOH and 3 NaCl match the three Cl and three OH.",
  },
  {
    id: "pbno3-ki",
    level: "polyatomic",
    title: "Lead(II) nitrate + potassium iodide",
    equation: "Pb(NO3)2 + KI = PbI2 + KNO3",
    hint: "Nitrate and iodide are spectators that still need counting.",
    strategy: "Two nitrates → 2 KNO₃; two iodides → 2 KI.",
  },
  {
    id: "ca3po4-h2so4",
    level: "polyatomic",
    title: "Calcium phosphate + sulfuric acid",
    equation: "Ca3(PO4)2 + H2SO4 = CaSO4 + H3PO4",
    hint: "Three Ca²⁺ need three sulfate; two phosphate groups become two H₃PO₄.",
    strategy: "3 CaSO₄ and 2 H₃PO₄; that uses 3 H₂SO₄.",
  },
  {
    id: "al-h2so4",
    level: "polyatomic",
    title: "Aluminum + sulfuric acid",
    equation: "Al + H2SO4 = Al2(SO4)3 + H2",
    hint: "Al₂(SO₄)₃ contains two Al and three sulfate. Hydrogen must leave as H₂.",
    strategy: "2 Al and 3 H₂SO₄ give 6 H → 3 H₂.",
  },
  {
    id: "kmno4-hcl",
    level: "challenge",
    title: "Permanganate + HCl",
    equation: "KMnO4 + HCl = KCl + MnCl2 + H2O + Cl2",
    hint: "Mn and K are 1:1 with KMnO₄. Chlorine appears in three products — save Cl for last.",
    strategy: "Balance K, Mn, then O (as H₂O), then H, then leftover Cl as Cl₂.",
  },
  {
    id: "cu-hno3",
    level: "challenge",
    title: "Copper + nitric acid",
    equation: "Cu + HNO3 = Cu(NO3)2 + NO + H2O",
    hint: "Some nitrate is the Cu²⁺ salt; some is reduced to NO. Do not treat every N as Cu(NO₃)₂.",
    strategy: "3 Cu need 6 nitrate in the salt plus 2 NO → 8 HNO₃; then H and O fix water.",
  },
  {
    id: "fes2-o2",
    level: "challenge",
    title: "Roasting pyrite",
    equation: "FeS2 + O2 = Fe2O3 + SO2",
    hint: "Iron ends in Fe₂O₃ (scale to even Fe); each FeS₂ has two S → SO₂.",
    strategy: "4 FeS₂ → 2 Fe₂O₃ + 8 SO₂; then count O on the right for O₂.",
  },
  {
    id: "ostwald",
    level: "challenge",
    title: "Ostwald oxidation of ammonia",
    equation: "NH3 + O2 = NO + H2O",
    hint: "N is 1:1 from NH₃ to NO. Hydrogen in water will force you to scale.",
    strategy: "4 NH₃ give 4 NO and 6 H₂O; oxygen atoms then set O₂ to 5.",
  },
  {
    id: "blast-furnace",
    level: "challenge",
    title: "Blast-furnace iron",
    equation: "Fe2O3 + CO = Fe + CO2",
    hint: "CO → CO₂ is a 1:1 carbon swap; iron metal comes from Fe₂O₃.",
    strategy: "2 Fe from one Fe₂O₃; three O in the oxide need 3 CO / 3 CO₂.",
  },
  {
    id: "thermite",
    level: "challenge",
    title: "Thermite reaction",
    equation: "Al + Fe2O3 = Al2O3 + Fe",
    hint: "Oxygen moves from Fe₂O₃ to Al₂O₃. Both oxides have three O.",
    strategy: "One Fe₂O₃ already matches Al₂O₃ oxygen; 2 Al and 2 Fe finish it.",
  },
  {
    id: "steam-iron",
    level: "challenge",
    title: "Iron + steam",
    equation: "Fe + H2O = Fe3O4 + H2",
    hint: "Fe₃O₄ is a mixed oxide (Fe₃O₄ = FeO·Fe₂O₃). Scale iron to 3.",
    strategy: "3 Fe and 4 H₂O make Fe₃O₄ and 4 H₂.",
  },
  {
    id: "kclo3",
    level: "challenge",
    title: "Potassium chlorate decomposition",
    equation: "KClO3 = KCl + O2",
    hint: "K and Cl stay 1:1. Oxygen is even as O₂, so scale chlorate.",
    strategy: "2 KClO₃ give 3 O₂ and 2 KCl.",
  },
  {
    id: "nh3-cuo",
    level: "challenge",
    title: "Ammonia + copper(II) oxide",
    equation: "NH3 + CuO = N2 + Cu + H2O",
    hint: "Nitrogen must leave as N₂ (even N). Oxygen from CuO becomes water.",
    strategy: "2 NH₃ → 1 N₂ + 3 H₂O, which needs 3 CuO and 3 Cu.",
  },
  {
    id: "h2s-o2",
    level: "challenge",
    title: "Hydrogen sulfide combustion",
    equation: "H2S + O2 = SO2 + H2O",
    hint: "S → SO₂ and H → H₂O, then oxygen.",
    strategy: "2 H₂S give 2 SO₂ + 2 H₂O = 6 O → 3 O₂.",
  },
];

export function problemsForLevel(
  level: PracticeLevel | "all",
): BalancePracticeProblem[] {
  if (level === "all") return BALANCE_PRACTICE_PROBLEMS;
  return BALANCE_PRACTICE_PROBLEMS.filter((p) => p.level === level);
}

export function expectedCoefficients(equation: string): number[] {
  const result = balanceEquation(equation);
  return [...result.reactants, ...result.products].map((s) => s.coefficient);
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

function parseCoefficient(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return n;
}

export function liveCoefficients(inputs: string[]): number[] {
  return inputs.map((value) => {
    const parsed = parseCoefficient(value);
    if (parsed === null) return 1;
    if (!Number.isInteger(parsed) || parsed <= 0) return 1;
    return parsed;
  });
}

export function coachFromAtomCheck(rows: AtomCheckRow[]): string[] {
  return rows
    .filter((row) => row.reactantAtoms !== row.productAtoms)
    .map((row) => {
      if (row.reactantAtoms > row.productAtoms) {
        return `${row.element}: reactants ${row.reactantAtoms} vs products ${row.productAtoms} — raise a product that contains ${row.element}, or lower a reactant.`;
      }
      return `${row.element}: products ${row.productAtoms} vs reactants ${row.reactantAtoms} — raise a reactant that contains ${row.element}, or lower a product.`;
    });
}

export function gradeAttempt(
  equation: string,
  inputs: string[],
): GradeResult {
  const { left, right } = parseEquationSides(equation);
  const expected = expectedCoefficients(equation);
  const parsed = inputs.map(parseCoefficient);

  if (parsed.some((n) => n === null)) {
    const preview = liveCoefficients(inputs);
    const atomCheck = atomCheckForCoefficients(left, right, preview);
    return {
      status: "incomplete",
      message:
        "Type a coefficient in every box. Use 1 if that formula does not need scaling — blank is not submitted.",
      atomCheck,
      unmatched: atomCheck
        .filter((row) => row.reactantAtoms !== row.productAtoms)
        .map((row) => row.element),
      coach: [],
    };
  }

  if (parsed.some((n) => !Number.isInteger(n) || (n as number) <= 0)) {
    const preview = liveCoefficients(inputs);
    const atomCheck = atomCheckForCoefficients(left, right, preview);
    return {
      status: "invalid",
      message: "Coefficients must be positive whole numbers (no fractions or zeros).",
      atomCheck,
      unmatched: atomCheck
        .filter((row) => row.reactantAtoms !== row.productAtoms)
        .map((row) => row.element),
      coach: [],
    };
  }

  const attempt = parsed as number[];
  const atomCheck = atomCheckForCoefficients(left, right, attempt);
  const unmatched = atomCheck
    .filter((row) => row.reactantAtoms !== row.productAtoms)
    .map((row) => row.element);

  if (unmatched.length > 0) {
    return {
      status: "unbalanced",
      message: `Not balanced yet. Off on ${unmatched.join(", ")}.`,
      atomCheck,
      unmatched,
      coach: coachFromAtomCheck(atomCheck),
    };
  }

  const equal = attempt.every((n, i) => n === expected[i]);
  if (equal) {
    return {
      status: "correct",
      message: "Balanced — smallest whole-number coefficients.",
      atomCheck,
      unmatched: [],
      coach: [],
    };
  }

  const factor = attempt[0] / expected[0];
  const isMultiple =
    Number.isInteger(factor) &&
    factor > 1 &&
    attempt.every((n, i) => n === expected[i] * factor);

  if (isMultiple) {
    const g = attempt.reduce((acc, n) => gcd(acc, n), attempt[0]);
    return {
      status: "reducible",
      message: `Atoms balance, but these are ${factor}× the smallest set. Divide every coefficient by ${g}.`,
      atomCheck,
      unmatched: [],
      factor,
      coach: [
        `Classroom convention is the smallest whole-number ratio. Divide each coefficient by ${g}.`,
      ],
    };
  }

  return {
    status: "correct",
    message: "Atoms balance on both sides.",
    atomCheck,
    unmatched: [],
    coach: [],
  };
}

export function thirdHint(equation: string): string {
  const { left, right } = parseEquationSides(equation);
  const expected = expectedCoefficients(equation);
  const species = [...left, ...right];
  let best = 0;
  for (let i = 1; i < expected.length; i += 1) {
    if (expected[i] > expected[best]) best = i;
  }
  const side = best < left.length ? "reactant" : "product";
  return `The largest coefficient in the smallest whole-number set is ${expected[best]} on ${side} ${species[best]}.`;
}

export function pickNextProblem(
  pool: BalancePracticeProblem[],
  currentId: string | null,
  solvedIds: Set<string>,
): BalancePracticeProblem {
  if (pool.length === 0) {
    throw new Error("No practice problems in this set.");
  }
  const unsolved = pool.filter(
    (p) => p.id !== currentId && !solvedIds.has(p.id),
  );
  const rest = pool.filter((p) => p.id !== currentId);
  const candidates = unsolved.length > 0 ? unsolved : rest.length > 0 ? rest : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
