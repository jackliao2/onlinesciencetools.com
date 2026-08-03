"use client";

import { useMemo, useState } from "react";
import { Binary, RotateCcw } from "lucide-react";

type Base = 2 | 8 | 10 | 16;
type Operation = "+" | "-" | "*" | "/";

const BASE_LABELS: Record<Base, string> = {
  2: "Binary",
  8: "Octal",
  10: "Decimal",
  16: "Hexadecimal",
};

function parseInBase(
  value: string,
  base: Base,
): { ok: true; num: number } | { ok: false; error: string } {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, error: "Enter a value." };

  const patterns: Record<Base, RegExp> = {
    2: /^-?[01]+$/,
    8: /^-?[0-7]+$/,
    10: /^-?\d+$/,
    16: /^-?[0-9a-fA-F]+$/,
  };

  if (!patterns[base].test(trimmed)) {
    return {
      ok: false,
      error:
        base === 10
          ? "Enter a whole number (fractions are not supported)."
          : `Invalid ${BASE_LABELS[base].toLowerCase()} digits.`,
    };
  }

  const num = base === 10 ? Number(trimmed) : parseInt(trimmed, base);
  if (!Number.isFinite(num)) {
    return { ok: false, error: "Could not parse number." };
  }
  return { ok: true, num };
}

function formatInBase(num: number, base: Base): string {
  if (!Number.isFinite(num)) return "—";
  if (base === 10) return String(Math.round(num));
  if (num < 0) return "-" + formatInBase(-num, base);
  return Math.floor(num).toString(base).toUpperCase();
}

export function BinaryCalculator() {
  const [mode, setMode] = useState<"convert" | "arithmetic">("convert");
  const [inputBase, setInputBase] = useState<Base>(10);
  const [inputValue, setInputValue] = useState("255");
  const [opBase, setOpBase] = useState<Base>(10);
  const [operandA, setOperandA] = useState("10");
  const [operandB, setOperandB] = useState("3");
  const [operation, setOperation] = useState<Operation>("+");

  const convertResult = useMemo(() => {
    const parsed = parseInBase(inputValue, inputBase);
    if (!parsed.ok) return { error: parsed.error };
    const num = parsed.num;
    return {
      binary: formatInBase(num, 2),
      octal: formatInBase(num, 8),
      decimal: formatInBase(num, 10),
      hex: formatInBase(num, 16),
      raw: num,
    };
  }, [inputValue, inputBase]);

  const arithmeticResult = useMemo(() => {
    const a = parseInBase(operandA, opBase);
    const b = parseInBase(operandB, opBase);
    if (!a.ok) return { error: `Operand A: ${a.error}` };
    if (!b.ok) return { error: `Operand B: ${b.error}` };

    let result: number;
    switch (operation) {
      case "+":
        result = a.num + b.num;
        break;
      case "-":
        result = a.num - b.num;
        break;
      case "*":
        result = a.num * b.num;
        break;
      case "/":
        if (b.num === 0) return { error: "Division by zero." };
        result = Math.trunc(a.num / b.num);
        break;
    }

    return {
      result,
      binary: formatInBase(result, 2),
      octal: formatInBase(result, 8),
      decimal: formatInBase(result, 10),
      hex: formatInBase(result, 16),
    };
  }, [operandA, operandB, opBase, operation]);

  const reset = () => {
    setInputValue("255");
    setInputBase(10);
    setOperandA("10");
    setOperandB("3");
    setOpBase(10);
    setOperation("+");
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Binary className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Number systems
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

      <div className="mt-6 flex flex-wrap gap-2">
        {(["convert", "arithmetic"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              mode === m
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {m === "convert" ? "Convert" : "Arithmetic"}
          </button>
        ))}
      </div>

      {mode === "convert" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Input base</span>
              <select
                value={inputBase}
                onChange={(e) => setInputBase(Number(e.target.value) as Base)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              >
                {(Object.keys(BASE_LABELS) as unknown as Base[]).map((b) => (
                  <option key={b} value={b}>
                    {BASE_LABELS[b]} (base {b})
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Value</span>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                spellCheck={false}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-mono text-lg outline-none ring-[var(--accent)] focus:ring-2"
              />
            </label>
          </div>
          <BaseResults
            result={convertResult}
            title="Converted values"
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Base</span>
              <select
                value={opBase}
                onChange={(e) => setOpBase(Number(e.target.value) as Base)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              >
                {(Object.keys(BASE_LABELS) as unknown as Base[]).map((b) => (
                  <option key={b} value={b}>
                    {BASE_LABELS[b]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block flex-1 min-w-[120px]">
              <span className="mb-2 block text-sm font-medium">Operand A</span>
              <input
                value={operandA}
                onChange={(e) => setOperandA(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-mono outline-none ring-[var(--accent)] focus:ring-2"
              />
            </label>
            <div className="flex gap-1">
              {(["+", "-", "*", "/"] as Operation[]).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setOperation(op)}
                  className={`h-11 w-11 rounded-xl font-mono text-lg font-semibold transition ${
                    operation === op
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
            <label className="block flex-1 min-w-[120px]">
              <span className="mb-2 block text-sm font-medium">Operand B</span>
              <input
                value={operandB}
                onChange={(e) => setOperandB(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-mono outline-none ring-[var(--accent)] focus:ring-2"
              />
            </label>
          </div>
          <BaseResults
            result={arithmeticResult}
            title="Result in all bases"
          />
        </div>
      )}
    </div>
  );
}

function BaseResults({
  result,
  title,
}: {
  result:
    | { error: string }
    | { binary: string; octal: string; decimal: string; hex: string };
  title: string;
}) {
  if ("error" in result) {
    return (
      <div className="flex min-h-[200px] flex-col justify-center rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/60 p-6 dark:border-rose-500/30 dark:bg-rose-950/20">
        <p className="font-semibold text-rose-700 dark:text-rose-300">Error</p>
        <p className="mt-1 text-sm text-rose-600/90 dark:text-rose-200/80">{result.error}</p>
      </div>
    );
  }

  const rows = [
    { label: "Binary", value: result.binary },
    { label: "Octal", value: result.octal },
    { label: "Decimal", value: result.decimal },
    { label: "Hex", value: result.hex },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 grid gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {row.label}
            </span>
            <span className="font-mono text-lg font-semibold">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
