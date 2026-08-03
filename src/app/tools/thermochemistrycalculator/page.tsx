import type { Metadata } from "next";
import { ToolHero } from "@/components/tools/ToolHero";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { PracticeProblems } from "@/components/tools/PracticeProblems";
import { ToolSeoArticle } from "@/components/tools/ToolSeoArticle";
import { JsonLd } from "@/components/tools/JsonLd";
import { ThermochemistryCalculator } from "@/components/tools/thermo/ThermochemistryCalculator";
import { buildToolMetadata, buildWebApplicationJsonLd } from "@/lib/seo";
import { categoryLabels, getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("thermochemistrycalculator")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function ThermochemistryCalculatorPage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd(tool)} />
      <ToolHero
        eyebrow={categoryLabels[tool.category]}
        title={tool.title}
        description={tool.description}
      />
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <ThermochemistryCalculator />
      </section>
      <ToolSeoArticle slug={tool.slug} />
      <PracticeProblems slug={tool.slug} topicLabel="thermochemistry" />
      <RelatedTools slug={tool.slug} />
    </>
  );
}
