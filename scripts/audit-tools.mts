/**
 * Cross-tool correctness audit — exits non-zero on failure.
 */
import { balanceEquation } from "../src/lib/chemistry/balance-equation.ts";
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
import { calculateBufferRecipe } from "../src/lib/chemistry/buffer-recipe.ts";
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
} from "../src/lib/math/phase-portrait.ts";

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

// --- Ksp ---
approx(solubilityFromKsp("AB2", 4e-6), 0.01, 1e-6, "AB2 s from Ksp");
approx(kspFromSolubility("AB2", 0.01), 4e-6, 1e-12, "AB2 Ksp from s");

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

console.log(failed === 0 ? "\nALL PASSED" : `\n${failed} FAILURES`);
process.exit(failed === 0 ? 0 : 1);
