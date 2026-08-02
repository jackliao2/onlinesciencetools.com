import type { MetadataRoute } from "next";
import { SITE_URL, legalPages } from "@/lib/site";
import { guides, tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const toolEntries = tools.map((tool) => ({
    url: `${SITE_URL}${tool.href}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: tool.status === "live" ? 0.9 : 0.6,
  }));

  const guideEntries = guides.map((guide) => ({
    url: `${SITE_URL}${guide.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const legalEntries = legalPages.map((page) => ({
    url: `${SITE_URL}${page.href}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: page.slug === "about" || page.slug === "contact" ? 0.7 : 0.4,
  }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolEntries,
    ...guideEntries,
    ...legalEntries,
  ];
}
