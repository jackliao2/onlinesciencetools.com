"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BALANCE_PRACTICE_PROBLEMS,
  PRACTICE_LEVELS,
  gradeAttempt,
  liveCoefficients,
  pickNextProblem,
  problemsForLevel,
  thirdHint,
  type PracticeLevel,
} from "@/lib/chemistry/balance-practice";
import {
  atomCheckForCoefficients,
  balanceEquation,
  parseEquationSides,
} from "@/lib/chemistry/balance-equation";
import { FormulaDisplay } from "@/components/tools/balance/FormulaDisplay";
import {
  Check,
  ChevronRight,
  Eye,
  Lightbulb,
  RotateCcw,
  Shuffle,
} from "lucide-react";

const STORAGE_KEY = "ost-balance-practice-v1";

type Stats = {
  solved: string[];
  streak: number;
  bestStreak: number;
  attempts: number;
};

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { solved: [], streak: 0, bestStreak: 0, attempts: 0 };
    }
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return {
      solved: Array.isArray(parsed.solved) ? parsed.solved : [],
      streak: Number(parsed.streak) || 0,
      bestStreak: Number(parsed.bestStreak) || 0,
      attempts: Number(parsed.attempts) || 0,
    };
  } catch {
    return { solved: [], streak: 0, bestStreak: 0, attempts: 0 };
  }
}

function emptyInputs(count: number): string[] {
  return Array.from({ length: count }, () => "");
}

export function BalancePractice() {
  const [level, setLevel] = useState<PracticeLevel | "all">("all");
  const [quiz, setQuiz] = useState(false);
  const [problemId, setProblemId] = useState(BALANCE_PRACTICE_PROBLEMS[0].id);
  const [inputs, setInputs] = useState<string[]>(() =>
    emptyInputs(
      parseEquationSides(BALANCE_PRACTICE_PROBLEMS[0].equation).left.length +
        parseEquationSides(BALANCE_PRACTICE_PROBLEMS[0].equation).right.length,
    ),
  );
  const [hintLevel, setHintLevel] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [stats, setStats] = useState<Stats>({
    solved: [],
    streak: 0,
    bestStreak: 0,
    attempts: 0,
  });
  const [failedThis, setFailedThis] = useState(false);

  const pool = useMemo(() => problemsForLevel(level), [level]);
  const problem =
    pool.find((p) => p.id === problemId) ?? pool[0] ?? BALANCE_PRACTICE_PROBLEMS[0];

  const sides = useMemo(
    () => parseEquationSides(problem.equation),
    [problem.equation],
  );
  const species = useMemo(
    () => [...sides.left, ...sides.right],
    [sides.left, sides.right],
  );
  const solvedResult = useMemo(
    () => balanceEquation(problem.equation),
    [problem.equation],
  );

  const liveAtoms = useMemo(() => {
    const coeffs = liveCoefficients(
      inputs.length === species.length ? inputs : emptyInputs(species.length),
    );
    try {
      return atomCheckForCoefficients(sides.left, sides.right, coeffs);
    } catch {
      return [];
    }
  }, [inputs, sides.left, sides.right, species.length]);

  const grade = useMemo(() => {
    if (!checked) return null;
    return gradeAttempt(problem.equation, inputs);
  }, [checked, problem.equation, inputs]);

  const showTable = !quiz || checked;
  const solvedSet = useMemo(() => new Set(stats.solved), [stats.solved]);
  const poolSolved = pool.filter((p) => solvedSet.has(p.id)).length;

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    const count = species.length;
    setInputs(emptyInputs(count));
    setHintLevel(0);
    setRevealed(false);
    setChecked(false);
    setFailedThis(false);
  }, [problem.id, species.length]);

  const persist = (next: Stats) => {
    setStats(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota / private-mode failures.
    }
  };

  const goNext = (preferUnsolved = true) => {
    const next = pickNextProblem(
      pool,
      problem.id,
      preferUnsolved ? solvedSet : new Set(),
    );
    setProblemId(next.id);
  };

  const onCheck = () => {
    const result = gradeAttempt(problem.equation, inputs);
    setChecked(true);

    if (result.status === "incomplete" || result.status === "invalid") {
      return;
    }

    const already = solvedSet.has(problem.id);
    const attempts = stats.attempts + 1;

    if (result.status === "unbalanced") {
      setFailedThis(true);
      persist({ ...stats, attempts, streak: 0 });
      return;
    }

    if (result.status === "reducible") {
      if (!failedThis && !revealed && !already) {
        persist({
          ...stats,
          attempts,
          streak: stats.streak + 1,
          bestStreak: Math.max(stats.bestStreak, stats.streak + 1),
        });
      } else {
        persist({ ...stats, attempts });
      }
      return;
    }

    const solved = already ? stats.solved : [...stats.solved, problem.id];
    const bumpStreak = !failedThis && !revealed;
    const streak = bumpStreak ? stats.streak + 1 : stats.streak;
    persist({
      solved,
      attempts,
      streak,
      bestStreak: Math.max(stats.bestStreak, streak),
    });
  };

  const applySmallest = () => {
    const coeffs = [...solvedResult.reactants, ...solvedResult.products].map(
      (s) => String(s.coefficient),
    );
    setInputs(coeffs);
    setChecked(true);
  };

  const onReveal = () => {
    setRevealed(true);
    setFailedThis(true);
    applySmallest();
    persist({ ...stats, streak: 0 });
  };

  const reduceByFactor = () => {
    if (!grade?.factor) return;
    const nextInputs = inputs.map((value) =>
      String(Number(value) / (grade.factor ?? 1)),
    );
    setInputs(nextInputs);
    setChecked(true);
    const result = gradeAttempt(problem.equation, nextInputs);
    if (result.status === "correct" && !solvedSet.has(problem.id)) {
      persist({
        ...stats,
        solved: [...stats.solved, problem.id],
      });
    }
  };

  return (
    <div id="practice" className="scroll-mt-24">
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-[var(--muted)]">Set</span>
        {PRACTICE_LEVELS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setLevel(item.id);
              const nextPool = problemsForLevel(item.id);
              if (!nextPool.some((p) => p.id === problemId) && nextPool[0]) {
                setProblemId(nextPool[0].id);
              }
            }}
            className={`border px-2.5 py-1.5 text-xs ${
              level === item.id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {item.label}
          </button>
        ))}
        <label className="ml-auto inline-flex items-center gap-2 text-xs text-[var(--muted)]">
          <input
            type="checkbox"
            checked={quiz}
            onChange={(e) => {
              setQuiz(e.target.checked);
              setChecked(false);
            }}
          />
          Quiz (hide inventory until check)
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
        <span>
          Solved {poolSolved}/{pool.length} in this set
        </span>
        <span>Streak {stats.streak}</span>
        <span>Best {stats.bestStreak}</span>
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              {problem.level} · {problem.title}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Fill coefficients only. Formulas (subscripts) stay locked.
            </p>
          </div>
          <button
            type="button"
            onClick={() => goNext(false)}
            className="inline-flex items-center gap-1.5 border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface)]"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Skip
          </button>
        </div>

        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            onCheck();
          }}
        >
          <div className="flex flex-wrap items-center gap-x-1 gap-y-3 font-mono text-lg sm:text-xl">
            {sides.left.map((formula, i) => (
              <SpeciesInput
                key={`r-${formula}-${i}`}
                formula={formula}
                value={inputs[i] ?? ""}
                onChange={(value) => {
                  const next = [...inputs];
                  next[i] = value;
                  setInputs(next);
                  setChecked(false);
                }}
                showPlus={i < sides.left.length - 1}
              />
            ))}
            <span className="px-2 text-[var(--muted)]" aria-hidden>
              →
            </span>
            {sides.right.map((formula, i) => {
              const idx = sides.left.length + i;
              return (
                <SpeciesInput
                  key={`p-${formula}-${i}`}
                  formula={formula}
                  value={inputs[idx] ?? ""}
                  onChange={(value) => {
                    const next = [...inputs];
                    next[idx] = value;
                    setInputs(next);
                    setChecked(false);
                  }}
                  showPlus={i < sides.right.length - 1}
                />
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              <Check className="h-3.5 w-3.5" />
              Check
            </button>
            <button
              type="button"
              onClick={() => setHintLevel((n) => Math.min(3, n + 1))}
              disabled={hintLevel >= 3}
              className="inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--surface)] disabled:opacity-40"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Hint {hintLevel < 3 ? hintLevel + 1 : 3}/3
            </button>
            <button
              type="button"
              onClick={onReveal}
              className="inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--surface)]"
            >
              <Eye className="h-3.5 w-3.5" />
              Reveal
            </button>
            <button
              type="button"
              onClick={() => {
                setInputs(emptyInputs(species.length));
                setHintLevel(0);
                setRevealed(false);
                setChecked(false);
                setFailedThis(false);
              }}
              className="inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--surface)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
            {(grade?.status === "correct" || revealed) && (
              <button
                type="button"
                onClick={() => goNext(true)}
                className="inline-flex items-center gap-1.5 border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm text-[var(--foreground)]"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        {hintLevel >= 1 && (
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            <span className="font-medium text-[var(--foreground)]">Hint 1.</span>{" "}
            {problem.hint}
          </p>
        )}
        {hintLevel >= 2 && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            <span className="font-medium text-[var(--foreground)]">Hint 2.</span>{" "}
            {problem.strategy}
          </p>
        )}
        {hintLevel >= 3 && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            <span className="font-medium text-[var(--foreground)]">Hint 3.</span>{" "}
            {thirdHint(problem.equation)}
          </p>
        )}

        {grade && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              grade.status === "correct"
                ? "border-emerald-300/60 bg-emerald-50/80 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-100"
                : grade.status === "reducible"
                  ? "border-amber-300/60 bg-amber-50/80 text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100"
                  : "border-rose-300/50 bg-rose-50/70 text-rose-800 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-100"
            }`}
          >
            <p>{grade.message}</p>
            {grade.coach.map((line) => (
              <p key={line} className="mt-1.5 opacity-90">
                {line}
              </p>
            ))}
            {grade.status === "reducible" && (
              <button
                type="button"
                onClick={reduceByFactor}
                className="mt-2 border border-current/30 px-2 py-1 text-xs"
              >
                Divide to smallest integers
              </button>
            )}
          </div>
        )}

        {revealed && (
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Inspection notes
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--muted)]">
              {solvedResult.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 font-mono text-sm font-medium">
              {solvedResult.equation}
            </p>
          </div>
        )}
      </div>

      {showTable && liveAtoms.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead className="bg-[var(--surface-2)] text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2 font-semibold">Element</th>
                <th className="px-3 py-2 font-semibold">Reactants</th>
                <th className="px-3 py-2 font-semibold">Products</th>
                <th className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {liveAtoms.map((row) => {
                const ok = row.reactantAtoms === row.productAtoms;
                return (
                  <tr
                    key={row.element}
                    className="border-t border-[var(--border)]"
                  >
                    <td className="px-3 py-2 font-mono font-medium">
                      {row.element}
                    </td>
                    <td className="px-3 py-2 font-mono">{row.reactantAtoms}</td>
                    <td className="px-3 py-2 font-mono">{row.productAtoms}</td>
                    <td
                      className={`px-3 py-2 text-xs font-medium ${
                        ok
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-rose-700 dark:text-rose-300"
                      }`}
                    >
                      {ok ? "Match" : "Off"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
            Live inventory treats a blank box as 1 (the usual inspection start).
            Check still requires every box filled.
          </p>
        </div>
      )}
    </div>
  );
}

function SpeciesInput({
  formula,
  value,
  onChange,
  showPlus,
}: {
  formula: string;
  value: string;
  onChange: (value: string) => void;
  showPlus: boolean;
}) {
  return (
    <>
      <label className="inline-flex items-center gap-1">
        <span className="sr-only">Coefficient for {formula}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          placeholder="1"
          className="w-12 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-1 py-1.5 text-center font-mono text-base outline-none focus:ring-2 focus:ring-[var(--accent)] sm:w-14 sm:text-lg"
        />
        <FormulaDisplay formula={formula} className="font-medium" />
      </label>
      {showPlus ? (
        <span className="px-1 text-[var(--muted)]" aria-hidden>
          +
        </span>
      ) : null}
    </>
  );
}
