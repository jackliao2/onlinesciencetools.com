"use client";

import { useMemo, useState } from "react";
import {
  AVOGADRO,
  formatScientific,
  massFromMoles,
  molesFromMass,
  molesFromParticles,
  parseFormula,
  particlesFromMoles,
  FormulaParseError,
  type FormulaResult,
} from "@/lib/chemistry/molar-mass";
import { Calculator, FlaskConical, RotateCcw } from "lucide-react";

const EXAMPLES = ["H2O", "CO2", "H2SO4", "Ca(OH)2", "C6H12O6", "Fe2(SO4)3", "CuSO4·5H2O"];

type InputMode = "moles" | "mass" | "particles";

export function StoichiometryCalculator() {
  const [formula, setFormula] = useState("H2SO4");
  const [mode, setMode] = useState<InputMode>("mass");
  const [amount, setAmount] = useState("98.079");

  const parsed = useMemo(() => {
    try {
      return { ok: true as const, result: parseFormula(formula) };
    } catch (error) {
      const message =
        error instanceof FormulaParseError
          ? error.message
          : "Could not parse this formula.";
      return { ok: false as const, error: message };
    }
  }, [formula]);

  const conversion = useMemo(() => {
    if (!parsed.ok) return null;
    const molarMass = parsed.result.molarMass;
    const value = Number(amount);

    if (!Number.isFinite(value) || value < 0) {
      return { error: "Enter a non-negative number." };
    }

    let moles = 0;
    if (mode === "moles") moles = value;
    if (mode === "mass") moles = molesFromMass(value, molarMass);
    if (mode === "particles") moles = molesFromParticles(value);

    return {
      moles,
      mass: massFromMoles(moles, molarMass),
      particles: particlesFromMoles(moles),
      molarMass,
    };
  }, [amount, mode, parsed]);

  const applyExample = (example: string) => {
    setFormula(example);
    try {
      const result = parseFormula(example);
      setMode("mass");
      setAmount(result.molarMass.toFixed(3));
    } catch {
      // ignore
    }
  };

  const reset = () => {
    setFormula("H2SO4");
    setMode("mass");
    setAmount("98.079");
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Calculator className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Interactive calculator
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

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--muted)]">
        <p className="font-medium text-[var(--foreground)]">Molar mass formula</p>
        <p className="mt-1 font-mono">
          n = m / M · m = n × M · N = n × Nₐ · Nₐ = 6.02214076×10²³ mol⁻¹
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Chemical formula
            </span>
            <input
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              spellCheck={false}
              placeholder="e.g. Ca(OH)2 or CuSO4·5H2O"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-mono text-lg text-[var(--foreground)] outline-none ring-[var(--accent)] transition focus:ring-2"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => applyExample(example)}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 font-mono text-xs text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {example}
              </button>
            ))}
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium">Amount input</span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["mass", "Mass (g)"],
                  ["moles", "Moles (mol)"],
                  ["particles", "Particles"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    mode === key
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={0}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-mono text-[var(--foreground)] outline-none ring-[var(--accent)] transition focus:ring-2"
            />
          </div>
        </div>

        <ResultsPanel parsed={parsed} conversion={conversion} />
      </div>

      {parsed.ok && <CompositionTable result={parsed.result} />}
    </div>
  );
}

function ResultsPanel({
  parsed,
  conversion,
}: {
  parsed:
    | { ok: true; result: FormulaResult }
    | { ok: false; error: string };
  conversion:
    | { error: string }
    | {
        moles: number;
        mass: number;
        particles: number;
        molarMass: number;
      }
    | null;
}) {
  if (!parsed.ok) {
    return (
      <div className="flex min-h-[280px] flex-col justify-center rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/60 p-6 dark:border-rose-500/30 dark:bg-rose-950/20">
        <FlaskConical className="h-8 w-8 text-rose-500" />
        <p className="mt-3 font-semibold text-rose-700 dark:text-rose-300">
          Formula error
        </p>
        <p className="mt-1 text-sm text-rose-600/90 dark:text-rose-200/80">
          {parsed.error}
        </p>
      </div>
    );
  }

  if (!conversion || "error" in conversion) {
    return (
      <div className="flex min-h-[280px] flex-col justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-6">
        <p className="font-semibold">Invalid amount</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {conversion && "error" in conversion
            ? conversion.error
            : "Enter a valid amount to convert."}
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: "Molar mass",
      value: `${conversion.molarMass.toFixed(4)} g/mol`,
    },
    {
      label: "Moles",
      value: `${formatScientific(conversion.moles)} mol`,
    },
    {
      label: "Mass",
      value: `${formatScientific(conversion.mass)} g`,
    },
    {
      label: "Particles",
      value: formatScientific(conversion.particles),
      hint: `Nₐ = ${AVOGADRO.toExponential(4)}`,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-2),var(--surface))] p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            {card.label}
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-[var(--foreground)]">
            {card.value}
          </p>
          {card.hint && (
            <p className="mt-1 text-xs text-[var(--muted)]">{card.hint}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function CompositionTable({ result }: { result: FormulaResult }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
      <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
        <h3 className="text-sm font-semibold">
          Elemental composition of {result.formula}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Element</th>
              <th className="px-4 py-3 font-medium">Atoms</th>
              <th className="px-4 py-3 font-medium">Atomic mass</th>
              <th className="px-4 py-3 font-medium">Contribution</th>
              <th className="px-4 py-3 font-medium">Mass %</th>
            </tr>
          </thead>
          <tbody>
            {result.composition.map((row) => (
              <tr
                key={row.element}
                className="border-t border-[var(--border)] odd:bg-[var(--surface)] even:bg-[var(--surface-2)]"
              >
                <td className="px-4 py-3 font-mono font-semibold">{row.element}</td>
                <td className="px-4 py-3 font-mono">{row.count}</td>
                <td className="px-4 py-3 font-mono">
                  {row.atomicMass.toFixed(4)}
                </td>
                <td className="px-4 py-3 font-mono">
                  {row.totalMass.toFixed(4)} g/mol
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--border)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${Math.min(row.percent, 100)}%` }}
                      />
                    </div>
                    <span className="font-mono">{row.percent.toFixed(2)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
