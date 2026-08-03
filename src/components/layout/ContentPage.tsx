import type { ReactNode } from "react";
import { ToolHero } from "@/components/tools/ToolHero";

export function ContentPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <ToolHero
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <article className="prose-ost max-w-none border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
          {children}
        </article>
      </section>
    </>
  );
}
