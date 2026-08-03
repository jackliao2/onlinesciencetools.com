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
        eyebrow="Guides"
        title={guide.title}
        description={guide.description}
      />
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <article className="prose-ost max-w-none border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
          {children}
          <AuthorityReferences references={references} />
        </article>
      </section>

      <section className="mx-auto max-w-6xl border-t border-[var(--border)] px-4 py-8 sm:px-6">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
          More guides & tools
        </h2>
        <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.href}
                className="group flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="shrink-0 font-medium group-hover:text-[var(--accent)] sm:w-48">
                  {item.shortTitle}
                </span>
                <span className="text-sm text-[var(--muted)] line-clamp-1">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/tools/phaseportrait"
              className="group flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="shrink-0 font-medium group-hover:text-[var(--accent)] sm:w-48">
                Phase Portrait Generator
              </span>
              <span className="text-sm text-[var(--muted)] line-clamp-1">
                Visualize dynamical systems that appear throughout physics GRE
                prep.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/tools/graphingcalculator"
              className="group flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="shrink-0 font-medium group-hover:text-[var(--accent)] sm:w-48">
                2D Graphing Calculator
              </span>
              <span className="text-sm text-[var(--muted)] line-clamp-1">
                Plot review formulas while studying for quantitative sections.
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}
