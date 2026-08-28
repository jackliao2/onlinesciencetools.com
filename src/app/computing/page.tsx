import type { Metadata } from "next";
import { CategoryHub } from "@/components/hubs/CategoryHub";
import { buildStaticPageMetadata } from "@/lib/seo";
import { categoryHubs } from "@/lib/tools";

const page = categoryHubs.computing;

export const metadata: Metadata = buildStaticPageMetadata(page);

export default function ComputingHubPage() {
  return <CategoryHub category="computing" />;
}
