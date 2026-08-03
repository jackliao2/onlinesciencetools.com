interface ToolHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function ToolHero({ eyebrow, title, description }: ToolHeroProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
        <p className="text-xs font-medium text-[var(--muted)]">{eyebrow}</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[1.75rem]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          {description}
        </p>
      </div>
    </header>
  );
}
