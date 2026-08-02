import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { ElectricFieldVisualizer } from "@/components/guides/ElectricFieldVisualizer";
import { buildGuideMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/tools";

const guide = getGuideBySlug("electricfield")!;

export const metadata: Metadata = buildGuideMetadata(guide);

export default function ElectricFieldGuidePage() {
  return (
    <GuideLayout guide={guide}>
      <h2>What is an electric field?</h2>
      <p>
        The electric field <strong>E</strong> at a point in space describes the
        force per unit charge that a positive test charge would experience. For a
        point charge <code>q</code> at the origin, Coulomb&apos;s law gives:
      </p>
      <pre>
        <code>{`E = (1 / 4πε₀) · q / r² · r̂

k = 1 / 4πε₀ ≈ 8.99 × 10⁹ N·m²/C²`}</code>
      </pre>
      <p>
        Field lines point away from positive charges and toward negative charges.
        The superposition principle states that the total field from multiple
        charges is the vector sum of individual contributions.
      </p>

      <ElectricFieldVisualizer />

      <h3>Key formulas for introductory &amp; GRE physics</h3>
      <pre>
        <code>{`Point charge field:     E = k q / r²
Superposition:            E_total = Σ E_i
Force on test charge:     F = q_test E
Potential (scalar):       V = k q / r
Field from potential:     E = −∇V
Uniform field:            E = σ / ε₀  (parallel plates, ideal)
Dipole field (far):       E ∝ p / r³`}</code>
      </pre>

      <h3>Gauss&apos;s law connection</h3>
      <p>
        Gauss&apos;s law relates the flux of the electric field through a closed
        surface to enclosed charge:
      </p>
      <pre>
        <code>{`∮ E · dA = Q_enc / ε₀`}</code>
      </pre>
      <p>
        For highly symmetric charge distributions (spheres, cylinders, infinite
        planes), Gauss&apos;s law provides the fastest route to the field
        magnitude without integrating Coulomb&apos;s law directly.
      </p>

      <h3>Common exam scenarios</h3>
      <ul>
        <li>
          <strong>Two point charges:</strong> find null points on the line
          connecting them where <code>E = 0</code>.
        </li>
        <li>
          <strong>Dipole:</strong> field falls off as <code>1/r³</code> at large
          distances; torque <code>τ = p × E</code>.
        </li>
        <li>
          <strong>Conductors in equilibrium:</strong> interior{" "}
          <code>E = 0</code>, excess charge resides on the surface.
        </li>
        <li>
          <strong>Energy:</strong> potential energy{" "}
          <code>U = qV</code>; stored energy density{" "}
          <code>u = ½ ε₀ E²</code>.
        </li>
      </ul>

      <h3>Units &amp; constants</h3>
      <div className="not-prose overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">SI unit</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Electric field E", "N/C or V/m", "Equivalent dimensions"],
              ["Charge q", "Coulomb (C)", "e ≈ 1.602 × 10⁻¹⁹ C"],
              ["Permittivity ε₀", "8.854 × 10⁻¹² F/m", "Vacuum value"],
              ["Coulomb constant k", "8.99 × 10⁹ N·m²/C²", "k = 1/(4πε₀)"],
            ].map(([qty, unit, notes]) => (
              <tr key={qty} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-medium">{qty}</td>
                <td className="px-4 py-3 font-mono text-[var(--accent)]">{unit}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Study workflow</h3>
      <ol>
        <li>Read the field definition and superposition principle above.</li>
        <li>
          Drag charges in the visualizer to see how field arrows respond.
        </li>
        <li>
          Practice null-point and dipole-limit problems from GRE-style sets.
        </li>
        <li>
          Cross-reference E&amp;M formulas in the{" "}
          <Link href="/guides/physicsgre">Physics GRE Guide</Link>.
        </li>
        <li>
          Plot field-related functions (e.g. Coulomb potential{" "}
          <code>V(r) ∝ 1/r</code>) with the{" "}
          <Link href="/tools/graphingcalculator">graphing calculator</Link> to
          check scaling and asymptotic behavior.
        </li>
      </ol>

      <p className="!mb-0">
        Use the formulas above with the interactive canvas to build intuition —
        then try sketching field lines by hand before checking the visualizer.
      </p>
    </GuideLayout>
  );
}
