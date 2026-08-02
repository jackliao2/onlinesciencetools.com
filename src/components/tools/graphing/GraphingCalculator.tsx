"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { compileExpression } from "@/lib/math/expression";
import { LineChart, Plus, RotateCcw, Trash2 } from "lucide-react";

const COLORS = ["#2563eb", "#db2777", "#059669", "#d97706", "#7c3aed", "#0891b2"];

interface ExpressionRow {
  id: string;
  expr: string;
  visible: boolean;
}

let nextExprId = 2;

const DEFAULT_EXPRS: ExpressionRow[] = [
  { id: "1", expr: "sin(x)", visible: true },
];

export function GraphingCalculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expressions, setExpressions] = useState<ExpressionRow[]>(DEFAULT_EXPRS);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-5);
  const [yMax, setYMax] = useState(5);
  const [sampleCount] = useState(800);

  const compiled = useMemo(() => {
    return expressions.map((row) => {
      if (!row.visible || !row.expr.trim()) {
        return { id: row.id, ok: false as const, error: null };
      }
      try {
        const fn = compileExpression(row.expr, ["x"]);
        return { id: row.id, ok: true as const, fn, expr: row.expr };
      } catch (err) {
        return {
          id: row.id,
          ok: false as const,
          error: err instanceof Error ? err.message : "Invalid expression",
        };
      }
    });
  }, [expressions]);

  const extrema = useMemo(() => {
    const points: Array<{
      id: string;
      expr: string;
      x: number;
      y: number;
      type: "max" | "min";
      color: string;
    }> = [];

    compiled.forEach((item, index) => {
      if (!item.ok) return;
      const samples = 500;
      const dx = (xMax - xMin) / samples;
      const ys: Array<{ x: number; y: number } | null> = [];

      for (let i = 0; i <= samples; i += 1) {
        const x = xMin + i * dx;
        try {
          const y = item.fn(x);
          ys.push(Number.isFinite(y) ? { x, y } : null);
        } catch {
          ys.push(null);
        }
      }

      for (let i = 1; i < ys.length - 1; i += 1) {
        const prev = ys[i - 1];
        const cur = ys[i];
        const next = ys[i + 1];
        if (!prev || !cur || !next) continue;
        if (cur.y > prev.y && cur.y > next.y) {
          points.push({
            id: item.id,
            expr: item.expr,
            x: cur.x,
            y: cur.y,
            type: "max",
            color: COLORS[index % COLORS.length],
          });
        } else if (cur.y < prev.y && cur.y < next.y) {
          points.push({
            id: item.id,
            expr: item.expr,
            x: cur.x,
            y: cur.y,
            type: "min",
            color: COLORS[index % COLORS.length],
          });
        }
      }
    });

    return points.slice(0, 24);
  }, [compiled, xMin, xMax]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    ctx.fillStyle = isDark ? "#0b1220" : "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    const toCanvas = (x: number, y: number) => ({
      cx: ((x - xMin) / (xMax - xMin)) * width,
      cy: height - ((y - yMin) / (yMax - yMin)) * height,
    });

    ctx.strokeStyle = isDark ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i += 1) {
      const x = (i / 10) * width;
      const y = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const origin = toCanvas(0, 0);
    ctx.strokeStyle = isDark ? "rgba(148,163,184,0.45)" : "rgba(71,85,105,0.55)";
    ctx.lineWidth = 1.25;
    if (origin.cx >= 0 && origin.cx <= width) {
      ctx.beginPath();
      ctx.moveTo(origin.cx, 0);
      ctx.lineTo(origin.cx, height);
      ctx.stroke();
    }
    if (origin.cy >= 0 && origin.cy <= height) {
      ctx.beginPath();
      ctx.moveTo(0, origin.cy);
      ctx.lineTo(width, origin.cy);
      ctx.stroke();
    }

    compiled.forEach((item, index) => {
      if (!item.ok) return;
      const color = COLORS[index % COLORS.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      let started = false;
      const dx = (xMax - xMin) / sampleCount;

      for (let i = 0; i <= sampleCount; i += 1) {
        const x = xMin + i * dx;
        let y: number;
        try {
          y = item.fn(x);
        } catch {
          started = false;
          continue;
        }
        if (!Number.isFinite(y)) {
          started = false;
          continue;
        }

        const { cx, cy } = toCanvas(x, y);
        if (cy < -50 || cy > height + 50) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(cx, cy);
          started = true;
        } else {
          ctx.lineTo(cx, cy);
        }
      }
      ctx.stroke();
    });

    // Local extrema markers
    extrema.forEach((pt) => {
      const { cx, cy } = toCanvas(pt.x, pt.y);
      if (cx < 0 || cx > width || cy < 0 || cy > height) return;
      ctx.fillStyle = pt.color;
      ctx.strokeStyle = isDark ? "#0b1220" : "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (pt.type === "max") {
        ctx.moveTo(cx, cy - 6);
        ctx.lineTo(cx + 5, cy + 4);
        ctx.lineTo(cx - 5, cy + 4);
      } else {
        ctx.moveTo(cx, cy + 6);
        ctx.lineTo(cx + 5, cy - 4);
        ctx.lineTo(cx - 5, cy - 4);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }, [compiled, extrema, xMin, xMax, yMin, yMax, sampleCount]);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", draw);
    return () => {
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", draw);
    };
  }, [draw]);

  const addExpression = () => {
    setExpressions((prev) => [
      ...prev,
      { id: String(nextExprId++), expr: "x^2", visible: true },
    ]);
  };

  const reset = () => {
    setExpressions(DEFAULT_EXPRS);
    setXMin(-10);
    setXMax(10);
    setYMin(-5);
    setYMax(5);
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <LineChart className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            2D function plotter
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addExpression}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add f(x)
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {expressions.map((row, index) => {
            const comp = compiled.find((c) => c.id === row.id);
            return (
              <div key={row.id} className="flex items-start gap-2">
                <span
                  className="mt-3 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1">
                  <input
                    value={row.expr}
                    onChange={(e) =>
                      setExpressions((prev) =>
                        prev.map((r) =>
                          r.id === row.id ? { ...r, expr: e.target.value } : r,
                        ),
                      )
                    }
                    placeholder="y = f(x)"
                    spellCheck={false}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                  />
                  {comp && !comp.ok && comp.error && (
                    <p className="mt-1 text-xs text-rose-500">{comp.error}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setExpressions((prev) =>
                      prev.length > 1 ? prev.filter((r) => r.id !== row.id) : prev,
                    )
                  }
                  className="mt-2 rounded-lg p-2 text-[var(--muted)] hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}

          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["xMin", xMin, setXMin],
                ["xMax", xMax, setXMax],
                ["yMin", yMin, setYMin],
                ["yMax", yMax, setYMax],
              ] as const
            ).map(([label, value, setter]) => (
              <label key={label} className="block">
                <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                  {label}
                </span>
                <input
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
            <canvas ref={canvasRef} className="h-[360px] w-full sm:h-[420px]" />
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Local extrema (window)
            </p>
            {extrema.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                No local max/min detected in the current x-window.
              </p>
            ) : (
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {extrema.map((pt, i) => (
                  <li
                    key={`${pt.id}-${pt.type}-${i}`}
                    className="font-mono text-xs text-[var(--foreground)]"
                  >
                    <span style={{ color: pt.color }}>
                      {pt.type === "max" ? "max" : "min"}
                    </span>{" "}
                    ≈ ({pt.x.toFixed(3)}, {pt.y.toFixed(3)})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
