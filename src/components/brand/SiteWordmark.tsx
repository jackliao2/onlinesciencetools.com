type SiteWordmarkProps = {
  variant?: "header" | "hero" | "footer";
  className?: string;
};

/**
 * Shared brand wordmark: restrained hierarchy (Online / Science Tools)
 * without renaming the site or going decorative.
 */
export function SiteWordmark({
  variant = "header",
  className = "",
}: SiteWordmarkProps) {
  if (variant === "hero") {
    return (
      <span className={`block ${className}`}>
        <span className="block font-[family-name:var(--font-body)] text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] sm:text-xs">
          Online
        </span>
        <span className="mt-1 block font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
          Science&nbsp;Tools
        </span>
      </span>
    );
  }

  if (variant === "footer") {
    return (
      <span
        className={`inline-flex flex-col leading-tight ${className}`}
      >
        <span className="font-[family-name:var(--font-body)] text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Online
        </span>
        <span className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--foreground)]">
          Science Tools
        </span>
      </span>
    );
  }

  // header
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-[family-name:var(--font-display)] ${className}`}
    >
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] sm:text-[0.7rem]">
        Online
      </span>
      <span className="text-sm font-semibold tracking-tight text-[var(--foreground)] sm:text-base">
        Science Tools
      </span>
    </span>
  );
}
