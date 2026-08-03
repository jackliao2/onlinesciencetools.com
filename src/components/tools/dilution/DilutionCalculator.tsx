"use client";

import { useMemo, useState } from "react";
import {
  DilutionError,
  fromLiters,
  solveDilution,
  toLiters,
  type DilutionField,
} from "@/lib/chemistry/dilution";
import { RotateCcw } from "lucide-react";

type VolumeUnit = "L" | "mL";

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-3)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(6)).toString();
}

export function DilutionCalculator() {
  const [c1, setC1] = useState("2.0");
  const [v1, setV1] = useState("");
  const [c2, setC2] = useState("0.50");
  const [v2, setV2] = useState("250");
  const [volUnit, setVolUnit] = useState<VolumeUnit>("mL");
  const [concUnit, setConcUnit] = useState("M");

  const parseOptional = (raw: string): number | null => {
    const t = raw.trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : Number.NaN;
  };

  const result = useMemo(() => {
    const raw = {
      c1: parseOptional(c1),
      v1: parseOptional(v1),
      c2: parseOptional(c2),
      v2: parseOptional(v2),
    };

    if ([raw.c1, raw.v1, raw.c2, raw.v2].some((v) => Number.isNaN(v as number))) {
      return { ok: false as const, error: "Enter valid numbers, or leave one field blank." };
    }

    // Convert volumes to liters for the solver, then convert back for display.
    const input = {
      c1: raw.c1,
      c2: raw.c2,
      v1: raw.v1 === null ? null : toLiters(raw.v1, volUnit),
      v2: raw.v2 === null ? null : toLiters(raw.v2, volUnit),
    };

    try {
      const solved = solveDilution(input);
      return {
        ok: true as const,
        value: {
          ...solved,
          v1Display: fromLiters(solved.v1, volUnit),
          v2Display: fromLiters(solved.v2, volUnit),
        },
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof DilutionError
            ? error.message
            : "Unable to solve this dilution.",
      };
    }
  }, [c1, v1, c2, v2, volUnit]);

  const fieldLabels: Record<DilutionField, string> = {
    c1: "C₁ (stock)",
    v1: "V₁ (stock volume)",
    c2: "C₂ (diluted)",
    v2: "V₂ (final volume)",
  };

  const reset = () => {
    setC1("2.0");
    setV1("");
    setC2("0.50");
    setV2("250");
    setVolUnit("mL");
    setConcUnit("M");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Dilution calculator</p>
          <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">C₁V₁ = C₂V₂</p>
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

      <p className="mt-3 text-sm text-[var(--muted)]">
        Enter any three values and leave one blank. Concentrations must share the
        same unit; volumes use the unit selected below.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-[var(--muted)]">Volume unit</span>
          <select
            value={volUnit}
            onChange={(e) => setVolUnit(e.target.value as VolumeUnit)}
            className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
          >
            <option value="mL">mL</option>
            <option value="L">L</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[var(--muted)]">Concentration unit</span>
          <input
            value={concUnit}
            onChange={(e) => setConcUnit(e.target.value)}
            className="w-20 border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
            placeholder="M"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(
          [
            ["c1", c1, setC1, concUnit],
            ["v1", v1, setV1, volUnit],
            ["c2", c2, setC2, concUnit],
            ["v2", v2, setV2, volUnit],
          ] as const
        ).map(([key, value, setter, unit]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium">
              {fieldLabels[key]}{" "}
              <span className="font-normal text-[var(--muted)]">({unit})</span>
            </span>
            <input
              value={value}
              onChange={(e) => setter(e.target.value)}
              inputMode="decimal"
              placeholder="leave blank to solve"
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
        ))}
      </div>

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : (
          <div className="space-y-2">
            <p>
              Solved for{" "}
              <span className="font-medium text-[var(--foreground)]">
                {fieldLabels[result.value.solved]}
              </span>
            </p>
            <dl className="grid gap-1.5 sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">C₁</dt>
                <dd className="font-mono">
                  {formatNum(result.value.c1)} {concUnit}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">V₁</dt>
                <dd className="font-mono">
                  {formatNum(result.value.v1Display)} {volUnit}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">C₂</dt>
                <dd className="font-mono">
                  {formatNum(result.value.c2)} {concUnit}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">V₂</dt>
                <dd className="font-mono">
                  {formatNum(result.value.v2Display)} {volUnit}
                </dd>
              </div>
            </dl>
            <p className="pt-1 text-[var(--muted)]">
              Dilution factor C₁/C₂ = {formatNum(result.value.dilutionFactor)}×
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
