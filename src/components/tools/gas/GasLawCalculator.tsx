"use client";

import { useMemo, useState } from "react";
import {
  GasLawError,
  molarMassFromDensity,
  solveIdealGas,
  type GasField,
  type PressureUnit,
  type TempUnit,
  type VolumeUnit,
} from "@/lib/chemistry/gas-law";
import { RotateCcw } from "lucide-react";

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-3)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(6)).toString();
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function GasLawCalculator() {
  const [P, setP] = useState("1.00");
  const [V, setV] = useState("22.4");
  const [n, setN] = useState("");
  const [T, setT] = useState("273.15");
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>("atm");
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("L");
  const [tempUnit, setTempUnit] = useState<TempUnit>("K");
  const [density, setDensity] = useState("");

  const result = useMemo(() => {
    const raw = {
      P: parseOptional(P),
      V: parseOptional(V),
      n: parseOptional(n),
      T: parseOptional(T),
    };
    if ([raw.P, raw.V, raw.n, raw.T].some((v) => Number.isNaN(v as number))) {
      return { ok: false as const, error: "Enter valid numbers, or leave one field blank." };
    }
    try {
      return {
        ok: true as const,
        value: solveIdealGas({
          ...raw,
          pressureUnit,
          volumeUnit,
          tempUnit,
        }),
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof GasLawError ? error.message : "Unable to solve PV = nRT.",
      };
    }
  }, [P, V, n, T, pressureUnit, volumeUnit, tempUnit]);

  const mmResult = useMemo(() => {
    const d = Number(density);
    if (!density.trim()) return null;
    if (!result.ok) return { ok: false as const, error: "Solve the gas law first (or fill P and T)." };
    try {
      // Use solved P,T in display units
      const mm = molarMassFromDensity(
        d,
        result.value.display.P,
        result.value.display.T,
        pressureUnit,
        tempUnit,
      );
      return { ok: true as const, value: mm };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof GasLawError
            ? error.message
            : "Unable to compute molar mass from density.",
      };
    }
  }, [density, result, pressureUnit, tempUnit]);

  const labels: Record<GasField, string> = {
    P: "Pressure P",
    V: "Volume V",
    n: "Amount n",
    T: "Temperature T",
  };

  const reset = () => {
    setP("1.00");
    setV("22.4");
    setN("");
    setT("273.15");
    setPressureUnit("atm");
    setVolumeUnit("L");
    setTempUnit("K");
    setDensity("");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Ideal gas law</p>
          <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">
            PV = nRT · R = 0.082057 L·atm/(mol·K)
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

      <p className="mt-3 text-sm text-[var(--muted)]">
        Enter any three of P, V, n, T and leave one blank. Units are converted
        internally to atm, L, and K.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-[var(--muted)]">P unit</span>
          <select
            value={pressureUnit}
            onChange={(e) => setPressureUnit(e.target.value as PressureUnit)}
            className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
          >
            <option value="atm">atm</option>
            <option value="kPa">kPa</option>
            <option value="mmHg">mmHg</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[var(--muted)]">V unit</span>
          <select
            value={volumeUnit}
            onChange={(e) => setVolumeUnit(e.target.value as VolumeUnit)}
            className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
          >
            <option value="L">L</option>
            <option value="mL">mL</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[var(--muted)]">T unit</span>
          <select
            value={tempUnit}
            onChange={(e) => setTempUnit(e.target.value as TempUnit)}
            className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
          >
            <option value="K">K</option>
            <option value="C">°C</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">
            Pressure ({pressureUnit})
          </span>
          <input
            value={P}
            onChange={(e) => setP(e.target.value)}
            placeholder="leave blank to solve"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Volume ({volumeUnit})</span>
          <input
            value={V}
            onChange={(e) => setV(e.target.value)}
            placeholder="leave blank to solve"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Amount n (mol)</span>
          <input
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="leave blank to solve"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">
            Temperature ({tempUnit === "C" ? "°C" : "K"})
          </span>
          <input
            value={T}
            onChange={(e) => setT(e.target.value)}
            placeholder="leave blank to solve"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
      </div>

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : (
          <div className="space-y-2">
            <p>
              Solved for{" "}
              <span className="font-medium">{labels[result.value.solved]}</span>
            </p>
            <dl className="grid gap-1.5 sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">P</dt>
                <dd className="font-mono">
                  {formatNum(result.value.display.P)} {pressureUnit}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">V</dt>
                <dd className="font-mono">
                  {formatNum(result.value.display.V)} {volumeUnit}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">n</dt>
                <dd className="font-mono">{formatNum(result.value.n)} mol</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">T</dt>
                <dd className="font-mono">
                  {formatNum(result.value.display.T)}{" "}
                  {tempUnit === "C" ? "°C" : "K"}
                  {tempUnit === "C"
                    ? ` (${formatNum(result.value.T)} K)`
                    : ""}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <p className="text-sm font-medium">Optional: molar mass from density</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Uses M = dRT/P with the P and T above (d in g/L).
        </p>
        <label className="mt-3 block max-w-xs text-sm">
          <span className="mb-1 block font-medium">Density (g/L)</span>
          <input
            value={density}
            onChange={(e) => setDensity(e.target.value)}
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        {mmResult ? (
          <p className="mt-2 text-sm">
            {mmResult.ok ? (
              <>
                Molar mass ≈{" "}
                <span className="font-mono font-medium">
                  {formatNum(mmResult.value)} g/mol
                </span>
              </>
            ) : (
              <span className="text-[var(--muted)]">{mmResult.error}</span>
            )}
          </p>
        ) : null}
      </div>
    </div>
  );
}
