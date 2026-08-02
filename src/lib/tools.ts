export type ToolCategory = "chemistry" | "math" | "computing";

export type ToolStatus = "live" | "coming-soon";

export interface Tool {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ToolCategory;
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

export const tools: Tool[] = [
  {
    slug: "stoichiometrycalculator",
    href: "/tools/stoichiometrycalculator",
    title: "Stoichiometry Calculator",
    shortTitle: "Stoichiometry",
    description:
      "Calculate molar mass, convert between moles, grams, and particles, and solve stoichiometric relationships for chemical formulas.",
    category: "chemistry",
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
    slug: "equilibriumcalculator",
    href: "/tools/equilibriumcalculator",
    title: "Equilibrium Calculator",
    shortTitle: "Equilibrium",
    description:
      "Solve chemical equilibrium problems with Kc/Kp, reaction quotient Q, ICE tables, and equilibrium concentrations.",
    category: "chemistry",
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
    slug: "reactionstoichiometrycalculator",
    href: "/tools/reactionstoichiometrycalculator",
    title: "Reaction Stoichiometry Calculator",
    shortTitle: "Reaction Stoichiometry",
    description:
      "Find limiting reagents and theoretical yields from balanced chemical equations and starting amounts.",
    category: "chemistry",
    status: "live",
    keywords: [
      "reaction stoichiometry",
      "limiting reagent",
      "theoretical yield",
    ],
    accent: "sky",
  },
  {
    slug: "balanceequation",
    href: "/tools/balanceequation",
    title: "Chemistry Equation Balancer",
    shortTitle: "Equation Balancer",
    description:
      "Automatically balance chemical equations and inspect stoichiometric coefficients on both sides.",
    category: "chemistry",
    status: "live",
    keywords: [
      "balance chemical equation",
      "equation balancer",
      "stoichiometric coefficients",
    ],
    accent: "lime",
  },
  {
    slug: "phaseportrait",
    href: "/tools/phaseportrait",
    title: "Phase Portrait Generator",
    shortTitle: "Phase Portrait",
    description:
      "Visualize 2D autonomous differential equation systems with interactive vector fields and solution trajectories.",
    category: "math",
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
      "Plot y = f(x) on an interactive canvas, with adjustable windows and automatic local extrema detection.",
    category: "math",
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
      "Animate functions of time and parametric motion trajectories with playable t-parameter curves.",
    category: "math",
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
      "Solve 2×2 and 3×3 systems of linear equations with Gaussian elimination and step summaries.",
    category: "math",
    status: "live",
    keywords: ["linear equations solver", "gaussian elimination", "systems"],
    accent: "blue",
  },
  {
    slug: "binarycalculator",
    href: "/tools/binarycalculator",
    title: "Binary Calculator & Converter",
    shortTitle: "Binary Calculator",
    description:
      "Convert and compute across binary, octal, decimal, and hexadecimal number systems.",
    category: "computing",
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
      "Pick colors and convert instantly between HEX, RGB, and HSL for web and design workflows.",
    category: "computing",
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
      "Write and run HTML, CSS, and JavaScript instantly in a sandboxed browser playground.",
    category: "computing",
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
  chemistry: "Chemistry Tools",
  math: "Mathematics & Computation",
  computing: "Computing & Web Tools",
};

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getRelatedTools(slug: string, limit = 4): Tool[] {
  const current = getToolBySlug(slug);
  if (!current) return tools.slice(0, limit);

  const sameCategory = tools.filter(
    (tool) => tool.slug !== slug && tool.category === current.category,
  );
  const others = tools.filter(
    (tool) => tool.slug !== slug && tool.category !== current.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}
