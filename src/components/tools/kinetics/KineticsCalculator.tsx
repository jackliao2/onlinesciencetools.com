"use client";

import { useMemo, useState } from "react";
import {
  KineticsError,
  solveKinetics,
  type RateOrder,
} from "@/lib/chemistry/kinetics";
import { RotateCcw } from "lucide-react";

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-3)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(6)).toString();
}

type SolveFor = "c" | "t" | "k" | "halfLife";

export function KineticsCalculator() {
  const [order, setOrder] = useState<RateOrder>(1);
  const [solveFor, setSolveFor] = useState<SolveFor>("c");
  const [k, setK] = useState("0.001");
  const [c0, setC0] = useState("1.00");
  const [t, setT] = useState("600");
  const [c, setC] = useState("0.50");

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: solveKinetics({
          order,
          k: Number(k),
          c0: c0.trim() ? Number(c0) : undefined,
          t: t.trim() ? Number(t) : undefined,
          c: c.trim() ? Number(c) : undefined,
          solveFor,
        }),
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof KineticsError ? error.message : "Unable to solve kinetics.",
      };
    }
  }, [order, k, c0, t, c, solveFor]);

  const reset = () => {
    setOrder(1);
    setSolveFor("c");
    setK("0.001");
    setC0("1.00");
    setT("600");
    setC("0.50");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Kinetics calculator</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Zero-, first-, and second-order rate laws and half-life
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {([0, 1, 2] as RateOrder[]).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOrder(o)}
            className={`border px-2.5 py-1.5 text-xs ${
              order === o
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            Order {o}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(
          [
            ["c", "Find [A]ₜ"],
            ["t", "Find t"],
            ["k", "Find k"],
            ["halfLife", "Half-life"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSolveFor(id)}
            className={`border px-2.5 py-1.5 text-xs ${
              solveFor === id
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {solveFor !== "k" ? (
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              k{" "}
              <span className="font-normal text-[var(--muted)]">
                ({order === 0 ? "M/time" : order === 1 ? "1/time" : "1/(M·time)"})
              </span>
            </span>
            <input
              value={k}
              onChange={(e) => setK(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
            />
          </label>
        ) : null}

        {(solveFor !== "halfLife" || order !== 1) && (
          <label className="block text-sm">
            <span className="mb-1 block font-medium">[A]₀ (M)</span>
            <input
              value={c0}
              onChange={(e) => setC0(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
            />
          </label>
        )}

        {(solveFor === "c" || solveFor === "k") && (
          <label className="block text-sm">
            <span className="mb-1 block font-medium">t</span>
            <input
              value={t}
              onChange={(e) => setT(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
            />
          </label>
        )}

        {(solveFor === "t" || solveFor === "k") && (
          <label className="block text-sm">
            <span className="mb-1 block font-medium">[A]ₜ (M)</span>
            <input
              value={c}
              onChange={(e) => setC(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
            />
          </label>
        )}
      </div>

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : (
          <div className="space-y-2">
            <p className="font-mono text-xs text-[var(--muted)]">
              {result.value.expression}
            </p>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">k</dt>
                <dd className="font-mono">{formatNum(result.value.k)}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">t½</dt>
                <dd className="font-mono">{formatNum(result.value.halfLife)}</dd>
              </div>
              {result.value.c !== null ? (
                <div>
                  <dt className="text-[var(--muted)]">[A]ₜ</dt>
                  <dd className="font-mono">{formatNum(result.value.c)} M</dd>
                </div>
              ) : null}
              {result.value.t !== null ? (
                <div>
                  <dt className="text-[var(--muted)]">t</dt>
                  <dd className="font-mono">{formatNum(result.value.t)}</dd>
                </div>
              ) : null}
            </dl>
            {result.value.notes.map((n) => (
              <p key={n} className="text-xs text-[var(--muted)]">
                {n}
              </p>
            ))}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        Assumes a single-reactant integrated rate law with a constant rate
        constant. Use M for concentration and one consistent time unit throughout.
      </p>
    </div>
  );
}
