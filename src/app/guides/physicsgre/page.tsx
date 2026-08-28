import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { buildGuideMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/tools";

const guide = getGuideBySlug("physicsgre")!;

export const metadata: Metadata = buildGuideMetadata(guide);

export default function PhysicsGreGuidePage() {
  return (
    <GuideLayout guide={guide}>
      <h2>Physics GRE equation sheet</h2>
      <p>
        This Physics GRE equation sheet (also a formula sheet and study guide)
        is a formula-first review for the PGRE: classical mechanics,
        electromagnetism, quantum mechanics, thermodynamics/statistical
        mechanics, optics, relativity, laboratory methods, and specialized
        topics. Keep it open while you drill timed sets.
      </p>

      <h3>Approximate topic distribution</h3>
      <div className="not-prose overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Topic area</th>
              <th className="px-4 py-3 font-medium">Approx. weight</th>
              <th className="px-4 py-3 font-medium">Focus skills</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Classical Mechanics", "20%", "Lagrangians, orbits, oscillations, rigid bodies"],
              ["Electromagnetism", "18%", "Maxwell equations, circuits, waves, potentials"],
              ["Quantum Mechanics", "12%", "Operators, hydrogen atom, spin, perturbation"],
              ["Thermo / Stat Mech", "10%", "Laws of thermo, ensembles, distributions"],
              ["Optics & Waves", "9%", "Interference, diffraction, Fourier ideas"],
              ["Relativity", "6%", "Lorentz transforms, 4-vectors, E=γmc²"],
              ["Lab Methods", "6%", "Uncertainty, circuits, detectors, data"],
              ["Specialized Topics", "9%", "Nuclear/particle, condensed matter, astrophysics"],
              ["Atomic Physics", "10%", "Spectra, selection rules, fine structure"],
            ].map(([topic, weight, focus]) => (
              <tr key={topic} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                  {topic}
                </td>
                <td className="px-4 py-3 font-mono text-[var(--accent)]">{weight}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Classical mechanics formula sheet</h3>
      <pre>
        <code>{`Newton II:                 F = dp/dt = ma
Work–energy:               W = ∫ F·dr = ΔK
Conservation:              E = K + U  (conservative forces)
Simple harmonic motion:    x(t) = A cos(ωt + φ),  ω = √(k/m)
Physical pendulum:         ω = √(mgd/I)
Central force orbits:      L = μ r² θ̇  conserved
Kepler III:                T² = (4π²/GM) a³
Lagrangian:                L = T − V,  d/dt(∂L/∂q̇) = ∂L/∂q
Hamiltonian:               H = p q̇ − L`}</code>
      </pre>

      <h3>Electromagnetism essentials</h3>
      <pre>
        <code>{`Coulomb / field:           E = (1/4πε₀) q r̂ / r²
Gauss’s law:               ∮ E·dA = Q_enc / ε₀
Potential:                 V = −∫ E·dl ,  E = −∇V
Biot–Savart:               dB = (μ₀/4π) I dl × r̂ / r²
Ampère–Maxwell:            ∮ B·dl = μ₀(I_enc + ε₀ dΦ_E/dt)
Faraday:                   ∮ E·dl = −dΦ_B/dt
Poynting:                  S = (1/μ₀) E × B
Wave speed:                c = 1/√(μ₀ε₀)
AC impedance:              Z = R + i(ωL − 1/ωC)`}</code>
      </pre>
      <p>
        For a deeper conceptual walkthrough of electrostatic fields, see the{" "}
        <Link href="/guides/electricfield">Electric Field Guide & Visualizer</Link>.
      </p>

      <h3>Quantum mechanics checklist</h3>
      <ul>
        <li>
          <strong>Postulates:</strong> states as kets, observables as Hermitian
          operators, Born rule probabilities.
        </li>
        <li>
          <strong>Infinite well:</strong>{" "}
          <code>E_n = n²π²ℏ² / (2mL²)</code>, nodes = n−1.
        </li>
        <li>
          <strong>Harmonic oscillator:</strong>{" "}
          <code>E_n = ℏω(n + 1/2)</code>.
        </li>
        <li>
          <strong>Hydrogen:</strong>{" "}
          <code>E_n = −13.6 eV / n²</code>, degeneracy{" "}
          <code>n²</code> (ignoring spin).
        </li>
        <li>
          <strong>Commutators:</strong>{" "}
          <code>[x, p] = iℏ</code>, angular momentum algebra{" "}
          <code>[J_i, J_j] = iℏ ε_ijk J_k</code>.
        </li>
        <li>
          <strong>Spin-1/2:</strong> Pauli matrices, Stern–Gerlach intuition,
          addition of angular momenta.
        </li>
      </ul>

      <h3>Thermodynamics & statistical mechanics</h3>
      <pre>
        <code>{`First law:                 ΔU = Q − W  (sign convention dependent)
Ideal gas:                 PV = NkT = nRT
Entropy (Clausius):        dS = đQ_rev / T
Maxwell–Boltzmann:         f(v) ∝ v² exp(−mv²/2kT)
Partition function:        Z = Σ_i e^{−βE_i},  β = 1/kT
Helmholtz free energy:     F = −kT ln Z = U − TS
Equipartition:             (1/2)kT per quadratic degree of freedom`}</code>
      </pre>

      <h3>Optics & waves formula sheet</h3>
      <pre>
        <code>{`Wave:                      v = fλ
Intensity (wave):          I ∝ A²
Snell:                     n₁ sin θ₁ = n₂ sin θ₂
Thin lens:                 1/f = 1/s + 1/s′
Magnification:             m = −s′/s = h′/h
Double slit:               d sin θ = mλ  (bright)
Single-slit min:           a sin θ = mλ
Diffraction grating:       d sin θ = mλ
Rayleigh criterion:        θ ≈ 1.22 λ/D
Doppler (sound, source):   f′ = f v/(v ± v_s)`}</code>
      </pre>

      <h3>Special relativity</h3>
      <pre>
        <code>{`Lorentz factor:            γ = 1/√(1 − β²),  β = v/c
Time dilation:             Δt = γ Δτ
Length contraction:        L = L₀/γ
Velocity addition:         u = (v + u′)/(1 + vu′/c²)
Energy–momentum:           E² = (pc)² + (mc²)²
Rest energy:               E₀ = mc²
Kinetic energy:            K = (γ − 1)mc²`}</code>
      </pre>

      <h3>High-yield constants</h3>
      <pre>
        <code>{`c = 3.00×10⁸ m/s
h = 6.63×10⁻³⁴ J·s    ℏc ≈ 197 MeV·fm
k = 8.62×10⁻⁵ eV/K    N_A = 6.02×10²³ mol⁻¹
e = 1.60×10⁻¹⁹ C      α ≈ 1/137
m_e = 511 keV/c²      m_p ≈ 938 MeV/c²
g ≈ 9.8 m/s²          σ = 5.67×10⁻⁸ W·m⁻²·K⁻⁴
ε₀ = 8.85×10⁻¹² F/m   μ₀ = 4π×10⁻⁷ T·m/A`}</code>
      </pre>

      <h3>High-yield exam strategy</h3>
      <ol className="list-decimal space-y-2 pl-5 text-[var(--muted)]">
        <li>
          <span className="text-[var(--foreground)]">
            Drill dimensional analysis and limiting cases first
          </span>{" "}
          — many PGRE items reward quick elimination.
        </li>
        <li>
          <span className="text-[var(--foreground)]">
            Memorize order-of-magnitude constants
          </span>{" "}
          (ℏc ≈ 197 MeV·fm, k ≈ 8.6×10⁻⁵ eV/K, α ≈ 1/137).
        </li>
        <li>
          <span className="text-[var(--foreground)]">
            Practice under timed conditions
          </span>{" "}
          — roughly 1.7 minutes per question across ~100 items.
        </li>
        <li>
          <span className="text-[var(--foreground)]">
            Rotate weak topics weekly
          </span>{" "}
          instead of re-reading only mechanics comfort zones.
        </li>
        <li>
          <span className="text-[var(--foreground)]">
            Use interactive tools while reviewing
          </span>{" "}
          — plot potentials with the{" "}
          <Link href="/tools/graphingcalculator">graphing calculator</Link> and
          explore ODE phase structure with the{" "}
          <Link href="/tools/phaseportrait">phase portrait generator</Link>.
        </li>
      </ol>

      <h3>Two-week intensive outline</h3>
      <ul>
        <li>
          <strong>Days 1–3:</strong> Mechanics + oscillations + central forces
        </li>
        <li>
          <strong>Days 4–6:</strong> E&M (electrostatics through Maxwell)
        </li>
        <li>
          <strong>Days 7–8:</strong> Quantum + atomic spectra
        </li>
        <li>
          <strong>Days 9–10:</strong> Thermo/stat mech + lab methods
        </li>
        <li>
          <strong>Days 11–12:</strong> Optics, waves, relativity
        </li>
        <li>
          <strong>Days 13–14:</strong> Full practice exams + error logs
        </li>
      </ul>

      <p>
        For hands-on practice visualization, use the{" "}
        <Link href="/tools/graphingcalculator">graphing calculator</Link> to
        plot potentials and waveforms, the{" "}
        <Link href="/tools/phaseportrait">phase portrait generator</Link> for
        dynamical systems, and the{" "}
        <Link href="/tools/timegraphing">time graphing tool</Link> for
        position–velocity–time curves.
      </p>

      <p className="!mb-0">
        Bookmark this equation sheet, then jump into practice sets and
        interactive visualizations to convert recognition into speed.
      </p>
    </GuideLayout>
  );
}
