export interface AuthorityReference {
  label: string;
  href: string;
  note: string;
}

/**
 * Curated outbound citations — standards bodies, universities, and textbooks.
 * Every href in this file should return HTTP 200 (verified by scripts/check-links.mjs).
 */
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
      label: "LibreTexts / OpenStax — Formula mass and the mole",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/03%3A_Composition_of_Substances_and_Solutions/3.01%3A_Formula_Mass_and_the_Mole_Concept",
      note: "Open textbook treatment of moles and formula mass.",
    },
  ],
  equilibriumcalculator: [
    {
      label: "LibreTexts — Chemical Equilibrium",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/15%3A_Chemical_Equilibrium",
      note: "Kc, Kp, and equilibrium expressions.",
    },
    {
      label: "IUPAC Gold Book — equilibrium constant",
      href: "https://goldbook.iupac.org/terms/view/E02177",
      note: "Formal definition of the equilibrium constant.",
    },
    {
      label: "Khan Academy — Chemical equilibrium",
      href: "https://www.khanacademy.org/science/chemistry/chemical-equilibrium",
      note: "Student-friendly walkthrough of Q versus K.",
    },
  ],
  reactionstoichiometrycalculator: [
    {
      label: "LibreTexts / OpenStax — Reaction stoichiometry",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/04%3A_Stoichiometry_of_Chemical_Reactions/4.03%3A_Reaction_Stoichiometry",
      note: "Mole ratios, limiting reagents, and theoretical yield.",
    },
    {
      label: "ACS — Education resources",
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
      label: "LibreTexts / OpenStax — Writing and balancing equations",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/04%3A_Stoichiometry_of_Chemical_Reactions/4.01%3A_Writing_and_Balancing_Chemical_Equations",
      note: "Atom-balance rules for chemical equations.",
    },
    {
      label: "IUPAC Gold Book — chemical equation",
      href: "https://goldbook.iupac.org/terms/view/C01033",
      note: "Terminology for representing reactions.",
    },
    {
      label: "PhET — Balancing Chemical Equations",
      href: "https://phet.colorado.edu/en/simulations/balancing-chemical-equations",
      note: "Interactive practice from University of Colorado Boulder.",
    },
  ],
  dilutioncalculator: [
    {
      label: "LibreTexts / OpenStax — Molarity (includes dilution)",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/03%3A_Composition_of_Substances_and_Solutions/3.03%3A_Molarity",
      note: "Molarity and the C₁V₁ = C₂V₂ dilution relation.",
    },
    {
      label: "NIST — Guide for the Use of the International System of Units",
      href: "https://www.nist.gov/pml/special-publication-811",
      note: "Unit conventions for volume and amount of substance.",
    },
    {
      label: "OpenStax Chemistry 2e — Molarity",
      href: "https://openstax.org/books/chemistry-2e/pages/3-3-molarity",
      note: "Primary OpenStax chapter on solution concentration and dilution.",
    },
  ],
  concentrationconverter: [
    {
      label: "LibreTexts / OpenStax — Other concentration units",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/03%3A_Composition_of_Substances_and_Solutions/3.04%3A_Other_Units_for_Solution_Concentrations",
      note: "Mass percent, ppm, molality, and related units.",
    },
    {
      label: "IUPAC Gold Book — molality",
      href: "https://goldbook.iupac.org/terms/view/M03970",
      note: "Formal definition of molality.",
    },
    {
      label: "OpenStax Chemistry 2e — Other units for solution concentrations",
      href: "https://openstax.org/books/chemistry-2e/pages/3-4-other-units-for-solution-concentrations",
      note: "Canonical open textbook section on concentration units.",
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
      label: "NIST — pH metrology",
      href: "https://www.nist.gov/programs-projects/ph-metrology",
      note: "NIST program on electrochemical pH measurement standards.",
    },
  ],
  compositioncalculator: [
    {
      label: "LibreTexts / OpenStax — Formula mass and the mole",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/03%3A_Composition_of_Substances_and_Solutions/3.01%3A_Formula_Mass_and_the_Mole_Concept",
      note: "Mass percent composition from chemical formulas.",
    },
    {
      label: "LibreTexts / OpenStax — Empirical and molecular formulas",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/03%3A_Composition_of_Substances_and_Solutions/3.02%3A_Determining_Empirical_and_Molecular_Formulas",
      note: "Converting percent composition to empirical formulas.",
    },
    {
      label: "OpenStax Chemistry 2e — Empirical and molecular formulas",
      href: "https://openstax.org/books/chemistry-2e/pages/3-2-determining-empirical-and-molecular-formulas",
      note: "Primary OpenStax chapter for composition problems.",
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
  thermochemistrycalculator: [
    {
      label: "LibreTexts — Enthalpies of Formation",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/05%3A_Thermochemistry/5.07%3A_Enthalpies_of_Formation",
      note: "Using ΔHf° to compute reaction enthalpies.",
    },
    {
      label: "NIST Chemistry WebBook",
      href: "https://webbook.nist.gov/chemistry/",
      note: "Tabulated thermochemical data.",
    },
  ],
  kineticscalculator: [
    {
      label: "LibreTexts / OpenStax — Integrated rate laws",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/12%3A_Kinetics/12.04%3A_Integrated_Rate_Laws",
      note: "Zero-, first-, and second-order integrated laws.",
    },
    {
      label: "IUPAC Gold Book — half-life",
      href: "https://goldbook.iupac.org/terms/view/H02716",
      note: "Definition of half-life.",
    },
  ],
  nernstcalculator: [
    {
      label: "LibreTexts / OpenStax — Potential, free energy, and equilibrium",
      href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/17%3A_Electrochemistry/17.04%3A_Potential_Free_Energy_and_Equilibrium",
      note: "Nernst relation and ΔG = −nFE.",
    },
    {
      label: "NIST — Faraday constant (CODATA)",
      href: "https://physics.nist.gov/cgi-bin/cuu/Value?f",
      note: "Official CODATA Faraday constant.",
    },
  ],
  phaseportrait: [
    {
      label: "MIT OCW — Differential Equations",
      href: "https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/",
      note: "Classic undergraduate ODE course materials.",
    },
    {
      label: "Wikipedia — Phase portrait",
      href: "https://en.wikipedia.org/wiki/Phase_portrait",
      note: "Overview of phase portraits for autonomous ODE systems.",
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
      label: "Khan Academy — Functions",
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
      label: "OpenStax — Projectile Motion",
      href: "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion",
      note: "University Physics treatment of parametric trajectories under gravity.",
    },
    {
      label: "LibreTexts Physics — Waves",
      href: "https://phys.libretexts.org/Bookshelves/University_Physics/University_Physics_(OpenStax)/Book%3A_University_Physics_I_-_Mechanics_Sound_Oscillations_and_Waves_(OpenStax)/16%3A_Waves",
      note: "Traveling-wave forms and wave motion.",
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
      label: "MathWorld — Linear System of Equations",
      href: "https://mathworld.wolfram.com/LinearSystemofEquations.html",
      note: "Existence and uniqueness overview.",
    },
    {
      label: "Khan Academy — Systems of equations",
      href: "https://www.khanacademy.org/math/algebra-home/alg-system-of-equations",
      note: "Worked practice for systems of equations.",
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
      label: "CSS Working Group — CSS Color Module Level 4",
      href: "https://drafts.csswg.org/css-color-4/",
      note: "Official definitions for RGB, HSL, and hex colors on the web.",
    },
    {
      label: "MDN — CSS color values",
      href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value",
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
      label: "WHATWG — HTML Living Standard",
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
      label: "OpenStax — University Physics Volume 1",
      href: "https://openstax.org/details/books/university-physics-volume-1",
      note: "Free university physics textbook covering mechanics through waves.",
    },
    {
      label: "NIST CODATA — Fundamental physical constants",
      href: "https://physics.nist.gov/cuu/Constants/",
      note: "Recommended values for constants used in PGRE estimates.",
    },
  ],
  electricfield: [
    {
      label: "OpenStax — Electric Field",
      href: "https://openstax.org/books/university-physics-volume-2/pages/5-4-electric-field",
      note: "Point-charge fields and the principle of superposition.",
    },
    {
      label: "LibreTexts Physics — Electric Charges and Fields",
      href: "https://phys.libretexts.org/Bookshelves/University_Physics/University_Physics_(OpenStax)/University_Physics_II_-_Thermodynamics_Electricity_and_Magnetism_(OpenStax)/05%3A_Electric_Charges_and_Fields",
      note: "OpenStax university physics chapter on fields.",
    },
    {
      label: "MIT OCW — Physics II: Electricity and Magnetism",
      href: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/",
      note: "MIT undergraduate electricity and magnetism course materials.",
    },
  ],
};
