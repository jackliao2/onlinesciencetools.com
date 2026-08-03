export type SolutionKind = "unique" | "infinite" | "none";

export interface ParametricSolution {
  /** Particular solution x0 */
  particular: number[];
  /** Free variable indices (0-based) */
  freeIndices: number[];
  /** Null-space basis vectors; solution = particular + Σ t_i * nullspace[i] */
  nullspace: number[][];
  /** Human-readable lines like x1 = 1 − 2 t1 */
  expressions: string[];
}

export interface LinearSolveResult {
  kind: SolutionKind;
  n: number;
  rank: number;
  determinant: number | null;
  /** Present when the pivot spread indicates an ill-conditioned system. */
  numericalWarning?: string;
  solution?: number[];
  parametric?: ParametricSolution;
  residual?: number[];
  steps: string[];
  rref: number[][];
}

const EPS = Number.EPSILON * 64;
const ILL_CONDITIONED_RATIO = 1e-10;

export function formatNum(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < EPS) return "0";
  if (Math.abs(n - Math.round(n)) < 1e-8) return String(Math.round(n));
  const abs = Math.abs(n);
  if (abs >= 1e6 || abs < 1e-4) return n.toExponential(4);
  return Number(n.toPrecision(6)).toString();
}

function cloneMatrix(m: number[][]): number[][] {
  return m.map((row) => [...row]);
}

function formatAug(aug: number[][]): string {
  return aug
    .map((row) => {
      const coeffs = row
        .slice(0, -1)
        .map((v) => formatNum(Math.abs(v) < EPS ? 0 : v))
        .join("  ");
      const b = formatNum(Math.abs(row[row.length - 1]) < EPS ? 0 : row[row.length - 1]);
      return `[ ${coeffs} | ${b} ]`;
    })
    .join("\n");
}

function varName(i: number): string {
  return `x${i + 1}`;
}

/** Determinant via Gaussian elimination with partial pivoting. */
export function determinant(A: number[][]): number {
  const n = A.length;
  if (n === 0 || A.some((row) => row.length !== n)) {
    throw new Error("Determinant requires a square matrix.");
  }
  const M = cloneMatrix(A);
  let det = 1;
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivot][col])) pivot = row;
    }
    if (M[pivot][col] === 0) return 0;
    if (pivot !== col) {
      [M[col], M[pivot]] = [M[pivot], M[col]];
      det *= -1;
    }
    det *= M[col][col];
    const piv = M[col][col];
    for (let row = col + 1; row < n; row += 1) {
      const factor = M[row][col] / piv;
      for (let c = col; c < n; c += 1) {
        M[row][c] -= factor * M[col][c];
      }
    }
  }
  return det;
}

/**
 * Solve Ax = b with Gaussian elimination (partial pivoting), RREF,
 * free-variable parametric form when underdetermined.
 */
export function solveLinearSystem(A: number[][], b: number[]): LinearSolveResult {
  const n = A.length;
  if (n === 0) throw new Error("Matrix cannot be empty.");
  if (A.some((row) => row.length !== n) || b.length !== n) {
    throw new Error("A must be square n×n and b length n.");
  }

  const steps: string[] = [];
  const aug = A.map((row, i) => [...row, b[i]]);
  const columnScales = Array.from({ length: n }, (_, col) =>
    Math.max(...A.map((row) => Math.abs(row[col]))),
  );
  const rhsScale = Math.max(...b.map(Math.abs));
  steps.push(`Augmented matrix (${n}×${n + 1}):`);
  steps.push(formatAug(aug));

  const pivotColOfRow: number[] = Array(n).fill(-1);
  const pivotMagnitudes: number[] = [];
  let rank = 0;

  for (let col = 0; col < n && rank < n; col += 1) {
    let pivotRow = rank;
    for (let row = rank + 1; row < n; row += 1) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[pivotRow][col])) {
        pivotRow = row;
      }
    }

    // Scale the zero test by the original column. This avoids turning a
    // perfectly valid, small-scale column into a free variable.
    if (Math.abs(aug[pivotRow][col]) <= EPS * columnScales[col]) {
      steps.push(`Column ${col + 1}: no pivot (free variable candidate).`);
      continue;
    }

    if (pivotRow !== rank) {
      [aug[rank], aug[pivotRow]] = [aug[pivotRow], aug[rank]];
      steps.push(`Swap R${rank + 1} ↔ R${pivotRow + 1} (partial pivoting)`);
    }

    const piv = aug[rank][col];
    pivotMagnitudes.push(Math.abs(piv));
    for (let c = col; c <= n; c += 1) {
      aug[rank][c] /= piv;
    }
    steps.push(`R${rank + 1} ← R${rank + 1} / ${formatNum(piv)}`);

    for (let row = 0; row < n; row += 1) {
      if (row === rank) continue;
      const factor = aug[row][col];
      if (Math.abs(factor) < EPS) continue;
      for (let c = col; c <= n; c += 1) {
        aug[row][c] -= factor * aug[rank][c];
      }
      steps.push(
        `R${row + 1} ← R${row + 1} − (${formatNum(factor)})·R${rank + 1}`,
      );
    }

    pivotColOfRow[rank] = col;
    rank += 1;
  }

  // Clean round-off noise relative to each original column, without erasing
  // a valid small-scale variable or right-hand side.
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c <= n; c += 1) {
      const scale = c < n ? columnScales[c] : rhsScale;
      if (Math.abs(aug[r][c]) <= EPS * scale) aug[r][c] = 0;
    }
  }

  steps.push("Reduced row-echelon form (RREF):");
  steps.push(formatAug(aug));

  // Contradiction: [0 ... 0 | nonzero]
  for (let r = 0; r < n; r += 1) {
    const allZero = aug[r].slice(0, n).every((v) => Math.abs(v) < EPS);
    if (allZero && Math.abs(aug[r][n]) > 1e-8) {
      return {
        kind: "none",
        n,
        rank,
        determinant: n === rank ? 0 : determinant(A),
        steps: [...steps, "Contradiction: 0 = nonzero → no solution."],
        rref: aug,
      };
    }
  }

  const pivotCols = new Set(pivotColOfRow.filter((c) => c >= 0));
  const freeIndices = Array.from({ length: n }, (_, i) => i).filter(
    (c) => !pivotCols.has(c),
  );

  const det = freeIndices.length === 0 ? determinant(A) : 0;
  const pivotRatio =
    pivotMagnitudes.length === 0
      ? 1
      : Math.min(...pivotMagnitudes) / Math.max(...pivotMagnitudes);
  const numericalWarning =
    pivotRatio < ILL_CONDITIONED_RATIO
      ? "This system is ill-conditioned; small input or rounding changes can substantially affect the displayed solution."
      : undefined;

  if (freeIndices.length > 0) {
    // Particular solution: set free vars = 0
    const particular = Array(n).fill(0);
    for (let r = 0; r < rank; r += 1) {
      const pc = pivotColOfRow[r];
      if (pc < 0) continue;
      particular[pc] = aug[r][n];
    }

    const nullspace: number[][] = freeIndices.map((freeIdx) => {
      const v = Array(n).fill(0);
      v[freeIdx] = 1;
      for (let r = 0; r < rank; r += 1) {
        const pc = pivotColOfRow[r];
        if (pc < 0) continue;
        v[pc] = -aug[r][freeIdx];
      }
      return v;
    });

    const expressions = Array.from({ length: n }, (_, i) => {
      if (freeIndices.includes(i)) {
        const t = freeIndices.indexOf(i) + 1;
        return `${varName(i)} = t${t}  (free)`;
      }
      const row = pivotColOfRow.indexOf(i);
      if (row < 0) return `${varName(i)} = 0`;
      let expr = formatNum(aug[row][n]);
      freeIndices.forEach((freeIdx, ti) => {
        const a = -aug[row][freeIdx];
        if (Math.abs(a) < EPS) return;
        const abs = Math.abs(a);
        const coeff = Math.abs(abs - 1) < EPS ? "" : `${formatNum(abs)} `;
        expr += a < 0 ? ` − ${coeff}t${ti + 1}` : ` + ${coeff}t${ti + 1}`;
      });
      if (expr.startsWith("0 + ")) expr = expr.slice(4);
      if (expr.startsWith("0 − ")) expr = `−${expr.slice(4)}`;
      return `${varName(i)} = ${expr}`;
    });

    steps.push(
      `Rank ${rank} < ${n} → ${freeIndices.length} free variable(s): ${freeIndices
        .map((i) => varName(i))
        .join(", ")}.`,
    );

    return {
      kind: "infinite",
      n,
      rank,
      determinant: det,
      numericalWarning,
      parametric: {
        particular,
        freeIndices,
        nullspace,
        expressions,
      },
      steps: [...steps, "General solution parameterized by free variables."],
      rref: aug,
    };
  }

  // Unique solution
  const solution = Array(n).fill(0);
  for (let r = 0; r < rank; r += 1) {
    const pc = pivotColOfRow[r];
    solution[pc] = aug[r][n];
  }

  const residual = A.map(
    (row, i) => row.reduce((s, aij, j) => s + aij * solution[j], 0) - b[i],
  );

  steps.push("Back-substitution from RREF complete (unique solution).");
  steps.push(`det(A) ≈ ${formatNum(det)}`);

  return {
    kind: "unique",
    n,
    rank,
    determinant: det,
    numericalWarning,
    solution,
    residual,
    steps,
    rref: aug,
  };
}

export function identityMatrix(n: number): number[][] {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );
}

/** Inverse via solving A X = I column-by-column. Null if singular. */
export function invertMatrix(A: number[][]): number[][] | null {
  const n = A.length;
  const inv: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let j = 0; j < n; j += 1) {
    const e = Array(n).fill(0);
    e[j] = 1;
    const res = solveLinearSystem(A, e);
    if (res.kind !== "unique" || !res.solution) return null;
    for (let i = 0; i < n; i += 1) inv[i][j] = res.solution[i];
  }
  return inv;
}

export const LINEAR_PRESETS: Array<{
  id: string;
  name: string;
  A: number[][];
  b: number[];
}> = [
  {
    id: "2x2",
    name: "2×2 unique",
    A: [
      [2, 1],
      [1, 3],
    ],
    b: [5, 6],
  },
  {
    id: "3x3",
    name: "3×3 unique",
    A: [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2],
    ],
    b: [8, -11, -3],
  },
  {
    id: "4x4",
    name: "4×4 unique",
    A: [
      [1, 2, 0, 1],
      [0, 1, 1, 0],
      [2, 0, 1, 1],
      [1, 1, 1, 1],
    ],
    b: [4, 2, 5, 4],
  },
  {
    id: "infinite",
    name: "Infinite (free var)",
    A: [
      [1, 2, 3],
      [2, 4, 6],
      [1, 1, 1],
    ],
    b: [6, 12, 3],
  },
  {
    id: "none",
    name: "No solution",
    A: [
      [1, 1],
      [2, 2],
    ],
    b: [1, 3],
  },
];
