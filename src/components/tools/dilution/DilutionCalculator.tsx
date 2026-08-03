"use client";

import { useMemo, useState } from "react";
import {
  DILUTION_LAB_PRESETS,
  DILUTION_RATIO_PRESETS,
  DilutionError,
  fromLiters,
  solveDilution,
  solveSerialDilution,
  toLiters,
  type DilutionField,
} from "@/lib/chemistry/dilution";
import { RotateCcw } from "lucide-react";

type VolumeUnit = "L" | "mL";
type Mode = "simple" | "serial";

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-3)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(6)).toString();
}

export function DilutionCalculator() {
  const [mode, setMode] = useState<Mode>("simple");
  const [c1, setC1] = useState("2.0");
  const [v1, setV1] = useState("");
  const [c2, setC2] = useState("0.50");
  const [v2, setV2] = useState("250");
  const [volUnit, setVolUnit] = useState<VolumeUnit>("mL");
  const [concUnit, setConcUnit] = useState("M");

  const [serialStock, setSerialStock] = useState("1.0");
  const [serialFactor, setSerialFactor] = useState("10");
  const [serialSteps, setSerialSteps] = useState("3");
  const [serialTransfer, setSerialTransfer] = useState("1");
  const [serialFinal, setSerialFinal] = useState("10");

  const parseOptional = (raw: string): number | null => {
    const t = raw.trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : Number.NaN;
  };

  const simpleResult = useMemo(() => {
    const raw = {
      c1: parseOptional(c1),
      v1: parseOptional(v1),
      c2: parseOptional(c2),
      v2: parseOptional(v2),
    };

    if ([raw.c1, raw.v1, raw.c2, raw.v2].some((v) => Number.isNaN(v as number))) {
      return {
        ok: false as const,
        error: "Enter valid numbers, or leave one field blank.",
      };
    }

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

  const serialResult = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: solveSerialDilution({
          stockC: Number(serialStock),
          factor: Number(serialFactor),
          steps: Number(serialSteps),
          transferV: Number(serialTransfer),
          finalV: Number(serialFinal),
        }),
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof DilutionError
            ? error.message
            : "Unable to plan this serial dilution.",
      };
    }
  }, [serialStock, serialFactor, serialSteps, serialTransfer, serialFinal]);

  const fieldLabels: Record<DilutionField, string> = {
    c1: "C₁ (stock)",
    v1: "V₁ (stock volume)",
    c2: "C₂ (diluted)",
    v2: "V₂ (final volume)",
  };

  const applyRatio = (factor: number) => {
    const stock = Number(c1);
    if (Number.isFinite(stock) && stock > 0) {
      setC2(String(stock / factor));
      setV1("");
      if (!v2.trim()) setV2("100");
    } else {
      setSerialFactor(String(factor));
      setSerialFinal(String(factor));
      setSerialTransfer("1");
    }
  };

  const applyLabPreset = (id: string) => {
    const preset = DILUTION_LAB_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setMode("simple");
    setC1(preset.c1);
    setC2(preset.c2);
    setV2(preset.v2);
    setV1("");
    setConcUnit(preset.concUnit);
    setVolUnit("mL");
  };

  const reset = () => {
    setMode("simple");
    setC1("2.0");
    setV1("");
    setC2("0.50");
    setV2("250");
    setVolUnit("mL");
    setConcUnit("M");
    setSerialStock("1.0");
    setSerialFactor("10");
    setSerialSteps("3");
    setSerialTransfer("1");
    setSerialFinal("10");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Dilution calculator</p>
          <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">
            C₁V₁ = C₂V₂ · serial dilution
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
            ["simple", "Simple (C₁V₁=C₂V₂)"],
            ["serial", "Serial dilution"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`border px-2.5 py-1.5 text-xs ${
              mode === id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="self-center text-xs text-[var(--muted)]">Ratio</span>
        {DILUTION_RATIO_PRESETS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              if (mode === "serial") {
                setSerialFactor(String(r.factor));
                setSerialFinal(String(r.factor));
                setSerialTransfer("1");
              } else {
                applyRatio(r.factor);
              }
            }}
            className="border border-[var(--border)] px-2 py-1 font-mono text-[11px] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="self-center text-xs text-[var(--muted)]">Lab</span>
        {DILUTION_LAB_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyLabPreset(p.id)}
            className="border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {p.label}
          </button>
        ))}
      </div>

      {mode === "simple" ? (
        <>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Enter any three values and leave one blank. Concentrations must share
            the same unit; volumes use the unit selected below.
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
                className="w-28 border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
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
            {!simpleResult.ok ? (
              <p className="text-[var(--muted)]">{simpleResult.error}</p>
            ) : (
              <div className="space-y-2">
                <p>
                  Solved for{" "}
                  <span className="font-medium text-[var(--foreground)]">
                    {fieldLabels[simpleResult.value.solved]}
                  </span>
                </p>
                <dl className="grid gap-1.5 sm:grid-cols-2">
                  <div>
                    <dt className="text-[var(--muted)]">C₁</dt>
                    <dd className="font-mono">
                      {formatNum(simpleResult.value.c1)} {concUnit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted)]">V₁</dt>
                    <dd className="font-mono">
                      {formatNum(simpleResult.value.v1Display)} {volUnit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted)]">C₂</dt>
                    <dd className="font-mono">
                      {formatNum(simpleResult.value.c2)} {concUnit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted)]">V₂</dt>
                    <dd className="font-mono">
                      {formatNum(simpleResult.value.v2Display)} {volUnit}
                    </dd>
                  </div>
                </dl>
                <p className="pt-1 text-[var(--muted)]">
                  Dilution factor C₁/C₂ ={" "}
                  {formatNum(simpleResult.value.dilutionFactor)}×
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Each step transfers the same aliquot into a fixed final volume. For a
            1:10 series, transfer 1 into 10 (factor = 10). Overall factor =
            factorⁿ.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["Stock C₀", serialStock, setSerialStock],
                ["Factor per step", serialFactor, setSerialFactor],
                ["Number of steps", serialSteps, setSerialSteps],
                ["Transfer volume", serialTransfer, setSerialTransfer],
                ["Final volume / step", serialFinal, setSerialFinal],
              ] as const
            ).map(([label, value, setter]) => (
              <label key={label} className="block text-sm">
                <span className="mb-1 block font-medium">{label}</span>
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  inputMode="decimal"
                  className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
            {!serialResult.ok ? (
              <p className="text-[var(--muted)]">{serialResult.error}</p>
            ) : (
              <div className="space-y-3">
                <p className="font-mono text-xs text-[var(--muted)]">
                  {serialResult.value.expression}
                </p>
                <p>
                  Overall dilution from stock:{" "}
                  <span className="font-mono font-medium">
                    {formatNum(serialResult.value.overallFactor)}×
                  </span>
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[260px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                      <tr>
                        <th className="py-1 pr-3 font-semibold">Step</th>
                        <th className="py-1 pr-3 font-semibold">C</th>
                        <th className="py-1 font-semibold">From stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serialResult.value.steps.map((row) => (
                        <tr
                          key={row.step}
                          className="border-t border-[var(--border)]"
                        >
                          <td className="py-1.5 pr-3 font-mono">{row.step}</td>
                          <td className="py-1.5 pr-3 font-mono">
                            {formatNum(row.concentration)} {concUnit}
                          </td>
                          <td className="py-1.5 font-mono">
                            {formatNum(row.dilutionFactorFromStock)}×
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
