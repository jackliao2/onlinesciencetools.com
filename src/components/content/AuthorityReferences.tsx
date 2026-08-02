import { ExternalLink } from "lucide-react";
import type { AuthorityReference } from "@/lib/tool-articles/references";

export function AuthorityReferences({
  title = "References & further reading",
  references,
}: {
  title?: string;
  references: AuthorityReference[];
}) {
  if (references.length === 0) return null;

  return (
    <div className="not-prose mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Standards bodies, university open courseware, and peer-reviewed references
        that align with the methods used on this page.
      </p>
      <ul className="mt-4 space-y-3">
        {references.map((ref) => (
          <li key={ref.href}>
            <a
              href={ref.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-2 font-medium text-[var(--accent)] hover:underline"
            >
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>
                <span className="block text-[var(--foreground)] group-hover:text-[var(--accent)]">
                  {ref.label}
                </span>
                <span className="mt-0.5 block text-sm font-normal text-[var(--muted)]">
                  {ref.note}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
