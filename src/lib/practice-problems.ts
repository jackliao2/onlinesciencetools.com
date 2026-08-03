export interface PracticeProblem {
  title: string;
  prompt: string;
  steps: string[];
  answer: string;
}

export const practiceProblemsBySlug: Record<string, PracticeProblem[]> = {
  stoichiometrycalculator: [
    {
      title: "Molar mass of H₂SO₄",
      prompt:
        "Calculate the molar mass of sulfuric acid, H₂SO₄. Then find how many moles are in 49.04 g of H₂SO₄.",
      steps: [
        "Atomic masses: H = 1.00794, S = 32.065, O = 15.9994.",
        "M = 2(1.00794) + 32.065 + 4(15.9994) = 98.07856 g/mol ≈ 98.079 g/mol.",
        "n = m / M = 49.04 / 98.079 ≈ 0.5000 mol.",
      ],
      answer: "M ≈ 98.079 g/mol; n ≈ 0.500 mol",
    },
    {
      title: "Particles in a water sample",
      prompt:
        "How many molecules are in 18.015 g of H₂O? Use Nₐ = 6.022 × 10²³.",
      steps: [
        "Molar mass of H₂O ≈ 18.015 g/mol, so 18.015 g is 1.000 mol.",
        "N = n × Nₐ = 1.000 × 6.022 × 10²³.",
      ],
      answer: "N ≈ 6.022 × 10²³ molecules",
    },
    {
      title: "Mass percent composition",
      prompt:
        "For glucose C₆H₁₂O₆ (M ≈ 180.16 g/mol), what is the mass percent of oxygen?",
      steps: [
        "Oxygen contribution = 6 × 15.9994 = 95.9964 g/mol.",
        "%O = (95.9964 / 180.16) × 100% ≈ 53.28%.",
      ],
      answer: "%O ≈ 53.3%",
    },
    {
      title: "Hydrate molar mass",
      prompt: "Find the molar mass of CuSO₄·5H₂O.",
      steps: [
        "CuSO₄ ≈ 63.546 + 32.065 + 4(15.9994) = 159.609 g/mol.",
        "5H₂O ≈ 5 × 18.015 = 90.075 g/mol.",
        "Total M ≈ 249.68 g/mol.",
      ],
      answer: "M ≈ 249.68 g/mol",
    },
  ],

  equilibriumcalculator: [
    {
      title: "Kc for the Haber reaction",
      prompt:
        "For N₂ + 3H₂ ⇌ 2NH₃ at equilibrium, [N₂] = 0.40 M, [H₂] = 1.20 M, [NH₃] = 0.20 M. Calculate Kc.",
      steps: [
        "Kc = [NH₃]² / ([N₂][H₂]³).",
        "Numerator = (0.20)² = 0.040.",
        "Denominator = (0.40)(1.20)³ = (0.40)(1.728) = 0.6912.",
        "Kc = 0.040 / 0.6912 ≈ 0.0579.",
      ],
      answer: "Kc ≈ 0.0579",
    },
    {
      title: "Compare Q and K",
      prompt:
        "A mixture has Q = 0.010 for a reaction with Kc = 0.060. In which direction does the net reaction proceed?",
      steps: [
        "Compare Q with K: 0.010 < 0.060.",
        "When Q < K, products are too low relative to equilibrium.",
        "Net reaction proceeds forward (reactants → products) until Q = K.",
      ],
      answer: "Forward (toward products)",
    },
    {
      title: "ICE table for A ⇌ 2B",
      prompt:
        "Start with [A]₀ = 1.00 M, [B]₀ = 0, and Kc = 0.36. Find equilibrium concentrations.",
      steps: [
        "ICE: A: 1.00 − x; B: 0 + 2x.",
        "Kc = (2x)² / (1 − x) = 0.36 ⇒ 4x² = 0.36(1 − x).",
        "4x² + 0.36x − 0.36 = 0 ⇒ x = [−0.36 + √(0.1296 + 5.76)] / 8 ≈ 0.258.",
        "[A]eq ≈ 0.742 M; [B]eq ≈ 0.517 M. Check: (0.517)² / 0.742 ≈ 0.36.",
      ],
      answer: "[A] ≈ 0.742 M, [B] ≈ 0.517 M",
    },
    {
      title: "Kp vs Kc",
      prompt:
        "For N₂ + 3H₂ ⇌ 2NH₃, Δn = −2. If Kc = 0.060 at 500 K, estimate Kp using R = 0.0821 L·atm/(mol·K).",
      steps: [
        "Kp = Kc(RT)^Δn.",
        "RT = (0.0821)(500) = 41.05.",
        "Kp = 0.060 / (41.05)² ≈ 0.060 / 1685 ≈ 3.56 × 10⁻⁵.",
      ],
      answer: "Kp ≈ 3.6 × 10⁻⁵",
    },
  ],

  reactionstoichiometrycalculator: [
    {
      title: "Limiting reagent",
      prompt:
        "For 2H₂ + O₂ → 2H₂O, you start with 4.0 mol H₂ and 1.0 mol O₂. Which reactant limits? How much H₂O forms?",
      steps: [
        "Needed O₂ for 4.0 mol H₂ = 2.0 mol; only 1.0 mol O₂ is available → O₂ limits.",
        "From O₂: n(H₂O) = 2 × 1.0 = 2.0 mol.",
        "H₂ leftover = 4.0 − 2(1.0) = 2.0 mol.",
      ],
      answer: "Limiting: O₂; H₂O = 2.0 mol",
    },
    {
      title: "Theoretical yield in grams",
      prompt:
        "Burn 10.0 g CH₄ (M = 16.04) in excess O₂ via CH₄ + 2O₂ → CO₂ + 2H₂O. What is the theoretical mass of CO₂ (M = 44.01)?",
      steps: [
        "n(CH₄) = 10.0 / 16.04 ≈ 0.623 mol.",
        "Mole ratio 1:1 ⇒ n(CO₂) ≈ 0.623 mol.",
        "m(CO₂) = 0.623 × 44.01 ≈ 27.4 g.",
      ],
      answer: "≈ 27.4 g CO₂",
    },
    {
      title: "Percent yield",
      prompt:
        "If the theoretical yield of a product is 12.0 g and you isolate 9.6 g, what is the percent yield?",
      steps: [
        "% yield = (actual / theoretical) × 100%.",
        "% yield = (9.6 / 12.0) × 100% = 80%.",
      ],
      answer: "80%",
    },
  ],

  balanceequation: [
    {
      title: "Balance combustion of ethane",
      prompt: "Balance: C₂H₆ + O₂ → CO₂ + H₂O.",
      steps: [
        "Carbon: put 2 CO₂.",
        "Hydrogen: 6 H ⇒ 3 H₂O.",
        "Oxygen: right side has 4 + 3 = 7 O atoms ⇒ (7/2) O₂; multiply all by 2.",
        "Result: 2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O.",
      ],
      answer: "2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O",
    },
    {
      title: "Balance iron oxidation",
      prompt: "Balance: Fe + O₂ → Fe₂O₃.",
      steps: [
        "Put 2 Fe on left to match Fe₂O₃ iron count, then scale oxygen.",
        "Standard integer solution: 4Fe + 3O₂ → 2Fe₂O₃.",
      ],
      answer: "4Fe + 3O₂ → 2Fe₂O₃",
    },
    {
      title: "Polyatomic species",
      prompt: "Balance: AgNO₃ + CaCl₂ → AgCl + Ca(NO₃)₂.",
      steps: [
        "NO₃ and Cl transfer as groups.",
        "2AgNO₃ + CaCl₂ → 2AgCl + Ca(NO₃)₂.",
      ],
      answer: "2AgNO₃ + CaCl₂ → 2AgCl + Ca(NO₃)₂",
    },
  ],

  phaseportrait: [
    {
      title: "Classify a linear system",
      prompt:
        "For ẋ = −x, ẏ = −2y, what is the phase portrait near the origin?",
      steps: [
        "Both eigenvalues are negative (−1 and −2).",
        "Trajectories approach the origin → stable node (sink).",
        "Motion is faster along the steeper eigendirection (y-axis).",
      ],
      answer: "Stable node / sink at (0,0)",
    },
    {
      title: "Saddle intuition",
      prompt: "Why does ẋ = x, ẏ = −y produce a saddle?",
      steps: [
        "x grows exponentially (unstable), y decays (stable).",
        "Most trajectories approach then leave along the unstable manifold.",
      ],
      answer: "One stable + one unstable direction ⇒ saddle",
    },
    {
      title: "Limit cycle (Van der Pol)",
      prompt:
        "In the Van der Pol oscillator, why do trajectories from different starts often look similar after a long time?",
      steps: [
        "A stable limit cycle attracts nearby orbits.",
        "Transients die out; long-term motion is periodic on the cycle.",
      ],
      answer: "They converge to the same stable limit cycle",
    },
  ],

  graphingcalculator: [
    {
      title: "Find extrema of a parabola",
      prompt: "For f(x) = x² − 4x + 1 on [−1, 5], where is the minimum?",
      steps: [
        "Vertex of ax²+bx+c is at x = −b/(2a) = 4/2 = 2.",
        "f(2) = 4 − 8 + 1 = −3.",
        "Endpoints: f(−1)=6, f(5)=6 → global min at x=2.",
      ],
      answer: "Minimum at (2, −3)",
    },
    {
      title: "Zeros of a sine wave",
      prompt: "Where does y = sin(x) cross zero on [0, 2π]?",
      steps: [
        "sin(x)=0 at integer multiples of π.",
        "In [0, 2π]: x = 0, π, 2π.",
      ],
      answer: "x = 0, π, 2π",
    },
    {
      title: "Compare growth",
      prompt: "Which grows faster for large x: y = x² or y = 2ˣ?",
      steps: [
        "Polynomial vs exponential: exponential dominates.",
        "For large x, 2ˣ ≫ x².",
      ],
      answer: "y = 2ˣ grows faster",
    },
  ],

  timegraphing: [
    {
      title: "Traveling wave",
      prompt: "Describe y = sin(x − 2t) as t increases.",
      steps: [
        "Form is f(x − vt) with v = 2.",
        "The profile shifts to the right at speed 2.",
      ],
      answer: "Rightward traveling wave, speed 2",
    },
    {
      title: "Projectile parametric path",
      prompt: "For x = 4t, y = 8t − 4.9t², when does the projectile land (y=0, t>0)?",
      steps: [
        "8t − 4.9t² = 0 ⇒ t(8 − 4.9t)=0.",
        "t = 8/4.9 ≈ 1.63 s.",
        "Range x = 4t ≈ 6.53.",
      ],
      answer: "t ≈ 1.63 s, range ≈ 6.53",
    },
    {
      title: "Circular motion",
      prompt: "Show that x=cos(t), y=sin(t) traces the unit circle.",
      steps: [
        "x² + y² = cos²t + sin²t = 1.",
        "As t increases, the point moves counterclockwise with period 2π.",
      ],
      answer: "Unit circle, period 2π",
    },
  ],

  linearequations: [
    {
      title: "2×2 unique solution",
      prompt: "Solve: 2x + y = 5; x − y = 1.",
      steps: [
        "Add equations: 3x = 6 ⇒ x = 2.",
        "From x − y = 1: 2 − y = 1 ⇒ y = 1.",
      ],
      answer: "(x, y) = (2, 1)",
    },
    {
      title: "No solution",
      prompt: "Do x + y = 2 and 2x + 2y = 5 have a solution?",
      steps: [
        "Second equation is twice the first but 4 ≠ 5.",
        "Parallel inconsistent lines ⇒ no solution.",
      ],
      answer: "No solution (inconsistent)",
    },
    {
      title: "3×3 sketch",
      prompt: "For a 3×3 system, what does a zero row with nonzero right-hand side mean after elimination?",
      steps: [
        "It produces 0 = c with c ≠ 0.",
        "The system is inconsistent — no solution.",
      ],
      answer: "Inconsistent system",
    },
  ],

  binarycalculator: [
    {
      title: "Binary to decimal",
      prompt: "Convert 1101₂ to decimal.",
      steps: [
        "1·8 + 1·4 + 0·2 + 1·1 = 13.",
      ],
      answer: "13₁₀",
    },
    {
      title: "Hex and binary",
      prompt: "Convert A3₁₆ to binary.",
      steps: [
        "A₁₆ = 1010₂, 3₁₆ = 0011₂.",
        "A3₁₆ = 10100011₂.",
      ],
      answer: "10100011₂",
    },
    {
      title: "Binary addition",
      prompt: "Compute 1011₂ + 110₂.",
      steps: [
        "Align: 1011 + 0110.",
        "Sum = 10001₂ = 17₁₀.",
      ],
      answer: "10001₂",
    },
  ],

  colorpicker: [
    {
      title: "HEX to RGB",
      prompt: "Convert #0F766E to RGB.",
      steps: [
        "0F₁₆ = 15, 76₁₆ = 118, 6E₁₆ = 110.",
        "RGB = (15, 118, 110).",
      ],
      answer: "rgb(15, 118, 110)",
    },
    {
      title: "RGB to HEX",
      prompt: "Convert rgb(37, 99, 235) to HEX.",
      steps: [
        "25₁₆, 63₁₆, EB₁₆.",
        "Result #2563EB.",
      ],
      answer: "#2563EB",
    },
    {
      title: "Relative luminance idea",
      prompt: "Why might white text fail on #F8FAFC?",
      steps: [
        "Background is near-white (high luminance).",
        "White-on-white contrast is too low for accessibility.",
      ],
      answer: "Insufficient contrast — use a dark foreground",
    },
  ],

  compositioncalculator: [
    {
      title: "Percent oxygen in water",
      prompt: "What is the mass percent of oxygen in H₂O?",
      steps: [
        "M(H₂O) ≈ 18.015 g/mol; O contributes ≈ 15.999 g/mol.",
        "%O ≈ (15.999/18.015)×100% ≈ 88.81%.",
      ],
      answer: "%O ≈ 88.8%",
    },
    {
      title: "Empirical formula",
      prompt: "A compound is 40.0% C, 6.7% H, 53.3% O. Find the empirical formula.",
      steps: [
        "Moles in 100 g: C 3.33, H 6.65, O 3.33 → ratio 1:2:1.",
        "Empirical formula CH₂O.",
      ],
      answer: "CH₂O",
    },
    {
      title: "Molecular formula",
      prompt: "Empirical formula CH₂O has M ≈ 30 g/mol. Molecular mass ≈ 180 g/mol. Molecular formula?",
      steps: [
        "n = 180/30 = 6.",
        "Molecular formula C₆H₁₂O₆.",
      ],
      answer: "C₆H₁₂O₆",
    },
  ],

  kspcalculator: [
    {
      title: "AgCl solubility",
      prompt: "Ksp(AgCl) = 1.8×10⁻¹⁰. Find s in pure water.",
      steps: [
        "AB salt: Ksp = s².",
        "s = √(1.8×10⁻¹⁰) ≈ 1.34×10⁻⁵ mol/L.",
      ],
      answer: "s ≈ 1.34×10⁻⁵ mol/L",
    },
    {
      title: "AB₂ Ksp from s",
      prompt: "If PbCl₂ has s = 0.016 M, estimate Ksp (AB₂).",
      steps: [
        "Ksp = 4s³ = 4(0.016)³ ≈ 1.6×10⁻⁵.",
      ],
      answer: "Ksp ≈ 1.6×10⁻⁵",
    },
    {
      title: "Precipitation check",
      prompt:
        "For AgCl, Ksp = 1.8×10⁻¹⁰. If [Ag⁺] = [Cl⁻] = 1.0×10⁻⁴ M, does a precipitate form?",
      steps: [
        "Q = (1.0×10⁻⁴)² = 1.0×10⁻⁸.",
        "Q > Ksp → precipitate expected.",
      ],
      answer: "Yes (Q > Ksp)",
    },
  ],

  gaslawcalculator: [
    {
      title: "Find n",
      prompt: "P = 1.00 atm, V = 22.4 L, T = 273 K. Find n (R = 0.0821).",
      steps: [
        "n = PV/RT ≈ (1×22.4)/(0.0821×273) ≈ 1.00 mol.",
      ],
      answer: "n ≈ 1.00 mol",
    },
    {
      title: "Celsius to kelvin",
      prompt: "A gas is at 25 °C. What T must you use in PV = nRT?",
      steps: ["T = 25 + 273.15 = 298.15 K."],
      answer: "298.15 K",
    },
    {
      title: "Molar mass from density",
      prompt:
        "A gas has density 1.96 g/L at 1.00 atm and 273 K. Estimate M (R = 0.0821).",
      steps: [
        "M = dRT/P ≈ 1.96×0.0821×273/1 ≈ 44 g/mol.",
      ],
      answer: "M ≈ 44 g/mol",
    },
  ],

  dilutioncalculator: [
    {
      title: "Stock volume for a lab dilution",
      prompt:
        "How many mL of 6.0 M H₂SO₄ are needed to prepare 500. mL of 0.15 M H₂SO₄?",
      steps: [
        "C₁V₁ = C₂V₂ → V₁ = (C₂V₂)/C₁.",
        "V₁ = (0.15 × 500) / 6.0 = 12.5 mL.",
      ],
      answer: "12.5 mL of 6.0 M stock",
    },
    {
      title: "Find final concentration",
      prompt:
        "25.0 mL of 0.80 M NaOH is diluted to 100.0 mL. What is C₂?",
      steps: [
        "C₂ = (C₁V₁)/V₂ = (0.80 × 25.0) / 100.0 = 0.20 M.",
      ],
      answer: "0.20 M",
    },
    {
      title: "Dilution factor",
      prompt:
        "A stock is 2.5 M and the working solution is 0.050 M. What is the dilution factor?",
      steps: [
        "Factor = C₁/C₂ = 2.5 / 0.050 = 50.",
        "Equivalently V₂/V₁ = 50 if volumes are consistent.",
      ],
      answer: "50×",
    },
  ],

  concentrationconverter: [
    {
      title: "Molarity to g/L",
      prompt:
        "What is the mass concentration (g/L) of 0.250 M glucose (C₆H₁₂O₆, M ≈ 180.16 g/mol)?",
      steps: [
        "g/L = M × molar mass = 0.250 × 180.16 ≈ 45.04 g/L.",
      ],
      answer: "≈ 45.0 g/L",
    },
    {
      title: "Mass percent for dilute NaCl",
      prompt:
        "For 0.100 M NaCl (M ≈ 58.44) with density 1.00 g/mL, estimate mass percent.",
      steps: [
        "In 1.00 L: solute ≈ 5.844 g; solution ≈ 1000 g.",
        "Mass % ≈ 0.584%.",
      ],
      answer: "≈ 0.584%",
    },
    {
      title: "Why density matters",
      prompt:
        "Why can’t you convert molarity to mass percent without density (or equivalent mass/volume data)?",
      steps: [
        "Molarity uses liters of solution; mass percent uses mass of solution.",
        "Density links volume to mass.",
      ],
      answer: "Need density (or mass and volume) to connect volume-based and mass-based units",
    },
  ],

  phcalculator: [
    {
      title: "Strong acid pH",
      prompt: "What is the pH of 0.010 M HCl?",
      steps: [
        "Strong acid: [H⁺] ≈ 0.010 M.",
        "pH = −log₁₀(0.010) = 2.00.",
      ],
      answer: "pH = 2.00",
    },
    {
      title: "Weak acid quadratic",
      prompt:
        "Estimate the pH of 0.10 M acetic acid (Ka = 1.8×10⁻⁵).",
      steps: [
        "x ≈ √(Ka C) = √(1.8×10⁻⁶) ≈ 1.34×10⁻³ (shortcut).",
        "Quadratic gives x ≈ 1.33×10⁻³; pH ≈ 2.88.",
      ],
      answer: "pH ≈ 2.88",
    },
    {
      title: "Buffer pH",
      prompt:
        "A buffer has [HA] = 0.10 M and [A⁻] = 0.10 M with Ka = 1.8×10⁻⁵. Find pH.",
      steps: [
        "pKa = 4.74.",
        "pH = pKa + log([A⁻]/[HA]) = 4.74 + log(1) = 4.74.",
      ],
      answer: "pH ≈ 4.74",
    },
  ],

  htmlexecutor: [
    {
      title: "Minimal page shell",
      prompt: "What three sections belong in a basic HTML document head/body setup for a sandbox demo?",
      steps: [
        "HTML structure (markup).",
        "CSS for presentation.",
        "JS for behavior, loaded after the DOM nodes it targets.",
      ],
      answer: "HTML + CSS + JS",
    },
    {
      title: "Why sandbox?",
      prompt: "Why run user JS in a sandboxed iframe?",
      steps: [
        "Isolates scripts from the parent origin.",
        "Prevents accidental access to cookies/storage of the host site.",
      ],
      answer: "Security isolation from the parent page",
    },
    {
      title: "CSS specificity quick check",
      prompt: "Between `#app p` and `.note`, which usually wins if both match?",
      steps: [
        "ID selectors outrank classes.",
        "`#app p` is more specific than `.note`.",
      ],
      answer: "#app p wins (higher specificity)",
    },
  ],
};

export function getPracticeProblems(slug: string): PracticeProblem[] {
  return practiceProblemsBySlug[slug] ?? [];
}
