"use client";

import { useMemo, useState } from "react";
import {
  GasLawError,
  R_LATM,
  densityFromMolarMass,
  molarMassFromDensity,
  solveIdealGas,
  type DensityUnit,
  type GasField,
  type PressureUnit,
  type TempUnit,
  type VolumeUnit,
} from "@/lib/chemistry/gas-law";
import { RotateCcw } from "lucide-react";

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e4 || Math.abs(value) < 1e-3)) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(6)).toString();
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : Number.NaN;
}

type Mode = "pvnrt" | "mm-drtp";
type MmDirection = "d-to-M" | "M-to-d";

const MM_PRESETS = [
  {
    id: "co2",
    name: "CO₂, 1.96 g/L, 1 atm, 273 K → M",
    density: "1.96",
    P: "1.00",
    T: "273.15",
    M: "44.01",
    direction: "d-to-M" as const,
  },
  {
    id: "n2",
    name: "N₂, M = 28.0 g/mol, 1 atm, 273 K → d",
    density: "1.250",
    P: "1.00",
    T: "273.15",
    M: "28.02",
    direction: "M-to-d" as const,
  },
];

export function GasLawCalculator() {
  const [mode, setMode] = useState<Mode>("pvnrt");
  const [P, setP] = useState("1.00");
  const [V, setV] = useState("22.4");
  const [n, setN] = useState("");
  const [T, setT] = useState("273.15");
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>("atm");
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("L");
  const [tempUnit, setTempUnit] = useState<TempUnit>("K");
  const [density, setDensity] = useState("1.96");
  const [molarMass, setMolarMass] = useState("44.01");
  const [densityUnit, setDensityUnit] = useState<DensityUnit>("g/L");
  const [mmDirection, setMmDirection] = useState<MmDirection>("d-to-M");

  const pvnrt = useMemo(() => {
    const raw = {
      P: parseOptional(P),
      V: parseOptional(V),
      n: parseOptional(n),
      T: parseOptional(T),
    };
    if ([raw.P, raw.V, raw.n, raw.T].some((v) => Number.isNaN(v as number))) {
      return {
        ok: false as const,
        error: "Enter valid numbers, or leave one field blank.",
      };
    }
    try {
      return {
        ok: true as const,
        value: solveIdealGas({
          ...raw,
          pressureUnit,
          volumeUnit,
          tempUnit,
        }),
      };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof GasLawError
            ? error.message
            : "Unable to solve PV = nRT.",
      };
    }
  }, [P, V, n, T, pressureUnit, volumeUnit, tempUnit]);

  const mmResult = useMemo(() => {
    const p = Number(P);
    const t = Number(T);
    try {
      if (mmDirection === "d-to-M") {
        const d = Number(density);
        const M = molarMassFromDensity(
          d,
          p,
          t,
          pressureUnit,
          tempUnit,
          densityUnit,
        );
        return { ok: true as const, kind: "M" as const, value: M };
      }
      const M = Number(molarMass);
      const d = densityFromMolarMass(
        M,
        p,
        t,
        pressureUnit,
        tempUnit,
        densityUnit,
      );
      return { ok: true as const, kind: "d" as const, value: d };
    } catch (error) {
      return {
        ok: false as const,
        error:
          error instanceof GasLawError
            ? error.message
            : "Unable to evaluate M = dRT/P.",
      };
    }
  }, [
    mmDirection,
    density,
    molarMass,
    P,
    T,
    pressureUnit,
    tempUnit,
    densityUnit,
  ]);

  const labels: Record<GasField, string> = {
    P: "Pressure P",
    V: "Volume V",
    n: "Amount n",
    T: "Temperature T",
  };

  const applyMmPreset = (id: string) => {
    const preset = MM_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setMode("mm-drtp");
    setMmDirection(preset.direction);
    setDensity(preset.density);
    setMolarMass(preset.M);
    setP(preset.P);
    setT(preset.T);
    setPressureUnit("atm");
    setTempUnit("K");
    setDensityUnit("g/L");
  };

  const reset = () => {
    setMode("pvnrt");
    setP("1.00");
    setV("22.4");
    setN("");
    setT("273.15");
    setPressureUnit("atm");
    setVolumeUnit("L");
    setTempUnit("K");
    setDensity("1.96");
    setMolarMass("44.01");
    setDensityUnit("g/L");
    setMmDirection("d-to-M");
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Ideal gas law calculator</p>
          <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">
            PV = nRT · M = dRT/P · R = {R_LATM} L·atm/(mol·K)
          </p>
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
        {(
          [
            ["pvnrt", "PV = nRT"],
            ["mm-drtp", "M = dRT/P (mm = dRT/P)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`border px-2.5 py-1.5 text-xs ${
              mode === id
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "mm-drtp" ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {MM_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyMmPreset(preset.id)}
              className="border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)] hover:border-[var(--accent)]"
            >
              {preset.name}
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-3 text-sm text-[var(--muted)]">
        {mode === "pvnrt"
          ? "Enter any three of P, V, n, T and leave one blank. Units convert internally to atm, L, and K."
          : "Classroom molar-mass formula M = dRT/P (also written mm = dRT/P). Density in g/L with P in atm and T in kelvin is the usual homework form. Does not need V or n."}
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-[var(--muted)]">P unit</span>
          <select
            value={pressureUnit}
            onChange={(e) => setPressureUnit(e.target.value as PressureUnit)}
            className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
          >
            <option value="atm">atm</option>
            <option value="kPa">kPa</option>
            <option value="mmHg">mmHg</option>
            <option value="torr">torr</option>
          </select>
        </label>
        {mode === "pvnrt" ? (
          <label className="flex items-center gap-2">
            <span className="text-[var(--muted)]">V unit</span>
            <select
              value={volumeUnit}
              onChange={(e) => setVolumeUnit(e.target.value as VolumeUnit)}
              className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
            >
              <option value="L">L</option>
              <option value="mL">mL</option>
            </select>
          </label>
        ) : (
          <label className="flex items-center gap-2">
            <span className="text-[var(--muted)]">d unit</span>
            <select
              value={densityUnit}
              onChange={(e) => setDensityUnit(e.target.value as DensityUnit)}
              className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
            >
              <option value="g/L">g/L</option>
              <option value="g/mL">g/mL</option>
            </select>
          </label>
        )}
        <label className="flex items-center gap-2">
          <span className="text-[var(--muted)]">T unit</span>
          <select
            value={tempUnit}
            onChange={(e) => setTempUnit(e.target.value as TempUnit)}
            className="border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
          >
            <option value="K">K</option>
            <option value="C">°C</option>
          </select>
        </label>
      </div>

      {mode === "mm-drtp" ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(
            [
              ["d-to-M", "Density → molar mass"],
              ["M-to-d", "Molar mass → density"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMmDirection(id)}
              className={`border px-2.5 py-1.5 text-xs ${
                mmDirection === id
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {mode === "pvnrt" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <NumberField
            label={`Pressure (${pressureUnit})`}
            value={P}
            onChange={setP}
            placeholder="leave blank to solve"
          />
          <NumberField
            label={`Volume (${volumeUnit})`}
            value={V}
            onChange={setV}
            placeholder="leave blank to solve"
          />
          <NumberField
            label="Amount n (mol)"
            value={n}
            onChange={setN}
            placeholder="leave blank to solve"
          />
          <NumberField
            label={`Temperature (${tempUnit === "C" ? "°C" : "K"})`}
            value={T}
            onChange={setT}
            placeholder="leave blank to solve"
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <NumberField
            label={`Pressure (${pressureUnit})`}
            value={P}
            onChange={setP}
          />
          <NumberField
            label={`Temperature (${tempUnit === "C" ? "°C" : "K"})`}
            value={T}
            onChange={setT}
          />
          {mmDirection === "d-to-M" ? (
            <NumberField
              label={`Density d (${densityUnit})`}
              value={density}
              onChange={setDensity}
            />
          ) : (
            <NumberField
              label="Molar mass M (g/mol)"
              value={molarMass}
              onChange={setMolarMass}
            />
          )}
        </div>
      )}

      <div className="mt-5 border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
        {mode === "pvnrt" ? (
          !pvnrt.ok ? (
            <p className="text-[var(--muted)]">{pvnrt.error}</p>
          ) : (
            <div className="space-y-2">
              <p className="font-mono text-xs text-[var(--muted)]">
                {pvnrt.value.expression}
              </p>
              <p>
                Solved for{" "}
                <span className="font-medium">{labels[pvnrt.value.solved]}</span>
              </p>
              <dl className="grid gap-1.5 sm:grid-cols-2">
                <div>
                  <dt className="text-[var(--muted)]">P</dt>
                  <dd className="font-mono">
                    {formatNum(pvnrt.value.display.P)} {pressureUnit}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">V</dt>
                  <dd className="font-mono">
                    {formatNum(pvnrt.value.display.V)} {volumeUnit}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">n</dt>
                  <dd className="font-mono">{formatNum(pvnrt.value.n)} mol</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">T</dt>
                  <dd className="font-mono">
                    {formatNum(pvnrt.value.display.T)}{" "}
                    {tempUnit === "C" ? "°C" : "K"}
                    {tempUnit === "C"
                      ? ` (${formatNum(pvnrt.value.T)} K)`
                      : ""}
                  </dd>
                </div>
              </dl>
            </div>
          )
        ) : !mmResult.ok ? (
          <p className="text-[var(--muted)]">{mmResult.error}</p>
        ) : mmResult.kind === "M" ? (
          <div className="space-y-2">
            <p className="font-mono text-xs text-[var(--muted)]">
              M = dRT/P = mm = dRT/P
            </p>
            <p>
              Molar mass M ={" "}
              <span className="font-mono font-medium">
                {formatNum(mmResult.value)}
              </span>{" "}
              g/mol
            </p>
            <p className="text-xs text-[var(--muted)]">
              R = {R_LATM} L·atm/(mol·K). Convert T to kelvin and P to atm
              before substituting. Homework often writes this as mm = dRT/P.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-mono text-xs text-[var(--muted)]">
              d = PM/RT
            </p>
            <p>
              Density d ={" "}
              <span className="font-mono font-medium">
                {formatNum(mmResult.value)}
              </span>{" "}
              {densityUnit}
            </p>
            <p className="text-xs text-[var(--muted)]">
              Inverse of M = dRT/P. Same R and unit conversions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[var(--accent)]"
      />
    </label>
  );
}
