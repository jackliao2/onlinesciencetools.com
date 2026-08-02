"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  PHASE_PRESETS,
  compileVectorField,
  integrateTrajectory,
  sampleVectorField,
  type Vec2,
} from "@/lib/math/phase-portrait";
import { Eraser, MousePointerClick, Play, RefreshCw } from "lucide-react";

const TRAJECTORY_COLORS = [
  "#0d9488",
  "#0891b2",
  "#2563eb",
  "#db2777",
  "#d97706",
  "#7c3aed",
];

export function PhasePortraitGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [presetId, setPresetId] = useState(PHASE_PRESETS[2].id);
  const [fx, setFx] = useState(PHASE_PRESETS[2].fx);
  const [fy, setFy] = useState(PHASE_PRESETS[2].fy);
  const [xMin, setXMin] = useState(PHASE_PRESETS[2].xMin);
  const [xMax, setXMax] = useState(PHASE_PRESETS[2].xMax);
  const [yMin, setYMin] = useState(PHASE_PRESETS[2].yMin);
  const [yMax, setYMax] = useState(PHASE_PRESETS[2].yMax);
  const [trajectories, setTrajectories] = useState<Vec2[][]>([]);
  const [density, setDensity] = useState(14);

  const compiled = useMemo(() => {
    try {
      return {
        ok: true as const,
        field: compileVectorField(fx, fy),
      };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Invalid expressions.",
      };
    }
  }, [fx, fy]);

  const field = compiled.ok ? compiled.field : null;
  const error = compiled.ok ? null : compiled.error;

  const bounds = useMemo(
    () => ({ xMin, xMax, yMin, yMax }),
    [xMin, xMax, yMin, yMax],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !field) return;

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

    const toCanvas = (p: Vec2): Vec2 => ({
      x: ((p.x - xMin) / (xMax - xMin)) * width,
      y: height - ((p.y - yMin) / (yMax - yMin)) * height,
    });

    // Grid
    ctx.strokeStyle = isDark ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i += 1) {
      const x = (i / 8) * width;
      const y = (i / 8) * height;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    const origin = toCanvas({ x: 0, y: 0 });
    ctx.strokeStyle = isDark ? "rgba(148,163,184,0.45)" : "rgba(71,85,105,0.55)";
    ctx.lineWidth = 1.25;
    if (origin.x >= 0 && origin.x <= width) {
      ctx.beginPath();
      ctx.moveTo(origin.x, 0);
      ctx.lineTo(origin.x, height);
      ctx.stroke();
    }
    if (origin.y >= 0 && origin.y <= height) {
      ctx.beginPath();
      ctx.moveTo(0, origin.y);
      ctx.lineTo(width, origin.y);
      ctx.stroke();
    }

    // Vector field
    const samples = sampleVectorField(field, bounds, density);
    const maxMag =
      samples.reduce((m, s) => Math.max(m, s.mag), 0) || 1;
    const arrowScale = Math.min(width, height) / density / 2.6;

    for (const s of samples) {
      if (s.mag < 1e-8) continue;
      const start = toCanvas({ x: s.x, y: s.y });
      const nx = s.dx / s.mag;
      const ny = s.dy / s.mag;
      const len = arrowScale * (0.35 + 0.65 * Math.min(s.mag / maxMag, 1));
      const end = {
        x: start.x + nx * len,
        y: start.y - ny * len,
      };

      const alpha = 0.25 + 0.55 * Math.min(s.mag / maxMag, 1);
      ctx.strokeStyle = isDark
        ? `rgba(45, 212, 191, ${alpha})`
        : `rgba(13, 148, 136, ${alpha})`;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 1.4;

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      const ah = 5;
      const angle = Math.atan2(start.y - end.y, end.x - start.x);
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - ah * Math.cos(angle - Math.PI / 7),
        end.y + ah * Math.sin(angle - Math.PI / 7),
      );
      ctx.lineTo(
        end.x - ah * Math.cos(angle + Math.PI / 7),
        end.y + ah * Math.sin(angle + Math.PI / 7),
      );
      ctx.closePath();
      ctx.fill();
    }

    // Trajectories
    trajectories.forEach((path, idx) => {
      if (path.length < 2) return;
      ctx.strokeStyle = TRAJECTORY_COLORS[idx % TRAJECTORY_COLORS.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      const first = toCanvas(path[0]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < path.length; i += 1) {
        const p = toCanvas(path[i]);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(first.x, first.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Bounds labels
    ctx.fillStyle = isDark ? "rgba(226,232,240,0.7)" : "rgba(51,65,85,0.75)";
    ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillText(`x ∈ [${xMin}, ${xMax}]`, 12, 20);
    ctx.fillText(`y ∈ [${yMin}, ${yMax}]`, 12, 38);
  }, [bounds, density, field, trajectories, xMax, xMin, yMax, yMin]);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => draw();
    mq.addEventListener("change", onScheme);
    return () => {
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onScheme);
    };
  }, [draw]);

  const applyPreset = (id: string) => {
    const preset = PHASE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPresetId(id);
    setFx(preset.fx);
    setFy(preset.fy);
    setXMin(preset.xMin);
    setXMax(preset.xMax);
    setYMin(preset.yMin);
    setYMax(preset.yMax);
    setTrajectories([]);
  };

  const addTrajectoryAt = (clientX: number, clientY: number) => {
    if (!field || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const x = xMin + (px / rect.width) * (xMax - xMin);
    const y = yMax - (py / rect.height) * (yMax - yMin);

    const path = integrateTrajectory(field, { x, y }, {
      ...bounds,
      steps: 900,
      dt: 0.02,
    });
    setTrajectories((prev) => [...prev, path].slice(-12));
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    addTrajectoryAt(event.clientX, event.clientY);
  };

  const seedDemoTrajectories = () => {
    if (!field) return;
    const seeds: Vec2[] = [
      { x: (xMin + xMax) / 2 + 0.8, y: (yMin + yMax) / 2 },
      { x: (xMin + xMax) / 2 - 1.1, y: (yMin + yMax) / 2 + 0.7 },
      { x: (xMin + xMax) / 2 + 0.2, y: (yMin + yMax) / 2 - 1.3 },
      { x: (xMin + xMax) / 2 - 0.4, y: (yMin + yMax) / 2 + 1.5 },
    ];
    const paths = seeds.map((seed) =>
      integrateTrajectory(field, seed, { ...bounds, steps: 900, dt: 0.02 }),
    );
    setTrajectories(paths);
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Play className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Interactive phase plane
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={seedDemoTrajectories}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Seed orbits
          </button>
          <button
            type="button"
            onClick={() => setTrajectories([])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            <Eraser className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">System preset</span>
            <select
              value={presetId === "custom" ? "custom" : presetId}
              onChange={(e) => {
                if (e.target.value === "custom") return;
                applyPreset(e.target.value);
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
            >
              {PHASE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
              <option value="custom">Custom expressions</option>
            </select>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              {presetId === "custom"
                ? "Edit f(x, y) and g(x, y) freely. Click the canvas to integrate trajectories."
                : PHASE_PRESETS.find((p) => p.id === presetId)?.description}
            </p>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">ẋ = f(x, y)</span>
            <input
              value={fx}
              onChange={(e) => {
                setFx(e.target.value);
                setPresetId("custom");
              }}
              spellCheck={false}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">ẏ = g(x, y)</span>
            <input
              value={fy}
              onChange={(e) => {
                setFy(e.target.value);
                setPresetId("custom");
              }}
              spellCheck={false}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
            />
          </label>

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
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                  {label}
                </span>
                <input
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="mb-2 flex items-center justify-between text-sm font-medium">
              Vector density
              <span className="font-mono text-[var(--muted)]">{density}</span>
            </span>
            <input
              type="range"
              min={8}
              max={22}
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </label>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
            <p className="inline-flex items-center gap-2 font-medium text-[var(--foreground)]">
              <MousePointerClick className="h-4 w-4 text-[var(--accent)]" />
              Click the canvas
            </p>
            <p className="mt-1.5 leading-relaxed">
              Click anywhere on the phase plane to launch a trajectory integrated
              with RK4 in both time directions.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-300/50 bg-rose-50/70 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200">
              {error}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]">
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            className="h-[420px] w-full cursor-crosshair touch-none sm:h-[520px]"
            aria-label="Phase portrait canvas"
          />
        </div>
      </div>
    </div>
  );
}
