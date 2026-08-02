import type { Metadata } from "next";
import { ToolHero } from "@/components/tools/ToolHero";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { PracticeProblems } from "@/components/tools/PracticeProblems";
import { ToolSeoArticle } from "@/components/tools/ToolSeoArticle";
import { JsonLd } from "@/components/tools/JsonLd";
import { GraphingCalculator } from "@/components/tools/graphing/GraphingCalculator";
import { buildToolMetadata, buildWebApplicationJsonLd } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("graphingcalculator")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function GraphingCalculatorPage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd(tool)} />

      <ToolHero
        eyebrow="Mathematics & Computation"
        title={tool.title}
        description={tool.description}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <GraphingCalculator />
      </section>

      <ToolSeoArticle slug={tool.slug} />
      <PracticeProblems
        slug={tool.slug}
        topicLabel="graphing calculator"
      />
      <RelatedTools slug={tool.slug} />
    </>
  );
}
