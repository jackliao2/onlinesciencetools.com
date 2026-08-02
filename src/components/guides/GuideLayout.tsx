import Link from "next/link";
import { AuthorityReferences } from "@/components/content/AuthorityReferences";
import { JsonLd } from "@/components/tools/JsonLd";
import { ToolHero } from "@/components/tools/ToolHero";
import { buildArticleJsonLd } from "@/lib/seo";
import { guideReferences } from "@/lib/tool-articles/references";
import { guides, type Guide } from "@/lib/tools";
import type { ReactNode } from "react";

export function GuideLayout({
  guide,
  children,
}: {
  guide: Guide;
  children: ReactNode;
}) {
  const related = guides.filter((g) => g.slug !== guide.slug);
  const references = guideReferences[guide.slug] ?? [];

  return (
    <>
      <JsonLd data={buildArticleJsonLd(guide)} />
      <ToolHero
        eyebrow="Academic Guides"
        title={guide.title}
        description={guide.description}
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <article className="prose-ost max-w-none rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
          {children}
          <AuthorityReferences references={references} />
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          More guides & tools
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
            >
              <p className="font-semibold">{item.shortTitle}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p>
            </Link>
          ))}
          <Link
            href="/tools/phaseportrait"
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
          >
            <p className="font-semibold">Phase Portrait Generator</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Visualize dynamical systems that appear throughout physics GRE prep.
            </p>
          </Link>
          <Link
            href="/tools/graphingcalculator"
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
          >
            <p className="font-semibold">2D Graphing Calculator</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Plot review formulas while studying for quantitative sections.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
