export type ToolCategory = "chemistry" | "math" | "computing";

export type ToolStatus = "live" | "coming-soon";

/** Sub-grouping for clearer browsing (especially chemistry). */
export type ToolGroup =
  | "reactions"
  | "solutions"
  | "acids"
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
  graphing: "Graphing & dynamics",
  algebra: "Algebra",
  web: "Web & numbers",
};

/** Display order of groups within each category. */
export const chemistryGroupOrder: ToolGroup[] = [
  "reactions",
  "solutions",
  "acids",
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
      "balance chemical equation",
      "equation balancer",
      "stoichiometric coefficients",
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
      "molar mass calculator",
      "mole converter",
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
      "C1V1=C2V2",
      "solution dilution",
      "serial dilution",
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
      "Solve chemical equilibrium with Kc/Kp, reaction quotient Q, ICE tables, and equilibrium amounts.",
    category: "chemistry",
    group: "acids",
    status: "live",
    keywords: [
      "equilibrium calculator",
      "ICE table",
      "Kc",
      "Kp",
      "reaction quotient",
    ],
    accent: "emerald",
  },
  {
    slug: "phcalculator",
    href: "/tools/phcalculator",
    title: "pH Calculator",
    shortTitle: "pH Calculator",
    description:
      "Calculate pH and pOH for strong/weak acids and bases and simple buffers (Henderson–Hasselbalch).",
    category: "chemistry",
    group: "acids",
    status: "live",
    keywords: [
      "pH calculator",
      "acid base calculator",
      "Henderson Hasselbalch",
      "weak acid pH",
      "buffer pH",
    ],
    accent: "teal",
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
      "Solve 2×2 and 3×3 linear systems with Gaussian elimination and step summaries.",
    category: "math",
    group: "algebra",
    status: "live",
    keywords: ["linear equations solver", "gaussian elimination", "systems"],
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
