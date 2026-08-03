"use client";

import { useMemo, useState } from "react";
import {
  NERNST_PRESETS,
  NernstError,
  calculateNernst,
  deltaGFromE,
} from "@/lib/chemistry/nernst";
import { RotateCcw } from "lucide-react";

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-3)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(6)).toString();
}

export function NernstCalculator() {
  const [E0, setE0] = useState("1.10");
  const [n, setN] = useState("2");
  const [Q, setQ] = useState("1");
  const [tempC, setTempC] = useState("25");
  const [classroom, setClassroom] = useState(true);

  const result = useMemo(() => {
    try {
      const nernst = calculateNernst({
        E0: Number(E0),
        n: Number(n),
        Q: Number(Q),
        temperatureC: Number(tempC),
        useClassroomForm: classroom,
      });
      const dG = deltaGFromE(nernst.n, nernst.E);
      const dG0 = deltaGFromE(nernst.n, nernst.E0);
      return { ok: true as const, nernst, dG, dG0 };
    } catch (error) {
      return {
        ok: false as const,
        error: error instanceof NernstError ? error.message : "Unable to solve.",
      };
    }
  }, [E0, n, Q, tempC, classroom]);

  const applyPreset = (id: string) => {
    const p = NERNST_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setE0(String(p.E0));
    setN(String(p.n));
    setQ(String(p.Q));
    setTempC("25");
    setClassroom(true);
  };

  const reset = () => {
    setE0("1.10");
    setN("2");
    setQ("1");
    setTempC("25");
    setClassroom(true);
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Nernst equation calculator</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Cell potential under non-standard conditions · ΔG = −nFE
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

      <div className="mt-3 flex flex-wrap gap-1.5">
        {NERNST_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.id)}
            className="border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)] hover:border-[var(--accent)]"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">E° (V)</span>
          <input
            value={E0}
            onChange={(e) => setE0(e.target.value)}
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">n (electrons)</span>
          <input
            value={n}
            onChange={(e) => setN(e.target.value)}
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Q (reaction quotient)</span>
          <input
            value={Q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Temperature (°C)</span>
          <input
            value={tempC}
            onChange={(e) => setTempC(e.target.value)}
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
          />
        </label>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={classroom}
          onChange={(e) => setClassroom(e.target.checked)}
        />
        Use 0.05916/n log₁₀ form at ~25 °C
      </label>

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : (
          <div className="space-y-2">
            <p className="font-mono text-xs text-[var(--muted)]">
              {result.nernst.expression}
            </p>
            <p>
              E ={" "}
              <span className="font-mono text-xl font-semibold">
                {formatNum(result.nernst.E)} V
              </span>
            </p>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">ΔG</dt>
                <dd className="font-mono">
                  {formatNum(result.dG / 1000)} kJ/mol
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">ΔG°</dt>
                <dd className="font-mono">
                  {formatNum(result.dG0 / 1000)} kJ/mol
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">T</dt>
                <dd className="font-mono">{formatNum(result.nernst.T)} K</dd>
              </div>
            </dl>
            <ul className="list-disc space-y-1 pl-4 text-xs text-[var(--muted)]">
              {result.nernst.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
