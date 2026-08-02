import Link from "next/link";
import { Compass } from "lucide-react";
import { SiteSearch } from "@/components/search/SiteSearch";
import { ToolDirectoryGrid } from "@/components/tools/ToolDirectoryGrid";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent-soft),transparent_55%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            <Compass className="h-3.5 w-3.5" />
            404
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            Tool Not Found
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            We could not find that page. Search below or browse the full list of
            calculators and guides to get back to learning.
          </p>

          <div className="mt-6 max-w-xl">
            <SiteSearch variant="hero" autoFocus />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Back to home
            </Link>
            <Link
              href="/#tools"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--accent)]"
            >
              Browse tools
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <ToolDirectoryGrid heading="All tools & guides — pick a destination" />
      </section>
    </div>
  );
}
