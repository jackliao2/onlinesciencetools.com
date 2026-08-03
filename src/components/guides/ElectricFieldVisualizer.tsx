"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Plus, Trash2 } from "lucide-react";

const K = 8.9875517923e9;
const ARROW_SCALE = 1.2e11;

interface Charge {
  id: string;
  q: number;
  x: number;
  y: number;
}

interface Probe {
  x: number;
  y: number;
  ex: number;
  ey: number;
  mag: number;
}

const DEFAULT_CHARGES: Charge[] = [
  { id: "1", q: 1e-9, x: -0.5, y: 0 },
  { id: "2", q: -1e-9, x: 0.5, y: 0 },
];

let nextChargeId = 3;

export function fieldAt(
  x: number,
  y: number,
  charges: Charge[],
): { ex: number; ey: number } {
  let ex = 0;
  let ey = 0;
  for (const c of charges) {
    const dx = x - c.x;
    const dy = y - c.y;
    const r2 = dx * dx + dy * dy;
    if (r2 < 1e-8) continue;
    const r = Math.sqrt(r2);
    const magnitude = (K * c.q) / r2;
    ex += magnitude * (dx / r);
    ey += magnitude * (dy / r);
  }
  return { ex, ey };
}

export function ElectricFieldVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [charges, setCharges] = useState<Charge[]>(DEFAULT_CHARGES);
  const [dragId, setDragId] = useState<string | null>(null);
  const [probe, setProbe] = useState<Probe | null>(null);
  const viewMin = -2;
  const viewMax = 2;

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
      cx: ((x - viewMin) / (viewMax - viewMin)) * width,
      cy: height - ((y - viewMin) / (viewMax - viewMin)) * height,
    });

    const range = viewMax - viewMin;
    ctx.strokeStyle = isDark ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.08)";
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

    const origin = toCanvas(0, 0);
    ctx.strokeStyle = isDark ? "rgba(148,163,184,0.45)" : "rgba(71,85,105,0.55)";
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(origin.cx, 0);
    ctx.lineTo(origin.cx, height);
    ctx.moveTo(0, origin.cy);
    ctx.lineTo(width, origin.cy);
    ctx.stroke();

    const density = 16;
    let maxMag = 0;
    const samples: Array<{ x: number; y: number; ex: number; ey: number; mag: number }> = [];

    for (let i = 0; i <= density; i += 1) {
      for (let j = 0; j <= density; j += 1) {
        const x = viewMin + (i / density) * range;
        const y = viewMin + (j / density) * range;
        const { ex, ey } = fieldAt(x, y, charges);
        const mag = Math.hypot(ex, ey);
        maxMag = Math.max(maxMag, mag);
        samples.push({ x, y, ex, ey, mag });
      }
    }

    for (const s of samples) {
      if (s.mag < 1e-3) continue;
      const scale = (s.mag / maxMag) * ARROW_SCALE;
      const len = Math.min(scale, range * 0.08);
      const ux = s.ex / s.mag;
      const uy = s.ey / s.mag;
      const start = toCanvas(s.x, s.y);
      const end = toCanvas(s.x + ux * len, s.y + uy * len);

      ctx.strokeStyle = isDark ? "rgba(56,189,248,0.55)" : "rgba(37,99,235,0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(start.cx, start.cy);
      ctx.lineTo(end.cx, end.cy);
      ctx.stroke();

      const angle = Math.atan2(end.cy - start.cy, end.cx - start.cx);
      const headLen = 6;
      ctx.beginPath();
      ctx.moveTo(end.cx, end.cy);
      ctx.lineTo(
        end.cx - headLen * Math.cos(angle - Math.PI / 6),
        end.cy - headLen * Math.sin(angle - Math.PI / 6),
      );
      ctx.moveTo(end.cx, end.cy);
      ctx.lineTo(
        end.cx - headLen * Math.cos(angle + Math.PI / 6),
        end.cy - headLen * Math.sin(angle + Math.PI / 6),
      );
      ctx.stroke();
    }

    if (probe) {
      const p = toCanvas(probe.x, probe.y);
      ctx.beginPath();
      ctx.arc(p.cx, p.cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#f59e0b";
      ctx.fill();
      ctx.strokeStyle = isDark ? "#fff" : "#0f172a";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (probe.mag > 1e-6) {
        const ux = probe.ex / probe.mag;
        const uy = probe.ey / probe.mag;
        const tip = toCanvas(probe.x + ux * 0.35, probe.y + uy * 0.35);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.cx, p.cy);
        ctx.lineTo(tip.cx, tip.cy);
        ctx.stroke();
      }
    }

    for (const c of charges) {
      const { cx, cy } = toCanvas(c.x, c.y);
      const radius = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = c.q > 0 ? "#ef4444" : "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = isDark ? "#f8fafc" : "#0f172a";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c.q > 0 ? "+" : "−", cx, cy);
    }
  }, [charges, probe, viewMin, viewMax]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", draw);
    return () => {
      window.removeEventListener("resize", draw);
      mq.removeEventListener("change", draw);
    };
  }, [draw]);

  const canvasToWorld = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    const x = viewMin + (cx / rect.width) * (viewMax - viewMin);
    const y = viewMax - (cy / rect.height) * (viewMax - viewMin);
    return { x, y };
  };

  const placeProbe = (x: number, y: number) => {
    const { ex, ey } = fieldAt(x, y, charges);
    setProbe({ x, y, ex, ey, mag: Math.hypot(ex, ey) });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const { x, y } = canvasToWorld(e.clientX, e.clientY);
    const hit = charges.find((c) => {
      const dx = c.x - x;
      const dy = c.y - y;
      return Math.hypot(dx, dy) < 0.15;
    });
    if (hit) {
      setDragId(hit.id);
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    } else {
      placeProbe(x, y);
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!dragId) return;
    const { x, y } = canvasToWorld(e.clientX, e.clientY);
    setCharges((prev) =>
      prev.map((c) => (c.id === dragId ? { ...c, x, y } : c)),
    );
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragId && probe) {
      const { ex, ey } = fieldAt(probe.x, probe.y, charges);
      setProbe({ ...probe, ex, ey, mag: Math.hypot(ex, ey) });
    }
    setDragId(null);
    try {
      (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore if capture was not set
    }
  };

  const updateCharge = (id: string, patch: Partial<Charge>) => {
    setCharges((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const addCharge = (sign: 1 | -1) => {
    setCharges((prev) => [
      ...prev,
      {
        id: String(nextChargeId++),
        q: sign * 1e-9,
        x: 0,
        y: sign > 0 ? 0.8 : -0.8,
      },
    ]);
  };

  const removeCharge = (id: string) => {
    setCharges((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));
  };

  // Recompute probe when charges move; avoid depending on the whole probe object.
  useEffect(() => {
    setProbe((p) => {
      if (!p) return p;
      const { ex, ey } = fieldAt(p.x, p.y, charges);
      return { ...p, ex, ey, mag: Math.hypot(ex, ey) };
    });
  }, [charges]);

  return (
    <div className="not-prose rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--foreground)]">
        Interactive field visualizer
      </h3>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Drag charges, add more sources, or click empty space to probe Ex, Ey, and |E|.
        Red = positive, blue = negative.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addCharge(1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Add + charge
        </button>
        <button
          type="button"
          onClick={() => addCharge(-1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Add − charge
        </button>
        <button
          type="button"
          onClick={() => {
            setCharges(DEFAULT_CHARGES);
            setProbe(null);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--muted)]"
        >
          Reset dipole
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)]">
        <canvas
          ref={canvasRef}
          className="h-[360px] w-full cursor-crosshair touch-none sm:h-[420px]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>

      {probe && (
        <div className="mt-4 grid gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase text-[var(--muted)]">Probe (x, y)</p>
            <p className="mt-1 font-mono text-sm">
              ({probe.x.toFixed(3)}, {probe.y.toFixed(3)}) m
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-[var(--muted)]">Ex</p>
            <p className="mt-1 font-mono text-sm">{probe.ex.toExponential(4)} N/C</p>
          </div>
          <div>
            <p className="text-xs uppercase text-[var(--muted)]">Ey</p>
            <p className="mt-1 font-mono text-sm">{probe.ey.toExponential(4)} N/C</p>
          </div>
          <div>
            <p className="text-xs uppercase text-[var(--muted)]">|E|</p>
            <p className="mt-1 font-mono text-sm font-semibold text-amber-700 dark:text-amber-300">
              {probe.mag.toExponential(4)} N/C
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {charges.map((c, index) => (
          <div
            key={c.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-[var(--muted)]">
                Charge {index + 1} ({c.q > 0 ? "+" : "−"})
              </p>
              <button
                type="button"
                onClick={() => removeCharge(c.id)}
                disabled={charges.length <= 1}
                className="rounded p-1 text-[var(--muted)] hover:text-rose-500 disabled:opacity-30"
                aria-label="Remove charge"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <label className="block">
                <span className="text-xs text-[var(--muted)]">q (nC)</span>
                <input
                  type="number"
                  step="any"
                  value={Number((c.q * 1e9).toFixed(3))}
                  onChange={(e) =>
                    updateCharge(c.id, { q: Number(e.target.value) * 1e-9 })
                  }
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-xs text-[var(--muted)]">x (m)</span>
                <input
                  type="number"
                  step="any"
                  value={Number(c.x.toFixed(3))}
                  onChange={(e) => updateCharge(c.id, { x: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-xs text-[var(--muted)]">y (m)</span>
                <input
                  type="number"
                  step="any"
                  value={Number(c.y.toFixed(3))}
                  onChange={(e) => updateCharge(c.id, { y: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
