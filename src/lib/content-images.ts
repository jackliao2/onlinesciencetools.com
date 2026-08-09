export interface ContentImage {
  id: string;
  /** Public path under /public */
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** SEO hero images in public/images/content */
export const contentImages = {
  physicsgre: {
    id: "physicsgre-hero",
    src: "/images/content/physicsgre-hero.webp",
    alt: "Physics GRE study notes, formulas, and practice sheets on a wooden desk",
    width: 1600,
    height: 900,
  },
  electricfield: {
    id: "electricfield-hero",
    src: "/images/content/electricfield-hero.webp",
    alt: "Electric field lines radiating between positive and negative point charges",
    width: 1600,
    height: 900,
  },
  equilibriumcalculator: {
    id: "equilibrium-hero",
    src: "/images/content/equilibrium-hero.webp",
    alt: "Two connected flasks suggesting dynamic chemical equilibrium",
    width: 1600,
    height: 900,
  },
  phcalculator: {
    id: "ph-hero",
    src: "/images/content/ph-hero.webp",
    alt: "Acid–base lab glassware with a subtle color gradient suggesting a pH scale",
    width: 1600,
    height: 900,
  },
  balanceequation: {
    id: "balanceequation-hero",
    src: "/images/content/balanceequation-hero.webp",
    alt: "Molecular models on a balance scale representing a balanced chemical equation",
    width: 1600,
    height: 900,
  },
  stoichiometrycalculator: {
    id: "stoichiometry-hero",
    src: "/images/content/stoichiometry-hero.webp",
    alt: "Analytical balance and powder sample for stoichiometric mass calculations",
    width: 1600,
    height: 900,
  },
  buffercalculator: {
    id: "buffer-hero",
    src: "/images/content/buffer-hero.webp",
    alt: "Preparing a buffer solution with a pipette and volumetric flask",
    width: 1600,
    height: 900,
  },
  redoxbalancer: {
    id: "redox-hero",
    src: "/images/content/redox-hero.webp",
    alt: "Oxidation–reduction concept with contrasting metal and solution half-cells",
    width: 1600,
    height: 900,
  },
  phaseportrait: {
    id: "phaseportrait-hero",
    src: "/images/content/phaseportrait-hero.webp",
    alt: "Phase portrait curves of a dynamical system on a coordinate plane",
    width: 1600,
    height: 900,
  },
  graphingcalculator: {
    id: "graphing-hero",
    src: "/images/content/graphing-hero.webp",
    alt: "Smooth function graphs plotted on a coordinate plane",
    width: 1600,
    height: 900,
  },
  home: {
    id: "home-science-tools",
    src: "/images/content/home-science-tools.webp",
    alt: "Laptop showing science calculators beside lab glassware and a notebook",
    width: 1600,
    height: 900,
  },
  dilutioncalculator: {
    id: "dilution-hero",
    src: "/images/content/dilution-hero.webp",
    alt: "Volumetric flask and pipette used for solution dilution",
    width: 1600,
    height: 900,
  },
} as const satisfies Record<string, ContentImage>;

export type ContentImageKey = keyof typeof contentImages;

export function getContentImage(key: ContentImageKey): ContentImage {
  return contentImages[key];
}

export function absoluteContentImageUrl(
  image: ContentImage,
  siteUrl: string,
): string {
  return `${siteUrl.replace(/\/$/, "")}${image.src}`;
}
