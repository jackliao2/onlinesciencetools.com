"use client";

import { useMemo, useState } from "react";
import {
  BUFFER_SYSTEMS,
  BufferRecipeError,
  calculateBufferRecipe,
} from "@/lib/chemistry/buffer-recipe";
import { RotateCcw } from "lucide-react";

function formatNum(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-3)) {
    return value.toExponential(3);
  }
  return Number(value.toPrecision(digits)).toString();
}

export function BufferRecipeCalculator() {
  const [systemId, setSystemId] = useState("phosphate");
  const [targetPh, setTargetPh] = useState("7.40");
  const [totalM, setTotalM] = useState("0.10");
  const [volumeMl, setVolumeMl] = useState("1000");

  const system = BUFFER_SYSTEMS.find((s) => s.id === systemId) ?? BUFFER_SYSTEMS[0];

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculateBufferRecipe({
          systemId,
          targetPh: Number(targetPh),
          totalMolarity: Number(totalM),
          volumeL: Number(volumeMl) / 1000,
        }),
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof BufferRecipeError
            ? error.message
            : "Unable to compute this buffer recipe.",
      };
    }
  }, [systemId, targetPh, totalM, volumeMl]);

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Phosphate buffer calculator (HEPES, MES, borate…)</p>
          <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">
            pH = pKa + log([A⁻]/[HA])
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSystemId("phosphate");
            setTargetPh("7.40");
            setTotalM("0.10");
            setVolumeMl("1000");
          }}
          className="inline-flex items-center gap-1.5 border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {BUFFER_SYSTEMS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSystemId(s.id);
              setTargetPh(((s.pHMin + s.pHMax) / 2).toFixed(2));
            }}
            className={`border px-2.5 py-1.5 text-xs ${
              systemId === s.id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        {system.notes} Useful pH ≈ {system.pHMin}–{system.pHMax}.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Target pH</span>
          <input
            value={targetPh}
            onChange={(e) => setTargetPh(e.target.value)}
            inputMode="decimal"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Total C (M)</span>
          <input
            value={totalM}
            onChange={(e) => setTotalM(e.target.value)}
            inputMode="decimal"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Final volume (mL)</span>
          <input
            value={volumeMl}
            onChange={(e) => setVolumeMl(e.target.value)}
            inputMode="decimal"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
      </div>

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : (
          <div className="space-y-3">
            <p className="font-mono text-xs text-[var(--muted)]">
              {result.value.expression} · pKa = {result.value.system.pKa}
            </p>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">[A⁻]/[HA]</dt>
                <dd className="font-mono">
                  {formatNum(result.value.ratioBaseOverAcid)}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">HH check pH</dt>
                <dd className="font-mono">{formatNum(result.value.hhCheckPh, 3)}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">
                  Acid {result.value.system.acidFormula}
                </dt>
                <dd className="font-mono">
                  {formatNum(result.value.acidMolarity)} M ·{" "}
                  {formatNum(result.value.acidMassG)} g
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">
                  Base {result.value.system.baseFormula}
                </dt>
                <dd className="font-mono">
                  {formatNum(result.value.baseMolarity)} M ·{" "}
                  {formatNum(result.value.baseMassG)} g
                </dd>
              </div>
            </dl>
            <p className="text-xs text-[var(--muted)]">
              Dissolve the calculated masses and dilute to {volumeMl} mL. Adjust
              ionic strength / activity as needed for research-grade work.
            </p>
            {result.value.warnings.map((w) => (
              <p key={w} className="text-xs text-amber-700 dark:text-amber-300">
                {w}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
