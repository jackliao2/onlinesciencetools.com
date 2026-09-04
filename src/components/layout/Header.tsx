import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { SiteSearch } from "@/components/search/SiteSearch";

const nav = [
  { href: "/chemistry", label: "Chemistry" },
  { href: "/math", label: "Math" },
  { href: "/computing", label: "Computing" },
  { href: "/guides", label: "Guides" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 sm:px-6 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-0">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--accent)] text-white">
            <FlaskConical className="h-4 w-4" aria-hidden />
          </span>
          <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--foreground)] sm:text-base">
            Online Science Tools
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-3 lg:justify-end">
          <div className="min-w-0 flex-1 lg:max-w-xs">
            <SiteSearch variant="header" />
          </div>
          <nav className="hidden items-center gap-1 text-sm lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/about"
              className="rounded-lg px-3 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              About
            </Link>
          </nav>
        </div>

        <nav
          aria-label="Subjects"
          className="no-scrollbar -mx-4 flex items-center gap-0.5 overflow-x-auto px-4 text-sm lg:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex shrink-0 items-center rounded-lg px-3 py-2.5 text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
