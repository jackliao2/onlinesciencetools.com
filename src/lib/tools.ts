export type ToolCategory = "chemistry" | "math" | "computing";

export type ToolStatus = "live" | "coming-soon";

/** Sub-grouping for clearer browsing (especially chemistry). */
export type ToolGroup =
  | "reactions"
  | "solutions"
  | "acids"
  | "gases"
  | "energy"
  | "graphing"
  | "algebra"
  | "web";

export interface Tool {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ToolCategory;
  group: ToolGroup;
  status: ToolStatus;
  keywords: string[];
  accent: string;
}

export interface Guide {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
}

export { SITE_NAME, SITE_URL } from "@/lib/site";

export const toolGroupLabels: Record<ToolGroup, string> = {
  reactions: "Reactions & stoichiometry",
  solutions: "Solutions & concentration",
  acids: "Equilibrium & acids",
  gases: "Gases",
  energy: "Energy, rates & electrochemistry",
  graphing: "Graphing & dynamics",
  algebra: "Algebra",
  web: "Web & numbers",
};

/** Display order of groups within each category. */
export const chemistryGroupOrder: ToolGroup[] = [
  "reactions",
  "solutions",
  "acids",
  "gases",
  "energy",
];
export const mathGroupOrder: ToolGroup[] = ["graphing", "algebra"];
export const computingGroupOrder: ToolGroup[] = ["web"];

export const tools: Tool[] = [
  // Chemistry — reactions
  {
    slug: "balanceequation",
    href: "/tools/balanceequation",
    title: "Chemistry Equation Balancer",
    shortTitle: "Equation Balancer",
    description:
      "Balance chemical equations and inspect stoichiometric coefficients on both sides.",
    category: "chemistry",
    group: "reactions",
    status: "live",
    keywords: [
      "chemistry equation balancer",
      "balancing chemical equations calculator",
      "balance chemical equations",
      "balance chemical equation",
      "equation balancer",
      "stoichiometric coefficients",
      "balancing chemical equations practice",
    ],
    accent: "lime",
  },
  {
    slug: "stoichiometrycalculator",
    href: "/tools/stoichiometrycalculator",
    title: "Stoichiometry Calculator",
    shortTitle: "Stoichiometry",
    description:
      "Calculate molar mass and convert between moles, grams, and particles for chemical formulas.",
    category: "chemistry",
    group: "reactions",
    status: "live",
    keywords: [
      "stoichiometry calculator",
      "stoichiometry solver",
      "molar mass calculator",
      "molar mass formula",
      "grams to moles",
      "mole converter",
      "Avogadro",
      "chemistry calculator",
    ],
    accent: "teal",
  },
  {
    slug: "reactionstoichiometrycalculator",
    href: "/tools/reactionstoichiometrycalculator",
    title: "Reaction Stoichiometry Calculator",
    shortTitle: "Reaction Stoichiometry",
    description:
      "Find limiting reagents and theoretical yields from balanced equations and starting amounts.",
    category: "chemistry",
    group: "reactions",
    status: "live",
    keywords: [
      "reaction stoichiometry",
      "limiting reagent",
      "theoretical yield",
    ],
    accent: "sky",
  },
  {
    slug: "compositioncalculator",
    href: "/tools/compositioncalculator",
    title: "Composition & Empirical Formula Calculator",
    shortTitle: "Composition / Empirical",
    description:
      "Get mass percent composition from a formula, or find empirical and molecular formulas from percent data.",
    category: "chemistry",
    group: "reactions",
    status: "live",
    keywords: [
      "percent composition",
      "empirical formula calculator",
      "molecular formula",
      "mass percent",
    ],
    accent: "teal",
  },
  {
    slug: "redoxbalancer",
    href: "/tools/redoxbalancer",
    title: "Redox Equation Balancer",
    shortTitle: "Redox Balancer",
    description:
      "Balance redox equations in acidic or basic medium with atom and charge conservation (H₂O / H⁺ / OH⁻).",
    category: "chemistry",
    group: "reactions",
    status: "live",
    keywords: [
      "redox balancer",
      "redox reactions equations",
      "half reaction calculator",
      "half reaction method",
      "oxidation number method",
      "balance redox equation",
    ],
    accent: "rose",
  },
  // Chemistry — solutions
  {
    slug: "dilutioncalculator",
    href: "/tools/dilutioncalculator",
    title: "Dilution Calculator",
    shortTitle: "Dilution",
    description:
      "Solve C₁V₁ = C₂V₂ for stock or diluted concentration and volume when preparing solutions.",
    category: "chemistry",
    group: "solutions",
    status: "live",
    keywords: [
      "dilution calculator",
      "serial dilution calculator",
      "C1V1=C2V2",
      "solution dilution",
      "serial dilution",
      "1:10 dilution calculator",
      "alcohol dilution calculator",
      "bleach dilution calculator",
    ],
    accent: "cyan",
  },
  {
    slug: "concentrationconverter",
    href: "/tools/concentrationconverter",
    title: "Concentration Converter",
    shortTitle: "Concentration",
    description:
      "Convert among molarity, g/L, mass percent, ppm, and molality using molar mass and density.",
    category: "chemistry",
    group: "solutions",
    status: "live",
    keywords: [
      "concentration converter",
      "molarity calculator",
      "molality",
      "mass percent",
      "ppm",
      "density",
      "g/mL",
      "mg/mL",
      "convert mg ml to molarity",
    ],
    accent: "sky",
  },
  // Chemistry — acids / equilibrium
  {
    slug: "equilibriumcalculator",
    href: "/tools/equilibriumcalculator",
    title: "Equilibrium Calculator",
    shortTitle: "Equilibrium",
    description:
      "Chemical equilibrium calculator for Kc/Kp, reaction quotient Q, ICE tables, and equilibrium concentrations.",
    category: "chemistry",
    group: "acids",
    status: "live",
    keywords: [
      "chemical equilibrium calculator",
      "equilibrium calculator",
      "ICE table calculator",
      "Kc calculator",
      "Kp calculator",
      "reaction quotient Q",
      "haber equilibrium",
    ],
    accent: "emerald",
  },
  {
    slug: "phcalculator",
    href: "/tools/phcalculator",
    title: "pH Calculator",
    shortTitle: "pH Calculator",
    description:
      "pH and pOH calculator for strong/weak acids and bases—including ammonia with Kb = 1.8×10⁻⁵—and simple buffers (Henderson–Hasselbalch).",
    category: "chemistry",
    group: "acids",
    status: "live",
    keywords: [
      "pH calculator",
      "ph formula",
      "acid base calculator",
      "weak base pH",
      "ammonia kb 1.8e-5",
      "Henderson Hasselbalch",
      "henderson hasselbalch equation",
      "weak acid pH",
      "buffer pH",
    ],
    accent: "teal",
  },
  {
    slug: "buffercalculator",
    href: "/tools/buffercalculator",
    title: "Buffer Preparation Calculator",
    shortTitle: "Buffer Recipe",
    description:
      "Prepare named buffers (phosphate, acetate, Tris, and more) from target pH, total concentration, and volume using Henderson–Hasselbalch.",
    category: "chemistry",
    group: "acids",
    status: "live",
    keywords: [
      "phosphate buffer calculator",
      "buffer preparation calculator",
      "buffer ph calculator",
      "citrate buffer calculator",
      "acetate buffer calculator",
      "henderson hasselbalch buffer",
    ],
    accent: "teal",
  },
  {
    slug: "kspcalculator",
    href: "/tools/kspcalculator",
    title: "Ksp Calculator",
    shortTitle: "Ksp / Solubility",
    description:
      "Convert between Ksp and molar solubility, and compare ion product Q with Ksp for precipitation.",
    category: "chemistry",
    group: "acids",
    status: "live",
    keywords: [
      "Ksp calculator",
      "solubility product",
      "molar solubility",
      "precipitation Q Ksp",
    ],
    accent: "emerald",
  },
  // Chemistry — gases
  {
    slug: "gaslawcalculator",
    href: "/tools/gaslawcalculator",
    title: "Ideal Gas Law Calculator",
    shortTitle: "Ideal Gas Law",
    description:
      "Solve PV = nRT for pressure, volume, moles, or temperature, with optional molar mass from density.",
    category: "chemistry",
    group: "gases",
    status: "live",
    keywords: [
      "ideal gas law calculator",
      "PV=nRT",
      "gas density molar mass",
      "Boyle Charles",
    ],
    accent: "sky",
  },
  // Chemistry — energy / rates / electro
  {
    slug: "thermochemistrycalculator",
    href: "/tools/thermochemistrycalculator",
    title: "Thermochemistry Calculator",
    shortTitle: "Thermochemistry",
    description:
      "Compute ΔH° from formation enthalpies, apply Hess’s law, run calorimetry q = mcΔT, and scale heat with moles.",
    category: "chemistry",
    group: "energy",
    status: "live",
    keywords: [
      "thermochemistry calculator",
      "enthalpy of formation",
      "Hess law",
      "calorimetry",
      "delta H",
    ],
    accent: "amber",
  },
  {
    slug: "kineticscalculator",
    href: "/tools/kineticscalculator",
    title: "Kinetics Calculator",
    shortTitle: "Kinetics",
    description:
      "Use zero-, first-, and second-order integrated rate laws to find concentration, time, k, or half-life.",
    category: "chemistry",
    group: "energy",
    status: "live",
    keywords: [
      "kinetics calculator",
      "half life",
      "first order kinetics",
      "integrated rate law",
    ],
    accent: "orange",
  },
  {
    slug: "nernstcalculator",
    href: "/tools/nernstcalculator",
    title: "Nernst Equation Calculator",
    shortTitle: "Nernst Equation",
    description:
      "Calculate non-standard cell potential E from E°, n, and Q, plus ΔG = −nFE.",
    category: "chemistry",
    group: "energy",
    status: "live",
    keywords: [
      "Nernst equation calculator",
      "cell potential",
      "electrochemistry",
      "delta G",
    ],
    accent: "rose",
  },
  // Math
  {
    slug: "phaseportrait",
    href: "/tools/phaseportrait",
    title: "Phase Portrait Generator",
    shortTitle: "Phase Portrait",
    description:
      "Visualize 2D autonomous differential equation systems with vector fields and trajectories.",
    category: "math",
    group: "graphing",
    status: "live",
    keywords: [
      "phase portrait",
      "differential equations",
      "vector field",
      "dynamical systems",
    ],
    accent: "cyan",
  },
  {
    slug: "graphingcalculator",
    href: "/tools/graphingcalculator",
    title: "2D Graphing Calculator",
    shortTitle: "Graphing",
    description:
      "Plot y = f(x) with adjustable windows and local extrema markers.",
    category: "math",
    group: "graphing",
    status: "live",
    keywords: ["graphing calculator", "function plotter", "extrema"],
    accent: "indigo",
  },
  {
    slug: "timegraphing",
    href: "/tools/timegraphing",
    title: "Time Graphing Tool",
    shortTitle: "Time Graphing",
    description:
      "Animate functions of time and parametric trajectories with a playable t parameter.",
    category: "math",
    group: "graphing",
    status: "live",
    keywords: [
      "time graphing",
      "parametric equations",
      "motion trajectory",
      "f(x,t)",
    ],
    accent: "fuchsia",
  },
  {
    slug: "linearequations",
    href: "/tools/linearequations",
    title: "Linear Equations Solver",
    shortTitle: "Linear Equations",
    description:
      "Solve 2×2–6×6 systems Ax = b with partial pivoting, RREF, free-variable form, determinant, and optional inverse.",
    category: "math",
    group: "algebra",
    status: "live",
    keywords: [
      "linear equations solver",
      "gaussian elimination",
      "RREF",
      "matrix inverse",
      "systems of equations",
    ],
    accent: "blue",
  },
  // Computing
  {
    slug: "binarycalculator",
    href: "/tools/binarycalculator",
    title: "Binary Calculator & Converter",
    shortTitle: "Binary Calculator",
    description:
      "Convert and compute across binary, octal, decimal, and hexadecimal number systems.",
    category: "computing",
    group: "web",
    status: "live",
    keywords: [
      "binary calculator",
      "hex converter",
      "number system converter",
    ],
    accent: "violet",
  },
  {
    slug: "colorpicker",
    href: "/tools/colorpicker",
    title: "Hex Color Picker & Converter",
    shortTitle: "Color Picker",
    description:
      "Pick colors and convert between HEX, RGB, and HSL for web workflows.",
    category: "computing",
    group: "web",
    status: "live",
    keywords: ["hex color picker", "color converter", "rgb hsl"],
    accent: "rose",
  },
  {
    slug: "htmlexecutor",
    href: "/tools/htmlexecutor",
    title: "Online HTML / JS Executor",
    shortTitle: "HTML Executor",
    description:
      "Write and run HTML, CSS, and JavaScript in a sandboxed browser playground.",
    category: "computing",
    group: "web",
    status: "live",
    keywords: ["html executor", "js sandbox", "online code runner"],
    accent: "amber",
  },
];

export const guides: Guide[] = [
  {
    slug: "physicsgre",
    href: "/guides/physicsgre",
    title: "Physics GRE Prep & Study Guide",
    shortTitle: "Physics GRE",
    description:
      "A structured Physics GRE study guide with core formula sheets, topic weights, and exam strategy for mechanics, E&M, quantum, and thermo.",
    keywords: [
      "physics gre",
      "physics gre study guide",
      "physics gre formulas",
      "pgre prep",
    ],
  },
  {
    slug: "electricfield",
    href: "/guides/electricfield",
    title: "Electric Field Guide & Visualizer",
    shortTitle: "Electric Field",
    description:
      "Learn electric field concepts, key formulas, and point-charge visualizations for introductory and GRE-level physics.",
    keywords: [
      "electric field",
      "electric field formula",
      "coulomb field",
      "physics guide",
    ],
  },
];

export const categoryLabels: Record<ToolCategory, string> = {
  chemistry: "Chemistry",
  math: "Mathematics",
  computing: "Computing",
};

export function groupOrderForCategory(category: ToolCategory): ToolGroup[] {
  if (category === "chemistry") return chemistryGroupOrder;
  if (category === "math") return mathGroupOrder;
  return computingGroupOrder;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getRelatedTools(slug: string, limit = 4): Tool[] {
  const current = getToolBySlug(slug);
  if (!current) return tools.slice(0, limit);

  const sameGroup = tools.filter(
    (tool) =>
      tool.slug !== slug &&
      tool.category === current.category &&
      tool.group === current.group,
  );
  const sameCategory = tools.filter(
    (tool) =>
      tool.slug !== slug &&
      tool.category === current.category &&
      tool.group !== current.group,
  );
  const others = tools.filter(
    (tool) => tool.slug !== slug && tool.category !== current.category,
  );

  return [...sameGroup, ...sameCategory, ...others].slice(0, limit);
}
