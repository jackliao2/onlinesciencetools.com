import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { buildGuideMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/tools";

const guide = getGuideBySlug("differential-equations")!;

export const metadata: Metadata = buildGuideMetadata(guide);

export default function DifferentialEquationsGuidePage() {
  return (
    <GuideLayout guide={guide}>
      <h2>Differential equations formula sheet</h2>
      <p>
        This sheet is the ODE companion to the{" "}
        <Link href="/tools/phaseportrait">Phase Portrait Generator</Link>:
        first- and second-order equations, linearization, and the eigenvalue
        test that classifies a node, saddle, spiral, or center. It does not
        replace the plotter—use the generator to draw the field, then check the
        classification against the Jacobian here.
      </p>

      <h3>First-order and linear second-order</h3>
      <pre>
        <code>{`separable:     dy/dx = g(x) h(y)  →  ∫ dy/h(y) = ∫ g(x) dx
linear 1st:    y′ + P(x) y = Q(x)
  μ = exp(∫ P dx),   (μ y)′ = μ Q
constant-coeff:  y″ + b y′ + c y = 0
  characteristic r² + b r + c = 0
  two real r:     y = A e^{r₁ t} + B e^{r₂ t}
  repeated r:     y = (A + B t) e^{r t}
  complex α±iβ:   y = e^{α t} (A cos βt + B sin βt)`}</code>
      </pre>

      <h3>2D autonomous systems</h3>
      <pre>
        <code>{`ẋ = f(x, y)
ẏ = g(x, y)

equilibrium (x*, y*):  f = 0 and g = 0
nullclines:            f = 0  (vertical flow),  g = 0  (horizontal flow)`}</code>
      </pre>
      <p>
        Trajectories are tangent to the vector field and do not cross (uniqueness).
        Click the phase plane in the{" "}
        <Link href="/tools/phaseportrait">Phase Portrait Generator</Link> to
        integrate with RK4. The Center, Spiral sink, and Saddle presets match
        the linear cases below.
      </p>

      <h3>Jacobian and classification</h3>
      <pre>
        <code>{`J = | ∂f/∂x  ∂f/∂y |
    | ∂g/∂x  ∂g/∂y |     evaluated at (x*, y*)

Eigenvalues λ of J:

  two real, same sign     node (sink if λ < 0, source if λ > 0)
  two real, opposite sign saddle (unstable)
  λ = α ± iβ, α ≠ 0       spiral (sink if α < 0, source if α > 0)
  λ = ± iβ                center (closed orbits, neutrally stable)
  one λ = 0               non-isolated or degenerate — linear test fails`}</code>
      </pre>
      <p>
        The linear solver helps when you already have J x = λ x as a matrix
        problem:{" "}
        <Link href="/tools/linearequations">Linear Equations Solver</Link>.
      </p>

      <h3>Worked linear portraits</h3>
      <pre>
        <code>{`center:   ẋ = −y,  ẏ = x           J = [[0,-1],[1,0]]   λ = ±i
saddle:   ẋ = x,   ẏ = −y          λ = +1, −1
sink:     ẋ = −x,  ẏ = −2y         λ = −1, −2
spiral:   ẋ = −0.3x − y, ẏ = x − 0.3y    λ = −0.3 ± i`}</code>
      </pre>
      <p>
        Load those as presets on the plotter, then enable equilibria +
        classification. Nonlinear examples (Van der Pol, damped pendulum) have
        the same local types after linearization, plus possible limit cycles
        that a linear J cannot see.
      </p>

      <h3>Existence, uniqueness, and time</h3>
      <pre>
        <code>{`Lipschitz f,g  → unique solution through each (x₀, y₀)
non-autonomous ẋ = f(x, t) is not a 2D phase portrait
  (use the time-graphing tool for x(t) instead)`}</code>
      </pre>
      <p>
        For explicit y = f(x) plots use the{" "}
        <Link href="/tools/graphingcalculator">2D Graphing Calculator</Link>;
        for x(t) use the{" "}
        <Link href="/tools/timegraphing">Time Graphing Tool</Link>.
      </p>
    </GuideLayout>
  );
}
