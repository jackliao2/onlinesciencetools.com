"use client";

import { useMemo, useState } from "react";
import {
  formatScientific,
  molesFromMass,
  massFromMoles,
  parseFormula,
  FormulaParseError,
} from "@/lib/chemistry/molar-mass";
import { Beaker, Plus, RotateCcw, Trash2 } from "lucide-react";

type Role = "reactant" | "product";
type AmountUnit = "moles" | "grams";

interface Species {
  id: string;
  coefficient: string;
  formula: string;
  role: Role;
  amount: string;
  unit: AmountUnit;
  manualMolarMass: string;
  useManualMass: boolean;
}

const DEFAULT_SPECIES: Species[] = [
  {
    id: "1",
    coefficient: "2",
    formula: "H2",
    role: "reactant",
    amount: "4",
    unit: "grams",
    manualMolarMass: "",
    useManualMass: false,
  },
  {
    id: "2",
    coefficient: "1",
    formula: "O2",
    role: "reactant",
    amount: "32",
    unit: "grams",
    manualMolarMass: "",
    useManualMass: false,
  },
  {
    id: "3",
    coefficient: "2",
    formula: "H2O",
    role: "product",
    amount: "0",
    unit: "moles",
    manualMolarMass: "",
    useManualMass: false,
  },
];

let nextId = 4;

function resolveMolarMass(species: Species): { molarMass: number; error?: string } {
  if (species.useManualMass) {
    const mm = Number(species.manualMolarMass);
    if (!Number.isFinite(mm) || mm <= 0) {
      return { molarMass: 0, error: "Enter a positive manual molar mass." };
    }
    return { molarMass: mm };
  }
  try {
    return { molarMass: parseFormula(species.formula).molarMass };
  } catch (error) {
    const message =
      error instanceof FormulaParseError
        ? error.message
        : "Invalid formula.";
    return { molarMass: 0, error: message };
  }
}

function toMoles(amount: number, unit: AmountUnit, molarMass: number): number {
  if (unit === "moles") return amount;
  return molesFromMass(amount, molarMass);
}

export function ReactionStoichiometryCalculator() {
  const [species, setSpecies] = useState<Species[]>(DEFAULT_SPECIES);

  const updateSpecies = (id: string, patch: Partial<Species>) => {
    setSpecies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  };

  const addSpecies = () => {
    setSpecies((prev) => [
      ...prev,
      {
        id: String(nextId++),
        coefficient: "1",
        formula: "",
        role: "reactant",
        amount: "0",
        unit: "moles",
        manualMolarMass: "",
        useManualMass: false,
      },
    ]);
  };

  const removeSpecies = (id: string) => {
    setSpecies((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  };

  const reset = () => setSpecies(DEFAULT_SPECIES);

  const result = useMemo(() => {
    const reactants = species.filter((s) => s.role === "reactant");
    const products = species.filter((s) => s.role === "product");

    if (reactants.length === 0) {
      return { error: "Add at least one reactant with a starting amount." };
    }

    const parsed = species.map((s) => {
      const coeff = Number(s.coefficient);
      const amount = Number(s.amount);
      const mm = resolveMolarMass(s);

      if (!Number.isFinite(coeff) || coeff <= 0) {
        return { species: s, error: "Coefficients must be positive numbers." };
      }
      if (s.role === "reactant" && (!Number.isFinite(amount) || amount < 0)) {
        return { species: s, error: "Reactant amounts must be non-negative." };
      }
      if (mm.error) {
        return { species: s, error: mm.error };
      }

      const moles =
        s.role === "reactant"
          ? toMoles(amount, s.unit, mm.molarMass)
          : 0;

      return {
        species: s,
        coefficient: coeff,
        molarMass: mm.molarMass,
        initialMoles: moles,
      };
    });

    const firstError = parsed.find((p) => "error" in p);
    if (firstError && "error" in firstError) {
      return { error: `${firstError.species.formula || "Species"}: ${firstError.error}` };
    }

    const reactantData = parsed.filter(
      (p): p is Exclude<typeof p, { error: string }> =>
        !("error" in p) && p.species.role === "reactant",
    );

    const extents = reactantData.map((r) => ({
      ...r,
      maxExtent: r.initialMoles / r.coefficient,
    }));

    const limitingExtent = Math.min(...extents.map((e) => e.maxExtent));
    const limiting = extents.reduce((best, current) =>
      current.maxExtent <= best.maxExtent ? current : best,
    );

    const productYields = products.map((p) => {
      const coeff = Number(p.coefficient);
      const mm = resolveMolarMass(p);
      const theoreticalMoles = limitingExtent * coeff;
      return {
        formula: p.formula,
        coefficient: coeff,
        molarMass: mm.molarMass,
        theoreticalMoles,
        theoreticalMass: massFromMoles(theoreticalMoles, mm.molarMass),
      };
    });

    const leftoverReactants = reactantData.map((r) => {
      const consumed = limitingExtent * r.coefficient;
      const remaining = r.initialMoles - consumed;
      return {
        formula: r.species.formula,
        coefficient: r.coefficient,
        initialMoles: r.initialMoles,
        consumedMoles: consumed,
        remainingMoles: remaining,
        remainingMass: massFromMoles(remaining, r.molarMass),
        isLimiting: r.species.id === limiting.species.id,
      };
    });

    return {
      limitingReagent: limiting.species.formula,
      extent: limitingExtent,
      productYields,
      leftoverReactants,
    };
  }, [species]);

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Beaker className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Reaction stoichiometry
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addSpecies}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add species
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--muted)]">
        Enter a balanced reaction: coefficient, formula, role, and starting amount
        for each reactant. Molar mass is parsed from the formula or entered manually.
      </p>

      <div className="mt-6 space-y-4">
        {species.map((s) => (
          <div
            key={s.id}
            className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:grid-cols-[auto_1fr_auto_auto_auto_auto]"
          >
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">Coeff</span>
              <input
                value={s.coefficient}
                onChange={(e) => updateSpecies(s.id, { coefficient: e.target.value })}
                className="w-16 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-2 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">Formula</span>
              <input
                value={s.formula}
                onChange={(e) => updateSpecies(s.id, { formula: e.target.value })}
                placeholder="e.g. H2O"
                spellCheck={false}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">Role</span>
              <select
                value={s.role}
                onChange={(e) =>
                  updateSpecies(s.id, { role: e.target.value as Role })
                }
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              >
                <option value="reactant">Reactant</option>
                <option value="product">Product</option>
              </select>
            </label>
            {s.role === "reactant" && (
              <>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-[var(--muted)]">Amount</span>
                  <input
                    value={s.amount}
                    onChange={(e) => updateSpecies(s.id, { amount: e.target.value })}
                    className="w-24 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-[var(--muted)]">Unit</span>
                  <select
                    value={s.unit}
                    onChange={(e) =>
                      updateSpecies(s.id, { unit: e.target.value as AmountUnit })
                    }
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:ring-2"
                  >
                    <option value="moles">mol</option>
                    <option value="grams">g</option>
                  </select>
                </label>
              </>
            )}
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <input
                  type="checkbox"
                  checked={s.useManualMass}
                  onChange={(e) =>
                    updateSpecies(s.id, { useManualMass: e.target.checked })
                  }
                />
                Manual M
              </label>
              {s.useManualMass && (
                <input
                  value={s.manualMolarMass}
                  onChange={(e) =>
                    updateSpecies(s.id, { manualMolarMass: e.target.value })
                  }
                  placeholder="g/mol"
                  className="w-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-2 font-mono text-xs outline-none ring-[var(--accent)] focus:ring-2"
                />
              )}
              <button
                type="button"
                onClick={() => removeSpecies(s.id)}
                className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-rose-500"
                aria-label="Remove species"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ResultsPanel result={result} />
    </div>
  );
}

function ResultsPanel({
  result,
}: {
  result:
    | { error: string }
    | {
        limitingReagent: string;
        extent: number;
        productYields: Array<{
          formula: string;
          coefficient: number;
          molarMass: number;
          theoreticalMoles: number;
          theoreticalMass: number;
        }>;
        leftoverReactants: Array<{
          formula: string;
          coefficient: number;
          initialMoles: number;
          consumedMoles: number;
          remainingMoles: number;
          remainingMass: number;
          isLimiting: boolean;
        }>;
      };
}) {
  if ("error" in result) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/60 p-6 dark:border-rose-500/30 dark:bg-rose-950/20">
        <p className="font-semibold text-rose-700 dark:text-rose-300">Calculation error</p>
        <p className="mt-1 text-sm text-rose-600/90 dark:text-rose-200/80">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-2),var(--surface))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Limiting reagent
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-[var(--accent)]">
            {result.limitingReagent}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-2),var(--surface))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Reaction extent
          </p>
          <p className="mt-2 font-mono text-lg font-semibold">
            {formatScientific(result.extent)} mol
          </p>
        </div>
      </div>

      {result.productYields.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
            <h3 className="text-sm font-semibold">Theoretical product yields</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--surface)] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Coeff</th>
                  <th className="px-4 py-3 font-medium">Theoretical (mol)</th>
                  <th className="px-4 py-3 font-medium">Theoretical (g)</th>
                </tr>
              </thead>
              <tbody>
                {result.productYields.map((row) => (
                  <tr key={row.formula} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 font-mono font-semibold">{row.formula}</td>
                    <td className="px-4 py-3 font-mono">{row.coefficient}</td>
                    <td className="px-4 py-3 font-mono">
                      {formatScientific(row.theoreticalMoles)}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {formatScientific(row.theoreticalMass)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
          <h3 className="text-sm font-semibold">Reactant consumption & leftovers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--surface)] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Reactant</th>
                <th className="px-4 py-3 font-medium">Initial (mol)</th>
                <th className="px-4 py-3 font-medium">Consumed (mol)</th>
                <th className="px-4 py-3 font-medium">Leftover (mol)</th>
                <th className="px-4 py-3 font-medium">Leftover (g)</th>
              </tr>
            </thead>
            <tbody>
              {result.leftoverReactants.map((row) => (
                <tr
                  key={row.formula}
                  className={`border-t border-[var(--border)] ${
                    row.isLimiting ? "bg-[var(--accent-soft)]/40" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-semibold">
                    {row.formula}
                    {row.isLimiting && (
                      <span className="ml-2 text-xs text-[var(--accent)]">(limiting)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {formatScientific(row.initialMoles)}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {formatScientific(row.consumedMoles)}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {formatScientific(row.remainingMoles)}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {formatScientific(row.remainingMass)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
