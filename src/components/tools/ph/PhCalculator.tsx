"use client";

import { useMemo, useState } from "react";
import {
  PH_PRESETS,
  PhError,
  calculatePh,
  type PhMode,
} from "@/lib/chemistry/ph";
import { RotateCcw } from "lucide-react";

const MODES: Array<{ id: PhMode; label: string }> = [
  { id: "strong-acid", label: "Strong monoprotic acid" },
  { id: "strong-base", label: "Strong monohydroxide base" },
  { id: "weak-acid", label: "Weak acid" },
  { id: "weak-base", label: "Weak base" },
  { id: "buffer", label: "Buffer" },
  { id: "neutralization", label: "Neutralization (HCl + NaOH)" },
];

function formatNum(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-4)) {
    return value.toExponential(3);
  }
  return Number(value.toPrecision(digits)).toString();
}

export function PhCalculator() {
  const [mode, setMode] = useState<PhMode>("weak-acid");
  const [concentration, setConcentration] = useState("0.10");
  const [constant, setConstant] = useState("1.8e-5");
  const [conjugate, setConjugate] = useState("0.10");
  const [acidVolumeMl, setAcidVolumeMl] = useState("25");
  const [baseConcentration, setBaseConcentration] = useState("0.10");
  const [baseVolumeMl, setBaseVolumeMl] = useState("25");

  const needsConstant = mode === "weak-acid" || mode === "weak-base" || mode === "buffer";
  const needsConjugate = mode === "buffer";
  const isNeutralization = mode === "neutralization";

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculatePh({
          mode,
          concentration: Number(concentration),
          constant: needsConstant ? Number(constant) : undefined,
          conjugate: needsConjugate ? Number(conjugate) : undefined,
          acidVolumeL: isNeutralization ? Number(acidVolumeMl) / 1000 : undefined,
          baseConcentration: isNeutralization ? Number(baseConcentration) : undefined,
          baseVolumeL: isNeutralization ? Number(baseVolumeMl) / 1000 : undefined,
        }),
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof PhError ? error.message : "Unable to calculate pH.",
      };
    }
  }, [
    mode,
    concentration,
    constant,
    conjugate,
    needsConstant,
    needsConjugate,
    isNeutralization,
    acidVolumeMl,
    baseConcentration,
    baseVolumeMl,
  ]);

  const hhEstimate = useMemo(() => {
    if (mode !== "buffer") return null;
    const ka = Number(constant);
    const ha = Number(concentration);
    const a = Number(conjugate);
    if (!(ka > 0) || !(ha > 0) || !(a > 0)) return null;
    const pKa = -Math.log10(ka);
    const pH = pKa + Math.log10(a / ha);
    return { pKa, pH };
  }, [mode, constant, concentration, conjugate]);

  const applyPreset = (id: string) => {
    const preset = PH_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setMode(preset.mode);
    setConcentration(String(preset.concentration));
    if ("constant" in preset && preset.constant !== undefined) {
      setConstant(String(preset.constant));
    }
    if ("conjugate" in preset && preset.conjugate !== undefined) {
      setConjugate(String(preset.conjugate));
    }
    if ("acidVolumeL" in preset && preset.acidVolumeL !== undefined) {
      setAcidVolumeMl(String(preset.acidVolumeL * 1000));
    }
    if ("baseConcentration" in preset && preset.baseConcentration !== undefined) {
      setBaseConcentration(String(preset.baseConcentration));
    }
    if ("baseVolumeL" in preset && preset.baseVolumeL !== undefined) {
      setBaseVolumeMl(String(preset.baseVolumeL * 1000));
    }
  };

  const reset = () => {
    setMode("weak-acid");
    setConcentration("0.10");
    setConstant("1.8e-5");
    setConjugate("0.10");
    setAcidVolumeMl("25");
    setBaseConcentration("0.10");
    setBaseVolumeMl("25");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">pH / acid–base / neutralization calculator</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Strong/weak acid–base · buffer · HCl + NaOH mix (25 °C, Kw = 1.0×10⁻¹⁴)
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
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`px-2.5 py-1.5 text-xs border ${
              mode === m.id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PH_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.id)}
            className="border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-4 border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--muted)]">
        <p className="font-medium text-[var(--foreground)]">pH formula strip</p>
        <p className="mt-1 font-mono">
          pH = −log₁₀[H⁺] · pOH = −log₁₀[OH⁻] · pH + pOH = 14 (25 °C, Kw = 10⁻¹⁴)
        </p>
        <p className="mt-1 font-mono">
          Henderson–Hasselbalch (buffer approx.): pH = pKa + log₁₀([A⁻]/[HA])
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">
            {mode === "buffer"
              ? "[HA] (M)"
              : isNeutralization
                ? "Acid concentration (M)"
                : "Concentration (M)"}
          </span>
          <input
            value={concentration}
            onChange={(e) => setConcentration(e.target.value)}
            inputMode="decimal"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>

        {isNeutralization ? (
          <>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Acid volume (mL)</span>
              <input
                value={acidVolumeMl}
                onChange={(e) => setAcidVolumeMl(e.target.value)}
                inputMode="decimal"
                className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Base concentration (M)</span>
              <input
                value={baseConcentration}
                onChange={(e) => setBaseConcentration(e.target.value)}
                inputMode="decimal"
                className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Base volume (mL)</span>
              <input
                value={baseVolumeMl}
                onChange={(e) => setBaseVolumeMl(e.target.value)}
                inputMode="decimal"
                className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </label>
          </>
        ) : null}

        {needsConjugate ? (
          <label className="block text-sm">
            <span className="mb-1 block font-medium">[A⁻] (M)</span>
            <input
              value={conjugate}
              onChange={(e) => setConjugate(e.target.value)}
              inputMode="decimal"
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
        ) : null}

        {needsConstant ? (
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              {mode === "weak-base" ? "Kb" : "Ka"}
            </span>
            <input
              value={constant}
              onChange={(e) => setConstant(e.target.value)}
              inputMode="decimal"
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
        ) : null}
      </div>

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <p className="text-[var(--muted)]">pH</p>
                <p className="font-mono text-xl font-semibold">
                  {formatNum(result.value.pH, 4)}
                </p>
              </div>
              <div>
                <p className="text-[var(--muted)]">pOH</p>
                <p className="font-mono text-xl font-semibold">
                  {formatNum(result.value.pOH, 4)}
                </p>
              </div>
              <div>
                <p className="text-[var(--muted)]">[H⁺] (M)</p>
                <p className="font-mono">{formatNum(result.value.hPlus)}</p>
              </div>
              <div>
                <p className="text-[var(--muted)]">[OH⁻] (M)</p>
                <p className="font-mono">{formatNum(result.value.ohMinus)}</p>
              </div>
            </div>
            <p className="font-mono text-xs text-[var(--muted)]">
              {result.value.expression}
            </p>
            {hhEstimate ? (
              <p className="text-xs text-[var(--muted)]">
                HH estimate: pKa = {formatNum(hhEstimate.pKa, 3)}, pH ≈{" "}
                {formatNum(hhEstimate.pH, 4)} (solver uses charge balance; HH is
                the classroom approximation).
              </p>
            ) : null}
            <ul className="list-disc space-y-1 pl-4 text-xs text-[var(--muted)]">
              {result.value.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
