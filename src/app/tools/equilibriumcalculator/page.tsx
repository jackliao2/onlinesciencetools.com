import type { Metadata } from "next";
import { ToolHero } from "@/components/tools/ToolHero";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { PracticeProblems } from "@/components/tools/PracticeProblems";
import { ToolSeoArticle } from "@/components/tools/ToolSeoArticle";
import { JsonLd } from "@/components/tools/JsonLd";
import { EquilibriumCalculator } from "@/components/tools/equilibrium/EquilibriumCalculator";
import { buildToolMetadata, buildWebApplicationJsonLd } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("equilibriumcalculator")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function EquilibriumCalculatorPage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd(tool)} />

      <ToolHero
        eyebrow="Chemistry Tools"
        title={tool.title}
        description={tool.description}
        badge={
          <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">
            Chemistry
          </span>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <EquilibriumCalculator />
      </section>

      <ToolSeoArticle slug={tool.slug} />
      <PracticeProblems
        slug={tool.slug}
        topicLabel="equilibrium calculator"
      />
      <RelatedTools slug={tool.slug} />
    </>
  );
}
