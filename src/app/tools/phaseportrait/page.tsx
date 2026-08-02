import type { Metadata } from "next";
import { ToolHero } from "@/components/tools/ToolHero";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { PracticeProblems } from "@/components/tools/PracticeProblems";
import { ToolSeoArticle } from "@/components/tools/ToolSeoArticle";
import { JsonLd } from "@/components/tools/JsonLd";
import { PhasePortraitGenerator } from "@/components/tools/phase-portrait/PhasePortraitGenerator";
import { buildToolMetadata, buildWebApplicationJsonLd } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("phaseportrait")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function PhasePortraitPage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd(tool)} />

      <ToolHero
        eyebrow="Dynamical Systems"
        title={tool.title}
        description={tool.description}
        badge={
          <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">
            Differential equations
          </span>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <PhasePortraitGenerator />
      </section>

      <ToolSeoArticle slug={tool.slug} />
      <PracticeProblems
        slug={tool.slug}
        topicLabel="phase portrait generator"
      />
      <RelatedTools slug={tool.slug} />
    </>
  );
}
