import type { Metadata } from "next";
import { ToolHero } from "@/components/tools/ToolHero";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { PracticeProblems } from "@/components/tools/PracticeProblems";
import { ToolSeoArticle } from "@/components/tools/ToolSeoArticle";
import { JsonLd } from "@/components/tools/JsonLd";
import { TimeGraphingTool } from "@/components/tools/time-graphing/TimeGraphingTool";
import { buildToolMetadata, buildWebApplicationJsonLd } from "@/lib/seo";
import { categoryLabels, getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("timegraphing")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function TimeGraphingPage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd(tool)} />

      <ToolHero
        eyebrow={categoryLabels[tool.category]}
        title={tool.title}
        description={tool.description}
      />

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
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
