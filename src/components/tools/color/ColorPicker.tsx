"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Copy, Palette, RotateCcw } from "lucide-react";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToRgb(hex: string): Rgb | null {
  const cleaned = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const hn = ((h % 360) + 360) % 360 / 360;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;

  const hueToRgb = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  return {
    r: Math.round(hueToRgb(hn + 1 / 3) * 255),
    g: Math.round(hueToRgb(hn) * 255),
    b: Math.round(hueToRgb(hn - 1 / 3) * 255),
  };
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
      aria-label="Copy"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export function ColorPicker() {
  const [hex, setHex] = useState("#2563EB");
  const [rgb, setRgb] = useState<Rgb>({ r: 37, g: 99, b: 235 });
  const [hsl, setHsl] = useState<Hsl>({ h: 221, s: 83, l: 53 });
  const syncFromRgb = useCallback((next: Rgb) => {
    setRgb(next);
    setHex(rgbToHex(next));
    setHsl(rgbToHsl(next));
  }, []);

  const syncFromHex = useCallback(
    (value: string) => {
      setHex(value);
      const parsed = hexToRgb(value);
      if (parsed) {
        setRgb(parsed);
        setHsl(rgbToHsl(parsed));
      }
    },
    [],
  );

  const syncFromHsl = useCallback(
    (next: Hsl) => {
      setHsl(next);
      const nextRgb = hslToRgb(next);
      setRgb(nextRgb);
      setHex(rgbToHex(nextRgb));
    },
    [],
  );

  const previewColor = useMemo(() => rgbToHex(rgb), [rgb]);

  const reset = () => {
    syncFromRgb({ r: 37, g: 99, b: 235 });
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Palette className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Color converter
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-40 w-40 rounded-3xl border border-[var(--border)] shadow-inner"
            style={{ backgroundColor: previewColor }}
          />
          <input
            type="color"
            value={previewColor}
            onChange={(e) => syncFromHex(e.target.value)}
            className="h-12 w-full cursor-pointer rounded-xl border border-[var(--border)] bg-transparent"
          />
        </div>

        <div className="space-y-5">
          <ColorField
            label="HEX"
            value={hex}
            onChange={syncFromHex}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {(["r", "g", "b"] as const).map((channel) => (
              <label key={channel} className="block">
                <span className="mb-1 block text-xs font-medium uppercase text-[var(--muted)]">
                  {channel}
                </span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[channel]}
                  onChange={(e) => {
                    syncFromRgb({
                      ...rgb,
                      [channel]: clamp(Number(e.target.value), 0, 255),
                    });
                  }}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
            ))}
          </div>
          <p className="font-mono text-sm text-[var(--muted)]">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
            <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {(["h", "s", "l"] as const).map((channel) => (
              <label key={channel} className="block">
                <span className="mb-1 block text-xs font-medium uppercase text-[var(--muted)]">
                  {channel === "h" ? "Hue" : channel === "s" ? "Saturation" : "Lightness"}
                </span>
                <input
                  type="number"
                  min={channel === "h" ? 0 : 0}
                  max={channel === "h" ? 359 : 100}
                  value={hsl[channel]}
                  onChange={(e) => {
                    syncFromHsl({
                      ...hsl,
                      [channel]: Number(e.target.value),
                    });
                  }}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
            ))}
          </div>
          <p className="font-mono text-sm text-[var(--muted)]">
            hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
            <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          </p>
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex-1">
        <span className="mb-1 block text-xs font-medium uppercase text-[var(--muted)]">
          {label}
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 font-mono outline-none ring-[var(--accent)] focus:ring-2"
        />
      </label>
      <div className="mt-5">
        <CopyButton value={value} />
      </div>
    </div>
  );
}
