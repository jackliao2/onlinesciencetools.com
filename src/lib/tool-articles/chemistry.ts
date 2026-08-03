import type { ToolArticleContent } from "./types";

export const chemistryArticles: ToolArticleContent[] = [
  {
    slug: "stoichiometrycalculator",
    whatIs: {
      paragraphs: [
        "Stoichiometry is the branch of chemistry that relates the amounts of reactants and products in a chemical reaction through balanced equations and molar relationships. At its foundation lies the mole concept: chemists count particles in units of moles because individual atoms and molecules are far too numerous to tally directly. One mole contains exactly 6.02214076 × 10²³ entities, a quantity known as Avogadro's number.",
        "Before any stoichiometric calculation can proceed, you must know the molar mass of each substance involved. Molar mass is the mass of one mole of a compound, expressed in grams per mole (g/mol). It is computed by summing the atomic masses of every atom in the chemical formula, weighted by subscripts. For example, water (H₂O) has a molar mass of approximately 18.015 g/mol because two hydrogen atoms (1.008 g/mol each) plus one oxygen atom (15.999 g/mol) combine to that total.",
        "In general chemistry laboratories, stoichiometry governs how much reagent to weigh out, how to prepare solutions of known concentration, and how to interpret analytical results. A student preparing 250 mL of 0.100 M NaCl must first convert volume to liters, multiply by molarity to find moles of solute, then multiply moles by the molar mass of NaCl (58.44 g/mol) to determine the required mass. Without accurate molar mass values, every subsequent calculation in the experiment becomes unreliable.",
        "Stoichiometry also appears throughout homework sets involving mass-percent composition, empirical formulas, and mole-to-mole conversions from balanced equations. When a problem asks what mass of oxygen is produced from 10.0 g of potassium chlorate, the workflow begins with molar mass, proceeds through mole ratios from the balanced equation, and ends with a mass conversion. The Stoichiometry Calculator on Online Science Tools automates the molar mass step so you can focus on the logical chain of conversions rather than arithmetic errors in atomic mass lookups.",
        "Beyond introductory courses, stoichiometry underpins quantitative analysis, environmental chemistry, and materials science. Whether you are determining the formula of an unknown compound from combustion data or scaling a synthesis from milligram to kilogram quantities, the same mass–mole–particle relationships apply. Mastering these conversions builds the quantitative reasoning that distinguishes chemistry from descriptive science.",
      ],
      bullets: [
        "Molar mass (M) links grams to moles: n = m / M",
        "Avogadro's number converts moles to particle count: N = n × Nₐ",
        "Mass percent shows each element's fractional contribution to a compound's total mass",
        "Balanced equations provide mole ratios between reactants and products",
      ],
    },
    formula: {
      intro:
        "The core stoichiometric relationships connect mass, moles, and particle count through molar mass and Avogadro's number. For a compound with formula unit X, the molar mass is the weighted sum of constituent atomic masses.",
      blocks: [
        `M = Σ (nᵢ × Aᵢ)

where:
  M   = molar mass (g/mol)
  nᵢ  = number of atoms of element i in the formula
  Aᵢ  = standard atomic mass of element i (g/mol)

Mass ↔ moles:
  n = m / M          (moles from mass)
  m = n × M          (mass from moles)

Moles ↔ particles:
  N = n × Nₐ
  Nₐ = 6.02214076 × 10²³ mol⁻¹

Mass percent of element i:
  % mass(i) = (nᵢ × Aᵢ / M) × 100%`,
      ],
      notes: [
        "Subscripts in a formula multiply the atomic mass of the preceding element or group.",
        "Parentheses indicate polyatomic groups whose total count is multiplied by the outside subscript.",
        "Hydrates are written with a dot separator (e.g., CuSO₄·5H₂O) and each part contributes to molar mass independently.",
      ],
    },
    example: {
      title: "Molar Mass and Mole Conversion for Sulfuric Acid",
      scenario:
        "A student needs to prepare a solution using 49.0 g of sulfuric acid (H₂SO₄). Determine the molar mass of H₂SO₄ and convert the given mass to moles.",
      steps: [
        "Identify the formula: H₂SO₄ contains 2 hydrogen, 1 sulfur, and 4 oxygen atoms.",
        "Look up atomic masses: H = 1.008, S = 32.06, O = 15.999 g/mol.",
        "Calculate molar mass: M = 2(1.008) + 32.06 + 4(15.999) = 2.016 + 32.06 + 63.996 = 98.072 g/mol.",
        "Convert mass to moles: n = m / M = 49.0 g / 98.072 g/mol = 0.4996 mol ≈ 0.500 mol.",
        "Verify mass percent: H contributes (2.016/98.072) × 100 = 2.06%, S contributes 32.68%, O contributes 65.26%.",
      ],
      toolCheck:
        "Open the Stoichiometry Calculator on Online Science Tools, enter H2SO4 as the formula, and confirm the molar mass reads approximately 98.07 g/mol with the elemental breakdown matching your hand calculation. Then enter 49.0 g in the mass field to verify the tool reports about 0.500 mol. If you are continuing to a reaction problem, use the Chemistry Equation Balancer to obtain coefficients and the Reaction Stoichiometry Calculator for limiting reagent analysis.",
    },
    faq: [
      {
        question: "How do I convert grams to moles with the molar mass formula?",
        answer:
          "Use n = m / M. Enter the formula to get M (g/mol), enter the mass in grams, and read moles. The reverse is m = n × M. Particle count follows N = n × Nₐ with Avogadro’s number 6.02214076 × 10²³ mol⁻¹. That grams-to-moles conversion is the core of most stoichiometry calculator workflows for a single compound.",
      },
      {
        question: "Why do I need molar mass before doing any stoichiometry problem?",
        answer:
          "Stoichiometry problems almost always require you to work in moles because balanced chemical equations express ratios in moles, not grams. Molar mass is the conversion factor that bridges the mass you can measure on a balance with the mole quantities that appear in the equation. Without it, you cannot move from a weighed sample to the mole ratio needed to find product yields or remaining reactants.",
      },
      {
        question: "How do I enter hydrates and parentheses in a chemical formula?",
        answer:
          "Hydrates are written with a dot or middle dot between the anhydrous compound and the water molecules, such as CuSO4·5H2O or CuSO4.5H2O. The Stoichiometry Calculator treats each segment independently and sums their molar masses. For grouped atoms like calcium hydroxide, write Ca(OH)2—the parentheses ensure both oxygen and hydrogen are multiplied by two before the masses are added.",
      },
      {
        question: "What is the difference between molar mass and molecular mass?",
        answer:
          "Molecular mass refers to the mass of a single molecule in atomic mass units (u), while molar mass is the mass of one mole of that substance in grams per mole. Numerically they are the same value when atomic masses are expressed in u, but molar mass carries the unit g/mol needed for stoichiometric calculations. For ionic compounds like NaCl, the term 'formula mass' is often used instead of molecular mass, but molar mass applies universally.",
      },
      {
        question: "Can I use the Stoichiometry Calculator for mass-percent composition problems?",
        answer:
          "Yes. Once you enter a formula, the calculator displays each element's contribution to the total molar mass as a mass percentage. This is directly useful for empirical formula problems, purity checks, and verifying whether a sample matches an expected composition. Compare the percentages to experimental data from combustion analysis or spectroscopy to confirm your compound identity.",
      },
    ],
  },
  {
    slug: "equilibriumcalculator",
    whatIs: {
      paragraphs: [
        "Chemical equilibrium occurs when a reversible reaction reaches a state where the forward and reverse reaction rates are equal, so macroscopic concentrations and partial pressures no longer change with time. This does not mean the reaction has stopped—molecules continue to react in both directions, but the net change is zero. The equilibrium state is described mathematically by the equilibrium constant K, which relates the concentrations or partial pressures of products and reactants at equilibrium.",
        "For a general reaction aA + bB ⇌ cC + dD, the concentration-based equilibrium constant Kc is defined as the ratio of product concentrations raised to their stoichiometric powers divided by reactant concentrations raised to their powers, each evaluated at equilibrium. A related constant Kp uses partial pressures instead of molar concentrations and applies especially to gas-phase equilibria. The reaction quotient Q has the same mathematical form as K but uses current (not necessarily equilibrium) concentrations, telling you which direction the net reaction will proceed.",
        "The ICE table method—Initial, Change, Equilibrium—is the standard classroom technique for organizing equilibrium algebra. You record initial concentrations, express changes in terms of a single variable x representing the extent of reaction, and write equilibrium expressions. Substituting equilibrium values into the K expression yields an equation in x that you solve to find final concentrations. This method appears on virtually every general chemistry exam covering equilibria.",
        "Equilibrium calculations appear in contexts ranging from acid–base buffer design to industrial Haber process optimization. In the laboratory, students use ICE tables to predict how dilution, temperature change, or addition of a reactant shifts a system according to Le Chatelier's principle. The Equilibrium Calculator on Online Science Tools constructs the ICE table automatically, evaluates Q relative to K, and solves for equilibrium concentrations numerically, letting you verify your handwritten algebra.",
        "Understanding equilibrium is also essential for advanced topics such as solubility product constants (Ksp), formation constants of complex ions, and coupled equilibria in analytical chemistry. The same Q-versus-K logic applies: if Q is less than K, the forward reaction dominates until equilibrium is restored; if Q exceeds K, the reverse reaction proceeds. These principles govern everything from blood CO₂ buffering to the chemistry of ocean acidification.",
      ],
      bullets: [
        "Kc uses molar concentrations; Kp uses partial pressures (atm)",
        "Q < K means net forward reaction; Q > K means net reverse reaction",
        "ICE tables track how each species changes by ±ν·x from initial values",
        "Kp = Kc(RT)^Δn relates the two constants for ideal gases",
      ],
    },
    formula: {
      intro:
        "The equilibrium constant and reaction quotient share the same functional form. For the reaction aA + bB ⇌ cC + dD, concentrations are expressed in mol/L and partial pressures in atm.",
      blocks: [
        `Kc = [C]^c [D]^d / ([A]^a [B]^b)     (at equilibrium)

Q  = [C]^c [D]^d / ([A]^a [B]^b)     (at any instant)

Direction:
  Q < K  →  net forward (→)
  Q > K  →  net reverse (←)
  Q = K  →  at equilibrium

ICE table (extent x):
  A:  [A]₀ − a·x
  B:  [B]₀ − b·x
  C:  [C]₀ + c·x
  D:  [D]₀ + d·x

Kp and Kc relationship (ideal gases):
  Kp = Kc (RT)^Δn
  Δn = (c + d) − (a + b)   (change in gas moles)`,
      ],
      notes: [
        "Pure solids and liquids are omitted from K expressions because their activities are approximately constant.",
        "The extent x must keep all equilibrium concentrations non-negative: 0 ≤ x ≤ [reactant]₀/ν for each limiting reactant.",
        "When K is very large or very small, the small-x or large-x approximation may simplify the algebra before numerical solution.",
      ],
    },
    example: {
      title: "ICE Table for the Haber Equilibrium",
      scenario:
        "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), Kc = 0.50 at a certain temperature. If 1.00 M N₂ and 3.00 M H₂ are mixed with no initial NH₃, find the equilibrium concentrations.",
      steps: [
        "Set up the ICE table with initial values: [N₂]₀ = 1.00, [H₂]₀ = 3.00, [NH₃]₀ = 0 M.",
        "Define changes: N₂ loses x, H₂ loses 3x, NH₃ gains 2x.",
        "Write equilibrium expressions: [N₂] = 1.00 − x, [H₂] = 3.00 − 3x = 3(1 − x), [NH₃] = 2x.",
        "Substitute into Kc: 0.50 = (2x)² / [(1 − x)(3(1 − x))³] = 4x² / [27(1 − x)⁴].",
        "Rearrange: 4x² = 13.5(1 − x)⁴. Solve numerically on 0 ≤ x ≤ 1.",
        "The physical root is x ≈ 0.486 M.",
        "Equilibrium concentrations: [N₂] ≈ 0.514 M, [H₂] ≈ 1.54 M, [NH₃] ≈ 0.972 M.",
      ],
      toolCheck:
        "Enter N2 + 3H2 ⇌ 2NH3 with Kc = 0.50 and initials 1.00 M N₂, 3.00 M H₂, 0 M NH₃ in the Equilibrium Calculator. Initial Q = 0 (Q < K), so the net reaction is forward. Compare the solved equilibrium concentrations with about 0.514, 1.54, and 0.972 M.",
    },
    faq: [
      {
        question: "What is the difference between Kc and Kp?",
        answer:
          "Kc is expressed in terms of molar concentrations (mol/L), while Kp uses partial pressures (typically in atm). They describe the same equilibrium but in different units. For gas-phase reactions involving ideal gases, Kp = Kc(RT)^Δn, where Δn is the change in the number of moles of gas from reactants to products. Use Kc when working with concentration data and Kp when working with pressure data, but never mix units within a single expression.",
      },
      {
        question: "How do I know which direction the reaction will shift?",
        answer:
          "Calculate the reaction quotient Q using the current concentrations and the same formula as K. If Q is less than K, the system has too many reactants relative to products and the net reaction proceeds forward. If Q exceeds K, there are too many products and the net reaction runs in reverse. At equilibrium, Q equals K exactly. Le Chatelier's principle provides a qualitative shortcut: adding reactant or removing product shifts the equilibrium toward products.",
      },
      {
        question: "Why can equilibrium concentrations never be negative?",
        answer:
          "Concentrations are physical quantities representing moles of solute per liter of solution. A negative value has no chemical meaning. When solving the ICE table equation for x, you must reject any root that would make a reactant concentration negative. The valid range for x is bounded by the stoichiometric limit of the scarcest reactant. This constraint is why equilibrium problems sometimes have only one physically meaningful root among several mathematical solutions.",
      },
      {
        question: "Does changing temperature change the equilibrium constant?",
        answer:
          "Yes. Unlike concentration or pressure changes, which alter Q and shift the equilibrium position without changing K, a temperature change modifies K itself. Exothermic reactions have K decrease with increasing temperature; endothermic reactions have K increase. This follows from the van't Hoff equation. In the classroom, you often compare K values at different temperatures rather than applying Le Chatelier's to temperature as if it were a concentration change.",
      },
      {
        question: "When should I use the small-x approximation?",
        answer:
          "Use the small-x approximation when K is very small (≪ 1), so little product forms and x is tiny compared with the initial reactant concentrations. Then you may replace terms like (1.00 − x) with 1.00 to simplify the algebra. Always check afterward that x is under about 5% of the initial concentration; if not, solve the full equation. Large K means the opposite situation — the reaction goes nearly to completion — so small-x is the wrong tool; use the Equilibrium Calculator for a numerical root instead.",
      },
    ],
  },
  {
    slug: "reactionstoichiometrycalculator",
    whatIs: {
      paragraphs: [
        "Reaction stoichiometry extends the mole concept from single compounds to entire balanced chemical equations. Once an equation is balanced, the coefficients serve as mole ratios that connect the amount of any reactant to any product. If 2 mol of hydrogen gas reacts with 1 mol of oxygen to form 2 mol of water, then 5.0 mol of H₂ would require 2.5 mol of O₂ and produce 5.0 mol of H₂O. These proportional relationships are the basis for all yield and limiting reagent calculations.",
        "The limiting reagent is the reactant that is completely consumed first, thereby stopping the reaction and determining the maximum possible product yield. The excess reagent is whatever remains after the limiting reagent is used up. In a problem where you mix 10.0 g of each of two reactants, you must convert each mass to moles, divide by the stoichiometric coefficient, and identify which reactant produces the fewest moles of product—that substance limits the outcome.",
        "Theoretical yield is the maximum mass of product predicted by stoichiometry when the limiting reagent is fully converted. Actual yield, measured in the laboratory, is almost always lower due to side reactions, incomplete conversion, or product loss during isolation. The ratio of actual to theoretical yield, expressed as a percentage, is called the percent yield and serves as a measure of reaction efficiency.",
        "These calculations are central to general chemistry laboratory reports. A student who weighs out reactants, performs a synthesis, and collects a product must compare the collected mass to the theoretical yield to compute percent yield. Errors in identifying the limiting reagent propagate through the entire analysis, so systematic conversion from grams to moles to product moles to product grams is essential. The Reaction Stoichiometry Calculator on Online Science Tools accepts a balanced equation and starting masses or moles, then identifies the limiting reagent and computes theoretical yields automatically.",
        "Beyond the introductory lab, reaction stoichiometry scales to industrial chemical production, where engineers optimize feed ratios to minimize waste and maximize output. Pharmaceutical synthesis, polymer manufacturing, and environmental remediation all rely on the same limiting reagent logic. Pair this tool with the Chemistry Equation Balancer when you need coefficients and with the Stoichiometry Calculator for individual molar mass lookups.",
      ],
      bullets: [
        "Coefficients in a balanced equation are mole ratios, not mass ratios",
        "Limiting reagent: the reactant that yields the smallest amount of product",
        "Theoretical yield: maximum product from complete consumption of the limiting reagent",
        "Percent yield = (actual yield / theoretical yield) × 100%",
      ],
    },
    formula: {
      intro:
        "Given a balanced equation, convert each reactant amount to moles, then use stoichiometric ratios to find the product formed by each reactant. The smallest product amount identifies the limiting reagent.",
      blocks: [
        `Balanced equation:  aA + bB → cC + dD

Moles of reactant i from mass:
  nᵢ = mᵢ / Mᵢ

Moles of product possible from reactant i:
  n_C(i) = nᵢ × (c / a)     (if i = A)
  n_C(i) = nᵢ × (c / b)     (if i = B)

Limiting reagent = reactant with smallest n_C(i)

Theoretical yield (mass):
  m_C = n_C(limiting) × M_C

Percent yield:
  % yield = (m_actual / m_theoretical) × 100%`,
      ],
      notes: [
        "Always balance the equation before applying mole ratios; unbalanced coefficients give incorrect results.",
        "If moles are given directly instead of mass, skip the m/M conversion and proceed to the ratio step.",
        "Excess reagent remaining = initial moles − moles consumed, where moles consumed follows the limiting reagent ratio.",
      ],
    },
    example: {
      title: "Limiting Reagent and Theoretical Yield",
      scenario:
        "Consider the combustion of propane: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. If 44.0 g of C₃H₈ reacts with 160.0 g of O₂, identify the limiting reagent and calculate the theoretical yield of CO₂.",
      steps: [
        "Calculate molar masses: M(C₃H₈) = 44.10 g/mol, M(O₂) = 32.00 g/mol, M(CO₂) = 44.01 g/mol.",
        "Convert reactants to moles: n(C₃H₈) = 44.0 / 44.10 = 0.998 mol; n(O₂) = 160.0 / 32.00 = 5.00 mol.",
        "Moles of CO₂ from C₃H₈: 0.998 × (3/1) = 2.99 mol CO₂.",
        "Moles of CO₂ from O₂: 5.00 × (3/5) = 3.00 mol CO₂.",
        "C₃H₈ produces fewer moles of CO₂ (2.99 < 3.00), so C₃H₈ is the limiting reagent.",
        "Theoretical yield: m(CO₂) = 2.99 mol × 44.01 g/mol = 132 g CO₂.",
        "O₂ remaining: 5.00 − 0.998(5) = 5.00 − 4.99 = 0.01 mol O₂ in excess (essentially fully consumed).",
      ],
      toolCheck:
        "Enter the balanced equation C3H8 + 5O2 -> 3CO2 + 4H2O with 44.0 g C₃H₈ and 160.0 g O₂ into the Reaction Stoichiometry Calculator on Online Science Tools. The tool should identify C₃H₈ as the limiting reagent and report a theoretical CO₂ yield near 132 g. If your equation is not yet balanced, run it through the Chemistry Equation Balancer first, then return to verify molar masses with the Stoichiometry Calculator.",
    },
    faq: [
      {
        question: "How do I identify the limiting reagent quickly?",
        answer:
          "Convert each reactant to moles, then divide each mole amount by its stoichiometric coefficient from the balanced equation. The reactant with the smallest ratio is the limiting reagent. Alternatively, calculate how much product each reactant could form and pick the reactant that gives the least product. Both methods give the same answer; choose whichever feels more natural during an exam.",
      },
      {
        question: "What if the problem gives volumes of gases instead of masses?",
        answer:
          "At the same temperature and pressure, gas volumes are directly proportional to moles (Avogadro's law). You can use volumes in place of moles in the stoichiometric ratio step, provided all gases are measured under identical conditions. If conditions differ, convert each gas to moles using the ideal gas law PV = nRT before applying reaction stoichiometry.",
      },
      {
        question: "Why is my percent yield always less than 100%?",
        answer:
          "Percent yield below 100% is normal in real experiments. Product may be lost during filtration, transfer, or purification. Side reactions consume reactants without forming the desired product. Some reactions do not go to completion. A yield of 60–90% is typical in undergraduate organic chemistry labs. Compare your result to class averages or literature values rather than expecting a perfect 100%.",
      },
      {
        question: "Do I need a balanced equation before using the Reaction Stoichiometry Calculator?",
        answer:
          "Yes. The coefficients determine the mole ratios that drive every calculation. An unbalanced equation gives incorrect limiting reagent and yield results. Use the Chemistry Equation Balancer on Online Science Tools to obtain correct coefficients, then paste the balanced equation into the Reaction Stoichiometry Calculator along with your starting amounts.",
      },
    ],
  },
  {
    slug: "balanceequation",
    whatIs: {
      paragraphs: [
        "A balanced chemical equation obeys the law of conservation of mass: every atom present among the reactants must appear among the products in equal numbers. Balancing is not merely a bookkeeping exercise—it produces the stoichiometric coefficients that govern all subsequent mole-ratio calculations in reaction stoichiometry, equilibrium problems, and thermochemical equations. An unbalanced equation implies atoms are created or destroyed, which violates fundamental physical law.",
        "The standard balancing method in general chemistry is inspection: adjust coefficients in front of compound formulas until each element has the same count on both sides. Start with elements that appear in only one reactant and one product, then move to more complex cases involving polyatomic ions that may transfer intact (such as sulfate or nitrate groups). For redox reactions, the half-reaction method or oxidation-number method provides a systematic approach when inspection becomes unwieldy.",
        "Balanced equations appear in virtually every chemistry context. Combustion analysis requires balancing the burning reaction to relate CO₂ and H₂O produced back to the original compound. Acid–base neutralization, precipitation, and gas-evolution reactions all begin with a correctly balanced equation. In thermochemistry, coefficients scale the enthalpy change: if ΔH for forming 1 mol of product is known, doubling the coefficient doubles the enthalpy.",
        "Students frequently struggle with balancing because they attempt to change subscripts within formulas rather than adjusting coefficients. The subscripts in H₂O, for instance, define water's identity and must never be altered—only the coefficient in front may change. The Chemistry Equation Balancer on Online Science Tools is a free chemistry equation balancer that applies algorithmic balancing to valid chemical formulas, returns the smallest whole-number coefficients, and shows balancing steps with an atom-check table for practice and homework verification.",
        "Correct balancing is the gateway to the Reaction Stoichiometry Calculator and the Equilibrium Calculator. Without accurate coefficients, limiting reagent predictions and ICE table stoichiometry are wrong from the start. Treat balancing as the first step in any multi-part quantitative chemistry problem, and use our balancer to confirm your handwritten work during homework and exam preparation.",
      ],
      bullets: [
        "Coefficients multiply entire formulas; subscripts within formulas are fixed",
        "Polyatomic ions unchanged on both sides can be balanced as units",
        "Redox equations may require the half-reaction method in acidic or basic medium",
        "The smallest whole-number coefficient set is the convention for balanced equations",
      ],
    },
    formula: {
      intro:
        "Balancing is a constraint satisfaction problem: find integer coefficients cᵢ for each species such that the total atom count of every element is identical on the reactant and product sides.",
      blocks: [
        `General form:
  c₁·(species₁) + c₂·(species₂) + … → c₃·(species₃) + c₄·(species₄) + …

Conservation for each element X:
  Σ (cᵢ × atoms of X in speciesᵢ)_reactants
    = Σ (cⱼ × atoms of X in speciesⱼ)_products

Example:  CH₄ + O₂ → CO₂ + H₂O

  C:  1 = 1           ✓ (already balanced for carbon)
  H:  4 ≠ 2           → need 2·H₂O
  O:  2 ≠ 4           → need 2·O₂

Balanced:  CH₄ + 2O₂ → CO₂ + 2H₂O`,
      ],
      notes: [
        "Fractional coefficients during balancing should be cleared by multiplying the entire equation by the denominator.",
        "For ionic equations in aqueous solution, charge must also balance in addition to atom count.",
        "Combustion of hydrocarbons always produces CO₂ and H₂O; balance C first, then H, then O.",
      ],
    },
    example: {
      title: "Balancing the Combustion of Ethanol",
      scenario:
        "Balance the combustion equation for ethanol: C₂H₅OH + O₂ → CO₂ + H₂O. Verify atom conservation on both sides.",
      steps: [
        "Count atoms on the left: C = 2, H = 6, O = 1 (in ethanol) + O₂.",
        "Balance carbon: place coefficient 2 in front of CO₂ → C₂H₅OH + O₂ → 2CO₂ + H₂O.",
        "Balance hydrogen: 6 H on left needs 3 H₂O → C₂H₅OH + O₂ → 2CO₂ + 3H₂O.",
        "Balance oxygen: right side has 4 + 3 = 7 O; left has 1 + 2×O₂, so 2x = 6, x = 3.",
        "Balanced equation: C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O.",
        "Verify: C: 2 = 2, H: 6 = 6, O: 1 + 6 = 7 and 4 + 3 = 7. All atoms conserved.",
      ],
      toolCheck:
        "Enter C2H5OH + O2 -> CO2 + H2O into the Chemistry Equation Balancer on Online Science Tools. The tool should return coefficients 1, 3, 2, 3 for ethanol, oxygen, carbon dioxide, and water respectively, matching your hand-balanced result. Use these coefficients in the Reaction Stoichiometry Calculator if you need to compute yields, or check individual molar masses with the Stoichiometry Calculator.",
    },
    faq: [
      {
        question: "Is this a balancing chemical equations calculator with steps?",
        answer:
          "Yes. Enter an equation such as C2H6 + O2 = CO2 + H2O and the balancer returns the balanced result, short step notes, and an element-by-element atom inventory so you can practice inspection balancing and check your work.",
      },
      {
        question: "Can I change subscripts to balance an equation?",
        answer:
          "No. Changing a subscript alters the identity of the substance. Writing H₂O as H₂O₂ would mean hydrogen peroxide instead of water. The only permissible changes are coefficients—the numbers placed before a formula that multiply every atom in that formula. If you find yourself wanting to change a subscript, reconsider your product or reactant formulas instead.",
      },
      {
        question: "What if the balancer gives fractional coefficients?",
        answer:
          "The Chemistry Equation Balancer returns the smallest whole-number ratio by default. If you encounter fractions during manual balancing, multiply the entire equation by the least common denominator to clear them. For example, if you obtain C₂H₄ + 3.5O₂ → 2CO₂ + 3H₂O, multiply everything by 2 to get 2C₂H₄ + 7O₂ → 4CO₂ + 6H₂O.",
      },
      {
        question: "How do I balance redox reactions in acidic solution?",
        answer:
          "Split the reaction into oxidation and reduction half-reactions. Balance atoms other than O and H first, then balance O by adding H₂O and H by adding H⁺ (in acidic medium). Balance charge by adding electrons. Multiply each half-reaction so electrons lost equal electrons gained, then add the half-reactions and cancel species appearing on both sides. For a dedicated acidic/basic medium tool with atom and charge checks, use the Redox Equation Balancer.",
      },
      {
        question: "Why does balancing matter for enthalpy calculations?",
        answer:
          "Enthalpy of reaction ΔH is reported per mole of reaction as written. If you double all coefficients, ΔH doubles. Thermochemical equations must be balanced so the stated ΔH corresponds to the correct mole ratio of reactants and products. Using an unbalanced equation leads to enthalpy values that are off by an integer factor, producing incorrect heat predictions in calorimetry problems.",
      },
    ],
  },
  {
    slug: "redoxbalancer",
    whatIs: {
      paragraphs: [
        "Redox reactions transfer electrons between species: oxidation loses electrons, reduction gains them. Many aqueous redox equations cannot be balanced by inspection alone because oxygen, hydrogen, and charge must be adjusted together with the principal atoms. The half-reaction method (ion–electron method) separates oxidation and reduction, balances atoms and charge in each half, then combines them so electrons cancel.",
        "In acidic medium, oxygen is balanced with H₂O and hydrogen with H⁺. In basic medium, the same acidic skeleton is converted by adding OH⁻ to neutralize H⁺, producing water on one side and leaving net OH⁻ where needed. Both atom counts and net charge must match on the reactant and product sides of the final equation.",
        "The Redox Equation Balancer on Online Science Tools accepts ionic or molecular skeletons such as MnO4- + Fe2+ = Mn2+ + Fe3+, chooses acidic or basic medium, and returns the smallest whole-number equation with step notes and an atom/charge check. Use it to verify homework half-reaction work, then carry coefficients into the Reaction Stoichiometry Calculator when yields matter.",
      ],
      bullets: [
        "Split into oxidation and reduction half-reactions when needed",
        "Acidic: balance O with H₂O, H with H⁺, then charge with e⁻",
        "Basic: convert H⁺ by adding equal OH⁻ (H⁺ + OH⁻ → H₂O)",
        "Electrons lost must equal electrons gained before adding halves",
      ],
    },
    formula: {
      intro:
        "Conservation constraints for a redox equation in aqueous solution:",
      blocks: [
        `For every element X:
  Σ atoms(X)_reactants = Σ atoms(X)_products

Charge:
  Σ (coeff × charge)_reactants = Σ (coeff × charge)_products

Acidic half-reaction pattern (example MnO₄⁻ → Mn²⁺):
  MnO₄⁻ → Mn²⁺
  MnO₄⁻ → Mn²⁺ + 4H₂O
  MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O
  MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O`,
      ],
      notes: [
        "Write ion charges as Fe2+, MnO4-, or with carets (SO4^2-).",
        "Spectator ions may be omitted in net ionic redox equations.",
        "If the skeleton already includes H₂O / H⁺ / OH⁻, the balancer may still adjust them.",
      ],
    },
    example: {
      title: "Permanganate oxidizing Fe²⁺ (acidic)",
      scenario:
        "Balance MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺ in acidic aqueous solution.",
      steps: [
        "Reduction: MnO₄⁻ → Mn²⁺; add 4 H₂O, then 8 H⁺, then 5 e⁻.",
        "Oxidation: Fe²⁺ → Fe³⁺ + e⁻.",
        "Multiply the iron half by 5 so electrons cancel (5e⁻).",
        "Add: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.",
        "Check: Mn, Fe, O, H atoms and net charge (+17) match on both sides.",
      ],
      toolCheck:
        "Enter MnO4- + Fe2+ = Mn2+ + Fe3+, choose Acidic, and confirm the same coefficients in the Redox Equation Balancer.",
    },
    faq: [
      {
        question: "Is this a half reaction calculator for acidic and basic media?",
        answer:
          "Yes. Choose acidic or basic medium. The tool balances atoms and charge, adding H₂O, H⁺, or OH⁻ as required, and shows steps plus an atom inventory so you can compare with hand-worked half-reactions.",
      },
      {
        question: "How do I enter ion charges?",
        answer:
          "Append the charge after the formula: Fe2+, Zn2+, MnO4-, or use a caret for polyatomic ions such as Cr2O7^2- and SO4^2-. Neutral species like Zn, H2, and MnO2 need no charge suffix.",
      },
      {
        question: "When should I use basic medium?",
        answer:
          "Use basic when the reaction occurs in alkaline solution or the expected products include OH⁻ (for example permanganate to MnO₂ with sulfite in base). Switching medium changes how H⁺/OH⁻/H₂O appear in the final equation.",
      },
      {
        question: "How is this different from the Chemistry Equation Balancer?",
        answer:
          "The general balancer conserves atoms for molecular equations. The redox balancer also conserves charge and can introduce solvent-derived H₂O, H⁺, and OH⁻ that were not in your skeleton—essential for aqueous half-reaction problems.",
      },
    ],
  },
  {
    slug: "dilutioncalculator",
    whatIs: {
      paragraphs: [
        "Dilution is the process of lowering a solution’s concentration by adding solvent. In teaching labs and homework, the working relation is almost always C₁V₁ = C₂V₂: the amount of solute is conserved when you dilute, so the product of concentration and volume stays constant if concentration units are consistent.",
        "Typical tasks include preparing a working solution from a concentrated stock, finding how much stock to pipette into a volumetric flask, or checking what concentration results after combining a known aliquot with solvent up to a final volume. The Dilution Calculator solves for whichever one of C₁, V₁, C₂, or V₂ you leave blank.",
        "Keep units consistent. If volumes are in milliliters, both V₁ and V₂ should be in milliliters (or both in liters). Concentrations may be molarity, percent, or another shared unit—the algebra is the same. Use the serial dilution mode for 1:10 / 1:100 series, or lab presets such as alcohol, bleach, and hydrogen peroxide dilutions.",
      ],
      bullets: [
        "Solute amount is conserved: moles before = moles after (for non-reactive dilution)",
        "C₁V₁ = C₂V₂ with matching concentration units and matching volume units",
        "Stock concentration C₁ is greater than or equal to the diluted concentration C₂",
      ],
    },
    formula: {
      intro:
        "For a dilution that does not consume or produce solute, the conserved quantity is concentration × volume.",
      blocks: [
        `C₁V₁ = C₂V₂

Solve for one unknown, for example:
  V₁ = (C₂V₂) / C₁
  C₂ = (C₁V₁) / V₂

Dilution factor = C₁ / C₂ = V₂ / V₁`,
      ],
      notes: [
        "Volumes may be mL or L as long as both sides match.",
        "Do not mix mass percent with molarity in the same equation without converting first.",
      ],
    },
    example: {
      title: "Preparing 250 mL of 0.50 M HCl from 2.0 M stock",
      scenario:
        "You have 2.0 M HCl stock and need 250 mL of 0.50 M HCl. What volume of stock should you measure before diluting to the mark?",
      steps: [
        "Identify knowns: C₁ = 2.0 M, C₂ = 0.50 M, V₂ = 250 mL; solve for V₁.",
        "V₁ = (C₂V₂) / C₁ = (0.50 × 250) / 2.0 = 62.5 mL.",
        "Measure 62.5 mL of stock and dilute with water to 250 mL total volume.",
        "Check: dilution factor = 2.0 / 0.50 = 4, and 250 / 62.5 = 4.",
      ],
      toolCheck:
        "In the Dilution Calculator, enter C₁ = 2.0, leave V₁ blank, C₂ = 0.50, V₂ = 250 (mL). Confirm V₁ ≈ 62.5 mL.",
    },
    faq: [
      {
        question: "Can I use mL and L in the same calculation?",
        answer:
          "Only if you convert so both volumes use the same unit. 250 mL is 0.250 L. Mixing units without converting gives a wrong V₁ by a factor of 1000.",
      },
      {
        question: "Does C₁V₁ = C₂V₂ work for mass percent?",
        answer:
          "It works when both concentrations are the same type and the density does not change much, which is reasonable for dilute aqueous solutions. For precise work with concentrated solutions, convert to moles or use mass of solute instead.",
      },
      {
        question: "What is a serial dilution?",
        answer:
          "A serial dilution repeats dilution in steps (for example, 1:10 three times). Each step still obeys C₁V₁ = C₂V₂. The overall dilution factor is the product of the step factors. Switch the Dilution Calculator to Serial dilution, set factor = 10 with transfer 1 into final 10, and read each tube concentration.",
      },
      {
        question: "How do I do a 1:10 dilution calculator workflow?",
        answer:
          "A 1:10 step means the diluted concentration is one-tenth of the stock for that step (dilution factor 10). In simple mode, leave V₁ blank with C₁ known, set C₂ = C₁/10, and enter V₂. In serial mode, choose the 1:10 chip so transfer/final volumes match the factor.",
      },
    ],
  },
  {
    slug: "concentrationconverter",
    whatIs: {
      paragraphs: [
        "Chemists express solution composition in several units. Molarity (mol/L of solution) is common in volumetric work. Molality (mol/kg of solvent) is preferred when temperature changes matter. Mass percent and ppm appear in analytical and environmental contexts. Converting among them requires the solute’s molar mass and, for most conversions, the solution density.",
        "The Concentration Converter takes one known concentration plus molar mass (from a formula or a typed value) and density, then reports molarity, g/L, g/mL, mg/mL, mass percent, ppm, and molality on a 1.00 L solution basis. Density-aware examples (saline, glucose, ethanol) help connect classroom molarity problems to everyday g↔mL style conversions.",
        "For dilute aqueous solutions, density ≈ 1.00 g/mL is a standard classroom approximation. Concentrated acids, bases, and syrups need a measured or tabulated density or the conversion will be off.",
      ],
      bullets: [
        "Molarity M = moles solute / liters solution",
        "Molality m = moles solute / kilograms solvent",
        "Mass % and ppm need density to relate mass of solute to volume of solution",
      ],
    },
    formula: {
      intro:
        "For 1.00 L of solution with density ρ (g/mL) and solute molar mass M (g/mol):",
      blocks: [
        `Mass of solution ≈ 1000ρ grams
Mass of solute (g) = (molarity) × M
Mass % = (mass solute / mass solution) × 100%
ppm (mass) = (mass solute / mass solution) × 10⁶
Molality = moles solute / kg solvent
kg solvent = (mass solution − mass solute) / 1000`,
      ],
      notes: [
        "ppm here is mass ppm (mg/kg). For very dilute water solutions this is nearly mg/L.",
        "If solute mass exceeds solution mass, the inputs are physically inconsistent.",
      ],
    },
    example: {
      title: "0.100 M NaCl with density 1.00 g/mL",
      scenario:
        "Convert 0.100 M aqueous NaCl (M ≈ 58.44 g/mol, ρ = 1.00 g/mL) into g/L, mass percent, ppm, and molality.",
      steps: [
        "g/L = 0.100 × 58.44 = 5.844 g/L.",
        "In 1.00 L, solution mass ≈ 1000 g; solute = 5.844 g.",
        "Mass % ≈ (5.844 / 1000) × 100 = 0.584%.",
        "ppm ≈ 5844.",
        "kg solvent ≈ 0.994 kg; molality ≈ 0.100 / 0.994 ≈ 0.101 mol/kg.",
      ],
      toolCheck:
        "Enter NaCl, density 1.00, molarity 0.100 in the Concentration Converter and compare the table of results.",
    },
    faq: [
      {
        question: "When is molality better than molarity?",
        answer:
          "Molality does not change with temperature because it is based on solvent mass, not solution volume. Colligative-property problems usually use molality.",
      },
      {
        question: "Why do I need density?",
        answer:
          "Molarity is per liter of solution, while mass percent and molality are mass-based. Density links volume of solution to its mass so those families of units can be connected.",
      },
      {
        question: "What if I do not know the formula?",
        answer:
          "Leave the formula blank and type the molar mass in g/mol directly. The converter only needs M for mole ↔ mass links.",
      },
    ],
  },
  {
    slug: "phcalculator",
    whatIs: {
      paragraphs: [
        "pH measures the acidity of an aqueous solution on a logarithmic scale using the pH formula pH = −log₁₀[H⁺] (more precisely, activity of H₃O⁺, approximated by concentration in dilute solutions). Strong acids and bases dissociate essentially completely; weak acids and bases only partially, so Ka or Kb is required. Buffers contain a weak acid and its conjugate base and resist pH change; their pH is estimated with the Henderson–Hasselbalch equation pH = pKa + log₁₀([A⁻]/[HA]).",
        "The pH Calculator covers five classroom cases at 25 °C (Kw = 1.0×10⁻¹⁴): strong acid, strong base, weak acid, weak base, and a simple HA/A⁻ buffer, with presets for acetate, phosphate-like, and ammonium buffers. Strong electrolytes include water’s autoionization so extremely dilute solutions do not report nonsense pH values far past 7. The tool compares the Henderson–Hasselbalch estimate to a charge-balance solver for buffers.",
        "Always match the mode to the chemistry. Acetic acid is weak (use Ka); HCl is strong. A mixture of acetic acid and sodium acetate is a buffer, not a single weak-acid problem.",
      ],
      bullets: [
        "Strong acid/base: start from complete dissociation; include water when C is tiny",
        "Weak acid/base: solve Ka or Kb = x²/(C−x) with the quadratic",
        "Buffer: pH = pKa + log₁₀([A⁻]/[HA])",
      ],
    },
    formula: {
      intro: "Core relations used by the calculator (25 °C):",
      blocks: [
        `pH = −log₁₀[H⁺]
pOH = −log₁₀[OH⁻]
[H⁺][OH⁻] = Kw = 1.0×10⁻¹⁴

Weak acid: Ka = x² / (C − x)
Weak base: Kb = x² / (C − x)
Buffer: pH = pKa + log₁₀([A⁻]/[HA])
pKa = −log₁₀(Ka)`,
      ],
      notes: [
        "Polyprotic acids and activity corrections are outside this tool’s scope.",
        "If Ka or Kb ≥ 1, treat the species as strong instead.",
      ],
    },
    example: {
      title: "pH of 0.10 M acetic acid (Ka = 1.8×10⁻⁵)",
      scenario:
        "Find the pH of 0.10 M CH₃COOH using the weak-acid quadratic.",
      steps: [
        "Ka = x²/(0.10 − x) = 1.8×10⁻⁵.",
        "x = (−Ka + √(Ka² + 4 Ka C))/2 ≈ 1.33×10⁻³ M.",
        "pH = −log₁₀(1.33×10⁻³) ≈ 2.88.",
        "Check: x/C ≈ 1.3% < 5%, so the x ≪ C shortcut would also be roughly OK here.",
      ],
      toolCheck:
        "Choose Weak acid, concentration 0.10, Ka 1.8e-5 in the pH Calculator. Expect pH near 2.88.",
    },
    faq: [
      {
        question: "What is the Henderson–Hasselbalch equation used for?",
        answer:
          "It estimates buffer pH from pKa and the ratio of conjugate base to weak acid: pH = pKa + log₁₀([A⁻]/[HA]). Use it for classroom buffer problems and phosphate/acetate-style examples. The calculator also solves a fuller charge-balance model so you can see when the approximation is excellent.",
      },
      {
        question: "Why is the pH of 1.0×10⁻⁸ M HCl not 8?",
        answer:
          "Water contributes [H⁺] as well. A charge-balance treatment gives a pH slightly below 7, not an alkaline value. The strong-acid mode includes that correction.",
      },
      {
        question: "When is Henderson–Hasselbalch valid?",
        answer:
          "When both HA and A⁻ are present at concentrations much larger than [H⁺] and [OH⁻], typically in the 0.01–1 M range for common buffers. It is an approximation, not an exact charge-balance solution.",
      },
      {
        question: "How do Ka and Kb relate for a conjugate pair?",
        answer:
          "Ka × Kb = Kw at the same temperature. If you know Ka for acetic acid, Kb for acetate is Kw/Ka.",
      },
    ],
  },
  {
    slug: "buffercalculator",
    whatIs: {
      paragraphs: [
        "A buffer is a mixture of a weak acid (HA) and its conjugate base (A⁻) that resists pH change when small amounts of strong acid or base are added. Laboratory recipes specify a named system (phosphate, acetate, Tris, citrate, ammonia, bicarbonate), a target pH, a total buffer concentration C = [HA] + [A⁻], and a final volume. The Henderson–Hasselbalch equation sets the ratio [A⁻]/[HA] from pH and pKa; together with C it fixes both concentrations, then masses follow from molar mass and volume.",
        "Useful buffering is typically within about ±1 pH unit of the system pKa. Outside that window the ratio becomes extreme and capacity collapses. Real polyprotic systems (citrate, carbonate) have multiple pKa values; this calculator uses a single effective pKa per named recipe as a teaching and planning aid—not a substitute for validated lab SOPs for critical biology or clinical work.",
        "The Buffer Preparation Calculator on Online Science Tools returns acid and base molarities, moles, and grams for common named buffers. Cross-check the target pH with the pH Calculator’s buffer mode, and dilute stock solutions with the Dilution Calculator when needed.",
      ],
      bullets: [
        "pH = pKa + log₁₀([A⁻]/[HA]) (Henderson–Hasselbalch)",
        "C = [HA] + [A⁻]; solve for each concentration from the ratio and C",
        "mass = moles × molar mass; moles = molarity × volume (L)",
        "Stay near the system pKa for practical buffer capacity",
      ],
    },
    formula: {
      intro: "Recipe from target pH, total molarity C, and volume V:",
      blocks: [
        `pH = pKa + log₁₀([A⁻]/[HA])
r = [A⁻]/[HA] = 10^(pH − pKa)

[HA] = C / (1 + r)
[A⁻] = C − [HA] = C · r / (1 + r)

n_HA = [HA] · V
n_A  = [A⁻] · V
m = n · M (molar mass of the acid or base reagent)`,
      ],
      notes: [
        "Reagent formulas are the usual lab salts/acids (e.g. NaH₂PO₄ / Na₂HPO₄ for phosphate).",
        "Ionic strength, temperature, and activity corrections are omitted.",
        "Tris and citrate recipes are approximate single-pKa models.",
      ],
    },
    example: {
      title: "0.10 M phosphate buffer, pH 7.40, 1.00 L",
      scenario:
        "Prepare 1.00 L of 0.10 M phosphate buffer at pH 7.40 using NaH₂PO₄ / Na₂HPO₄ (pKa₂ ≈ 7.20).",
      steps: [
        "r = 10^(7.40 − 7.20) = 10^0.20 ≈ 1.585.",
        "[HA] = 0.10 / (1 + 1.585) ≈ 0.0387 M; [A⁻] ≈ 0.0613 M.",
        "moles: n_HA ≈ 0.0387 mol; n_A ≈ 0.0613 mol.",
        "Masses ≈ 4.64 g NaH₂PO₄ and 8.70 g Na₂HPO₄ (anhydrous formulas).",
      ],
      toolCheck:
        "Select Phosphate, pH 7.40, 0.10 M, 1000 mL in the Buffer Preparation Calculator and compare the gram amounts.",
    },
    faq: [
      {
        question: "Is this a phosphate buffer calculator?",
        answer:
          "Yes. Choose the Phosphate system for the H₂PO₄⁻ / HPO₄²⁻ pair (sodium salts), set target pH, total molarity, and volume, and read off the grams of each salt. Acetate, citrate, Tris, ammonia, and bicarbonate systems are also available.",
      },
      {
        question: "Why warn when pH is far from pKa?",
        answer:
          "Buffer capacity is highest near pKa. Far away, almost all of the buffer is in one form, so small additions of strong acid or base shift pH sharply. Pick a system whose pKa is close to your target.",
      },
      {
        question: "Can I use this for biological Tris or PBS recipes?",
        answer:
          "It gives a useful first estimate from Henderson–Hasselbalch. For published protocols (exact hydrates, ionic strength, temperature), follow the lab SOP and verify pH with a calibrated meter.",
      },
      {
        question: "How does this relate to the pH Calculator?",
        answer:
          "The pH Calculator estimates pH from known [HA] and [A⁻]. This tool inverts the problem: given target pH and total C, it finds the recipe amounts. Use both to cross-check homework and lab prep.",
      },
    ],
  },
  {
    slug: "compositioncalculator",
    whatIs: {
      paragraphs: [
        "Percent composition states how much of a compound’s mass comes from each element. It follows directly from the chemical formula and atomic masses: divide each element’s contribution by the molar mass and multiply by 100%. Combustion analysis and elemental analysis report percentages that you then convert into an empirical formula—the simplest whole-number mole ratio of atoms.",
        "If an independent molecular mass is known (from mass spectrometry or gas-density data), multiply the empirical formula by an integer so the molar mass matches. The Composition & Empirical Formula Calculator handles both directions: formula → mass percents, and percent/mass data → empirical (and optional molecular) formula.",
      ],
      bullets: [
        "% element = (mass of element in 1 mol) / (molar mass) × 100%",
        "Empirical formula from moles of each element, scaled to smallest integers",
        "Molecular formula = (empirical) × n, where n ≈ M_molecular / M_empirical",
      ],
    },
    formula: {
      intro: "Core relations:",
      blocks: [
        `%X = (n_X × A_X / M) × 100%

moles of X = (mass % of X) / A_X   (using 100 g sample)
Divide each mole amount by the smallest → relative indices
Clear fractions to the smallest integers → empirical formula`,
      ],
    },
    example: {
      title: "Empirical formula from 40.0% C, 6.7% H, 53.3% O",
      scenario:
        "An organic compound is 40.0% C, 6.7% H, and 53.3% O by mass. Its molar mass is about 180 g/mol. Find the empirical and molecular formulas.",
      steps: [
        "In 100 g: 40.0 g C, 6.7 g H, 53.3 g O.",
        "Moles: C 3.331, H 6.647, O 3.331 → ratios ≈ 1 : 2 : 1.",
        "Empirical formula CH₂O (M ≈ 30.03 g/mol).",
        "n = 180 / 30 ≈ 6 → molecular formula C₆H₁₂O₆.",
      ],
      toolCheck:
        "Use Empirical from % / mass with C 40, H 6.7, O 53.3 and molecular mass 180.",
    },
    faq: [
      {
        question: "Do percents have to sum to exactly 100?",
        answer:
          "Experimental values often sum to 99–101% because of rounding. The calculator treats values near 100% as mass percents; if amounts look like grams with a sum far from 100, it treats them as relative masses.",
      },
      {
        question: "Why might indices like 1.5 appear?",
        answer:
          "Mole ratios are not always integers before scaling. Multiplying by 2 clears a 1.5 ratio (for example CH₃O → C₂H₆O₂).",
      },
    ],
  },
  {
    slug: "kspcalculator",
    whatIs: {
      paragraphs: [
        "The solubility product Ksp is the equilibrium constant for dissolving a sparingly soluble ionic solid. For a salt that dissolves as x cations and y anions per formula unit, Ksp = [cation]^x[anion]^y at saturation. Molar solubility s is the moles of formula unit that dissolve per liter of saturated solution in pure water.",
        "Comparing the ion product Q (same form as Ksp but with actual concentrations) to Ksp predicts precipitation: Q > Ksp favors solid formation. The Ksp Calculator converts between s and Ksp for common salt stoichiometries and evaluates Q versus Ksp.",
      ],
      bullets: [
        "AB salt: Ksp = s²",
        "AB₂ salt: Ksp = 4s³",
        "A₂B salt: Ksp = 4s³",
        "Q > Ksp → precipitate expected",
      ],
    },
    formula: {
      intro: "For MxAy(s) ⇌ x M + y A with solubility s:",
      blocks: [
        `Ksp = (x s)^x (y s)^y = x^x y^y s^(x+y)

s = (Ksp / (x^x y^y))^(1/(x+y))
Q = [M]^x [A]^y`,
      ],
    },
    example: {
      title: "Solubility of AgCl from Ksp",
      scenario:
        "AgCl is type AB with Ksp = 1.8×10⁻¹⁰ at 25 °C. Find the molar solubility in pure water.",
      steps: [
        "Ksp = s² = 1.8×10⁻¹⁰.",
        "s = √(1.8×10⁻¹⁰) ≈ 1.34×10⁻⁵ mol/L.",
      ],
      toolCheck:
        "Choose Ksp → solubility, salt type AB, Ksp = 1.8e-10.",
    },
    faq: [
      {
        question: "Does this include the common-ion effect?",
        answer:
          "The s ↔ Ksp modes assume pure water (no extra common ion). For common-ion problems, set up the ICE table with the extra ion and use the Equilibrium Calculator or solve algebraically; you can still check Q vs Ksp with measured ion concentrations.",
      },
      {
        question: "Are Ksp values temperature-dependent?",
        answer:
          "Yes. Tabulated Ksp values are for a stated temperature (often 25 °C). Using a Ksp at the wrong temperature gives the wrong solubility.",
      },
    ],
  },
  {
    slug: "gaslawcalculator",
    whatIs: {
      paragraphs: [
        "The ideal gas law PV = nRT relates pressure, volume, amount, and absolute temperature for gases at moderate conditions. Classroom calculations usually use R = 0.082057 L·atm/(mol·K) with P in atm, V in liters, and T in kelvin. Real gases deviate at high pressure or low temperature, but the ideal model is the standard starting point in general chemistry.",
        "The Ideal Gas Law Calculator solves for whichever variable you leave blank and can estimate molar mass from gas density via M = dRT/P.",
      ],
      bullets: [
        "Always convert temperature to kelvin for PV = nRT",
        "Keep P, V, R unit-consistent (tool converts atm/kPa/mmHg and L/mL)",
        "Molar mass from density: M = dRT/P with d in g/L",
      ],
    },
    formula: {
      intro: "Ideal gas relations used here:",
      blocks: [
        `PV = nRT
R = 0.082057 L·atm/(mol·K)

T(K) = t(°C) + 273.15
M = dRT / P   (d in g/L)`,
      ],
    },
    example: {
      title: "Moles of gas at STP-like conditions",
      scenario:
        "A sample occupies 22.4 L at 1.00 atm and 273.15 K. How many moles are present?",
      steps: [
        "n = PV/(RT) = (1.00 × 22.4) / (0.082057 × 273.15) ≈ 1.00 mol.",
      ],
      toolCheck:
        "Enter P = 1.00 atm, V = 22.4 L, leave n blank, T = 273.15 K.",
    },
    faq: [
      {
        question: "Why must temperature be in kelvin?",
        answer:
          "Gas laws are proportional to absolute temperature. Zero on the Celsius scale is not zero thermal energy; 0 °C is 273.15 K.",
      },
      {
        question: "When does the ideal gas law fail?",
        answer:
          "At high pressures and low temperatures, attractions and molecular volume matter. Use van der Waals or tabulated compressibility for precise work; for homework STP/room-condition problems, PV = nRT is expected.",
      },
    ],
  },
  {
    slug: "thermochemistrycalculator",
    whatIs: {
      paragraphs: [
        "Thermochemistry relates heat to chemical change. The standard enthalpy of reaction can be estimated from tabulated standard enthalpies of formation: ΔH° = Σ nΔHf°(products) − Σ nΔHf°(reactants). Hess’s law says the net ΔH for a path equals the sum of ΔH for the steps, so you can reverse or scale tabulated reactions. Calorimetry measures heat via q = mcΔT for a substance that changes temperature.",
        "The Thermochemistry Calculator covers formation-based ΔH°, Hess sums, calorimetry, and scaling heat with moles of reaction. Use consistent units (kJ for enthalpies; match mass and c for calorimetry).",
      ],
      bullets: [
        "ΔH° from formation enthalpies",
        "Hess: reverse a step with a negative coefficient",
        "q = m c ΔT for temperature changes",
      ],
    },
    formula: {
      intro: "Key relations:",
      blocks: [
        `ΔH° = Σ n ΔHf°(products) − Σ n ΔHf°(reactants)
ΔH_net = Σ (coeff_i × ΔH_i)
q = m c ΔT
q_rxn = n × ΔH`,
      ],
    },
    example: {
      title: "ΔH° for methane combustion",
      scenario:
        "CH₄ + 2 O₂ → CO₂ + 2 H₂O(g) with ΔHf°: CH₄ −74.8, O₂ 0, CO₂ −393.5, H₂O(g) −241.8 kJ/mol.",
      steps: [
        "Products: (−393.5) + 2(−241.8) = −877.1 kJ.",
        "Reactants: (−74.8) + 2(0) = −74.8 kJ.",
        "ΔH° = −877.1 − (−74.8) = −802.3 kJ/mol-rxn.",
      ],
      toolCheck:
        "Use From ΔHf° with the methane combustion preset values and confirm ΔH° ≈ −802 kJ.",
    },
    faq: [
      {
        question: "What is ΔHf° for an element in its standard state?",
        answer:
          "Zero by definition (for example O₂(g), C(graphite), Fe(s) at 1 bar and the reference temperature).",
      },
      {
        question: "Is q for the system or surroundings?",
        answer:
          "In calorimetry, m c ΔT is usually the heat absorbed by the calorimeter contents. The reaction heat is often the negative of that if the reaction is the system heating the water.",
      },
    ],
  },
  {
    slug: "kineticscalculator",
    whatIs: {
      paragraphs: [
        "Chemical kinetics describes how fast concentrations change. For elementary decay of a single reactant, the integrated rate laws for orders 0, 1, and 2 relate [A], t, and k. Half-life t½ is the time for [A] to fall to half of its initial value; only first-order t½ is independent of [A]₀.",
        "The Kinetics Calculator solves for remaining concentration, time, rate constant, or half-life once you choose the order and provide the known quantities.",
      ],
      bullets: [
        "Zero order: [A] = [A]₀ − kt",
        "First order: ln[A] = ln[A]₀ − kt",
        "Second order: 1/[A] = 1/[A]₀ + kt",
      ],
    },
    formula: {
      intro: "Half-lives:",
      blocks: [
        `0th: t½ = [A]₀ / (2k)
1st: t½ = ln 2 / k
2nd: t½ = 1 / (k[A]₀)`,
      ],
    },
    example: {
      title: "First-order remaining concentration",
      scenario:
        "[A]₀ = 1.00 M, k = 0.001 s⁻¹, t = 600 s. Find [A].",
      steps: [
        "[A] = 1.00 e^(−0.001×600) = e^(−0.6) ≈ 0.549 M.",
        "t½ = ln2 / 0.001 ≈ 693 s.",
      ],
      toolCheck:
        "Order 1, Find [A]ₜ, k = 0.001, [A]₀ = 1, t = 600.",
    },
    faq: [
      {
        question: "How do I know the order?",
        answer:
          "From experiment: linear plots of [A], ln[A], or 1/[A] versus time identify orders 0, 1, or 2. The calculator does not invent the order—you select it from the problem statement or data analysis.",
      },
      {
        question: "What units does k have?",
        answer:
          "They depend on order: M/time (0), 1/time (1), 1/(M·time) (2). Keep time units consistent throughout.",
      },
    ],
  },
  {
    slug: "nernstcalculator",
    whatIs: {
      paragraphs: [
        "The Nernst equation gives the cell potential when concentrations (or pressures) are not standard: E = E° − (RT/nF) ln Q. At 25 °C textbooks often write E = E° − (0.05916/n) log₁₀ Q. The reaction quotient Q uses the same form as the equilibrium expression for the cell reaction.",
        "Gibbs free energy relates to potential by ΔG = −nFE. The Nernst Equation Calculator returns E and the corresponding ΔG (and ΔG° from E°).",
      ],
      bullets: [
        "n = moles of electrons transferred in the balanced cell reaction",
        "Q = 1 recovers E = E°",
        "ΔG = −nFE (E in volts → ΔG in joules per mole of reaction)",
      ],
    },
    formula: {
      intro: "Forms used by the tool:",
      blocks: [
        `E = E° − (RT/nF) ln Q
E = E° − (0.05916/n) log₁₀ Q   (25 °C)
ΔG = −n F E`,
      ],
    },
    example: {
      title: "Non-standard Zn–Cu cell",
      scenario: "E° = 1.10 V, n = 2, Q = 0.010 at 25 °C. Find E.",
      steps: [
        "E = 1.10 − (0.05916/2) log₁₀(0.010) = 1.10 − 0.02958(−2).",
        "E = 1.10 + 0.05916 ≈ 1.16 V.",
      ],
      toolCheck:
        "Load the Zn–Cu Q = 0.010 preset and confirm E ≈ 1.16 V.",
    },
    faq: [
      {
        question: "What goes into Q?",
        answer:
          "Products over reactants with stoichiometric exponents, omitting pure solids and pure liquids, just as in K. Aqueous species use concentration (or activity); gases use partial pressure in bar in precise work.",
      },
      {
        question: "Does a positive E mean the reaction is spontaneous?",
        answer:
          "For the cell reaction as written, E > 0 means ΔG < 0 under those conditions, so the forward cell reaction is spontaneous.",
      },
    ],
  },
];
