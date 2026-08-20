import {
  BALANCE_PRACTICE_PROBLEMS,
  PRACTICE_LEVELS,
  type PracticeLevel,
} from "@/lib/chemistry/balance-practice";

const LEVEL_BLURBS: Record<PracticeLevel, string> = {
  intro: "Diatomic elements, simple oxides, and single replacements.",
  combustion: "Hydrocarbons and oxygenates: C, then H, then O (clear fractions).",
  polyatomic: "Nitrate, sulfate, hydroxide, and phosphate as intact groups.",
  challenge: "Redox-adjacent formula equations still balanced by atoms only.",
};

export function BalancePracticeCatalog() {
  const grouped = (["intro", "combustion", "polyatomic", "challenge"] as const).map(
    (level) => ({
      level,
      label: PRACTICE_LEVELS.find((item) => item.id === level)?.label ?? level,
      blurb: LEVEL_BLURBS[level],
      items: BALANCE_PRACTICE_PROBLEMS.filter((p) => p.level === level),
    }),
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <article className="prose-ost max-w-none rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
        <h2>Balancing chemical equations practice set</h2>
        <p>
          {BALANCE_PRACTICE_PROBLEMS.length} inspection problems live in the
          Practice tab above. Formulas are locked; you only fill coefficients.
          Use the live atom-check table, or turn on Quiz to hide it until you
          check.
        </p>
        {grouped.map((group) => (
          <div key={group.level} className="not-prose mt-6">
            <h3 className="font-semibold text-[var(--foreground)]">
              {group.label}
              <span className="ml-2 text-sm font-normal text-[var(--muted)]">
                {group.items.length} equations
              </span>
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
            <ul className="mt-3 space-y-1.5 font-mono text-sm text-[var(--muted)]">
              {group.items.map((item) => (
                <li key={item.id}>
                  <span className="text-[var(--foreground)]">{item.title}:</span>{" "}
                  {item.equation.replace("=", "→")}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </article>
    </section>
  );
}
