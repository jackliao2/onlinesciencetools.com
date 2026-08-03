"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { filterSearchItems, getSearchIndex } from "@/lib/search";
import {
  categoryLabels,
  groupOrderForCategory,
  toolGroupLabels,
  type ToolCategory,
} from "@/lib/tools";

const categoryOrder: ToolCategory[] = ["chemistry", "math", "computing"];

type SectionFilter = "all" | ToolCategory | "guides";

const filterTabs: Array<{ id: SectionFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "chemistry", label: categoryLabels.chemistry },
  { id: "math", label: categoryLabels.math },
  { id: "computing", label: categoryLabels.computing },
  { id: "guides", label: "Guides" },
];

export function HomeToolMatrix() {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<SectionFilter>("all");
  const deferred = useDeferredValue(query);
  const index = useMemo(() => getSearchIndex(), []);
  const results = useMemo(
    () => filterSearchItems(deferred, index),
    [deferred, index],
  );

  const toolResults = results.filter((item) => item.kind === "tool");
  const guideResults = results.filter((item) => item.kind === "guide");
  const searching = deferred.trim().length > 0;

  const visibleCategories =
    section === "all" || section === "guides"
      ? categoryOrder
      : categoryOrder.filter((c) => c === section);

  const showTools = section !== "guides";
  const showGuides = section === "all" || section === "guides";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
              Online Science Tools
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
              Browse by subject and topic group. Click a tool to open the
              calculator.
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search tools and guides</span>
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] py-2 pl-8 pr-3 text-sm outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-1"
            />
          </label>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Browse by subject"
        className="mt-5 flex flex-wrap gap-1 border-b border-[var(--border)] pb-px"
      >
        {filterTabs.map((tab) => {
          const active = section === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSection(tab.id)}
              className={`rounded-t-md px-3 py-2 text-sm transition ${
                active
                  ? "-mb-px border border-b-[var(--background)] border-[var(--border)] bg-[var(--background)] font-medium text-[var(--foreground)]"
                  : "border border-transparent text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {searching ? (
        <p className="mt-3 text-xs text-[var(--muted)]">
          {results.length} match{results.length === 1 ? "" : "es"} for “{query}”
        </p>
      ) : null}

      <div id="tools" className="mt-6 min-w-0 space-y-12">
        {showTools && toolResults.length === 0 && searching ? (
          <p className="text-sm text-[var(--muted)]">
            No tools match “{query}”.
          </p>
        ) : null}

        {showTools
          ? visibleCategories.map((category) => {
              const categoryTools = toolResults.filter(
                (tool) => tool.kind === "tool" && tool.category === category,
              );
              if (categoryTools.length === 0) return null;

              const groups = groupOrderForCategory(category);

              return (
                <section key={category}>
                  {section === "all" ? (
                    <h2 className="mb-5 border-b-2 border-[var(--foreground)] pb-2 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
                      {categoryLabels[category]}
                    </h2>
                  ) : (
                    <p className="mb-5 text-sm text-[var(--muted)]">
                      {categoryTools.length} tool
                      {categoryTools.length === 1 ? "" : "s"}
                    </p>
                  )}

                  <div className="space-y-8">
                    {groups.map((group) => {
                      const items = categoryTools.filter(
                        (tool) => tool.kind === "tool" && tool.group === group,
                      );
                      if (items.length === 0) return null;

                      return (
                        <div key={group}>
                          <div className="mb-0 flex items-center gap-3 border-l-[3px] border-[var(--accent)] bg-[var(--surface-2)] px-3 py-2.5">
                            <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]">
                              {toolGroupLabels[group]}
                            </h3>
                            <span className="text-xs tabular-nums text-[var(--muted)]">
                              {items.length}
                            </span>
                          </div>

                          <ul className="border border-t-0 border-[var(--border)]">
                            {items.map((tool) => (
                              <li
                                key={tool.slug}
                                className="border-t border-[var(--border)] first:border-t-0"
                              >
                                <Link
                                  href={tool.href}
                                  title={tool.title}
                                  className="group grid grid-cols-1 items-center gap-1 px-3 py-2.5 transition hover:bg-[var(--surface)] sm:grid-cols-[13.5rem_minmax(0,1fr)] sm:gap-6"
                                >
                                  <span className="truncate text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
                                    {tool.shortTitle}
                                  </span>
                                  <span className="truncate text-sm text-[var(--muted)]">
                                    {tool.description}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          : null}

        {showGuides ? (
          <section id="guides">
            <div className="mb-0 flex items-center gap-3 border-l-[3px] border-[var(--accent)] bg-[var(--surface-2)] px-3 py-2.5">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em]">
                Guides
              </h2>
              <span className="text-xs tabular-nums text-[var(--muted)]">
                {guideResults.length}
              </span>
            </div>
            {guideResults.length === 0 ? (
              <p className="border border-t-0 border-[var(--border)] px-3 py-3 text-sm text-[var(--muted)]">
                No guides match the current filter.
              </p>
            ) : (
              <ul className="border border-t-0 border-[var(--border)]">
                {guideResults.map((guide) => (
                  <li
                    key={guide.slug}
                    className="border-t border-[var(--border)] first:border-t-0"
                  >
                    <Link
                      href={guide.href}
                      title={guide.title}
                      className="group grid grid-cols-1 items-center gap-1 px-3 py-2.5 transition hover:bg-[var(--surface)] sm:grid-cols-[13.5rem_minmax(0,1fr)] sm:gap-6"
                    >
                      <span className="truncate text-sm font-medium group-hover:text-[var(--accent)]">
                        {guide.shortTitle}
                      </span>
                      <span className="truncate text-sm text-[var(--muted)]">
                        {guide.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
