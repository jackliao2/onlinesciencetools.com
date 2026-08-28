/**
 * Cross-tool correctness audit — exits non-zero on failure.
 */
import { balanceEquation } from "../src/lib/chemistry/balance-equation.ts";
import {
  BALANCE_PRACTICE_PROBLEMS,
  gradeAttempt,
} from "../src/lib/chemistry/balance-practice.ts";
import { parseFormula, molesFromMass } from "../src/lib/chemistry/molar-mass.ts";
import {
  empiricalFromElements,
  percentCompositionFromFormula,
} from "../src/lib/chemistry/composition.ts";
import { convertConcentration } from "../src/lib/chemistry/concentration.ts";
import { calculatePh } from "../src/lib/chemistry/ph.ts";
import { solveDilution, solveSerialDilution } from "../src/lib/chemistry/dilution.ts";
import { solubilityFromKsp, kspFromSolubility } from "../src/lib/chemistry/ksp.ts";
import { solveIdealGas } from "../src/lib/chemistry/gas-law.ts";
import { enthalpyFromFormation } from "../src/lib/chemistry/thermochemistry.ts";
import { solveKinetics } from "../src/lib/chemistry/kinetics.ts";
import { calculateNernst } from "../src/lib/chemistry/nernst.ts";
import { balanceRedox } from "../src/lib/chemistry/redox.ts";
import {
  calculateBufferRecipe,
  calculateMcIlvaine,
} from "../src/lib/chemistry/buffer-recipe.ts";
import {
  solveEquilibrium,
  computeKFromEquilibrium,
  convertKcKp,
  gasDeltaN,
} from "../src/lib/chemistry/equilibrium.ts";
import {
  solveLinearSystem,
  determinant,
  invertMatrix,
} from "../src/lib/math/linear-system.ts";
import { compileExpression } from "../src/lib/math/expression.ts";
import {
  compileVectorField,
  rk4Step,
  findEquilibria,
  PHASE_PRESETS,
} from "../src/lib/math/phase-portrait.ts";
import { SEARCH_LOCKED_PAGES, getGuideBySlug, getToolBySlug } from "../src/lib/tools.ts";
import {
  looksLikeFullHtmlDocument,
  parseHtmlFile,
} from "../src/lib/html-executor/parse-html-file.ts";
import { kspStoichiometryLabel } from "../src/lib/chemistry/ksp.ts";

let failed = 0;

function approx(actual: number, expected: number, tol = 1e-4, label = "") {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tol) {
    console.error(`FAIL ${label}: got ${actual}, expected ${expected}`);
    failed += 1;
  } else {
    console.log(`OK   ${label}: ${actual}`);
  }
}

function eq(actual: string, expected: string, label = "") {
  if (actual !== expected) {
    console.error(`FAIL ${label}: got "${actual}", expected "${expected}"`);
    failed += 1;
  } else {
    console.log(`OK   ${label}: ${actual}`);
  }
}

function throws(fn: () => unknown, label: string) {
  try {
    fn();
    console.error(`FAIL ${label}: expected throw`);
    failed += 1;
  } catch {
    console.log(`OK   ${label}: throws`);
  }
}

// --- Balancer ---
eq(balanceEquation("H2 + O2 = H2O").equation, "2H2 + O2 → 2H2O", "balance water");
eq(balanceEquation("Fe + O2 = Fe2O3").equation, "4Fe + 3O2 → 2Fe2O3", "balance Fe2O3");
eq(
  balanceEquation("C2H6 + O2 = CO2 + H2O").equation,
  "2C2H6 + 7O2 → 4CO2 + 6H2O",
  "balance ethane",
);
eq(
  balanceEquation("C2H5OH + O2 = CO2 + H2O").equation,
  "C2H5OH + 3O2 → 2CO2 + 3H2O",
  "balance ethanol",
);
eq(
  balanceEquation("H2 + O2 = H2O + H2O2").equation,
  "3H2 + 2O2 → 2H2O + H2O2",
  "balance multi-null",
);
eq(
  balanceEquation("KMnO4 + HCl = KCl + MnCl2 + H2O + Cl2").equation,
  "2KMnO4 + 16HCl → 2KCl + 2MnCl2 + 8H2O + 5Cl2",
  "balance permanganate",
);
eq(
  balanceEquation("Cu + HNO3 = Cu(NO3)2 + NO + H2O").equation,
  "3Cu + 8HNO3 → 3Cu(NO3)2 + 2NO + 4H2O",
  "balance Cu/HNO3",
);
eq(
  balanceEquation("AgNO3 + CaCl2 = AgCl + Ca(NO3)2").equation,
  "2AgNO3 + CaCl2 → 2AgCl + Ca(NO3)2",
  "balance AgNO3",
);

{
  const ids = new Set(BALANCE_PRACTICE_PROBLEMS.map((p) => p.id));
  eq(ids.size, BALANCE_PRACTICE_PROBLEMS.length, "practice ids unique");
  eq(BALANCE_PRACTICE_PROBLEMS.length, 40, "practice bank size");
}
for (const problem of BALANCE_PRACTICE_PROBLEMS) {
  const result = balanceEquation(problem.equation);
  eq(
    result.atomCheck.every((row) => row.reactantAtoms === row.productAtoms),
    true,
    `practice ${problem.id} balances`,
  );
  const expected = [...result.reactants, ...result.products].map((s) =>
    String(s.coefficient),
  );
  eq(
    gradeAttempt(problem.equation, expected).status,
    "correct",
    `practice ${problem.id} grades correct`,
  );
}
eq(
  gradeAttempt("H2 + O2 = H2O", ["4", "2", "4"]).status,
  "reducible",
  "water 2× is reducible",
);
eq(gradeAttempt("H2 + O2 = H2O", ["4", "2", "4"]).factor, 2, "water factor 2");
eq(
  gradeAttempt("H2 + O2 = H2O", ["1", "1", "1"]).status,
  "unbalanced",
  "water all-1 unbalanced",
);
eq(
  gradeAttempt("H2 + O2 = H2O", ["2", "1", ""]).status,
  "incomplete",
  "blank incomplete",
);

// --- Redox ---
eq(
  balanceRedox("MnO4- + Fe2+ = Mn2+ + Fe3+", "acidic").equation,
  "MnO4⁻ + 5Fe^{2+} + 8H⁺ → Mn^{2+} + 5Fe^{3+} + 4H₂O",
  "redox MnO4/Fe acidic",
);
eq(
  balanceRedox("Cr2O7^2- + Fe2+ = Cr3+ + Fe3+", "acidic").equation,
  "Cr2O7^{2-} + 6Fe^{2+} + 14H⁺ → 2Cr^{3+} + 6Fe^{3+} + 7H₂O",
  "redox dichromate/Fe",
);
eq(
  balanceRedox("Zn + H+ = Zn2+ + H2", "acidic").equation,
  "Zn + 2H⁺ → Zn^{2+} + H2",
  "redox Zn/H+",
);
eq(
  balanceRedox("MnO4- + SO3^2- = MnO2 + SO4^2-", "basic").equation,
  "2MnO4⁻ + 3SO3^{2-} + H₂O → 2MnO2 + 3SO4^{2-} + 2OH⁻",
  "redox MnO4/SO3 basic",
);
{
  const r = balanceRedox("MnO4- + Fe2+ = Mn2+ + Fe3+", "acidic");
  eq(r.chargeReactants === r.chargeProducts, true, "redox charge balanced");
  eq(
    r.atomCheck.every((row) => row.reactantAtoms === row.productAtoms),
    true,
    "redox atoms balanced",
  );
}

// --- Buffer recipe ---
{
  const buf = calculateBufferRecipe({
    systemId: "phosphate",
    targetPh: 7.4,
    totalMolarity: 0.1,
    volumeL: 1,
  });
  approx(buf.ratioBaseOverAcid, 1.5849, 1e-3, "buffer phosphate ratio");
  approx(buf.acidMassG, 4.6415, 0.02, "buffer phosphate acid mass");
  approx(buf.baseMassG, 8.704, 0.05, "buffer phosphate base mass");
  approx(buf.hhCheckPh, 7.4, 1e-9, "buffer HH check");
}
{
  const hepes = calculateBufferRecipe({
    systemId: "hepes",
    targetPh: 7.48,
    totalMolarity: 0.1,
    volumeL: 1,
  });
  approx(hepes.ratioBaseOverAcid, 1, 1e-6, "HEPES at pKa");
  approx(hepes.acidMolarMass, 238.3, 0.1, "HEPES acid MM");
}
{
  const mes = calculateBufferRecipe({
    systemId: "mes",
    targetPh: 6.15,
    totalMolarity: 0.1,
    volumeL: 1,
  });
  approx(mes.ratioBaseOverAcid, 1, 1e-6, "MES at pKa");
}
{
  const borate = calculateBufferRecipe({
    systemId: "borate",
    targetPh: 9.24,
    totalMolarity: 0.05,
    volumeL: 1,
  });
  approx(borate.ratioBaseOverAcid, 1, 1e-6, "borate at pKa");
}
{
  const buf = calculateBufferRecipe({
    systemId: "acetate",
    targetPh: 4.76,
    totalMolarity: 0.2,
    volumeL: 0.5,
  });
  approx(buf.ratioBaseOverAcid, 1, 1e-9, "buffer acetate equal");
  approx(buf.acidMolarity, 0.1, 1e-9, "buffer acetate [HA]");
  approx(buf.baseMolarity, 0.1, 1e-9, "buffer acetate [A-]");
}
{
  const his = calculateBufferRecipe({
    systemId: "histidine",
    targetPh: 6.04,
    totalMolarity: 0.05,
    volumeL: 1,
  });
  approx(his.ratioBaseOverAcid, 1, 1e-6, "histidine at pKa");
}
{
  const mix = calculateMcIlvaine(7.0, 20);
  approx(mix.phosphateMl, 16.47, 1e-9, "McIlvaine pH 7 20 mL phosphate");
  approx(mix.citrateMl, 3.53, 1e-9, "McIlvaine pH 7 20 mL citrate");
  const scaled = calculateMcIlvaine(7.0, 100);
  approx(scaled.phosphateMl, 82.35, 1e-9, "McIlvaine pH 7 100 mL phosphate");
}
throws(() => calculateMcIlvaine(1.5, 20), "McIlvaine pH too low");

// --- Molar mass / composition ---
approx(parseFormula("H2O").molarMass, 18.01528, 1e-4, "molar H2O");
approx(parseFormula("CuSO4·5H2O").molarMass, 249.685, 0.01, "molar blue vitriol");
approx(parseFormula("Ca(OH)2").molarMass, 74.09268, 0.01, "molar Ca(OH)2");
throws(() => parseFormula("Ca(OH"), "unclosed paren");
const emp = empiricalFromElements([
  { element: "C", value: 40.0 },
  { element: "H", value: 6.7 },
  { element: "O", value: 53.3 },
]);
eq(emp.empiricalFormula, "CH2O", "empirical CH2O");
throws(
  () =>
    empiricalFromElements([
      { element: "C", value: 12 },
      { element: "C", value: 12 },
      { element: "H", value: 1 },
    ]),
  "duplicate elements",
);
approx(
  percentCompositionFromFormula("H2O").composition.find((c) => c.element === "H")!
    .percent,
  11.19,
  0.05,
  "%H in water",
);

// --- Dilution ---
const dil = solveDilution({ c1: 2, v1: null, c2: 0.5, v2: 0.25 });
approx(dil.v1, 0.0625, 1e-9, "dilution v1");
{
  const hcl = solveDilution({ c1: 12, v1: null, c2: 1, v2: 1000 });
  approx(hcl.v1, 1000 / 12, 1e-9, "HCl 12 M → 1 M V1");
  approx(hcl.dilutionFactor, 12, 1e-9, "HCl dilution factor");
}
const serial = solveSerialDilution({
  stockC: 1,
  factor: 10,
  steps: 3,
  transferV: 1,
  finalV: 10,
});
approx(serial.steps[2].concentration, 0.001, 1e-12, "serial 1:10 x3");
eq(serial.overallFactor, 1000, "serial overall factor");

const balCheck = balanceEquation("Fe + O2 = Fe2O3");
eq(balCheck.atomCheck.length > 0, true, "balance atomCheck present");
eq(
  balCheck.atomCheck.every((row) => row.reactantAtoms === row.productAtoms),
  true,
  "balance atomCheck matched",
);

// --- Concentration ---
const conc = convertConcentration({
  value: 0.1,
  kind: "molarity",
  molarMass: 58.44,
  density: 1.0,
});
approx(conc.massPercent, 0.5844, 0.01, "0.1 M NaCl mass%");
{
  const mm = convertConcentration({
    value: 100,
    kind: "millimolar",
    molarMass: 58.44,
    density: 1.0,
  });
  approx(mm.molarity, 0.1, 1e-9, "100 mM = 0.1 M");
  approx(mm.micromolar, 1e5, 1e-6, "100 mM = 1e5 μM");
}
{
  const mgml = convertConcentration({
    value: 5.844,
    kind: "milligramsPerMl",
    molarMass: 58.44,
    density: 1.0,
  });
  approx(mgml.molarity, 0.1, 1e-6, "5.844 mg/mL NaCl = 0.1 M");
  approx(mgml.gramsPerLiter, 5.844, 1e-9, "mg/mL equals g/L");
}
{
  const ng = convertConcentration({
    value: 200,
    kind: "nanogramsPerMl",
    molarMass: 66430,
    density: 1.0,
  });
  approx(ng.nanomolar, 3.0107, 0.01, "200 ng/mL BSA ≈ 3.01 nM");
  approx(ng.micromolar, 0.0030107, 1e-6, "200 ng/mL BSA ≈ 0.00301 μM");
}
{
  const wv = convertConcentration({
    value: 0.02,
    kind: "massVolumePercent",
    molarMass: 58.44,
    density: 1.0,
  });
  approx(wv.gramsPerLiter, 0.2, 1e-9, "0.02% w/v = 0.2 mg/mL");
  approx(wv.massVolumePercent, 0.02, 1e-9, "w/v percent round-trip");
}
throws(
  () =>
    convertConcentration({
      value: 100,
      kind: "massPercent",
      molarMass: 58.44,
      density: 1.0,
    }),
  "100% mass percent",
);

// --- pH ---
approx(calculatePh({ mode: "strong-acid", concentration: 0.01 }).pH, 2, 1e-3, "strong acid 0.01");
approx(calculatePh({ mode: "strong-base", concentration: 0.01 }).pH, 12, 1e-3, "strong base 0.01");
approx(
  calculatePh({ mode: "weak-acid", concentration: 0.1, constant: 1.8e-5 }).pH,
  2.873,
  0.02,
  "acetic 0.1M",
);
{
  const dilute = calculatePh({
    mode: "weak-acid",
    concentration: 1e-7,
    constant: 1e-7,
  });
  if (!(dilute.pH > 6.8 && dilute.pH < 7)) {
    console.error(`FAIL dilute weak acid pH: ${dilute.pH}`);
    failed += 1;
  } else console.log(`OK   dilute weak acid pH: ${dilute.pH}`);
}
approx(
  calculatePh({
    mode: "buffer",
    concentration: 0.1,
    conjugate: 0.1,
    constant: 1.8e-5,
  }).pH,
  4.7447,
  0.01,
  "acetate buffer",
);
// Henderson–Hasselbalch is invalid when the conjugate base is negligible.
// Formal 0.100 M HA with only 10⁻⁸ M A⁻ should approach the weak-acid result,
// not the HH prediction pH −2.255.
approx(
  calculatePh({
    mode: "buffer",
    concentration: 0.1,
    conjugate: 1e-8,
    constant: 1.8e-5,
  }).pH,
  2.873,
  0.01,
  "buffer extreme ratio exact solution",
);
// Dilute strong acid must not report pH 7 from clamping incorrectly
{
  const d = calculatePh({ mode: "strong-acid", concentration: 1e-8 });
  if (!(d.pH > 6.9 && d.pH < 7)) {
    console.error(`FAIL dilute strong acid pH: ${d.pH}`);
    failed += 1;
  } else console.log(`OK   dilute strong acid pH: ${d.pH}`);
}
{
  const eqv = calculatePh({
    mode: "neutralization",
    concentration: 0.1,
    acidVolumeL: 0.025,
    baseConcentration: 0.1,
    baseVolumeL: 0.025,
  });
  approx(eqv.pH, 7, 1e-6, "HCl+NaOH equivalence pH 7");
}
{
  const excess = calculatePh({
    mode: "neutralization",
    concentration: 0.1,
    acidVolumeL: 0.05,
    baseConcentration: 0.1,
    baseVolumeL: 0.02,
  });
  approx(excess.pH, 1.368, 0.01, "excess HCl after neutralization");
}

// --- Ksp ---
approx(solubilityFromKsp("AB2", 4e-6), 0.01, 1e-6, "AB2 s from Ksp");
approx(kspFromSolubility("AB2", 0.01), 4e-6, 1e-12, "AB2 Ksp from s");
approx(kspFromSolubility("AB", 1.08e-5), 1.1664e-10, 1e-16, "BaCrO4 Ksp from s");
approx(kspFromSolubility("A3B2", 6.1e-9), 108 * 6.1e-9 ** 5, 1e-46, "A3B2 Ksp from s");

// --- Gas law ---
{
  const r = solveIdealGas({
    P: 1,
    V: 22.414,
    n: null,
    T: 273.15,
    pressureUnit: "atm",
    volumeUnit: "L",
    tempUnit: "K",
  });
  approx(r.n, 1.0, 1e-3, "PV=nRT n");
}

// --- Thermo ---
{
  const dH = enthalpyFromFormation([
    { role: "reactant", moles: 1, deltaHf: -74.8 },
    { role: "product", moles: 1, deltaHf: -393.5 },
    { role: "product", moles: 2, deltaHf: -241.8 },
  ]);
  approx(dH, -802.3, 0.2, "CH4 combustion ΔH");
}

// --- Kinetics ---
{
  const r = solveKinetics({ order: 1, k: 0.001, c0: 1, t: 600, solveFor: "c" });
  approx(r.c!, Math.exp(-0.6), 1e-6, "1st order [A]");
}

// --- Nernst ---
{
  const r = calculateNernst({ E0: 1.1, n: 2, Q: 0.01, temperatureC: 25 });
  approx(r.E, 1.1 - (0.05916 / 2) * Math.log10(0.01), 1e-6, "Nernst Cu-Zn");
}
{
  const r = calculateNernst({ E0: 1.1, n: 2, Q: 10, temperatureC: 25 });
  approx(r.E, 1.07042, 1e-5, "Nernst Daniell Q = 10");
}

// --- Equilibrium A ⇌ B, K=4, A0=1 ---
{
  const r = solveEquilibrium(
    [
      { id: "1", label: "A", coefficient: 1, role: "reactant", initial: 1 },
      { id: "2", label: "B", coefficient: 1, role: "product", initial: 0 },
    ],
    4,
  );
  const A = r.species.find((s) => s.label === "A")!.equilibrium;
  const B = r.species.find((s) => s.label === "B")!.equilibrium;
  approx(A, 0.2, 1e-4, "eq A");
  approx(B, 0.8, 1e-4, "eq B");
}
// With A initially absent, Q = [B]/[A] is infinite and the net reaction is reverse.
{
  const r = solveEquilibrium(
    [
      { id: "1", label: "A", coefficient: 1, role: "reactant", initial: 0 },
      { id: "2", label: "B", coefficient: 1, role: "product", initial: 1 },
    ],
    4,
  );
  eq(r.direction, "reverse", "eq reverse direction from infinite Q");
  approx(
    r.species.find((s) => s.label === "A")!.equilibrium,
    0.2,
    1e-4,
    "eq reverse A",
  );
}

// Haber-ish: N2 + 3H2 ⇌ 2NH3 with high K direction check
{
  const r = solveEquilibrium(
    [
      { id: "1", label: "N2", coefficient: 1, role: "reactant", initial: 1 },
      { id: "2", label: "H2", coefficient: 3, role: "reactant", initial: 3 },
      { id: "3", label: "NH3", coefficient: 2, role: "product", initial: 0 },
    ],
    0.5,
  );
  if (r.direction !== "forward") {
    console.error(`FAIL haber direction: ${r.direction}`);
    failed += 1;
  } else console.log(`OK   haber direction: ${r.direction}`);
  if (!(r.x > 0)) {
    console.error(`FAIL haber extent: ${r.x}`);
    failed += 1;
  } else console.log(`OK   haber extent: ${r.x}`);
}

// --- Linear system ---
{
  const r = solveLinearSystem(
    [
      [2, 1],
      [1, -1],
    ],
    [5, 1],
  );
  eq(r.kind, "unique", "linear unique kind");
  approx(r.solution![0], 2, 1e-8, "linear x");
  approx(r.solution![1], 1, 1e-8, "linear y");
}
{
  const r = solveLinearSystem(
    [
      [1, 2],
      [2, 4],
    ],
    [3, 6],
  );
  eq(r.kind, "infinite", "linear infinite kind");
  const basis = r.parametric!.nullspace[0];
  approx(basis[0] + 2 * basis[1], 0, 1e-10, "linear nullspace basis row 1");
  approx(2 * basis[0] + 4 * basis[1], 0, 1e-10, "linear nullspace basis row 2");
}
{
  const r = solveLinearSystem(
    [
      [1, 2],
      [2, 4],
    ],
    [3, 7],
  );
  eq(r.kind, "none", "linear none kind");
}
approx(
  determinant([
    [1, 2],
    [3, 4],
  ]),
  -2,
  1e-9,
  "det 2x2",
);
{
  const A = [
    [1e-8, 0],
    [0, 1e-8],
  ];
  const r = solveLinearSystem(A, [1e-8, 2e-8]);
  eq(r.kind, "unique", "small-scale nonsingular system");
  approx(r.solution![0], 1, 1e-8, "small-scale linear x");
  approx(r.solution![1], 2, 1e-8, "small-scale linear y");
  approx(determinant(A), 1e-16, 1e-28, "small-scale determinant");
  const inv = invertMatrix(A);
  approx(inv![0][0], 1e8, 1e-3, "small-scale inverse");
}

// --- Expression ---
{
  const f = compileExpression("log(100) + ln(e) + sin(pi/2)", []);
  approx(f(), 4, 1e-8, "log/ln/sin");
}
{
  const f = compileExpression("2^10", []);
  approx(f(), 1024, 1e-9, "power");
}
{
  const f = compileExpression("x^2 + 1", ["x"]);
  approx(f(3), 10, 1e-9, "poly x");
}
{
  const f = compileExpression("-2^2 + 2^-2", []);
  approx(f(), -3.75, 1e-9, "unary minus power precedence");
}
{
  const f = compileExpression("2^3^2", []);
  approx(f(), 512, 1e-9, "right-associative power");
}

// --- Phase portrait RK4 circular field ---
{
  const field = compileVectorField("-y", "x");
  const next = rk4Step(field, { x: 1, y: 0 }, 0.01);
  // Exact solution rotates; after small step y ≈ +0.01, x ≈ 1
  approx(next.x, Math.cos(0.01), 1e-5, "rk4 x");
  approx(next.y, Math.sin(0.01), 1e-5, "rk4 y");
}
{
  const predator = compileVectorField("x*(1-y)", "y*(x-1)");
  const v = predator(2, 0.5);
  approx(v.x, 1, 1e-12, "Lotka-Volterra prey sign");
  approx(v.y, 0.5, 1e-12, "Lotka-Volterra predator sign");
  const invalid = compileVectorField("sqrt(-1)", "y");
  if (Number.isFinite(invalid(0, 1).x)) {
    console.error("FAIL phase field domain error is not preserved");
    failed += 1;
  } else console.log("OK   phase field domain error is preserved");
}

// --- Electric field (Coulomb) ---
{
  const K = 8.9875517923e9;
  const q = 1e-9;
  const r = 1;
  const E = (K * q) / (r * r);
  approx(E, 8.9875517923, 1e-9, "E field 1nC at 1m");
}

// --- Projectile convention ---
approx(8 * 1 - (9.8 / 2) * 1 * 1, 3.1, 1e-12, "projectile uses g/2");

// --- Color conversion round-trip sanity ---
{
  const hex = "#336699";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  approx(r, 51, 0, "hex r");
  approx(g, 102, 0, "hex g");
  approx(b, 153, 0, "hex b");
}

// --- % yield (reaction stoichiometry core) ---
{
  // 4 g H2 + 32 g O2 → theoretical 2 mol H2O; 30 g actual ≈ 83.2%
  const mmH2O = parseFormula("H2O").molarMass;
  const theoMoles = 2; // limiting extent 1 * coeff 2
  const actualMoles = molesFromMass(30, mmH2O);
  const pct = (actualMoles / theoMoles) * 100;
  approx(pct, 83.24, 0.2, "percent yield H2O example");
}

// --- Solve for K + Kc↔Kp ---
{
  const computed = computeKFromEquilibrium(
    [
      { id: "1", label: "A", coefficient: 1, role: "reactant", initial: 0.2 },
      { id: "2", label: "B", coefficient: 1, role: "product", initial: 0.8 },
    ],
    "Kc",
  );
  approx(computed.K, 4, 1e-10, "K from equilibrium amounts");
}
{
  // Haber gases: Δn = 2 - (1+3) = -2
  const species = [
    { id: "1", label: "N2", coefficient: 1, role: "reactant" as const, initial: 1 },
    { id: "2", label: "H2", coefficient: 3, role: "reactant" as const, initial: 3 },
    { id: "3", label: "NH3", coefficient: 2, role: "product" as const, initial: 0 },
  ];
  approx(gasDeltaN(species), -2, 1e-12, "Haber Δn");
  const Kc = 0.06;
  const T = 298.15;
  const Kp = convertKcKp(Kc, "Kc", -2, T);
  const back = convertKcKp(Kp, "Kp", -2, T);
  approx(back, Kc, 1e-10, "Kc↔Kp roundtrip");
}

// --- Phase equilibria classification ---
{
  const saddle = findEquilibria(compileVectorField("x", "-y"), {
    xMin: -3,
    xMax: 3,
    yMin: -3,
    yMax: 3,
  });
  const origin = saddle.find((p) => Math.hypot(p.x, p.y) < 0.05);
  if (!origin || origin.classification !== "saddle") {
    console.error("FAIL saddle classification", origin);
    failed += 1;
  } else console.log("OK   saddle classification:", origin.classification);
}
{
  const center = findEquilibria(compileVectorField("-y", "x"), {
    xMin: -3,
    xMax: 3,
    yMin: -3,
    yMax: 3,
  });
  const origin = center.find((p) => Math.hypot(p.x, p.y) < 0.05);
  if (!origin || origin.classification !== "center") {
    console.error("FAIL center classification", origin);
    failed += 1;
  } else console.log("OK   center classification:", origin.classification);
}

// --- HTML file executor split ---
{
  const parsed = parseHtmlFile(`<!DOCTYPE html>
<html><head><style>h1{color:red}</style></head>
<body><h1>Hi</h1><script>console.log(1)</script></body></html>`);
  eq(parsed.html, "<h1>Hi</h1>", "html file body");
  eq(parsed.css, "h1{color:red}", "html file css");
  eq(parsed.js, "console.log(1)", "html file js");
}
{
  const parsed = parseHtmlFile(`<div>fragment</div>`);
  eq(parsed.html, "<div>fragment</div>", "html fragment stays in html");
  eq(parsed.css, "", "html fragment no css");
}
{
  const parsed = parseHtmlFile(
    `<html><body><p>x</p><script src="https://cdn.example/app.js"></script></body></html>`,
  );
  if (!parsed.html.includes('src="https://cdn.example/app.js"')) {
    console.error("FAIL html file keeps external script tag");
    failed += 1;
  } else console.log("OK   html file keeps external script tag");
}
if (!looksLikeFullHtmlDocument("<!DOCTYPE html><html></html>")) {
  console.error("FAIL looksLikeFullHtmlDocument");
  failed += 1;
} else console.log("OK   looksLikeFullHtmlDocument");

eq(kspStoichiometryLabel("AB"), "Ksp = s²", "Ksp label AB");
eq(kspStoichiometryLabel("A3B2"), "Ksp = 108s⁵", "Ksp label A3B2");

// --- Phase presets compile ---
for (const preset of PHASE_PRESETS) {
  try {
    const field = compileVectorField(preset.fx, preset.fy);
    const v = field(0.2, 0.3);
    if (!Number.isFinite(v.x) || !Number.isFinite(v.y)) {
      console.error(`FAIL phase preset ${preset.id} non-finite at (0.2,0.3)`, v);
      failed += 1;
    } else console.log(`OK   phase preset ${preset.id}`);
  } catch (err) {
    console.error(`FAIL phase preset ${preset.id}`, err);
    failed += 1;
  }
}
{
  const node = findEquilibria(compileVectorField("-x", "-2*y"), {
    xMin: -3,
    xMax: 3,
    yMin: -3,
    yMax: 3,
  });
  const origin = node.find((p) => Math.hypot(p.x, p.y) < 0.05);
  if (!origin || !origin.classification.includes("sink")) {
    console.error("FAIL node-sink classification", origin);
    failed += 1;
  } else console.log("OK   node-sink classification:", origin.classification);
}

eq(
  getGuideBySlug("physicsgre")?.title ?? "",
  "Physics GRE Equation Sheet",
  "physics gre equation sheet title",
);
eq(
  getGuideBySlug("chemistry-formulas")?.title ?? "",
  "Chemistry Formula Sheet",
  "chemistry formula sheet title",
);
eq(
  getGuideBySlug("chemistry-formulas")?.href ?? "",
  "/guides/chemistry-formulas",
  "chemistry formula sheet href",
);
eq(
  getToolBySlug("htmlexecutor")?.title ?? "",
  "HTML Executor",
  "html executor H1 still locked",
);

// --- Search-locked titles (GSC page 1–2; do not rename) ---
for (const [slug, locked] of Object.entries(SEARCH_LOCKED_PAGES)) {
  const tool = getToolBySlug(slug);
  eq(tool?.title ?? "", locked.title, `locked title ${slug}`);
  eq(tool?.href ?? "", locked.href, `locked href ${slug}`);
  eq(tool?.slug ?? "", slug, `locked slug ${slug}`);
}

console.log(failed === 0 ? "\nALL PASSED" : `\n${failed} FAILURES`);
process.exit(failed === 0 ? 0 : 1);
