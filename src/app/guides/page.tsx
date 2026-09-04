import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/tools/JsonLd";
import { ToolHero } from "@/components/tools/ToolHero";
import { buildCollectionJsonLd, buildStaticPageMetadata } from "@/lib/seo";
import { guides, guidesHub } from "@/lib/tools";

export const metadata: Metadata = buildStaticPageMetadata(guidesHub);

export default function GuidesIndexPage() {
  return (
    <>
      <JsonLd
        data={buildCollectionJsonLd(
          guidesHub,
          guides.map((guide) => ({ name: guide.title, href: guide.href })),
        )}
      />
      <ToolHero
        title={guidesHub.title}
        description={guidesHub.description}
        isSectionRoot
      />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <article className="prose-ost max-w-none border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
          <p>
            Formula sheets and short study notes that sit next to the
            calculators. Chemistry, intro physics, and differential-equations
            sheets collect the relations you type into homework; the Physics GRE
            equation sheet and electric field guide go deeper on those topics.
          </p>
          <div className="not-prose mt-6">
            <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={guide.href}
                    className="group flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="shrink-0 font-medium group-hover:text-[var(--accent)] sm:w-56">
                      {guide.title}
                    </span>
                    <span className="text-sm text-[var(--muted)]">
                      {guide.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6">
            Calculators are grouped under{" "}
            <Link href="/chemistry">chemistry</Link>,{" "}
            <Link href="/math">math</Link>, and{" "}
            <Link href="/computing">computing</Link>.
          </p>
        </article>
      </section>
    </>
  );
}
