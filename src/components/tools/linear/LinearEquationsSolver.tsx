"use client";

import { useMemo, useState } from "react";
import {
  LINEAR_PRESETS,
  formatNum,
  invertMatrix,
  solveLinearSystem,
  type LinearSolveResult,
} from "@/lib/math/linear-system";
import { Grid3x3, RotateCcw } from "lucide-react";

const SIZES = [2, 3, 4, 5, 6] as const;

function emptyMatrix(n: number): string[][] {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => "0"));
}

function emptyB(n: number): string[] {
  return Array.from({ length: n }, () => "0");
}

function fromNumeric(A: number[][], b: number[]) {
  return {
    matrix: A.map((row) => row.map((v) => String(v))),
    b: b.map((v) => String(v)),
  };
}

export function LinearEquationsSolver() {
  const initial = fromNumeric(LINEAR_PRESETS[1].A, LINEAR_PRESETS[1].b);
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState(initial.matrix);
  const [bVec, setBVec] = useState(initial.b);
  const [showInverse, setShowInverse] = useState(false);

  const resize = (n: number) => {
    setSize(n);
    const nextA = emptyMatrix(n);
    const nextB = emptyB(n);
    for (let i = 0; i < Math.min(n, matrix.length); i += 1) {
      for (let j = 0; j < Math.min(n, matrix[i].length); j += 1) {
        nextA[i][j] = matrix[i][j];
      }
      nextB[i] = bVec[i] ?? "0";
    }
    // Identity-ish default for new larger cells
    for (let i = 0; i < n; i += 1) {
      if (!nextA[i][i] || nextA[i][i] === "0") nextA[i][i] = "1";
    }
    setMatrix(nextA);
    setBVec(nextB);
  };

  const applyPreset = (id: string) => {
    const p = LINEAR_PRESETS.find((x) => x.id === id);
    if (!p) return;
    const loaded = fromNumeric(p.A, p.b);
    setSize(p.A.length);
    setMatrix(loaded.matrix);
    setBVec(loaded.b);
    setShowInverse(false);
  };

  const parsed = useMemo(() => {
    const A: number[][] = [];
    for (let i = 0; i < size; i += 1) {
      const row: number[] = [];
      for (let j = 0; j < size; j += 1) {
        const num = Number(matrix[i]?.[j]);
        if (!Number.isFinite(num)) {
          return { error: `Invalid entry at row ${i + 1}, column ${j + 1}.` };
        }
        row.push(num);
      }
      A.push(row);
    }
    const b = bVec.slice(0, size).map(Number);
    if (b.some((v) => !Number.isFinite(v))) {
      return { error: "Enter valid numbers for every entry of b." };
    }
    return { A, b };
  }, [matrix, bVec, size]);

  const result = useMemo((): LinearSolveResult | { error: string } => {
    if ("error" in parsed) return { error: parsed.error ?? "Invalid input." };
    try {
      return solveLinearSystem(parsed.A, parsed.b);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unable to solve.",
      };
    }
  }, [parsed]);

  const inverse = useMemo(() => {
    if (!showInverse || "error" in parsed) return null;
    return invertMatrix(parsed.A);
  }, [showInverse, parsed]);

  const reset = () => applyPreset("3x3");

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-4 w-4 text-[var(--accent)]" />
          <div>
            <p className="text-sm font-medium">Ax = b solver</p>
            <p className="text-xs text-[var(--muted)]">
              Gaussian elimination with partial pivoting · RREF · up to 6×6
            </p>
          </div>
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
        {SIZES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => resize(n)}
            className={`border px-2.5 py-1.5 text-xs ${
              size === n
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            {n}×{n}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {LINEAR_PRESETS.map((p) => (
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

      <div className="mt-5 overflow-x-auto">
        <table className="text-sm">
          <thead>
            <tr className="text-xs text-[var(--muted)]">
              {Array.from({ length: size }, (_, j) => (
                <th key={j} className="px-1 pb-1 font-medium">
                  a<sub>{j + 1}</sub>
                </th>
              ))}
              <th className="px-2" />
              <th className="px-1 pb-1 font-medium">b</th>
            </tr>
          </thead>
          <tbody>
            {matrix.slice(0, size).map((row, i) => (
              <tr key={i}>
                {row.slice(0, size).map((cell, j) => (
                  <td key={j} className="p-0.5">
                    <input
                      value={cell}
                      onChange={(e) => {
                        const next = matrix.map((r) => [...r]);
                        next[i][j] = e.target.value;
                        setMatrix(next);
                      }}
                      className="w-16 border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1.5 text-center font-mono text-sm outline-none focus:ring-1 focus:ring-[var(--accent)] sm:w-20"
                    />
                  </td>
                ))}
                <td className="px-2 text-[var(--muted)]">=</td>
                <td className="p-0.5">
                  <input
                    value={bVec[i] ?? "0"}
                    onChange={(e) => {
                      const next = [...bVec];
                      next[i] = e.target.value;
                      setBVec(next);
                    }}
                    className="w-16 border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1.5 text-center font-mono text-sm outline-none focus:ring-1 focus:ring-[var(--accent)] sm:w-20"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showInverse}
          onChange={(e) => setShowInverse(e.target.checked)}
        />
        Show A⁻¹ when the system has a unique solution
      </label>

      <ResultsPanel result={result} inverse={showInverse ? inverse : undefined} />
    </div>
  );
}

function ResultsPanel({
  result,
  inverse,
}: {
  result: LinearSolveResult | { error: string };
  inverse?: number[][] | null;
}) {
  if ("error" in result) {
    return (
      <div className="mt-5 border border-dashed border-rose-300/60 bg-rose-50/50 p-4 text-sm dark:border-rose-500/30 dark:bg-rose-950/20">
        <p className="font-medium text-rose-700 dark:text-rose-300">Input error</p>
        <p className="mt-1 text-[var(--muted)]">{result.error}</p>
      </div>
    );
  }

  const kindLabels = {
    unique: "Unique solution",
    infinite: "Infinitely many solutions",
    none: "No solution",
  } as const;

  return (
    <div className="mt-5 space-y-4">
      <div className="border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Result
        </p>
        <p className="mt-1 text-lg font-semibold">{kindLabels[result.kind]}</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          size {result.n}×{result.n} · rank {result.rank}
          {result.determinant !== null
            ? ` · det(A) ≈ ${formatNum(result.determinant)}`
            : ""}
        </p>
        {result.numericalWarning ? (
          <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
            {result.numericalWarning}
          </p>
        ) : null}

        {result.kind === "unique" && result.solution ? (
          <div className="mt-3 grid gap-1 font-mono text-sm sm:grid-cols-2">
            {result.solution.map((val, i) => (
              <p key={i}>
                x<sub>{i + 1}</sub> = {formatNum(val)}
              </p>
            ))}
          </div>
        ) : null}

        {result.kind === "infinite" && result.parametric ? (
          <div className="mt-3 space-y-1 font-mono text-sm">
            {result.parametric.expressions.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className="pt-2 text-xs text-[var(--muted)]">
              Particular solution (free vars = 0):{" "}
              {result.parametric.particular.map(formatNum).join(", ")}
            </p>
          </div>
        ) : null}

        {result.residual && result.kind === "unique" ? (
          <p className="mt-3 text-xs text-[var(--muted)]">
            Residual ‖Ax − b‖∞ ≈{" "}
            {formatNum(Math.max(...result.residual.map(Math.abs)))}
          </p>
        ) : null}
      </div>

      {inverse !== undefined ? (
        <div className="border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
          <p className="font-medium">Matrix inverse A⁻¹</p>
          {inverse === null ? (
            <p className="mt-2 text-[var(--muted)]">
              Singular (or not uniquely invertible) — no inverse.
            </p>
          ) : (
            <pre className="mt-2 overflow-x-auto font-mono text-xs text-[var(--muted)]">
              {inverse
                .map((row) => row.map((v) => formatNum(v).padStart(10)).join(" "))
                .join("\n")}
            </pre>
          )}
        </div>
      ) : null}

      <div className="border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <p className="text-sm font-medium">Elimination steps</p>
        <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap font-mono text-xs text-[var(--muted)]">
          {result.steps.join("\n")}
        </pre>
      </div>
    </div>
  );
}
