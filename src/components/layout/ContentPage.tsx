import type { ReactNode } from "react";
import { ToolHero } from "@/components/tools/ToolHero";

export function ContentPage({
  eyebrow,
  title,
  description,
  children,
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <>
      <ToolHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        badge={badge}
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <article className="prose-ost max-w-none rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
          {children}
        </article>
      </section>
    </>
  );
}
