import type { Metadata } from "next";
import { CategoryHub } from "@/components/hubs/CategoryHub";
import { buildStaticPageMetadata } from "@/lib/seo";
import { categoryHubs } from "@/lib/tools";

const page = categoryHubs.chemistry;

export const metadata: Metadata = buildStaticPageMetadata(page);

export default function ChemistryHubPage() {
  return <CategoryHub category="chemistry" />;
}
