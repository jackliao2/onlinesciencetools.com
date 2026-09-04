import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { buildGuideMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/tools";

const guide = getGuideBySlug("chemistry-formulas")!;

export const metadata: Metadata = buildGuideMetadata(guide);

export default function ChemistryFormulasGuidePage() {
  return (
    <GuideLayout guide={guide}>
      <h2>Chemistry formula sheet</h2>
      <p>
        This chemistry formula sheet (also an equation sheet for general and AP
        chemistry) collects the relations you actually type into homework: moles,
        dilution, equilibrium, Ksp, pH, gases, rates, and heat. Each block links
        to a calculator on this site so you can check a number after you write
        the equation.
      </p>

      <h3>Moles, mass, and particles</h3>
      <pre>
        <code>{`n = m / M
N = n × Nₐ    Nₐ = 6.02214076×10²³ mol⁻¹
% mass(i) = (nᵢ Aᵢ / M) × 100%`}</code>
      </pre>
      <p>
        Use the{" "}
        <Link href="/tools/stoichiometrycalculator">Stoichiometry Calculator</Link>{" "}
        for molar mass and the{" "}
        <Link href="/tools/compositioncalculator">
          Composition &amp; Empirical Formula Calculator
        </Link>{" "}
        for percent composition.
      </p>

      <h3>Balanced equations and limiting reagent</h3>
      <pre>
        <code>{`mole ratio from coefficients
n_product = n_limiting × (coeff_product / coeff_limiting)
theoretical yield (g) = n_product × M_product
percent yield = (actual / theoretical) × 100%`}</code>
      </pre>
      <p>
        Balance first with the{" "}
        <Link href="/tools/balanceequation">Chemical Equation Balancer</Link>,
        then find the limiting reagent with the{" "}
        <Link href="/tools/reactionstoichiometrycalculator">
          Limiting Reagent Calculator
        </Link>
        . Redox in acid or base:{" "}
        <Link href="/tools/redoxbalancer">Redox Equation Balancer</Link>.
      </p>

      <h3>Dilution and concentration</h3>
      <pre>
        <code>{`C₁V₁ = C₂V₂
dilution factor = C₁ / C₂ = V₂ / V₁
M = mol / L     mM = 10⁻³ M     μM = 10⁻⁶ M
% w/v = (g solute / 100 mL) × 100`}</code>
      </pre>
      <p>
        <Link href="/tools/dilutioncalculator">Dilution Calculator</Link> for
        C₁V₁ and serial dilutions;{" "}
        <Link href="/tools/concentrationconverter">
          Molarity &amp; Concentration Converter
        </Link>{" "}
        for M, mg/mL, ng/mL, % w/v, and ppm.
      </p>

      <h3>Equilibrium (Kc, Kp, Q)</h3>
      <pre>
        <code>{`Kc = Π [products]^ν / Π [reactants]^ν
Kp = Kc (RT)^{Δn}
Q uses the same form with current amounts
Q < K forward; Q > K reverse; Q = K at equilibrium`}</code>
      </pre>
      <p>
        ICE tables and Kc/Kp:{" "}
        <Link href="/tools/equilibriumcalculator">
          Chemical Equilibrium Calculator
        </Link>
        .
      </p>

      <h3>Ksp and precipitation</h3>
      <pre>
        <code>{`AB:    Ksp = s²
AB₂:   Ksp = 4s³
A₃B₂:  Ksp = 108 s⁵
Q > Ksp → precipitate expected`}</code>
      </pre>
      <p>
        <Link href="/tools/kspcalculator">Ksp Calculator</Link> converts s ↔ Ksp
        and compares Q with Ksp (BaCrO₄, A₃B₂ homework chips included).
      </p>

      <h3>pH, pOH, and buffers</h3>
      <pre>
        <code>{`pH = −log₁₀[H⁺]     pOH = −log₁₀[OH⁻]     pH + pOH = 14 (25 °C)
weak acid: [H⁺] ≈ √(Ka C)
Henderson–Hasselbalch: pH = pKa + log₁₀([A⁻]/[HA])`}</code>
      </pre>
      <p>
        <Link href="/tools/phcalculator">pH Calculator</Link> for strong/weak
        acids and neutralization;{" "}
        <Link href="/tools/buffercalculator">Phosphate Buffer Calculator</Link>{" "}
        for named recipes and McIlvaine citrate–phosphate.
      </p>

      <h3>Ideal gas law</h3>
      <pre>
        <code>{`PV = nRT
R = 0.082057 L·atm/(mol·K)
T(K) = t(°C) + 273.15
M = dRT / P   (mm = dRT/P; d in g/L)`}</code>
      </pre>
      <p>
        <Link href="/tools/gaslawcalculator">
          Ideal Gas Law Calculator (M = dRT/P)
        </Link>
        .
      </p>

      <h3>Kinetics (integrated rate laws)</h3>
      <pre>
        <code>{`zero order:  [A] = [A]₀ − kt      t½ = [A]₀ / (2k)
first order: ln[A] = ln[A]₀ − kt  t½ = ln 2 / k
second order: 1/[A] = 1/[A]₀ + kt t½ = 1 / (k [A]₀)`}</code>
      </pre>
      <p>
        <Link href="/tools/kineticscalculator">Kinetics Calculator</Link>.
      </p>

      <h3>Thermochemistry and Nernst</h3>
      <pre>
        <code>{`ΔH°rxn = Σ ν ΔH°f(products) − Σ ν ΔH°f(reactants)
q = m c ΔT
E = E° − (RT/nF) ln Q
ΔG = −n F E`}</code>
      </pre>
      <p>
        <Link href="/tools/thermochemistrycalculator">
          Thermochemistry Calculator
        </Link>{" "}
        and{" "}
        <Link href="/tools/nernstcalculator">Nernst Equation Calculator</Link>.
      </p>

      <p>
        Browse every chemistry tool on the{" "}
        <Link href="/chemistry">chemistry calculators</Link> page.
      </p>
    </GuideLayout>
  );
}
