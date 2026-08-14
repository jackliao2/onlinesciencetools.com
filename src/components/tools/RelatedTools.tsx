import Link from "next/link";
import {
  categoryLabels,
  getRelatedTools,
  toolGroupLabels,
  type Tool,
} from "@/lib/tools";

export function RelatedTools({ slug }: { slug: string }) {
  const related = getRelatedTools(slug);

  return (
    <section className="mx-auto max-w-6xl border-t border-[var(--border)] px-4 py-8 sm:px-6">
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
        Related tools
      </h2>
      <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {related.map((tool) => (
          <RelatedToolRow key={tool.slug} tool={tool} />
        ))}
      </ul>
    </section>
  );
}

function RelatedToolRow({ tool }: { tool: Tool }) {
  return (
    <li>
      <Link
        href={tool.href}
        className="group flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-6"
      >
        <span className="shrink-0 text-xs text-[var(--muted)] sm:w-40">
          {toolGroupLabels[tool.group]}
        </span>
        <span className="font-medium group-hover:text-[var(--accent)] sm:w-56 sm:shrink-0">
          {tool.title}
        </span>
        <span className="text-sm text-[var(--muted)] line-clamp-1">
          {tool.description}
        </span>
      </Link>
    </li>
  );
}
