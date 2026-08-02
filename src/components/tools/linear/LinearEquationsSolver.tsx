"use client";

import { useMemo, useState } from "react";
import { Grid3x3, RotateCcw } from "lucide-react";

type SystemSize = 2 | 3;
type SolutionKind = "unique" | "infinite" | "none";

interface SolveResult {
  kind: SolutionKind;
  solution?: number[];
  steps: string[];
}

function gaussianElimination(
  A: number[][],
  b: number[],
): SolveResult {
  const n = A.length;
  const aug = A.map((row, i) => [...row, b[i]]);
  const steps: string[] = [];

  steps.push(`Augmented matrix (${n}×${n + 1}):`);
  steps.push(formatAug(aug));

  let rank = 0;
  for (let col = 0; col < n; col += 1) {
    let pivotRow = -1;
    for (let row = rank; row < n; row += 1) {
      if (Math.abs(aug[row][col]) > 1e-10) {
        pivotRow = row;
        break;
      }
    }

    if (pivotRow === -1) continue;

    if (pivotRow !== rank) {
      [aug[rank], aug[pivotRow]] = [aug[pivotRow], aug[rank]];
      steps.push(`Swap R${rank + 1} ↔ R${pivotRow + 1}`);
    }

    const pivot = aug[rank][col];
    for (let row = rank + 1; row < n; row += 1) {
      const factor = aug[row][col] / pivot;
      if (Math.abs(factor) < 1e-12) continue;
      for (let c = col; c <= n; c += 1) {
        aug[row][c] -= factor * aug[rank][c];
      }
      steps.push(`R${row + 1} ← R${row + 1} − (${formatNum(factor)})·R${rank + 1}`);
    }
    rank += 1;
  }

  steps.push("Row-echelon form:");
  steps.push(formatAug(aug));

  const hasContradiction = aug.some(
    (row) => row.slice(0, n).every((v) => Math.abs(v) < 1e-10) && Math.abs(row[n]) > 1e-8,
  );
  if (hasContradiction) {
    return { kind: "none", steps: [...steps, "Contradiction: 0 = nonzero → no solution."] };
  }

  const freeVars: boolean[] = Array(n).fill(false);
  const pivotCols: number[] = [];
  for (let row = 0; row < n; row += 1) {
    let pivotCol = -1;
    for (let col = 0; col < n; col += 1) {
      if (Math.abs(aug[row][col]) > 1e-10) {
        pivotCol = col;
        break;
      }
    }
    if (pivotCol === -1) continue;
    pivotCols.push(pivotCol);
    for (let col = pivotCol + 1; col < n; col += 1) {
      if (Math.abs(aug[row][col]) > 1e-10) freeVars[col] = true;
    }
  }

  for (let col = 0; col < n; col += 1) {
    if (!pivotCols.includes(col)) freeVars[col] = true;
  }

  if (freeVars.some(Boolean)) {
    return {
      kind: "infinite",
      steps: [
        ...steps,
        "At least one free variable → infinitely many solutions.",
      ],
    };
  }

  const x = Array(n).fill(0);
  for (let row = n - 1; row >= 0; row -= 1) {
    let pivotCol = -1;
    for (let col = 0; col < n; col += 1) {
      if (Math.abs(aug[row][col]) > 1e-10) {
        pivotCol = col;
        break;
      }
    }
    if (pivotCol === -1) continue;
    let sum = aug[row][n];
    for (let col = pivotCol + 1; col < n; col += 1) {
      sum -= aug[row][col] * x[col];
    }
    x[pivotCol] = sum / aug[row][pivotCol];
  }

  return { kind: "unique", solution: x, steps: [...steps, "Back substitution complete."] };
}

function formatNum(n: number): string {
  if (Math.abs(n - Math.round(n)) < 1e-8) return String(Math.round(n));
  return n.toFixed(4).replace(/\.?0+$/, "");
}

function formatAug(aug: number[][]): string {
  return aug
    .map((row) =>
      `[ ${row
        .map((v) => formatNum(Math.abs(v) < 1e-10 ? 0 : v))
        .join("  ")} ]`,
    )
    .join("\n");
}

function parseMatrix(values: string[][], size: SystemSize): number[][] | { error: string } {
  const matrix: number[][] = [];
  for (let i = 0; i < size; i += 1) {
    const row: number[] = [];
    for (let j = 0; j < size; j += 1) {
      const num = Number(values[i][j]);
      if (!Number.isFinite(num)) {
        return { error: `Invalid entry at row ${i + 1}, column ${j + 1}.` };
      }
      row.push(num);
    }
    matrix.push(row);
  }
  return matrix;
}

const DEFAULT_2X2 = [
  ["2", "1"],
  ["1", "3"],
];
const DEFAULT_B2 = ["5", "6"];

const DEFAULT_3X3 = [
  ["2", "1", "-1"],
  ["-3", "-1", "2"],
  ["-2", "1", "2"],
];
const DEFAULT_B3 = ["8", "-11", "-3"];

export function LinearEquationsSolver() {
  const [size, setSize] = useState<SystemSize>(2);
  const [matrix2, setMatrix2] = useState(DEFAULT_2X2);
  const [b2, setB2] = useState(DEFAULT_B2);
  const [matrix3, setMatrix3] = useState(DEFAULT_3X3);
  const [b3, setB3] = useState(DEFAULT_B3);

  const result = useMemo(() => {
    const A =
      size === 2
        ? parseMatrix(matrix2, 2)
        : parseMatrix(matrix3, 3);
    if ("error" in A) return { error: A.error };

    const bRaw = size === 2 ? b2 : b3;
    const b = bRaw.map(Number);
    if (b.some((v) => !Number.isFinite(v))) {
      return { error: "Enter valid numbers for b." };
    }

    return gaussianElimination(A, b);
  }, [size, matrix2, b2, matrix3, b3]);

  const reset = () => {
    setMatrix2(DEFAULT_2X2);
    setB2(DEFAULT_B2);
    setMatrix3(DEFAULT_3X3);
    setB3(DEFAULT_B3);
  };

  const matrix = size === 2 ? matrix2 : matrix3;
  const bVec = size === 2 ? b2 : b3;
  const setMatrix = size === 2 ? setMatrix2 : setMatrix3;
  const setB = size === 2 ? setB2 : setB3;

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Grid3x3 className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Ax = b solver
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

      <div className="mt-6 flex gap-2">
        {([2, 3] as SystemSize[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              size === s
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {s}×{s} system
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="text-sm">
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="p-1">
                    <input
                      value={cell}
                      onChange={(e) => {
                        const next = matrix.map((r) => [...r]);
                        next[i][j] = e.target.value;
                        setMatrix(next);
                      }}
                      className="w-20 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 text-center font-mono outline-none ring-[var(--accent)] focus:ring-2"
                    />
                  </td>
                ))}
                <td className="px-2 text-[var(--muted)]">=</td>
                <td className="p-1">
                  <input
                    value={bVec[i]}
                    onChange={(e) => {
                      const next = [...bVec];
                      next[i] = e.target.value;
                      setB(next);
                    }}
                    className="w-20 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2 text-center font-mono outline-none ring-[var(--accent)] focus:ring-2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ResultsPanel result={result} />
    </div>
  );
}

function ResultsPanel({
  result,
}: {
  result: SolveResult | { error: string };
}) {
  if ("error" in result) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/60 p-6 dark:border-rose-500/30 dark:bg-rose-950/20">
        <p className="font-semibold text-rose-700 dark:text-rose-300">Input error</p>
        <p className="mt-1 text-sm text-rose-600/90 dark:text-rose-200/80">{result.error}</p>
      </div>
    );
  }

  const kindLabels: Record<SolutionKind, string> = {
    unique: "Unique solution",
    infinite: "Infinitely many solutions",
    none: "No solution",
  };

  const kindColors: Record<SolutionKind, string> = {
    unique: "text-emerald-600 dark:text-emerald-400",
    infinite: "text-amber-600 dark:text-amber-400",
    none: "text-rose-600 dark:text-rose-400",
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Solution type
        </p>
        <p className={`mt-2 text-lg font-semibold ${kindColors[result.kind]}`}>
          {kindLabels[result.kind]}
        </p>
        {result.kind === "unique" && result.solution && (
          <div className="mt-3 font-mono text-sm">
            {result.solution.map((val, i) => (
              <p key={i}>
                x<sub>{i + 1}</sub> = {formatNum(val)}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <p className="text-sm font-semibold">Gaussian elimination steps</p>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-[var(--muted)]">
          {result.steps.join("\n")}
        </pre>
      </div>
    </div>
  );
}
