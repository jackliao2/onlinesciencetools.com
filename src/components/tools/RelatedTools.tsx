import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getRelatedTools, type Tool } from "@/lib/tools";

export function RelatedTools({ slug }: { slug: string }) {
  const related = getRelatedTools(slug);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Related tools
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          Continue exploring the Online Science Tools matrix.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((tool) => (
          <RelatedToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}

function RelatedToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_12px_40px_-24px_var(--accent)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
          {tool.shortTitle}
        </h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
      </div>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
        {tool.description}
      </p>
      {tool.status === "coming-soon" && (
        <span className="mt-3 inline-block text-xs font-medium text-[var(--accent)]">
          Coming soon
        </span>
      )}
    </Link>
  );
}
