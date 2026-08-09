export const SITE_NAME = "Online Science Tools";

function resolveSiteUrl(): string {
  const fallback = "https://onlinesciencetools.com";
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return fallback;
  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
}

/** Canonical production origin — override with NEXT_PUBLIC_SITE_URL in env. */
export const SITE_URL = resolveSiteUrl();

export const SITE_DESCRIPTION =
  "Free online chemistry and math calculators for students and teachers — chemical equilibrium, pH, stoichiometry, equation balancing, buffers, phase portraits, graphing, and study guides.";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@onlinesciencetools.com";

export const SITE_FOUNDED_YEAR = 2012;

export const legalPages = [
  {
    slug: "about",
    href: "/about",
    title: "About",
    shortTitle: "About",
    description:
      "About Online Science Tools — chemistry, math, and physics calculators and study guides for students and educators.",
  },
  {
    slug: "contact",
    href: "/contact",
    title: "Contact Us",
    shortTitle: "Contact",
    description:
      "Contact Online Science Tools for feedback, classroom questions, bug reports, or collaboration.",
  },
  {
    slug: "privacy",
    href: "/privacy",
    title: "Privacy Policy",
    shortTitle: "Privacy",
    description:
      "Privacy Policy for Online Science Tools: how we handle information, cookies, analytics, and your rights when using our educational tools.",
  },
  {
    slug: "terms",
    href: "/terms",
    title: "Terms of Use",
    shortTitle: "Terms",
    description:
      "Terms of Use for Online Science Tools, covering acceptable use, educational disclaimers, intellectual property, and liability limits.",
  },
] as const;
