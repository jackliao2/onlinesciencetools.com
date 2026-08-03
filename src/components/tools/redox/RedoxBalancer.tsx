"use client";

import { useMemo, useState } from "react";
import {
  REDOX_EXAMPLES,
  RedoxError,
  balanceRedox,
  type RedoxMedium,
} from "@/lib/chemistry/redox";
import { RotateCcw } from "lucide-react";

export function RedoxBalancer() {
  const [input, setInput] = useState("MnO4- + Fe2+ = Mn2+ + Fe3+");
  const [medium, setMedium] = useState<RedoxMedium>("acidic");

  const result = useMemo(() => {
    try {
      return { ok: true as const, value: balanceRedox(input, medium) };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof RedoxError
            ? error.message
            : "Could not balance this redox equation.",
      };
    }
  }, [input, medium]);

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Redox / half-reaction balancer</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Acidic or basic medium · atom + charge balance
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setInput("MnO4- + Fe2+ = Mn2+ + Fe3+");
            setMedium("acidic");
          }}
          className="inline-flex items-center gap-1.5 border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(
          [
            ["acidic", "Acidic (H₂O / H⁺)"],
            ["basic", "Basic (H₂O / OH⁻)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMedium(id)}
            className={`border px-2.5 py-1.5 text-xs ${
              medium === id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block font-medium">Skeleton redox equation</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder="MnO4- + Fe2+ = Mn2+ + Fe3+"
          className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {REDOX_EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => {
              setInput(ex.equation);
              setMedium(ex.medium);
            }}
            className="border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        Write charges as Fe2+, MnO4-, or SO4^2-. Do not include free e⁻ — the
        solver adds H₂O / H⁺ (acidic) or converts to OH⁻ (basic).
      </p>

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Balanced ({result.value.medium})
              </p>
              <p className="mt-2 font-mono text-base font-semibold sm:text-lg">
                {result.value.equation}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Charge check: {result.value.chargeReactants} ={" "}
                {result.value.chargeProducts}
              </p>
            </div>

            <ol className="list-decimal space-y-1 pl-5 text-xs text-[var(--muted)]">
              {result.value.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[260px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                  <tr>
                    <th className="py-1 pr-3 font-semibold">Element</th>
                    <th className="py-1 pr-3 font-semibold">Reactants</th>
                    <th className="py-1 font-semibold">Products</th>
                  </tr>
                </thead>
                <tbody>
                  {result.value.atomCheck.map((row) => (
                    <tr
                      key={row.element}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="py-1.5 pr-3 font-mono">{row.element}</td>
                      <td className="py-1.5 pr-3 font-mono">
                        {row.reactantAtoms}
                      </td>
                      <td className="py-1.5 font-mono">{row.productAtoms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
