"use client";

import { useMemo, useState } from "react";
import {
  ConcentrationError,
  convertConcentration,
  resolveMolarMass,
  type ConcentrationKind,
} from "@/lib/chemistry/concentration";
import { RotateCcw } from "lucide-react";

const KINDS: Array<{ id: ConcentrationKind; label: string; unit: string }> = [
  { id: "molarity", label: "Molarity", unit: "mol/L (M)" },
  { id: "millimolar", label: "Millimolar", unit: "mmol/L (mM)" },
  { id: "micromolar", label: "Micromolar", unit: "μmol/L (μM)" },
  { id: "gramsPerLiter", label: "Mass concentration", unit: "g/L" },
  { id: "massPercent", label: "Mass percent", unit: "% (w/w)" },
  { id: "ppm", label: "ppm (mass)", unit: "mg/kg" },
  { id: "molality", label: "Molality", unit: "mol/kg" },
];

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e5 || Math.abs(value) < 1e-4)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(6)).toString();
}

export function ConcentrationConverter() {
  const [formula, setFormula] = useState("NaCl");
  const [manualMM, setManualMM] = useState("");
  const [density, setDensity] = useState("1.00");
  const [kind, setKind] = useState<ConcentrationKind>("molarity");
  const [value, setValue] = useState("0.100");

  const EXAMPLES = [
    {
      id: "mmnacl",
      label: "100 mM NaCl",
      formula: "NaCl",
      density: "1.00",
      kind: "millimolar" as const,
      value: "100",
    },
    {
      id: "nacl",
      label: "0.9% NaCl (ρ≈1.00)",
      formula: "NaCl",
      density: "1.00",
      kind: "massPercent" as const,
      value: "0.9",
    },
    {
      id: "glucose",
      label: "5% glucose (ρ≈1.02)",
      formula: "C6H12O6",
      density: "1.02",
      kind: "massPercent" as const,
      value: "5",
    },
    {
      id: "etoh",
      label: "40% EtOH (ρ≈0.95)",
      formula: "C2H5OH",
      density: "0.95",
      kind: "massPercent" as const,
      value: "40",
    },
  ];

  const result = useMemo(() => {
    try {
      const mm = resolveMolarMass(
        formula,
        manualMM.trim() ? Number(manualMM) : undefined,
      );
      const dens = Number(density);
      const val = Number(value);
      return {
        ok: true as const,
        value: convertConcentration({
          molarMass: mm,
          density: dens,
          kind,
          value: val,
        }),
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof ConcentrationError
            ? error.message
            : "Unable to convert this concentration.",
      };
    }
  }, [formula, manualMM, density, kind, value]);

  const reset = () => {
    setFormula("NaCl");
    setManualMM("");
    setDensity("1.00");
    setKind("molarity");
    setValue("0.100");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Concentration converter</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Molarity (M, mM, μM) · g/L · mass % · ppm · molality
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
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => {
              setFormula(ex.formula);
              setManualMM("");
              setDensity(ex.density);
              setKind(ex.kind);
              setValue(ex.value);
            }}
            className="border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Formula (for molar mass)</span>
          <input
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            spellCheck={false}
            placeholder="e.g. NaCl or C6H12O6"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">
            Molar mass override{" "}
            <span className="font-normal text-[var(--muted)]">(optional)</span>
          </span>
          <input
            value={manualMM}
            onChange={(e) => setManualMM(e.target.value)}
            inputMode="decimal"
            placeholder="g/mol"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Solution density (g/mL)</span>
          <input
            value={density}
            onChange={(e) => setDensity(e.target.value)}
            inputMode="decimal"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Known unit</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as ConcentrationKind)}
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 outline-none focus:ring-1 focus:ring-[var(--accent)]"
          >
            {KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label} ({k.unit})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">
            Value ({KINDS.find((k) => k.id === kind)?.unit})
          </span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="decimal"
            className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
      </div>

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-[var(--muted)]">Molar mass</dt>
              <dd className="font-mono">
                {formatNum(result.value.molarMass)} g/mol
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Molarity</dt>
              <dd className="font-mono">{formatNum(result.value.molarity)} mol/L</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Millimolar</dt>
              <dd className="font-mono">{formatNum(result.value.millimolar)} mM</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Micromolar</dt>
              <dd className="font-mono">{formatNum(result.value.micromolar)} μM</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Mass concentration</dt>
              <dd className="font-mono">
                {formatNum(result.value.gramsPerLiter)} g/L
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">g/mL (from g/L)</dt>
              <dd className="font-mono">
                {formatNum(result.value.gramsPerLiter / 1000)} g/mL
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">mg/mL (from g/L)</dt>
              <dd className="font-mono">
                {formatNum(result.value.gramsPerLiter)} mg/mL
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Mass percent</dt>
              <dd className="font-mono">
                {formatNum(result.value.massPercent)} % (w/w)
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">ppm (mass)</dt>
              <dd className="font-mono">{formatNum(result.value.ppm)}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Molality</dt>
              <dd className="font-mono">
                {formatNum(result.value.molality)} mol/kg solvent
              </dd>
            </div>
          </dl>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        Conversions use 1.00 L of solution as the calculation basis. For dilute
        aqueous solutions, density ≈ 1.00 g/mL is a common approximation; use a
        measured density for concentrated solutions.
      </p>
    </div>
  );
}
