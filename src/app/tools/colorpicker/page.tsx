import type { Metadata } from "next";
import { ToolHero } from "@/components/tools/ToolHero";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { PracticeProblems } from "@/components/tools/PracticeProblems";
import { ToolSeoArticle } from "@/components/tools/ToolSeoArticle";
import { JsonLd } from "@/components/tools/JsonLd";
import { ColorPicker } from "@/components/tools/color/ColorPicker";
import { buildToolMetadata, buildWebApplicationJsonLd } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("colorpicker")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function ColorPickerPage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd(tool)} />

      <ToolHero
        eyebrow="Computing & Web Tools"
        title={tool.title}
        description={tool.description}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ColorPicker />
      </section>

      <ToolSeoArticle slug={tool.slug} />
      <PracticeProblems
        slug={tool.slug}
        topicLabel="color picker"
      />
      <RelatedTools slug={tool.slug} />
    </>
  );
}
