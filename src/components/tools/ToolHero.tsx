import type { ReactNode } from "react";

interface ToolHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: ReactNode;
}

export function ToolHero({ eyebrow, title, description, badge }: ToolHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent-soft),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {eyebrow}
          </p>
          {badge}
        </div>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
