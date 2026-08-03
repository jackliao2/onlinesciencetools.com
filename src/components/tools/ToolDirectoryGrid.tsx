import Link from "next/link";
import {
  categoryLabels,
  guides,
  tools,
  type ToolCategory,
} from "@/lib/tools";

export function ToolDirectoryGrid({
  heading = "All tools & guides",
}: {
  heading?: string;
}) {
  return (
    <div className="space-y-8">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
        {heading}
      </h2>

      {(["chemistry", "math", "computing"] as ToolCategory[]).map((category) => {
        const items = tools.filter((tool) => tool.category === category);
        return (
          <section key={category}>
            <h3 className="mb-1 border-b border-[var(--border)] pb-1.5 text-sm font-semibold">
              {categoryLabels[category]}
            </h3>
            <ul className="divide-y divide-[var(--border)]">
              {items.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={tool.href}
                    className="group flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="shrink-0 font-medium group-hover:text-[var(--accent)] sm:w-48">
                      {tool.shortTitle}
                    </span>
                    <span className="text-sm text-[var(--muted)] line-clamp-2">
                      {tool.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section>
        <h3 className="mb-1 border-b border-[var(--border)] pb-1.5 text-sm font-semibold">
          Guides
        </h3>
        <ul className="divide-y divide-[var(--border)]">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={guide.href}
                className="group flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="shrink-0 font-medium group-hover:text-[var(--accent)] sm:w-48">
                  {guide.shortTitle}
                </span>
                <span className="text-sm text-[var(--muted)] line-clamp-2">
                  {guide.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
