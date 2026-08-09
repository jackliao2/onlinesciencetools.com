import type { Metadata } from "next";
import {
  absoluteContentImageUrl,
  contentImages,
  type ContentImageKey,
} from "@/lib/content-images";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { categoryLabels, type Guide, type Tool } from "@/lib/tools";

function contentImageForSlug(slug: string): string | undefined {
  if (slug in contentImages) {
    return absoluteContentImageUrl(
      contentImages[slug as ContentImageKey],
      SITE_URL,
    );
  }
  return undefined;
}

function buildPageMetadata(input: {
  title: string;
  description: string;
  keywords: string[];
  href: string;
  imageUrl?: string;
}): Metadata {
  const fullTitle = `${input.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${input.href}`;
  const images = input.imageUrl
    ? [{ url: input.imageUrl, width: 1600, height: 900, alt: input.title }]
    : undefined;

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
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      ...(input.imageUrl ? { images: [input.imageUrl] } : {}),
    },
  };
}

export function buildToolMetadata(tool: Tool): Metadata {
  return buildPageMetadata({
    ...tool,
    imageUrl: contentImageForSlug(tool.slug),
  });
}

export function buildGuideMetadata(guide: Guide): Metadata {
  return buildPageMetadata({
    ...guide,
    imageUrl: contentImageForSlug(guide.slug),
  });
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
  const homeImage = absoluteContentImageUrl(contentImages.home, SITE_URL);
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
        image: homeImage,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        image: homeImage,
      },
    ],
  };
}

export function buildWebApplicationJsonLd(tool: Tool) {
  const url = `${SITE_URL}${tool.href}`;
  const image = contentImageForSlug(tool.slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        "@id": `${url}#app`,
        name: tool.title,
        description: tool.description,
        url,
        ...(image ? { image } : {}),
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

export function buildArticleJsonLd(guide: Guide, imageSrc?: string) {
  const image =
    imageSrc != null
      ? `${SITE_URL}${imageSrc.startsWith("/") ? imageSrc : `/${imageSrc}`}`
      : contentImageForSlug(guide.slug);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${SITE_URL}${guide.href}`,
    ...(image ? { image } : {}),
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
