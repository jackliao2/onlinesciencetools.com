import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Guide, Tool } from "@/lib/tools";

function buildPageMetadata(input: {
  title: string;
  description: string;
  keywords: string[];
  href: string;
}): Metadata {
  const fullTitle = `${input.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${input.href}`;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
    },
  };
}

export function buildToolMetadata(tool: Tool): Metadata {
  return buildPageMetadata(tool);
}

export function buildGuideMetadata(guide: Guide): Metadata {
  return buildPageMetadata(guide);
}

export function buildStaticPageMetadata(input: {
  title: string;
  description: string;
  href: string;
  keywords?: string[];
}): Metadata {
  return buildPageMetadata({
    title: input.title,
    description: input.description,
    href: input.href,
    keywords: input.keywords ?? [],
  });
}

export function buildWebApplicationJsonLd(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    name: tool.title,
    description: tool.description,
    url: `${SITE_URL}${tool.href}`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildArticleJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${SITE_URL}${guide.href}`,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}${guide.href}`,
  };
}
