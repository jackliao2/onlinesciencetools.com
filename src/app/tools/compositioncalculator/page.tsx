import type { Metadata } from "next";
import { ToolHero } from "@/components/tools/ToolHero";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { PracticeProblems } from "@/components/tools/PracticeProblems";
import { ToolSeoArticle } from "@/components/tools/ToolSeoArticle";
import { JsonLd } from "@/components/tools/JsonLd";
import { CompositionCalculator } from "@/components/tools/composition/CompositionCalculator";
import { buildToolMetadata, buildWebApplicationJsonLd } from "@/lib/seo";
import { categoryLabels, getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("compositioncalculator")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function CompositionCalculatorPage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd(tool)} />
      <ToolHero
        eyebrow={categoryLabels[tool.category]}
        title={tool.title}
        description={tool.description}
      />
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <CompositionCalculator />
      </section>
      <ToolSeoArticle slug={tool.slug} />
      <PracticeProblems slug={tool.slug} topicLabel="composition calculator" />
      <RelatedTools slug={tool.slug} />
    </>
  );
}
