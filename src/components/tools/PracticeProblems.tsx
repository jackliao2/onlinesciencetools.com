import type { PracticeProblem } from "@/lib/practice-problems";
import { getPracticeProblems } from "@/lib/practice-problems";

export function PracticeProblems({
  slug,
  topicLabel,
}: {
  slug: string;
  topicLabel?: string;
}) {
  const problems = getPracticeProblems(slug);
  if (problems.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <article className="prose-ost max-w-none rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
        <h2>Practice problems & worked examples</h2>
        <p>
          Practice alongside the {topicLabel ?? "tool"} above. Each problem
          includes a full worked solution so you can check your reasoning step by
          step.
        </p>

        <div className="not-prose mt-6 space-y-4">
          {problems.map((problem, index) => (
            <ProblemCard
              key={problem.title}
              index={index + 1}
              problem={problem}
            />
          ))}
        </div>
      </article>
    </section>
  );
}

function ProblemCard({
  index,
  problem,
}: {
  index: number;
  problem: PracticeProblem;
}) {
  return (
    <details className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] open:bg-[var(--surface)]">
      <summary className="cursor-pointer list-none px-5 py-4 marker:content-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Practice problem {index}
            </p>
            <p className="mt-1 font-semibold text-[var(--foreground)]">
              {problem.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {problem.prompt}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)] group-open:hidden">
            Show solution
          </span>
          <span className="hidden shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)] group-open:inline">
            Hide solution
          </span>
        </div>
      </summary>

      <div className="border-t border-[var(--border)] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Worked solution
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)]">
          {problem.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-4 rounded-xl bg-[var(--accent-soft)] px-3 py-2 font-mono text-sm font-semibold text-[var(--foreground)]">
          Answer: {problem.answer}
        </p>
      </div>
    </details>
  );
}
