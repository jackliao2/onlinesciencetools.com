"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Beaker, Binary, BookOpen, Code2, Search, Sigma } from "lucide-react";
import { filterSearchItems, getSearchIndex } from "@/lib/search";
import { categoryLabels, type ToolCategory } from "@/lib/tools";

const categoryIcons: Record<ToolCategory, typeof Beaker> = {
  chemistry: Beaker,
  math: Sigma,
  computing: Code2,
};

export function HomeToolMatrix() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const index = useMemo(() => getSearchIndex(), []);
  const results = useMemo(
    () => filterSearchItems(deferred, index),
    [deferred, index],
  );

  const toolResults = results.filter((item) => item.kind === "tool");
  const guideResults = results.filter((item) => item.kind === "guide");

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--accent-soft),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Free science calculators since 2012
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Online Science Tools
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            Chemistry, math, and computing utilities built for real homework and
            classroom demos — fast in the browser, clear in the explanation, free
            for every student.
          </p>

          <div className="mt-8 max-w-xl">
            <label className="relative block">
              <span className="sr-only">Filter tools and guides</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Find a tool… e.g. "Equation", "Matrix", "GRE", "Stoichiometry"'
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3.5 pl-9 pr-4 text-sm shadow-sm outline-none ring-[var(--accent)] transition placeholder:text-[var(--muted)] focus:ring-2"
              />
            </label>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Showing {results.length} of {index.length} tools & guides
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tools/equilibriumcalculator"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Equilibrium Calculator
            </Link>
            <Link
              href="/guides/physicsgre"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--accent)]"
            >
              Physics GRE Guide
            </Link>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
            Tool matrix
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Pick a calculator and start exploring. Each page includes a short
            guide and practice problems with full solutions.
          </p>
        </div>

        {toolResults.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-[var(--muted)]">
            No tools match “{query}”. Try “phase”, “binary”, or “color”.
          </p>
        ) : (
          (["chemistry", "math", "computing"] as ToolCategory[]).map(
            (category) => {
              const Icon = categoryIcons[category];
              const items = toolResults.filter(
                (tool) => tool.kind === "tool" && tool.category === category,
              );
              if (items.length === 0) return null;

              return (
                <div key={category} className="mb-12 last:mb-0">
                  <div className="mb-4 flex items-center gap-2">
                    <Icon className="h-5 w-5 text-[var(--accent)]" />
                    <h3 className="text-lg font-semibold">
                      {categoryLabels[category]}
                    </h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={tool.href}
                        className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_16px_50px_-30px_var(--accent)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold group-hover:text-[var(--accent)]">
                              {tool.title}
                            </p>
                            <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                              {tool.href}
                            </p>
                          </div>
                          <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                            Free
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                          {tool.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            },
          )
        )}
      </section>

      <section
        id="guides"
        className="border-t border-[var(--border)] bg-[var(--surface)]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
              Study guides
            </h2>
          </div>
          {guideResults.length === 0 ? (
            <p className="text-[var(--muted)]">
              No guides match the current filter.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {guideResults.map((guide) => (
                <Link
                  key={guide.slug}
                  href={guide.href}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition hover:border-[var(--accent)]"
                >
                  <p className="font-semibold">{guide.title}</p>
                  <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                    {guide.href}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: Beaker,
              title: "Chemistry that teaches",
              text: "Molar mass, reaction stoichiometry, equilibrium ICE tables, and equation balancing — with worked examples on every page.",
            },
            {
              icon: BookOpen,
              title: "Guides for deep review",
              text: "Physics GRE formula sheets and electric-field concepts when you need more than a single calculator answer.",
            },
            {
              icon: Binary,
              title: "Math & computing utilities",
              text: "Graphing, time plots, phase portraits, linear systems, binary conversion, colors, and an HTML sandbox.",
            },
          ].map((item) => (
            <div key={item.title}>
              <item.icon className="h-6 w-6 text-[var(--accent)]" />
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
