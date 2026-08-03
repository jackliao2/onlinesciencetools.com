"use client";

import { useMemo, useState } from "react";
import {
  KSP_PRESETS,
  KspError,
  SALT_TYPES,
  ionProduct,
  kspFromSolubility,
  solubilityFromKsp,
  type SaltType,
} from "@/lib/chemistry/ksp";
import { RotateCcw } from "lucide-react";

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-3)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(5)).toString();
}

type Mode = "s-to-ksp" | "ksp-to-s" | "q";

export function KspCalculator() {
  const [mode, setMode] = useState<Mode>("ksp-to-s");
  const [type, setType] = useState<SaltType>("AB");
  const [ksp, setKsp] = useState("1.8e-10");
  const [solubility, setSolubility] = useState("1.34e-5");
  const [cation, setCation] = useState("1.0e-5");
  const [anion, setAnion] = useState("1.0e-5");

  const result = useMemo(() => {
    try {
      if (mode === "s-to-ksp") {
        const s = Number(solubility);
        const value = kspFromSolubility(type, s);
        return { ok: true as const, kind: "ksp" as const, value, s };
      }
      if (mode === "ksp-to-s") {
        const K = Number(ksp);
        const s = solubilityFromKsp(type, K);
        return { ok: true as const, kind: "s" as const, value: s, K };
      }
      const Q = ionProduct({
        type,
        cation: Number(cation),
        anion: Number(anion),
        ksp: Number(ksp),
      });
      return { ok: true as const, kind: "q" as const, value: Q };
    } catch (error) {
      return {
        ok: false as const,
        error: error instanceof KspError ? error.message : "Unable to solve.",
      };
    }
  }, [mode, type, ksp, solubility, cation, anion]);

  const applyPreset = (id: string) => {
    const p = KSP_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setType(p.type);
    setKsp(String(p.ksp));
    setMode("ksp-to-s");
  };

  const reset = () => {
    setMode("ksp-to-s");
    setType("AB");
    setKsp("1.8e-10");
    setSolubility("1.34e-5");
    setCation("1.0e-5");
    setAnion("1.0e-5");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Ksp / solubility calculator</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Solubility ↔ Ksp · ion product Q vs Ksp
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
            ["ksp-to-s", "Ksp → solubility"],
            ["s-to-ksp", "Solubility → Ksp"],
            ["q", "Q vs Ksp"],
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

      <div className="mt-3 flex flex-wrap gap-1.5">
        {KSP_PRESETS.map((p) => (
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
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Salt type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SaltType)}
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 outline-none focus:ring-1 focus:ring-[var(--accent)]"
          >
            {SALT_TYPES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} — e.g. {s.example}
              </option>
            ))}
          </select>
        </label>

        {mode !== "s-to-ksp" ? (
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Ksp</span>
            <input
              value={ksp}
              onChange={(e) => setKsp(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
        ) : null}

        {mode === "s-to-ksp" ? (
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Solubility s (mol/L)</span>
            <input
              value={solubility}
              onChange={(e) => setSolubility(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
        ) : null}

        {mode === "q" ? (
          <>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">[cation] (M)</span>
              <input
                value={cation}
                onChange={(e) => setCation(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">[anion] (M)</span>
              <input
                value={anion}
                onChange={(e) => setAnion(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </label>
          </>
        ) : null}
      </div>

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : result.kind === "ksp" ? (
          <p>
            Ksp = <span className="font-mono font-medium">{formatNum(result.value)}</span>
            <span className="text-[var(--muted)]">
              {" "}
              from s = {formatNum(result.s)} mol/L
            </span>
          </p>
        ) : result.kind === "s" ? (
          <div className="space-y-1">
            <p>
              Solubility s ={" "}
              <span className="font-mono font-medium">{formatNum(result.value)}</span>{" "}
              mol/L
            </p>
            <p className="text-xs text-[var(--muted)]">
              Molar solubility of the formula unit in pure water (no common ion).
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-mono text-xs text-[var(--muted)]">
              {result.value.expression}
            </p>
            <p>
              Q = <span className="font-mono font-medium">{formatNum(result.value.Q)}</span>
              {" · "}
              Ksp ={" "}
              <span className="font-mono font-medium">
                {formatNum(result.value.Ksp)}
              </span>
            </p>
            <p>{result.value.label}</p>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        Uses concentrations as activities and assumes the listed salt dissolves
        directly in pure water. Common-ion, pH, complexation, hydrolysis, and
        activity-coefficient effects are not included.
      </p>
    </div>
  );
}
