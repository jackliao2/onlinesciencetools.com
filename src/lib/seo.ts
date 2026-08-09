import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { categoryLabels, type Guide, type Tool } from "@/lib/tools";

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

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
      },
    ],
  };
}

export function buildWebApplicationJsonLd(tool: Tool) {
  const url = `${SITE_URL}${tool.href}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        "@id": `${url}#app`,
        name: tool.title,
        description: tool.description,
        url,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        provider: {
          "@id": `${SITE_URL}/#organization`,
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryLabels[tool.category],
            item: `${SITE_URL}/#tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.title,
            item: url,
          },
        ],
      },
    ],
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
