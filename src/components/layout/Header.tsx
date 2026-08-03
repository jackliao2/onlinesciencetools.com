import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { SiteWordmark } from "@/components/brand/SiteWordmark";
import { SiteSearch } from "@/components/search/SiteSearch";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-0">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-white transition-transform group-hover:scale-[1.03]">
              <FlaskConical className="h-4 w-4" aria-hidden />
            </span>
            <SiteWordmark variant="header" />
          </Link>

          <nav className="flex items-center gap-1 text-sm lg:hidden">
            <Link
              href="/#tools"
              className="rounded-lg px-2 py-2 text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Tools
            </Link>
            <Link
              href="/#guides"
              className="rounded-lg px-2 py-2 text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Guides
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center gap-3 lg:justify-end">
          <div className="min-w-0 flex-1 lg:max-w-xs">
            <SiteSearch variant="header" />
          </div>
          <nav className="hidden items-center gap-1 text-sm lg:flex">
            <Link
              href="/#tools"
              className="rounded-lg px-3 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              Tools
            </Link>
            <Link
              href="/#guides"
              className="rounded-lg px-3 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              Guides
            </Link>
            <Link
              href="/tools/equilibriumcalculator"
              className="rounded-lg px-3 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              Equilibrium
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-3 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-3 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
