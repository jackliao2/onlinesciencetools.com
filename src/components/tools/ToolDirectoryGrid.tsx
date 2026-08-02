import Link from "next/link";
import {
  categoryLabels,
  guides,
  tools,
  type ToolCategory,
} from "@/lib/tools";

export function ToolDirectoryGrid({
  heading = "Browse all tools & guides",
}: {
  heading?: string;
}) {
  return (
    <div className="space-y-10">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        {heading}
      </h2>

      {(["chemistry", "math", "computing"] as ToolCategory[]).map((category) => {
        const items = tools.filter((tool) => tool.category === category);
        return (
          <div key={category}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              {categoryLabels[category]}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)]"
                >
                  <p className="font-semibold">{tool.shortTitle}</p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--muted)]">
                    {tool.href}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Academic Guides
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={guide.href}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)]"
            >
              <p className="font-semibold">{guide.shortTitle}</p>
              <p className="mt-1 font-mono text-[11px] text-[var(--muted)]">
                {guide.href}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
