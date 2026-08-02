import type { Metadata } from "next";
import { ToolHero } from "@/components/tools/ToolHero";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { PracticeProblems } from "@/components/tools/PracticeProblems";
import { ToolSeoArticle } from "@/components/tools/ToolSeoArticle";
import { JsonLd } from "@/components/tools/JsonLd";
import { TimeGraphingTool } from "@/components/tools/time-graphing/TimeGraphingTool";
import { buildToolMetadata, buildWebApplicationJsonLd } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("timegraphing")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function TimeGraphingPage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd(tool)} />

      <ToolHero
        eyebrow="Mathematics & Calculus"
        title={tool.title}
        description={tool.description}
        badge={
          <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">
            Animation
          </span>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <TimeGraphingTool />
      </section>

      <ToolSeoArticle slug={tool.slug} />
      <PracticeProblems
        slug={tool.slug}
        topicLabel="time graphing tool"
      />
      <RelatedTools slug={tool.slug} />
    </>
  );
}
