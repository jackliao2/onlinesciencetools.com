import Link from "next/link";
import { SiteWordmark } from "@/components/brand/SiteWordmark";
import {
  categoryLabels,
  guides,
  tools,
} from "@/lib/tools";
import { legalPages, SITE_NAME } from "@/lib/site";

export function Footer() {
  const columns: Array<{
    title: string;
    links: Array<{ href: string; label: string }>;
  }> = [
    {
      title: categoryLabels.chemistry,
      links: tools
        .filter((t) => t.category === "chemistry")
        .map((t) => ({ href: t.href, label: t.shortTitle })),
    },
    {
      title: "Mathematics",
      links: tools
        .filter((t) => t.category === "math")
        .map((t) => ({ href: t.href, label: t.shortTitle })),
    },
    {
      title: "Computing",
      links: tools
        .filter((t) => t.category === "computing")
        .map((t) => ({ href: t.href, label: t.shortTitle })),
    },
    {
      title: "Guides",
      links: [
        ...guides.map((g) => ({ href: g.href, label: g.shortTitle })),
        ...legalPages.map((p) => ({ href: p.href, label: p.shortTitle })),
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <p>
              <SiteWordmark variant="footer" />
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Educational science calculators and study guides for coursework
              and self-study.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href="/" className="text-[var(--accent)] hover:underline">
                Home
              </Link>
              <Link href="/about" className="text-[var(--accent)] hover:underline">
                About
              </Link>
              <Link
                href="/contact"
                className="text-[var(--accent)] hover:underline"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-semibold text-[var(--foreground)]">
                  {column.title === "Guides" ? "Guides & legal" : column.title}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-3">
            <Link href="/privacy" className="hover:text-[var(--foreground)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--foreground)]">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-[var(--foreground)]">
              Contact
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
