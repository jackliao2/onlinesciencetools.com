"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { compileExpression } from "@/lib/math/expression";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

type Mode = "yxt" | "parametric";

const PRESETS: Array<{
  id: string;
  name: string;
  mode: Mode;
  y?: string;
  x?: string;
  py?: string;
}> = [
  {
    id: "wave",
    name: "Traveling wave",
    mode: "yxt",
    y: "sin(x - 2*t)",
  },
  {
    id: "pulse",
    name: "Gaussian pulse",
    mode: "yxt",
    y: "exp(-(x - t)^2)",
  },
  {
    id: "circle",
    name: "Circular motion",
    mode: "parametric",
    x: "cos(t)",
    py: "sin(t)",
  },
  {
    id: "lissajous",
    name: "Lissajous",
    mode: "parametric",
    x: "sin(3*t)",
    py: "sin(2*t)",
  },
  {
    id: "projectile",
    name: "Projectile",
    mode: "parametric",
    x: "4*t",
    py: "8*t - 4.9*t*t",
  },
];

export function TimeGraphingTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("yxt");
  const [yExpr, setYExpr] = useState("sin(x - 2*t)");
  const [xExpr, setXExpr] = useState("cos(t)");
  const [pyExpr, setPyExpr] = useState("sin(t)");
  const [t, setT] = useState(0);
  const [tMin, setTMin] = useState(0);
  const [tMax, setTMax] = useState(12);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [xMin, setXMin] = useState(-8);
  const [xMax, setXMax] = useState(8);
  const [yMin, setYMin] = useState(-3);
  const [yMax, setYMax] = useState(3);
  const trailRef = useRef<Array<{ x: number; y: number }>>([]);

  const compiled = useMemo(() => {
    try {
      if (mode === "yxt") {
        return {
          ok: true as const,
          y: compileExpression(yExpr, ["x", "t"]),
        };
      }
      return {
        ok: true as const,
        x: compileExpression(xExpr, ["t"]),
        y: compileExpression(pyExpr, ["t"]),
      };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Invalid expression",
      };
    }
  }, [mode, yExpr, xExpr, pyExpr]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = ((now - last) / 1000) * speed;
      last = now;
      setT((prev) => {
        const next = prev + dt;
        return next > tMax ? tMin : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, tMin, tMax]);

  useEffect(() => {
    trailRef.current = [];
  }, [mode, xExpr, pyExpr, yExpr]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !compiled.ok) return;
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
      const gx = (i / 10) * width;
      const gy = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
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

    if (mode === "yxt" && "y" in compiled && compiled.y) {
      const fn = compiled.y;
      ctx.strokeStyle = "#0d9488";
      ctx.lineWidth = 2.25;
      ctx.beginPath();
      let started = false;
      const samples = 700;
      for (let i = 0; i <= samples; i += 1) {
        const x = xMin + ((xMax - xMin) * i) / samples;
        let y: number;
        try {
          y = fn(x, t);
        } catch {
          started = false;
          continue;
        }
        if (!Number.isFinite(y)) {
          started = false;
          continue;
        }
        const { cx, cy } = toCanvas(x, y);
        if (!started) {
          ctx.moveTo(cx, cy);
          started = true;
        } else {
          ctx.lineTo(cx, cy);
        }
      }
      ctx.stroke();
    } else if (mode === "parametric" && "x" in compiled && compiled.x && compiled.y) {
      // Full path over [tMin, tMax]
      ctx.strokeStyle = isDark ? "rgba(45,212,191,0.35)" : "rgba(13,148,136,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let started = false;
      const samples = 900;
      for (let i = 0; i <= samples; i += 1) {
        const tt = tMin + ((tMax - tMin) * i) / samples;
        let x: number;
        let y: number;
        try {
          x = compiled.x(tt);
          y = compiled.y(tt);
        } catch {
          started = false;
          continue;
        }
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          started = false;
          continue;
        }
        const { cx, cy } = toCanvas(x, y);
        if (!started) {
          ctx.moveTo(cx, cy);
          started = true;
        } else {
          ctx.lineTo(cx, cy);
        }
      }
      ctx.stroke();

      // Current point + short trail
      try {
        const px = compiled.x(t);
        const py = compiled.y(t);
        if (Number.isFinite(px) && Number.isFinite(py)) {
          trailRef.current.push({ x: px, y: py });
          if (trailRef.current.length > 80) trailRef.current.shift();

          ctx.strokeStyle = "#0d9488";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          trailRef.current.forEach((p, i) => {
            const { cx, cy } = toCanvas(p.x, p.y);
            if (i === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          });
          ctx.stroke();

          const { cx, cy } = toCanvas(px, py);
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      } catch {
        // ignore
      }
    }

    ctx.fillStyle = isDark ? "rgba(226,232,240,0.75)" : "rgba(51,65,85,0.8)";
    ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillText(`t = ${t.toFixed(2)}`, 12, 20);
  }, [compiled, mode, t, tMin, tMax, xMin, xMax, yMin, yMax]);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  const applyPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setMode(preset.mode);
    if (preset.mode === "yxt" && preset.y) {
      setYExpr(preset.y);
      setXMin(-8);
      setXMax(8);
      setYMin(-3);
      setYMax(3);
    } else {
      setXExpr(preset.x ?? "cos(t)");
      setPyExpr(preset.py ?? "sin(t)");
      if (preset.id === "projectile") {
        setXMin(-1);
        setXMax(10);
        setYMin(-1);
        setYMax(5);
        setTMin(0);
        setTMax(2.2);
      } else {
        setXMin(-2);
        setXMax(2);
        setYMin(-2);
        setYMax(2);
        setTMin(0);
        setTMax(12);
      }
    }
    setT(0);
    trailRef.current = [];
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Timer className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Time graphing
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-white"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setT(tMin);
              trailRef.current = [];
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Rewind
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
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
      <p className="mt-3 text-xs text-[var(--muted)]">
        The Projectile preset uses x(t) = 4t and y(t) = 8t − 4.9t² in metres,
        with t in seconds and g = 9.8 m/s².
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div className="flex gap-2">
            {(
              [
                ["yxt", "y = f(x, t)"],
                ["parametric", "x(t), y(t)"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key);
                  trailRef.current = [];
                }}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  mode === key
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-2)] text-[var(--muted)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "yxt" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium">y = f(x, t)</span>
              <input
                value={yExpr}
                onChange={(e) => setYExpr(e.target.value)}
                spellCheck={false}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </label>
          ) : (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">x(t)</span>
                <input
                  value={xExpr}
                  onChange={(e) => setXExpr(e.target.value)}
                  spellCheck={false}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">y(t)</span>
                <input
                  value={pyExpr}
                  onChange={(e) => setPyExpr(e.target.value)}
                  spellCheck={false}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
            </>
          )}

          <label className="block">
            <span className="mb-2 flex justify-between text-sm font-medium">
              Time t
              <span className="font-mono text-[var(--muted)]">{t.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={tMin}
              max={tMax}
              step={0.01}
              value={t}
              onChange={(e) => setT(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex justify-between text-sm font-medium">
              Speed
              <span className="font-mono text-[var(--muted)]">{speed.toFixed(1)}×</span>
            </span>
            <input
              type="range"
              min={0.2}
              max={3}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["tMin", tMin, setTMin],
                ["tMax", tMax, setTMax],
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
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
            ))}
          </div>

          {!compiled.ok && (
            <div className="rounded-xl border border-rose-300/50 bg-rose-50/70 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200">
              {compiled.error}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <canvas ref={canvasRef} className="h-[400px] w-full sm:h-[480px]" />
        </div>
      </div>
    </div>
  );
}
