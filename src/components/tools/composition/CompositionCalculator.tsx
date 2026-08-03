"use client";

import { useMemo, useState } from "react";
import {
  COMMON_ELEMENTS,
  CompositionError,
  empiricalFromElements,
  percentCompositionFromFormula,
} from "@/lib/chemistry/composition";
import { RotateCcw } from "lucide-react";

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return Number(value.toPrecision(5)).toString();
}

type Mode = "percent" | "empirical";

export function CompositionCalculator() {
  const [mode, setMode] = useState<Mode>("percent");
  const [formula, setFormula] = useState("C6H12O6");
  const [rows, setRows] = useState([
    { element: "C", value: "40.0" },
    { element: "H", value: "6.7" },
    { element: "O", value: "53.3" },
  ]);
  const [molecularMass, setMolecularMass] = useState("180");

  const percentResult = useMemo(() => {
    if (mode !== "percent") return null;
    try {
      return { ok: true as const, value: percentCompositionFromFormula(formula) };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof CompositionError
            ? error.message
            : "Could not parse formula.",
      };
    }
  }, [mode, formula]);

  const empiricalResult = useMemo(() => {
    if (mode !== "empirical") return null;
    try {
      const amounts = rows.map((r) => ({
        element: r.element,
        value: Number(r.value),
      }));
      const mm = molecularMass.trim() ? Number(molecularMass) : undefined;
      return {
        ok: true as const,
        value: empiricalFromElements(amounts, mm),
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof CompositionError
            ? error.message
            : "Could not find an empirical formula.",
      };
    }
  }, [mode, rows, molecularMass]);

  const reset = () => {
    setMode("percent");
    setFormula("C6H12O6");
    setRows([
      { element: "C", value: "40.0" },
      { element: "H", value: "6.7" },
      { element: "O", value: "53.3" },
    ]);
    setMolecularMass("180");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Composition & empirical formula</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Mass percent from a formula, or empirical/molecular formula from % data
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
        {(
          [
            ["percent", "Percent from formula"],
            ["empirical", "Empirical from % / mass"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`border px-2.5 py-1.5 text-xs ${
              mode === id
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "percent" ? (
        <div className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Chemical formula</span>
            <input
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              spellCheck={false}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
          <div className="border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
            {!percentResult?.ok ? (
              <p className="text-[var(--muted)]">{percentResult?.error}</p>
            ) : (
              <div className="space-y-2">
                <p>
                  Molar mass{" "}
                  <span className="font-mono font-medium">
                    {formatNum(percentResult.value.molarMass)} g/mol
                  </span>
                </p>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[var(--muted)]">
                      <th className="py-1 font-medium">Element</th>
                      <th className="py-1 font-medium">Count</th>
                      <th className="py-1 font-medium">Mass %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {percentResult.value.composition.map((row) => (
                      <tr key={row.element} className="border-t border-[var(--border)]">
                        <td className="py-1.5 font-mono">{row.element}</td>
                        <td className="py-1.5 font-mono">{row.count}</td>
                        <td className="py-1.5 font-mono">
                          {formatNum(row.percent)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-[var(--muted)]">
            Enter mass percent (summing to ~100) or relative masses in grams.
            Optional molecular mass gives the molecular formula.
          </p>
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={i} className="flex flex-wrap gap-2">
                <select
                  value={row.element}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((r, j) =>
                        j === i ? { ...r, element: e.target.value } : r,
                      ),
                    )
                  }
                  className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 text-sm"
                >
                  {COMMON_ELEMENTS.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </select>
                <input
                  value={row.value}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((r, j) =>
                        j === i ? { ...r, value: e.target.value } : r,
                      ),
                    )
                  }
                  className="min-w-[8rem] flex-1 border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono text-sm outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  placeholder="% or g"
                />
                <button
                  type="button"
                  onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                  className="border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)]"
                  disabled={rows.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setRows((prev) => [...prev, { element: "N", value: "" }])
              }
              className="border border-[var(--border)] px-2.5 py-1.5 text-xs hover:bg-[var(--surface-2)]"
            >
              Add element
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-[var(--muted)]">Molecular mass (optional)</span>
              <input
                value={molecularMass}
                onChange={(e) => setMolecularMass(e.target.value)}
                className="w-28 border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 font-mono"
                placeholder="g/mol"
              />
            </label>
          </div>
          <div className="border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
            {!empiricalResult?.ok ? (
              <p className="text-[var(--muted)]">{empiricalResult?.error}</p>
            ) : (
              <div className="space-y-2">
                <p>
                  Empirical formula{" "}
                  <span className="font-mono text-lg font-semibold">
                    {empiricalResult.value.empiricalFormula}
                  </span>
                </p>
                <p className="text-[var(--muted)]">
                  Empirical molar mass ≈{" "}
                  {formatNum(empiricalResult.value.molarMassEmpirical)} g/mol
                </p>
                {empiricalResult.value.molecularFormula ? (
                  <p>
                    Molecular formula{" "}
                    <span className="font-mono text-lg font-semibold">
                      {empiricalResult.value.molecularFormula}
                    </span>
                    <span className="text-[var(--muted)]">
                      {" "}
                      (×{empiricalResult.value.multiplier})
                    </span>
                  </p>
                ) : null}
                <ul className="mt-2 space-y-1 font-mono text-xs text-[var(--muted)]">
                  {empiricalResult.value.ratios.map((r) => (
                    <li key={r.element}>
                      {r.element}: {formatNum(r.moles)} mol → index {r.index}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
