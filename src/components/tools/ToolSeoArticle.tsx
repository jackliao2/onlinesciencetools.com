import Link from "next/link";
import { AuthorityReferences } from "@/components/content/AuthorityReferences";
import { JsonLd } from "@/components/tools/JsonLd";
import { getToolArticle } from "@/lib/tool-articles";
import { toolReferences } from "@/lib/tool-articles/references";
import { getToolBySlug } from "@/lib/tools";

export function ToolSeoArticle({ slug }: { slug: string }) {
  const article = getToolArticle(slug);
  const tool = getToolBySlug(slug);
  if (!article || !tool) return null;
  const references = toolReferences[slug] ?? [];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <JsonLd data={faqLd} />
      <article className="prose-ost max-w-none rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
        <h2>What is the {tool.title}?</h2>
        {article.whatIs.paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
        {article.whatIs.bullets && article.whatIs.bullets.length > 0 && (
          <ul>
            {article.whatIs.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}

        <h2>Mathematical / chemical formulas</h2>
        <p>{article.formula.intro}</p>
        {article.formula.blocks.map((block) => (
          <pre key={block}>
            <code>{block}</code>
          </pre>
        ))}
        {article.formula.notes && (
          <ul>
            {article.formula.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}

        <h2>Step-by-step example: {article.example.title}</h2>
        <p>{article.example.scenario}</p>
        <ol className="list-decimal space-y-2 pl-5 text-[var(--muted)]">
          {article.example.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>{article.example.toolCheck}</p>

        <h2>Frequently asked questions</h2>
        <div className="not-prose mt-4 space-y-3">
          {article.faq.map((item) => (
            <details
              key={item.question}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] open:bg-[var(--surface)]"
            >
              <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-[var(--foreground)]">
                {item.question}
              </summary>
              <p className="border-t border-[var(--border)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <AuthorityReferences references={references} />

        <p className="mt-8 !mb-0 text-sm text-[var(--muted)]">
          Keep learning with{" "}
          <Link href="/#tools">more calculators</Link> and{" "}
          <Link href="/#guides">study guides</Link> on Online Science Tools.
        </p>
      </article>
    </section>
  );
}
