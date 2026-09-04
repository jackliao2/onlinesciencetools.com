import Link from "next/link";
import { categoryHubHrefFromLabel } from "@/lib/tools";

interface ToolHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  eyebrowHref?: string;
  isSectionRoot?: boolean;
}

export function ToolHero({
  eyebrow,
  title,
  description,
  eyebrowHref,
  isSectionRoot = false,
}: ToolHeroProps) {
  const hubHref =
    eyebrowHref ??
    (eyebrow ? categoryHubHrefFromLabel(eyebrow) : undefined) ??
    "/";

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted)]">
            <li>
              <Link
                href="/"
                className="inline-block py-1 hover:text-[var(--accent)] hover:underline"
              >
                Home
              </Link>
            </li>
            {isSectionRoot ? (
              <>
                <li aria-hidden="true">/</li>
                <li
                  className="min-w-0 break-words text-[var(--foreground)]"
                  aria-current="page"
                >
                  {title}
                </li>
              </>
            ) : (
              <>
                {eyebrow ? (
                  <>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link
                        href={hubHref}
                        className="hover:text-[var(--accent)] hover:underline"
                      >
                        {eyebrow}
                      </Link>
                    </li>
                  </>
                ) : null}
                <li aria-hidden="true">/</li>
                <li
                  className="min-w-0 break-words text-[var(--foreground)]"
                  aria-current="page"
                >
                  {title}
                </li>
              </>
            )}
          </ol>
        </nav>
        <h1 className="mt-1 break-words font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[1.75rem]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          {description}
        </p>
      </div>
    </header>
  );
}
