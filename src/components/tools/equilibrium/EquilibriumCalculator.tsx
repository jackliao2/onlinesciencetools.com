"use client";

import { useMemo, useState } from "react";
import {
  EQUILIBRIUM_PRESETS,
  EquilibriumError,
  solveEquilibrium,
  type SpeciesInput,
  type SpeciesRole,
} from "@/lib/chemistry/equilibrium";
import { Plus, RotateCcw, Scale, Trash2 } from "lucide-react";

type EditableSpecies = {
  id: string;
  label: string;
  coefficient: string;
  role: SpeciesRole;
  initial: string;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const DEFAULT_SPECIES: EditableSpecies[] = [
  { id: uid(), label: "A", coefficient: "1", role: "reactant", initial: "1" },
  { id: uid(), label: "B", coefficient: "1", role: "reactant", initial: "1" },
  { id: uid(), label: "C", coefficient: "1", role: "product", initial: "0" },
  { id: uid(), label: "D", coefficient: "1", role: "product", initial: "0" },
];

function formatNum(value: number, digits = 5): string {
  if (!Number.isFinite(value)) return "∞";
  if (Math.abs(value) !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-3)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(digits)).toString();
}

export function EquilibriumCalculator() {
  const [constantType, setConstantType] = useState<"Kc" | "Kp">("Kc");
  const [K, setK] = useState("4");
  const [species, setSpecies] = useState<EditableSpecies[]>(DEFAULT_SPECIES);

  const parsedSpecies = useMemo(() => {
    return species.map<SpeciesInput>((s) => ({
      id: s.id,
      label: s.label.trim(),
      coefficient: Number(s.coefficient),
      role: s.role,
      initial: Number(s.initial),
    }));
  }, [species]);

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: solveEquilibrium(parsedSpecies, Number(K), constantType),
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof EquilibriumError
            ? error.message
            : "Unable to solve this equilibrium setup.",
      };
    }
  }, [K, constantType, parsedSpecies]);

  const updateSpecies = (id: string, patch: Partial<EditableSpecies>) => {
    setSpecies((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const applyPreset = (id: string) => {
    const preset = EQUILIBRIUM_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setConstantType(preset.constant);
    setK(String(preset.K));
    setSpecies(
      preset.species.map((s) => ({
        id: uid(),
        label: s.label,
        coefficient: String(s.coefficient),
        role: s.role,
        initial: String(s.initial),
      })),
    );
  };

  const reset = () => {
    setConstantType("Kc");
    setK("4");
    setSpecies(DEFAULT_SPECIES.map((s) => ({ ...s, id: uid() })));
  };

  const unit = constantType === "Kc" ? "M" : "atm";

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Scale className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            ICE equilibrium solver
          </span>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {EQUILIBRIUM_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset.id)}
            className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <label className="block sm:col-span-1">
          <span className="mb-2 block text-sm font-medium">Constant type</span>
          <div className="flex gap-2">
            {(["Kc", "Kp"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setConstantType(type)}
                className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  constantType === type
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-2)] text-[var(--muted)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">
            Equilibrium constant {constantType}
          </span>
          <input
            type="number"
            min={0}
            step="any"
            value={K}
            onChange={(e) => setK(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 font-mono outline-none ring-[var(--accent)] focus:ring-2"
          />
        </label>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
            <tr>
              <th className="px-3 py-3 font-medium">Species</th>
              <th className="px-3 py-3 font-medium">Coeff</th>
              <th className="px-3 py-3 font-medium">Role</th>
              <th className="px-3 py-3 font-medium">Initial ({unit})</th>
              <th className="px-3 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {species.map((row) => (
              <tr key={row.id} className="border-t border-[var(--border)]">
                <td className="px-3 py-2">
                  <input
                    value={row.label}
                    onChange={(e) => updateSpecies(row.id, { label: e.target.value })}
                    className="w-24 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 font-mono outline-none focus:ring-2 focus:ring-[var(--accent)] sm:w-28"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={row.coefficient}
                    onChange={(e) =>
                      updateSpecies(row.id, { coefficient: e.target.value })
                    }
                    className="w-16 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 font-mono outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={row.role}
                    onChange={(e) =>
                      updateSpecies(row.id, {
                        role: e.target.value as SpeciesRole,
                      })
                    }
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="reactant">Reactant</option>
                    <option value="product">Product</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={row.initial}
                    onChange={(e) =>
                      updateSpecies(row.id, { initial: e.target.value })
                    }
                    className="w-28 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 font-mono outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    disabled={species.length <= 2}
                    onClick={() =>
                      setSpecies((prev) => prev.filter((s) => s.id !== row.id))
                    }
                    className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-30"
                    aria-label="Remove species"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() =>
          setSpecies((prev) => [
            ...prev,
            {
              id: uid(),
              label: `X${prev.length + 1}`,
              coefficient: "1",
              role: "product",
              initial: "0",
            },
          ])
        }
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        <Plus className="h-4 w-4" />
        Add species
      </button>

      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        Enter only dissolved solutes for Kc or gases for Kp; omit pure solids and
        liquids. This ICE model uses concentrations or partial pressures as
        activity approximations, so it is not suitable for non-ideal systems.
      </p>

      <div className="mt-6">
        {!result.ok ? (
          <div className="rounded-2xl border border-rose-300/50 bg-rose-50/70 p-5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200">
            {result.error}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard
                label="Reaction quotient Q"
                value={formatNum(result.value.Q)}
              />
              <StatCard
                label={constantType}
                value={formatNum(result.value.K)}
              />
              <StatCard
                label="Extent x"
                value={formatNum(result.value.x)}
                hint={
                  result.value.x >= 0
                    ? "Forward progress"
                    : "Reverse progress"
                }
              />
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Direction
              </p>
              <p className="mt-2 font-semibold text-[var(--foreground)]">
                {result.value.directionLabel}
              </p>
              <p className="mt-2 font-mono text-sm text-[var(--muted)]">
                {result.value.expression}
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Species</th>
                    <th className="px-4 py-3 font-medium">I</th>
                    <th className="px-4 py-3 font-medium">C</th>
                    <th className="px-4 py-3 font-medium">E</th>
                  </tr>
                </thead>
                <tbody>
                  {result.value.species.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-[var(--border)] odd:bg-[var(--surface)] even:bg-[var(--surface-2)]"
                    >
                      <td className="px-4 py-3 font-mono font-semibold">
                        {row.coefficient}
                        {row.label}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {formatNum(row.initial)}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {row.change >= 0 ? "+" : ""}
                        {formatNum(row.change)}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[var(--accent)]">
                        {formatNum(row.equilibrium)} {unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-2),var(--surface))] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  );
}
