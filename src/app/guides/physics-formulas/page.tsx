import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { buildGuideMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/tools";

const guide = getGuideBySlug("physics-formulas")!;

export const metadata: Metadata = buildGuideMetadata(guide);

export default function PhysicsFormulasGuidePage() {
  return (
    <GuideLayout guide={guide}>
      <h2>Physics formula sheet</h2>
      <p>
        This introductory physics formula sheet (also an equation sheet for high
        school and first-year college) collects the relations used in kinematics,
        Newton’s laws, energy, momentum, rotation, oscillations, waves, and basic
        electrostatics. It is not the Physics GRE sheet—use that for graduate
        subject-test review. Plot 1D motion with the{" "}
        <Link href="/tools/graphingcalculator">2D Graphing Calculator</Link> and
        fields with the{" "}
        <Link href="/guides/electricfield">Electric Field Guide</Link>.
      </p>

      <h3>Kinematics (constant acceleration)</h3>
      <pre>
        <code>{`v = v₀ + at
x = x₀ + v₀ t + ½ a t²
v² = v₀² + 2a(x − x₀)
Free fall near Earth: a = g ≈ 9.80 m/s² downward`}</code>
      </pre>

      <h3>Newton, friction, circular motion</h3>
      <pre>
        <code>{`ΣF = dp/dt = ma          (constant m)
Weight:                  W = mg
Kinetic friction:        f_k = μ_k N
Static friction:         f_s ≤ μ_s N
Uniform circular:        a_c = v²/r = ω² r
                         F_c = m v²/r`}</code>
      </pre>

      <h3>Energy and momentum</h3>
      <pre>
        <code>{`K = ½ m v²
U_g = m g h              (near Earth, constant g)
U_s = ½ k x²             (ideal spring)
W = ∫ F·dr = ΔK          (work–energy)
E = K + U conserved if only conservative forces
p = m v
impulse J = ∫ F dt = Δp
elastic 1D: relative speed reverses along the line of impact`}</code>
      </pre>

      <h3>Rotation (fixed axis)</h3>
      <pre>
        <code>{`θ, ω, α analog of x, v, a
τ = r F sinφ = I α
L = I ω                  (about a principal axis)
K_rot = ½ I ω²
rolling without slip:    v = r ω`}</code>
      </pre>

      <h3>Oscillations and waves</h3>
      <pre>
        <code>{`SHM:     x(t) = A cos(ωt + φ)
         ω = √(k/m)           (mass–spring)
         ω = √(g/L)           (small-angle simple pendulum)
         T = 2π/ω
wave:    v = f λ
         v = √(T/μ)           (transverse string)`}</code>
      </pre>

      <h3>Gravity and fluids</h3>
      <pre>
        <code>{`Newton gravity:  F = G m₁ m₂ / r²
                 U = −G m₁ m₂ / r
pressure:        P = P₀ + ρ g h
buoyancy:        F_b = ρ_fluid V_displaced g
continuity:      A v = constant  (incompressible)
Bernoulli:       P + ρ g h + ½ ρ v² = constant`}</code>
      </pre>

      <h3>Basic electrostatics</h3>
      <pre>
        <code>{`Coulomb:     F = k |q₁ q₂| / r²
field:       E = F/q_test = k q / r²   (point charge)
             F = q E
k = 1/(4πε₀) ≈ 8.99×10⁹ N·m²/C²`}</code>
      </pre>
      <p>
        For superposition sketches and the GRE-level field notes, use the{" "}
        <Link href="/guides/electricfield">Electric Field Guide &amp; Visualizer</Link>
        . Graduate-exam formulas (Lagrangians, Maxwell in integral form, quantum)
        live on the{" "}
        <Link href="/guides/physicsgre">Physics GRE Equation Sheet</Link>.
      </p>

      <h3>Useful constants</h3>
      <pre>
        <code>{`g ≈ 9.80 m/s²
G = 6.67×10⁻¹¹ N·m²/kg²
c = 3.00×10⁸ m/s
k_B = 1.38×10⁻²³ J/K
N_A = 6.02×10²³ mol⁻¹`}</code>
      </pre>
    </GuideLayout>
  );
}
