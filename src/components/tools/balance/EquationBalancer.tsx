"use client";

import { useMemo, useState } from "react";
import {
  BalanceError,
  balanceEquation,
} from "@/lib/chemistry/balance-equation";
import { Scale, RotateCcw } from "lucide-react";

const EXAMPLES = [
  "H2 + O2 = H2O",
  "Fe + O2 = Fe2O3",
  "C2H6 + O2 = CO2 + H2O",
  "KMnO4 + HCl = KCl + MnCl2 + H2O + Cl2",
  "Cu + HNO3 = Cu(NO3)2 + NO + H2O",
];

export function EquationBalancer() {
  const [input, setInput] = useState("Fe + O2 = Fe2O3");

  const result = useMemo(() => {
    try {
      return { ok: true as const, value: balanceEquation(input) };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof BalanceError
            ? error.message
            : "Could not balance this equation.",
      };
    }
  }, [input]);

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Scale className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Equation balancer
          </span>
        </div>
        <button
          type="button"
          onClick={() => setInput("Fe + O2 = Fe2O3")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-medium">Chemical equation</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder="e.g. C2H6 + O2 = CO2 + H2O"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-mono text-lg outline-none ring-[var(--accent)] focus:ring-2"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setInput(example)}
            className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 font-mono text-xs text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {example}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        Balances atoms in neutral formula equations only. Ionic charges, electrons,
        and acidic/basic redox half-reactions (H⁺, OH⁻, e⁻) are not supported.
      </p>

      <div className="mt-6">
        {!result.ok ? (
          <div className="rounded-2xl border border-rose-300/50 bg-rose-50/70 p-5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200">
            {result.error}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-2),var(--surface))] p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Balanced equation
              </p>
              <p className="mt-3 font-mono text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                {result.value.equation}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SideCard title="Reactants" items={result.value.reactants} />
              <SideCard title="Products" items={result.value.products} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SideCard({
  title,
  items,
}: {
  title: string;
  items: Array<{ formula: string; coefficient: number }>;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={`${title}-${item.formula}`}
            className="flex items-center justify-between rounded-xl bg-[var(--surface-2)] px-3 py-2 font-mono text-sm"
          >
            <span>{item.formula}</span>
            <span className="font-semibold text-[var(--accent)]">
              ×{item.coefficient}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
