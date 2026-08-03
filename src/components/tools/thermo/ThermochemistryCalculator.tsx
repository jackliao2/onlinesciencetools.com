"use client";

import { useMemo, useState } from "react";
import {
  ThermoError,
  calorimetryHeat,
  enthalpyFromFormation,
  heatFromEnthalpy,
  hessSum,
} from "@/lib/chemistry/thermochemistry";
import { RotateCcw } from "lucide-react";

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e5 || Math.abs(value) < 1e-3)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(6)).toString();
}

type Mode = "calorimetry" | "formation" | "hess" | "scale";

export function ThermochemistryCalculator() {
  const [mode, setMode] = useState<Mode>("formation");

  // calorimetry
  const [mass, setMass] = useState("100");
  const [c, setC] = useState("4.184");
  const [deltaT, setDeltaT] = useState("5.0");

  // formation
  const [species, setSpecies] = useState([
    { role: "reactant" as const, label: "CH4", moles: "1", deltaHf: "-74.8" },
    { role: "reactant" as const, label: "O2", moles: "2", deltaHf: "0" },
    { role: "product" as const, label: "CO2", moles: "1", deltaHf: "-393.5" },
    { role: "product" as const, label: "H2O(l)", moles: "2", deltaHf: "-285.8" },
  ]);

  // hess
  const [steps, setSteps] = useState([
    { label: "step 1", coefficient: "1", deltaH: "-100" },
    { label: "step 2", coefficient: "1", deltaH: "40" },
  ]);

  // scale
  const [molesRxn, setMolesRxn] = useState("2.0");
  const [deltaHRxn, setDeltaHRxn] = useState("-890");

  const result = useMemo(() => {
    try {
      if (mode === "calorimetry") {
        const q = calorimetryHeat(Number(mass), Number(c), Number(deltaT));
        return {
          ok: true as const,
          text: `q = ${formatNum(q)} (same energy unit as c·ΔT)`,
          detail:
            "q = m c ΔT. Positive ΔT → heat absorbed by the sample; for an isolated calorimeter, qrxn = −qsample.",
        };
      }
      if (mode === "formation") {
        const dH = enthalpyFromFormation(
          species.map((s) => ({
            role: s.role,
            moles: Number(s.moles),
            deltaHf: Number(s.deltaHf),
          })),
        );
        return {
          ok: true as const,
          text: `ΔH° = ${formatNum(dH)} kJ/mol-rxn`,
          detail: "ΔH° = Σ nΔHf°(products) − Σ nΔHf°(reactants).",
        };
      }
      if (mode === "hess") {
        const dH = hessSum(
          steps.map((s) => ({
            coefficient: Number(s.coefficient),
            deltaH: Number(s.deltaH),
          })),
        );
        return {
          ok: true as const,
          text: `ΔH_rxn = ${formatNum(dH)}`,
          detail: "Sum of (step coefficient × step ΔH). Reverse a step with coefficient −1.",
        };
      }
      const q = heatFromEnthalpy(Number(molesRxn), Number(deltaHRxn));
      return {
        ok: true as const,
        text: `q = ${formatNum(q)} kJ`,
        detail: "q = n × ΔH for the reaction as written.",
      };
    } catch (error) {
      return {
        ok: false as const,
        error: error instanceof ThermoError ? error.message : "Unable to calculate.",
      };
    }
  }, [mode, mass, c, deltaT, species, steps, molesRxn, deltaHRxn]);

  const reset = () => {
    setMode("formation");
    setMass("100");
    setC("4.184");
    setDeltaT("5.0");
    setSpecies([
      { role: "reactant", label: "CH4", moles: "1", deltaHf: "-74.8" },
      { role: "reactant", label: "O2", moles: "2", deltaHf: "0" },
      { role: "product", label: "CO2", moles: "1", deltaHf: "-393.5" },
      { role: "product", label: "H2O(l)", moles: "2", deltaHf: "-285.8" },
    ]);
    setSteps([
      { label: "step 1", coefficient: "1", deltaH: "-100" },
      { label: "step 2", coefficient: "1", deltaH: "40" },
    ]);
    setMolesRxn("2.0");
    setDeltaHRxn("-890");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Thermochemistry calculator</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            ΔHf° · Hess’s law · calorimetry · scale heat
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
            ["formation", "From ΔHf°"],
            ["hess", "Hess’s law"],
            ["calorimetry", "Calorimetry"],
            ["scale", "q from ΔH"],
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

      {mode === "calorimetry" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Mass m</span>
            <input
              value={mass}
              onChange={(e) => setMass(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">c (e.g. J/g·°C)</span>
            <input
              value={c}
              onChange={(e) => setC(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">ΔT</span>
            <input
              value={deltaT}
              onChange={(e) => setDeltaT(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
            />
          </label>
        </div>
      ) : null}

      {mode === "formation" ? (
        <div className="mt-5 space-y-2">
          <p className="text-sm text-[var(--muted)]">
            Enter coefficients and ΔHf° (kJ/mol), including the correct phase.
            Example: methane combustion to liquid water.
          </p>
          {species.map((s, i) => (
            <div key={i} className="flex flex-wrap gap-2">
              <select
                value={s.role}
                onChange={(e) =>
                  setSpecies((prev) =>
                    prev.map((row, j) =>
                      j === i
                        ? { ...row, role: e.target.value as "reactant" | "product" }
                        : row,
                    ),
                  )
                }
                className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 text-sm"
              >
                <option value="reactant">Reactant</option>
                <option value="product">Product</option>
              </select>
              <input
                value={s.label}
                onChange={(e) =>
                  setSpecies((prev) =>
                    prev.map((row, j) =>
                      j === i ? { ...row, label: e.target.value } : row,
                    ),
                  )
                }
                className="w-24 border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 font-mono text-sm"
                placeholder="label"
              />
              <input
                value={s.moles}
                onChange={(e) =>
                  setSpecies((prev) =>
                    prev.map((row, j) =>
                      j === i ? { ...row, moles: e.target.value } : row,
                    ),
                  )
                }
                className="w-20 border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 font-mono text-sm"
                placeholder="mol"
              />
              <input
                value={s.deltaHf}
                onChange={(e) =>
                  setSpecies((prev) =>
                    prev.map((row, j) =>
                      j === i ? { ...row, deltaHf: e.target.value } : row,
                    ),
                  )
                }
                className="min-w-[6rem] flex-1 border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 font-mono text-sm"
                placeholder="ΔHf°"
              />
              <button
                type="button"
                className="border border-[var(--border)] px-2 text-xs text-[var(--muted)]"
                onClick={() => setSpecies((prev) => prev.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setSpecies((prev) => [
                ...prev,
                { role: "product", label: "", moles: "1", deltaHf: "0" },
              ])
            }
            className="border border-[var(--border)] px-2.5 py-1.5 text-xs"
          >
            Add species
          </button>
        </div>
      ) : null}

      {mode === "hess" ? (
        <div className="mt-5 space-y-2">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-wrap gap-2">
              <input
                value={s.label}
                onChange={(e) =>
                  setSteps((prev) =>
                    prev.map((row, j) =>
                      j === i ? { ...row, label: e.target.value } : row,
                    ),
                  )
                }
                className="w-28 border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 text-sm"
              />
              <input
                value={s.coefficient}
                onChange={(e) =>
                  setSteps((prev) =>
                    prev.map((row, j) =>
                      j === i ? { ...row, coefficient: e.target.value } : row,
                    ),
                  )
                }
                className="w-20 border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 font-mono text-sm"
                placeholder="coeff"
              />
              <input
                value={s.deltaH}
                onChange={(e) =>
                  setSteps((prev) =>
                    prev.map((row, j) =>
                      j === i ? { ...row, deltaH: e.target.value } : row,
                    ),
                  )
                }
                className="min-w-[6rem] flex-1 border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 font-mono text-sm"
                placeholder="ΔH"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setSteps((prev) => [
                ...prev,
                { label: `step ${prev.length + 1}`, coefficient: "1", deltaH: "0" },
              ])
            }
            className="border border-[var(--border)] px-2.5 py-1.5 text-xs"
          >
            Add step
          </button>
        </div>
      ) : null}

      {mode === "scale" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Moles of reaction</span>
            <input
              value={molesRxn}
              onChange={(e) => setMolesRxn(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">ΔH (kJ/mol-rxn)</span>
            <input
              value={deltaHRxn}
              onChange={(e) => setDeltaHRxn(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono"
            />
          </label>
        </div>
      ) : null}

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {!result.ok ? (
          <p className="text-[var(--muted)]">{result.error}</p>
        ) : (
          <div className="space-y-1">
            <p className="font-medium">{result.text}</p>
            <p className="text-xs text-[var(--muted)]">{result.detail}</p>
          </div>
        )}
      </div>
    </div>
  );
}
