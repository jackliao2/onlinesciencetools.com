import type { ToolArticleContent } from "./types";

export const mathArticles: ToolArticleContent[] = [
  {
    slug: "phaseportrait",
    whatIs: {
      paragraphs: [
        "A phase portrait is a geometric representation of a dynamical system: a set of first-order differential equations whose solutions trace curves through a state space. For a two-dimensional autonomous system, the state at any instant is a point (x, y) and the rate of change is given by a vector field (dx/dt, dy/dt). Plotting this field together with representative solution trajectories reveals how the system evolves from different initial conditions without solving the equations analytically.",
        "Phase portraits are central to the study of ordinary differential equations in mathematics, physics, and engineering. In population ecology, the Lotka–Volterra equations model predator–prey dynamics; their phase portrait shows closed orbits around a coexistence equilibrium. In classical mechanics, a pendulum's angle and angular velocity form a two-dimensional state, and the portrait displays spirals toward a stable rest point or closed loops for undamped oscillation. Electrical circuits with inductors and capacitors exhibit analogous behavior.",
        "Equilibrium points—where dx/dt = dy/dt = 0—are the landmarks of a phase portrait. Linearizing the system near each equilibrium and examining the eigenvalues of the Jacobian matrix classifies the local behavior as a node, saddle, spiral, or center. A stable node attracts nearby trajectories; a saddle has one stable and one unstable direction; a spiral combines rotation with approach or departure. These classifications appear on every differential equations exam and in research on nonlinear dynamics.",
        "Students first encounter phase portraits when learning to interpret vector fields and nullclines. The x-nullcline is where dx/dt = 0; the y-nullcline is where dy/dt = 0. Their intersections are equilibria, and the regions between nullclines indicate whether each variable is increasing or decreasing. Sketching nullclines by hand builds intuition before relying on software, but numerical tools accelerate exploration of parameter changes.",
        "The Phase Portrait Generator on Online Science Tools accepts a pair of differential equations, plots the vector field on an adjustable domain, and integrates trajectories from user-specified initial conditions. Use it alongside the 2D Graphing Calculator for one-dimensional function plots and the Linear Equations Solver when linearizing systems near equilibria. Phase portraits transform abstract differential equations into visual stories about stability, oscillation, and long-term behavior.",
      ],
      bullets: [
        "Autonomous systems: dx/dt and dy/dt depend only on (x, y), not explicitly on time",
        "Equilibrium points occur where both rate equations equal zero simultaneously",
        "Jacobian eigenvalues at an equilibrium determine local stability classification",
        "Nullclines partition the plane into regions of increasing and decreasing x and y",
      ],
    },
    formula: {
      intro:
        "A two-dimensional autonomous system is defined by a pair of coupled first-order ODEs. The vector field, equilibrium conditions, and linearization Jacobian form the analytical backbone of phase portrait analysis.",
      blocks: [
        `System:
  dx/dt = f(x, y)
  dy/dt = g(x, y)

Vector field at each point (x, y):
  v = (f(x, y), g(x, y))

Equilibrium (x*, y*):
  f(x*, y*) = 0  and  g(x*, y*) = 0

Jacobian matrix (for linearization):
  J = | ∂f/∂x   ∂f/∂y |
      | ∂g/∂x   ∂g/∂y |

Eigenvalues λ of J at (x*, y*) classify stability:
  λ₁, λ₂ both real, same sign  →  node (stable if negative)
  λ₁, λ₂ real, opposite signs   →  saddle (unstable)
  λ = α ± iβ, α ≠ 0             →  spiral (stable if α < 0)
  λ = ± iβ (pure imaginary)   →  center (neutrally stable)`,
      ],
      notes: [
        "Trajectories are tangent to the vector field at every point and never cross (except at equilibria) by uniqueness of solutions.",
        "For non-autonomous systems with explicit time dependence, augment the state space or use the Time Graphing Tool instead.",
        "Numerical integration (e.g., Runge–Kutta) approximates trajectories when closed-form solutions are unavailable.",
      ],
    },
    example: {
      title: "Phase Portrait of a Damped Pendulum",
      scenario:
        "Model a pendulum with damping: dx/dt = y, dy/dt = −sin(x) − 0.5y, where x is the angle and y is angular velocity. Identify equilibria and describe the expected portrait near the origin.",
      steps: [
        "Set dx/dt = 0: y = 0. Set dy/dt = 0: −sin(x) − 0.5y = 0, so with y = 0, sin(x) = 0.",
        "Equilibria: (0, 0), (π, 0), (−π, 0), and all integer multiples of π along y = 0.",
        "Linearize at the origin: f = y, g = −sin(x) − 0.5y. At (0,0): ∂f/∂x = 0, ∂f/∂y = 1, ∂g/∂x = −cos(0) = −1, ∂g/∂y = −0.5.",
        "Jacobian at origin: J = [[0, 1], [−1, −0.5]].",
        "Characteristic equation: λ² + 0.5λ + 1 = 0. Discriminant: 0.25 − 4 = −3.75 < 0.",
        "Complex eigenvalues with real part −0.25: the origin is a stable spiral. Trajectories spiral inward toward (0, 0).",
        "At (π, 0): cos(π) = −1, so ∂g/∂x = 1. Jacobian has eigenvalues with opposite signs → saddle point.",
      ],
      toolCheck:
        "Enter dx/dt = y and dy/dt = -sin(x) - 0.5*y into the Phase Portrait Generator on Online Science Tools. Set the viewing window to x ∈ [−4, 4] and y ∈ [−3, 3], then click near (0.5, 0) to launch a trajectory. You should see a spiral converging to the origin, confirming the stable spiral classification. Launch another trajectory near (3.5, 0) to observe the saddle behavior at x = π. Compare vector field directions with your nullcline sketch.",
    },
    faq: [
      {
        question: "What is the difference between a phase portrait and a regular graph?",
        answer:
          "A regular graph plots a dependent variable against an independent variable, such as y versus x for a function. A phase portrait plots one state variable against another state variable (y versus x) with time as an implicit parameter along each curve. Multiple trajectories can pass through different regions of the same plane, and the vector field shows instantaneous direction at every point. The 2D Graphing Calculator handles explicit functions; the Phase Portrait Generator handles coupled differential equations.",
      },
      {
        question: "Why do trajectories never cross in a phase portrait?",
        answer:
          "By the existence and uniqueness theorem for ordinary differential equations, a given initial condition (x₀, y₀) determines exactly one solution curve. If two trajectories crossed at a point, that point would serve as two different initial conditions for the same system, violating uniqueness. The only exception is equilibrium points, where the velocity vector is zero and trajectories can meet.",
      },
      {
        question: "How do I find and classify equilibrium points?",
        answer:
          "Solve the simultaneous equations f(x, y) = 0 and g(x, y) = 0. At each solution, compute the Jacobian matrix of partial derivatives and find its eigenvalues. Real eigenvalues of the same sign indicate a node; opposite signs indicate a saddle; complex eigenvalues indicate a spiral or center depending on whether the real part is nonzero. The Phase Portrait Generator plots equilibria automatically when you enter the system.",
      },
      {
        question: "Can I use phase portraits for systems with three or more variables?",
        answer:
          "Phase portraits as two-dimensional plots require a two-dimensional state space. For three or more variables, you can project onto a two-dimensional slice (fixing other coordinates) or examine two-variable subsystems. Higher-dimensional analysis uses tools like Lyapunov exponents and bifurcation diagrams. The Phase Portrait Generator is designed specifically for 2D autonomous systems, which cover the majority of introductory differential equations coursework.",
      },
    ],
  },
  {
    slug: "graphingcalculator",
    whatIs: {
      paragraphs: [
        "A graphing calculator plots the relationship between an independent variable x and a dependent output f(x), turning an algebraic expression into a visual curve on the coordinate plane. By displaying the shape, intercepts, turning points, and asymptotic behavior of a function, graphing reveals properties that are difficult to detect from the formula alone. The graph of f(x) = x³ − 3x, for instance, immediately shows two local extrema and three x-intercepts that would require calculus or factoring to find analytically.",
        "Function graphing is a foundational skill in algebra, precalculus, calculus, and applied mathematics. Before the derivative is formally defined, students use graphs to estimate slopes and identify increasing and decreasing intervals. In calculus, graphs confirm analytical results: a critical point where f′(x) = 0 should appear as a horizontal tangent on the graph. In physics, position–time or velocity–time graphs connect mathematical functions to measurable quantities.",
        "The viewing window— the range of x and y values displayed— critically affects what you see. A function with rapid growth may look flat in a wide window but reveal detail when zoomed in. Local extrema detection algorithms sample the function numerically to find points where the sign of the slope changes, approximating where the derivative equals zero. These automated features complement hand calculations and help students verify their work.",
        "Graphing also supports comparing multiple functions on the same axes. Overlaying y = sin(x) and y = cos(x) shows their phase relationship; plotting a function and its tangent line at a point illustrates the derivative geometrically. Inequalities become regions: shading above or below a curve represents solution sets for y > f(x) or y < f(x).",
        "The 2D Graphing Calculator on Online Science Tools accepts standard mathematical expressions, renders them on an interactive canvas with pan and zoom, and highlights local maxima and minima automatically. Pair it with the Linear Equations Solver for systems whose solutions are intersection points of lines, or with the Time Graphing Tool when the function depends on time as well as position.",
      ],
      bullets: [
        "The graph of y = f(x) consists of all points (x, f(x)) in the plane",
        "x-intercepts occur where f(x) = 0; y-intercepts occur at f(0)",
        "Local maxima and minima appear where the slope changes sign (f′(x) = 0 or undefined)",
        "Transformations (shifts, stretches, reflections) modify the graph predictably",
      ],
    },
    formula: {
      intro:
        "Graphing relies on evaluating f(x) at sample points and connecting them. Key analytical formulas help locate intercepts, extrema, and asymptotes before or after plotting.",
      blocks: [
        `Function:  y = f(x)

x-intercepts:  solve f(x) = 0
y-intercept:   (0, f(0))

Slope (derivative):
  f′(x) = lim(h→0) [f(x+h) − f(x)] / h

Critical points:  f′(x) = 0  or  f′(x) undefined

Second derivative test:
  f″(x) > 0  →  local minimum at x
  f″(x) < 0  →  local maximum at x

Common transformations of f(x):
  f(x) + k       vertical shift up by k
  f(x − h)       horizontal shift right by h
  a·f(x)         vertical stretch by |a|
  f(b·x)         horizontal compression by 1/|b|`,
      ],
      notes: [
        "Vertical asymptotes occur where f(x) → ±∞; horizontal asymptotes describe end behavior as x → ±∞.",
        "Numerical plotting samples f at discrete x values; too few points may miss sharp features or oscillations.",
        "Piecewise functions require separate expressions over each domain interval.",
      ],
    },
    example: {
      title: "Graphing and Analyzing f(x) = x³ − 3x",
      scenario:
        "Analyze and sketch the cubic function f(x) = x³ − 3x. Find intercepts, critical points, and classify each extremum.",
      steps: [
        "y-intercept: f(0) = 0, so the graph passes through the origin.",
        "x-intercepts: x³ − 3x = x(x² − 3) = 0, so x = 0, x = √3 ≈ 1.732, x = −√3 ≈ −1.732.",
        "Derivative: f′(x) = 3x² − 3 = 3(x² − 1). Set f′(x) = 0: x = ±1.",
        "Evaluate: f(1) = 1 − 3 = −2 (local minimum); f(−1) = −1 + 3 = 2 (local maximum).",
        "Second derivative: f″(x) = 6x. f″(1) = 6 > 0 confirms minimum; f″(−1) = −6 < 0 confirms maximum.",
        "End behavior: as x → +∞, f(x) → +∞; as x → −∞, f(x) → −∞.",
        "Sketch: rising from lower left, peak at (−1, 2), descending through origin, minimum at (1, −2), then rising to upper right.",
      ],
      toolCheck:
        "Enter x^3 - 3*x into the 2D Graphing Calculator on Online Science Tools and set the window to x ∈ [−3, 3], y ∈ [−4, 4]. The tool should display the cubic curve passing through the three x-intercepts and automatically detect local extrema near (−1, 2) and (1, −2). Compare the detected coordinates to your analytical results. For a related system of lines, use the Linear Equations Solver to find where two linear functions intersect.",
    },
    faq: [
      {
        question: "Why does my graph look wrong or incomplete?",
        answer:
          "The most common cause is an inappropriate viewing window. If the function grows rapidly, most of the curve may be compressed into a corner of the screen. Try narrowing the x-range or adjusting the y-range. Another cause is a domain restriction: functions like sqrt(x) or 1/x are undefined at certain x values, creating gaps or asymptotes that require the window to include both sides of the discontinuity.",
      },
      {
        question: "How does the calculator find local extrema automatically?",
        answer:
          "The 2D Graphing Calculator samples the function at many points across the visible window and looks for sign changes in the approximate slope between adjacent samples. When the slope changes from positive to negative, a local maximum is flagged; from negative to positive, a local minimum. This numerical method approximates solving f′(x) = 0 and works for any differentiable function, though very sharp peaks may require a narrower window for accurate detection.",
      },
      {
        question: "Can I graph multiple functions at once?",
        answer:
          "Yes. Enter additional expressions to overlay them on the same axes. This is useful for comparing a function to its derivative estimate, finding intersection points visually, or exploring families of curves with different parameters. Intersection points of two graphs f(x) and g(x) correspond to solutions of f(x) = g(x).",
      },
      {
        question: "What functions can the graphing calculator handle?",
        answer:
          "The 2D Graphing Calculator supports polynomials, trigonometric functions (sin, cos, tan), exponentials, logarithms, absolute value, square roots, and combinations via standard arithmetic operators. Nested expressions and common constants like pi and e are recognized. For parametric or time-dependent curves, switch to the Time Graphing Tool, which handles x(t) and y(t) parameterizations.",
      },
    ],
  },
  {
    slug: "timegraphing",
    whatIs: {
      paragraphs: [
        "Time graphing extends ordinary function plotting to situations where quantities evolve with time. A function f(x, t) depends on both a spatial variable x and time t, producing a surface or family of curves that shift as t advances. Parametric equations x(t) and y(t) describe particle motion by giving each coordinate as a function of time, tracing a path through the plane without requiring y as an explicit function of x.",
        "Parametric motion appears throughout physics and engineering. Projectile motion can be written as x(t) = v₀cos(θ)·t and y(t) = v₀sin(θ)·t − ½gt², producing a parabolic trajectory when y is plotted against x. Circular motion x(t) = R cos(ωt), y(t) = R sin(ωt) generates a circle of radius R. Harmonic oscillators, planetary orbits, and Lissajous figures all have natural parametric descriptions that time graphing tools animate.",
        "Animating a function of time makes abstract equations tangible. Watching a sine wave propagate or a parametric curve being drawn dot by dot helps students connect the parameter t to physical time. In wave mechanics, f(x, t) = A sin(kx − ωt) represents a traveling wave; advancing t shifts the wave pattern horizontally at speed ω/k. Heat diffusion, population growth, and chemical kinetics likewise produce time-dependent profiles.",
        "The distinction between explicit graphs y = f(x) and parametric graphs (x(t), y(t)) matters when the curve doubles back on itself or has vertical tangents. A circle cannot be written as a single y = f(x) because each x value corresponds to two y values, but the parametric form handles this naturally. Time graphing tools plot the trajectory in the xy-plane while using t to control animation speed and position along the curve.",
        "The Time Graphing Tool on Online Science Tools supports both time-dependent functions f(x, t) and parametric pairs x(t), y(t) with a playable animation control. Use it alongside the Phase Portrait Generator for dynamical systems and the 2D Graphing Calculator for static function plots. Time graphing transforms equations into motion, making it an essential visualization tool for differential equations, mechanics, and signal processing courses.",
      ],
      bullets: [
        "Parametric form (x(t), y(t)) describes curves that may fail the vertical line test",
        "Time-dependent f(x, t) shows how a spatial profile evolves as t increases",
        "Velocity components are dx/dt and dy/dt; speed is √(dx/dt² + dy/dt²)",
        "Animation speed can be adjusted independently of the mathematical parameter t",
      ],
    },
    formula: {
      intro:
        "Time graphing uses either a time-dependent scalar field f(x, t) or a parametric vector (x(t), y(t)). Kinematic quantities derive from time derivatives of the parametric components.",
      blocks: [
        `Time-dependent function:
  y = f(x, t)        (curve changes shape or position as t varies)

Parametric motion:
  x = x(t)
  y = y(t)
  trajectory: {(x(t), y(t)) : t ∈ [t₀, t₁]}

Velocity and speed:
  v_x = dx/dt
  v_y = dy/dt
  speed = √(v_x² + v_y²)

Arc length from t = a to t = b:
  s = ∫ₐᵇ √[(dx/dt)² + (dy/dt)²] dt

Traveling wave example:
  f(x, t) = A sin(kx − ωt)
  wave speed v = ω/k`,
      ],
      notes: [
        "Eliminating t between x(t) and y(t) may yield an explicit relation y = g(x), but parametric form is often simpler.",
        "For projectile motion, t often represents physical time; for Lissajous figures, t is a phase parameter that need not equal clock time.",
        "When f(x, t) satisfies a PDE such as the heat equation, time graphing visualizes the solution surface over x and t.",
      ],
    },
    example: {
      title: "Parametric Projectile Trajectory",
      scenario:
        "A ball is launched from the origin at 20 m/s at a 45° angle. With g = 9.8 m/s², write parametric equations and find the landing time and range.",
      steps: [
        "Initial speed v₀ = 20 m/s, angle θ = 45°, so v₀cos(45°) = v₀sin(45°) = 20/√2 ≈ 14.14 m/s.",
        "Parametric equations: x(t) = 14.14t, y(t) = 14.14t − 4.9t².",
        "Landing occurs when y(t) = 0: 14.14t − 4.9t² = t(14.14 − 4.9t) = 0, so t = 0 (launch) or t = 14.14/4.9 ≈ 2.89 s.",
        "Range: x(2.89) = 14.14 × 2.89 ≈ 40.8 m.",
        "Maximum height: dy/dt = 14.14 − 9.8t = 0 gives t = 1.44 s. y(1.44) = 14.14(1.44) − 4.9(1.44)² ≈ 10.2 m.",
        "The trajectory in the xy-plane is a parabola opening downward, traced from t = 0 to t ≈ 2.89 s.",
      ],
      toolCheck:
        "Enter x(t) = 14.14*t and y(t) = 14.14*t - 4.9*t^2 into the Time Graphing Tool on Online Science Tools. Play the animation to watch the projectile arc from the origin and return to y = 0 near x ≈ 40.8 m. Pause at t ≈ 1.44 s to verify the peak height near 10.2 m. For a static view of the same parabola, plot y = x − 0.035x² in the 2D Graphing Calculator after eliminating t.",
    },
    faq: [
      {
        question: "When should I use time graphing instead of the 2D Graphing Calculator?",
        answer:
          "Use the Time Graphing Tool when your problem involves a parameter t that represents time or a free parameter tracing a curve. Parametric equations, traveling waves f(x, t), and animated function families all require time graphing. Use the 2D Graphing Calculator when you have a standard explicit function y = f(x) with no time dependence. If your system is dx/dt = f(x, y) without explicit t, the Phase Portrait Generator is the appropriate tool.",
      },
      {
        question: "How do I interpret the animation speed?",
        answer:
          "The animation control advances the parameter t at a rate you choose, which may differ from real-world time. A projectile simulation with t in seconds can be played slowly for inspection or quickly to see the full arc. The mathematical content—the shape of the trajectory—is independent of playback speed. Adjust speed to focus on a particular segment, such as the ascent or descent phase.",
      },
      {
        question: "Can I graph f(x, t) as a moving curve on the xy-plane?",
        answer:
          "Yes. For a function f(x, t), the Time Graphing Tool displays the curve y = f(x, t) at the current value of t. As t increases, the curve shifts, stretches, or morphs according to the equation. This is particularly useful for visualizing wave propagation, diffusion profiles, and any PDE solution where the spatial shape changes over time.",
      },
      {
        question: "What are Lissajous figures and how do I graph them?",
        answer:
          "Lissajous figures arise from x(t) = A sin(a·t + δ) and y(t) = B sin(b·t), where a and b are frequency ratios. When a/b is a simple rational number, closed curves appear; incommensurate ratios produce dense fills. Enter the parametric pair into the Time Graphing Tool and animate t over several periods to reveal the pattern. These figures appear in oscilloscope demonstrations and coupled oscillator analysis.",
      },
    ],
  },
  {
    slug: "linearequations",
    whatIs: {
      paragraphs: [
        "A system of linear equations is a collection of equations that are linear—each variable appears only to the first power, with no products like xy or x²—in all unknowns. A 2×2 system has two equations in two unknowns; a 3×3 system has three equations in three unknowns. The solution, if one exists, is the point (or set of points) that simultaneously satisfies every equation in the system. Geometrically, each linear equation in two variables represents a line, and the solution is their intersection.",
        "Linear systems are among the most widely applied mathematical models in science and engineering. Kirchhoff's circuit laws produce linear systems for unknown currents. Structural analysis in civil engineering, least-squares fitting in statistics, and chemical equilibrium mass balance all reduce to solving Ax = b. In computer graphics, solving linear systems determines lighting, transformations, and mesh deformations. Mastery of linear equation solving is prerequisite for linear algebra, numerical methods, and optimization.",
        "Gaussian elimination is the standard algorithm taught in algebra and linear algebra courses. It transforms the augmented matrix of the system through elementary row operations—swapping rows, multiplying a row by a nonzero scalar, adding a multiple of one row to another—into row echelon form and then reduced row echelon form. Back substitution then yields the solution. The method is systematic, works for any size system, and reveals when no solution or infinitely many solutions exist.",
        "A system may have a unique solution (lines intersect at one point), no solution (parallel lines, inconsistent system), or infinitely many solutions (coincident lines or planes). The determinant of the coefficient matrix for a square system signals uniqueness: a nonzero determinant guarantees a unique solution. Singular systems with zero determinant require further analysis to describe the solution set.",
        "The Linear Equations Solver on Online Science Tools accepts 2×2 and 3×3 systems, performs Gaussian elimination with step-by-step summaries, and reports the solution or identifies inconsistency. Use it to verify homework, explore what happens when equations are nearly parallel, and connect algebraic solutions to graphs on the 2D Graphing Calculator by plotting each equation as a line.",
      ],
      bullets: [
        "A linear equation in n variables has the form a₁x₁ + a₂x₂ + … + aₙxₙ = b",
        "Gaussian elimination uses row operations to reach upper triangular form",
        "Consistent systems have at least one solution; inconsistent systems have none",
        "The determinant (for square systems) equals zero when the system is singular",
      ],
    },
    formula: {
      intro:
        "Linear systems are compactly written as Ax = b. Gaussian elimination row-reduces the augmented matrix [A | b] to solve for x.",
      blocks: [
        `General form (n equations, n unknowns):
  a₁₁x₁ + a₁₂x₂ + … + a₁ₙxₙ = b₁
  a₂₁x₁ + a₂₂x₂ + … + a₂ₙxₙ = b₂
  ⋮
  aₙ₁x₁ + aₙ₂x₂ + … + aₙₙxₙ = bₙ

Matrix form:
  A x = b

2×2 Cramer's rule (when det A ≠ 0):
  x = det(A_x) / det(A)
  y = det(A_y) / det(A)

where A_x replaces column 1 of A with b, A_y replaces column 2.

Determinant (2×2):
  det | a  b | = ad − bc
      | c  d |

Row operations (preserves solution set):
  Rᵢ ↔ Rⱼ
  Rᵢ ← c·Rᵢ        (c ≠ 0)
  Rᵢ ← Rᵢ + k·Rⱼ`,
      ],
      notes: [
        "Reduced row echelon form has leading 1s (pivots) with zeros above and below each pivot.",
        "Free variables appear when a column lacks a pivot, leading to infinitely many solutions.",
        "For large systems, iterative methods replace direct elimination, but Gaussian elimination is exact for small systems.",
      ],
    },
    example: {
      title: "Solving a 2×2 System by Elimination",
      scenario:
        "Solve the system: 2x + 3y = 8 and x − y = 1. Verify the solution by substitution.",
      steps: [
        "Write the augmented matrix: [2  3 | 8] / [1 −1 | 1].",
        "Swap rows for convenience (optional): [1 −1 | 1] / [2  3 | 8].",
        "Eliminate x from row 2: R₂ ← R₂ − 2R₁ → [1 −1 | 1] / [0  5 | 6].",
        "Back substitute: 5y = 6, so y = 6/5 = 1.2.",
        "Substitute y into row 1: x − 1.2 = 1, so x = 2.2.",
        "Verify in both equations: 2(2.2) + 3(1.2) = 4.4 + 3.6 = 8 ✓. 2.2 − 1.2 = 1 ✓.",
        "Geometric interpretation: the lines 2x + 3y = 8 and x − y = 1 intersect at (2.2, 1.2).",
      ],
      toolCheck:
        "Enter the coefficients 2, 3, 8 and 1, −1, 1 into the Linear Equations Solver on Online Science Tools. The tool performs Gaussian elimination and should report x = 2.2 and y = 1.2. Review the step summary to compare each row operation with your manual work. Plot y = (8 − 2x)/3 and y = x − 1 on the 2D Graphing Calculator to confirm the intersection visually at (2.2, 1.2).",
    },
    faq: [
      {
        question: "What does it mean when the solver reports no solution?",
        answer:
          "An inconsistent system arises when the equations represent parallel lines (2D) or parallel planes (3D) that never intersect. During Gaussian elimination, you encounter a row of the form [0  0  …  0 | c] where c is nonzero, meaning 0 = c, which is impossible. This often indicates a modeling error—conflicting constraints—or a special case where coefficients must be adjusted.",
      },
      {
        question: "How do I handle infinitely many solutions?",
        answer:
          "When Gaussian elimination produces a row of zeros (0 = 0) and fewer pivots than variables, free variables exist. Express the pivot variables in terms of the free variables to describe the full solution set. Geometrically, two identical equations represent the same line, giving infinitely many intersection points. The Linear Equations Solver identifies this case and reports the parametric solution when applicable.",
      },
      {
        question: "Is Cramer's rule or Gaussian elimination better?",
        answer:
          "Cramer's rule is elegant for 2×2 and 3×3 systems and useful for theoretical work involving determinants, but it requires computing multiple determinants and does not scale efficiently. Gaussian elimination is the standard computational method for any size system and directly reveals consistency and rank. The Linear Equations Solver uses Gaussian elimination because it handles all cases uniformly and provides step-by-step output for learning.",
      },
      {
        question: "Can I use the Linear Equations Solver for 3×3 systems?",
        answer:
          "Yes. Enter three equations with three unknowns and the solver row-reduces the 3×3 augmented matrix. The process involves more row operations than a 2×2 case, but the logic is identical: eliminate variables column by column, then back substitute. Review each elimination step in the summary to follow the algorithm for exam preparation.",
      },
      {
        question: "How do linear systems connect to the Phase Portrait Generator?",
        answer:
          "Near an equilibrium of a nonlinear dynamical system, linearization produces a linear system whose Jacobian matrix plays the role of A. Solving or analyzing this linear system (via eigenvalues) determines local stability. The Linear Equations Solver handles the algebraic side; the Phase Portrait Generator visualizes the resulting trajectory behavior. Together they connect computation and geometry in differential equations.",
      },
    ],
  },
];
