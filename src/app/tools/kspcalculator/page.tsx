import type { Metadata } from "next";
import { ToolHero } from "@/components/tools/ToolHero";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { PracticeProblems } from "@/components/tools/PracticeProblems";
import { ToolSeoArticle } from "@/components/tools/ToolSeoArticle";
import { JsonLd } from "@/components/tools/JsonLd";
import { KspCalculator } from "@/components/tools/ksp/KspCalculator";
import { buildToolMetadata, buildWebApplicationJsonLd } from "@/lib/seo";
import { categoryLabels, getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("kspcalculator")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function KspCalculatorPage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd(tool)} />
      <ToolHero
        eyebrow={categoryLabels[tool.category]}
        title={tool.title}
        description={tool.description}
      />
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <KspCalculator />
      </section>
      <ToolSeoArticle slug={tool.slug} />
      <PracticeProblems slug={tool.slug} topicLabel="Ksp calculator" />
      <RelatedTools slug={tool.slug} />
    </>
  );
}
