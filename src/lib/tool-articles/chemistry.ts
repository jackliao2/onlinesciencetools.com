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
        "Students frequently struggle with balancing because they attempt to change subscripts within formulas rather than adjusting coefficients. The subscripts in H₂O, for instance, define water's identity and must never be altered—only the coefficient in front may change. The Chemistry Equation Balancer on Online Science Tools applies algorithmic balancing to any valid chemical formula, returning the smallest whole-number coefficients and displaying atom counts on each side for verification.",
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
          "Split the reaction into oxidation and reduction half-reactions. Balance atoms other than O and H first, then balance O by adding H₂O and H by adding H⁺ (in acidic medium). Balance charge by adding electrons. Multiply each half-reaction so electrons lost equal electrons gained, then add the half-reactions and cancel species appearing on both sides. The balancer handles many simple redox equations automatically, but the half-reaction method remains essential for exam problems.",
      },
      {
        question: "Why does balancing matter for enthalpy calculations?",
        answer:
          "Enthalpy of reaction ΔH is reported per mole of reaction as written. If you double all coefficients, ΔH doubles. Thermochemical equations must be balanced so the stated ΔH corresponds to the correct mole ratio of reactants and products. Using an unbalanced equation leads to enthalpy values that are off by an integer factor, producing incorrect heat predictions in calorimetry problems.",
      },
    ],
  },
];
