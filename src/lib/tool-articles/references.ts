export interface AuthorityReference {
  label: string;
  href: string;
  note: string;
}

/** Curated outbound citations — standards bodies, universities, and textbooks-class sources. */
export const toolReferences: Record<string, AuthorityReference[]> = {
  stoichiometrycalculator: [
    {
      label: "IUPAC CIAAW — Atomic weights of the elements",
      href: "https://ciaaw.org/atomic-weights.htm",
      note: "Standard atomic weights used in molar-mass calculations.",
    },
    {
      label: "NIST — Avogadro constant (CODATA)",
      href: "https://physics.nist.gov/cgi-bin/cuu/Value?na",
      note: "Official value of Nₐ for mole–particle conversions.",
    },
    {
      label: "LibreTexts Chemistry — The Mole and Molar Mass",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/03%3A_Stoichiometry_and_Equations/3.03%3A_The_Mole",
      note: "Open textbook treatment of moles and formula mass.",
    },
  ],
  equilibriumcalculator: [
    {
      label: "LibreTexts Chemistry — Chemical Equilibrium",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/15%3A_Chemical_Equilibrium",
      note: "Kc, Kp, and equilibrium expressions.",
    },
    {
      label: "IUPAC Gold Book — equilibrium constant",
      href: "https://goldbook.iupac.org/terms/view/E02177",
      note: "Formal definition of the equilibrium constant.",
    },
    {
      label: "Khan Academy — Reaction quotient and Le Chatelier",
      href: "https://www.khanacademy.org/science/chemistry/chemical-equilibrium",
      note: "Student-friendly walkthrough of Q versus K.",
    },
  ],
  reactionstoichiometrycalculator: [
    {
      label: "LibreTexts — Limiting Reactant",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/03%3A_Stoichiometry_and_Equations/3.07%3A_Limiting_Reactants",
      note: "Theory of limiting reagents and theoretical yield.",
    },
    {
      label: "ACS — Stoichiometry resources for educators",
      href: "https://www.acs.org/education.html",
      note: "American Chemical Society education hub.",
    },
    {
      label: "NIST Chemistry WebBook",
      href: "https://webbook.nist.gov/chemistry/",
      note: "Reference thermochemical and molecular data.",
    },
  ],
  balanceequation: [
    {
      label: "LibreTexts — Balancing Chemical Equations",
      href: "https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/11%3A_Chemical_Reactions/11.03%3A_Balancing_Chemical_Equations",
      note: "Atom-balance rules for chemical equations.",
    },
    {
      label: "IUPAC Gold Book — chemical equation",
      href: "https://goldbook.iupac.org/terms/view/C01033",
      note: "Terminology for representing reactions.",
    },
    {
      label: "PhET — Balancing Chemical Equations (simulation)",
      href: "https://phet.colorado.edu/en/simulations/balancing-chemical-equations",
      note: "Interactive practice from University of Colorado Boulder.",
    },
  ],
  dilutioncalculator: [
    {
      label: "LibreTexts — Dilutions and Concentrations",
      href: "https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/16%3A_Solutions/16.07%3A_Dilutions_and_Concentrations",
      note: "C₁V₁ = C₂V₂ and solution preparation practice.",
    },
    {
      label: "NIST — Guide for the Use of the International System of Units",
      href: "https://www.nist.gov/pml/special-publication-811",
      note: "Unit conventions for volume and amount of substance.",
    },
  ],
  concentrationconverter: [
    {
      label: "LibreTexts — Solution Concentration",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/04%3A_Reactions_in_Aqueous_Solution/4.05%3A_Concentrations_of_Solutions",
      note: "Molarity, molality, and related concentration units.",
    },
    {
      label: "IUPAC Gold Book — molality",
      href: "https://goldbook.iupac.org/terms/view/M03970",
      note: "Formal definition of molality.",
    },
  ],
  phcalculator: [
    {
      label: "LibreTexts — Acid–Base Equilibria",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/16%3A_AcidBase_Equilibria",
      note: "Strong/weak acids, Ka, and buffers.",
    },
    {
      label: "IUPAC Gold Book — pH",
      href: "https://goldbook.iupac.org/terms/view/P04524",
      note: "Definition of pH.",
    },
    {
      label: "NIST — pH standards",
      href: "https://www.nist.gov/programs-projects/nist-ph-standards",
      note: "Reference materials and metrology for pH.",
    },
  ],
  compositioncalculator: [
    {
      label: "LibreTexts — Percent Composition",
      href: "https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/06%3A_Chemical_Composition/6.07%3A_Mass_Percent_Composition",
      note: "Mass percent from chemical formulas.",
    },
    {
      label: "LibreTexts — Empirical Formulas",
      href: "https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/06%3A_Chemical_Composition/6.08%3A_Calculating_Empirical_Formulas",
      note: "Converting percent composition to empirical formulas.",
    },
  ],
  kspcalculator: [
    {
      label: "LibreTexts — Solubility Equilibria",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/17%3A_Additional_Aspects_of_Aqueous_Equilibria/17.04%3A_Solubility_Equilibria",
      note: "Ksp and molar solubility.",
    },
    {
      label: "IUPAC Gold Book — solubility product",
      href: "https://goldbook.iupac.org/terms/view/S05727",
      note: "Definition of the solubility product.",
    },
  ],
  gaslawcalculator: [
    {
      label: "LibreTexts — The Ideal Gas Law",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/10%3A_Gases/10.04%3A_The_Ideal_Gas_Equation",
      note: "PV = nRT and related gas calculations.",
    },
    {
      label: "NIST — CODATA value of R",
      href: "https://physics.nist.gov/cgi-bin/cuu/Value?r",
      note: "Molar gas constant reference value.",
    },
  ],
  phaseportrait: [
    {
      label: "MIT OCW — Differential Equations",
      href: "https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/",
      note: "Classic undergraduate ODE course materials.",
    },
    {
      label: "Scholarpedia — Phase portrait",
      href: "http://www.scholarpedia.org/article/Phase_portrait",
      note: "Peer-reviewed encyclopedia article on phase portraits.",
    },
    {
      label: "MathWorld — Phase Portrait",
      href: "https://mathworld.wolfram.com/PhasePortrait.html",
      note: "Concise mathematical definition and examples.",
    },
  ],
  graphingcalculator: [
    {
      label: "MathWorld — Function Graph",
      href: "https://mathworld.wolfram.com/FunctionGraph.html",
      note: "Graphing y = f(x) in the plane.",
    },
    {
      label: "Khan Academy — Graphs of functions",
      href: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:functions",
      note: "Algebra-level function graphing practice.",
    },
    {
      label: "NIST Digital Library of Mathematical Functions",
      href: "https://dlmf.nist.gov/",
      note: "Authoritative special-function reference.",
    },
  ],
  timegraphing: [
    {
      label: "HyperPhysics — Projectile Motion",
      href: "http://hyperphysics.phy-astr.gsu.edu/hbase/traj.html",
      note: "Parametric trajectories under constant gravity.",
    },
    {
      label: "LibreTexts Physics — Waves",
      href: "https://phys.libretexts.org/Bookshelves/University_Physics/University_Physics_(OpenStax)/University_Physics_I_-_Mechanics_Sound_Oscillations_and_Waves_(OpenStax)/16%3A_Waves",
      note: "Traveling-wave forms y = f(x − vt).",
    },
    {
      label: "MIT OCW — Classical Mechanics",
      href: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/",
      note: "Kinematics and motion graphs in context.",
    },
  ],
  linearequations: [
    {
      label: "MIT OCW — Linear Algebra (Gilbert Strang)",
      href: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
      note: "Gaussian elimination and Ax = b.",
    },
    {
      label: "MathWorld — System of Linear Equations",
      href: "https://mathworld.wolfram.com/SystemofLinearEquations.html",
      note: "Existence and uniqueness overview.",
    },
    {
      label: "Khan Academy — Systems of equations",
      href: "https://www.khanacademy.org/math/algebra-home/alg-system-of-equations",
      note: "Worked practice for 2×2 systems.",
    },
  ],
  binarycalculator: [
    {
      label: "Wikipedia — Positional notation",
      href: "https://en.wikipedia.org/wiki/Positional_notation",
      note: "How binary, octal, and hexadecimal place values work.",
    },
    {
      label: "MIT OCW — Computation Structures",
      href: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/",
      note: "Number representation in computer systems.",
    },
    {
      label: "MDN — Number.prototype.toString (radix)",
      href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString",
      note: "Practical base conversion in JavaScript.",
    },
  ],
  colorpicker: [
    {
      label: "W3C — CSS Color Module",
      href: "https://www.w3.org/TR/css-color-4/",
      note: "Official definitions for RGB, HSL, and hex colors on the web.",
    },
    {
      label: "MDN — CSS colors",
      href: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value",
      note: "Developer reference for color formats.",
    },
    {
      label: "WebAIM — Contrast Checker",
      href: "https://webaim.org/resources/contrastchecker/",
      note: "Accessibility contrast guidance for readable UI text.",
    },
  ],
  htmlexecutor: [
    {
      label: "MDN Web Docs — HTML",
      href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      note: "Canonical HTML documentation for learners and professionals.",
    },
    {
      label: "MDN — CSS",
      href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      note: "Styling reference paired with sandbox experiments.",
    },
    {
      label: "W3C — HTML Living Standard (WHATWG)",
      href: "https://html.spec.whatwg.org/",
      note: "The HTML specification that browsers implement.",
    },
  ],
};

export const guideReferences: Record<string, AuthorityReference[]> = {
  physicsgre: [
    {
      label: "ETS — GRE Physics Test",
      href: "https://www.ets.org/gre/test-takers/subject-tests/about/content-structure.html",
      note: "Official subject-test overview from the test maker.",
    },
    {
      label: "MIT OCW — Physics courses",
      href: "https://ocw.mit.edu/search/?d=Physics",
      note: "Free university-level physics lecture materials.",
    },
    {
      label: "HyperPhysics (Georgia State University)",
      href: "http://hyperphysics.phy-astr.gsu.edu/hbase/index.html",
      note: "Concept maps across mechanics, E&M, quantum, and thermo.",
    },
    {
      label: "NIST CODATA — Fundamental physical constants",
      href: "https://physics.nist.gov/cuu/Constants/",
      note: "Recommended values for constants used in PGRE estimates.",
    },
  ],
  electricfield: [
    {
      label: "HyperPhysics — Electric Field",
      href: "http://hyperphysics.phy-astr.gsu.edu/hbase/electric/elefie.html",
      note: "Point-charge fields and superposition.",
    },
    {
      label: "LibreTexts Physics — Electric Fields",
      href: "https://phys.libretexts.org/Bookshelves/University_Physics/University_Physics_(OpenStax)/University_Physics_II_-_Thermodynamics_Electricity_and_Magnetism_(OpenStax)/05%3A_Electric_Charges_and_Fields",
      note: "OpenStax university physics chapter on fields.",
    },
    {
      label: "MIT OCW — Electricity and Magnetism",
      href: "https://ocw.mit.edu/courses/8-02-electricity-and-magnetism-spring-2007/",
      note: "Walter Lewin’s classic E&M course materials.",
    },
  ],
};
