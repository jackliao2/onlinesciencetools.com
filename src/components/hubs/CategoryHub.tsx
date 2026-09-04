import Link from "next/link";
import { JsonLd } from "@/components/tools/JsonLd";
import { ToolHero } from "@/components/tools/ToolHero";
import { buildCollectionJsonLd } from "@/lib/seo";
import {
  categoryHubs,
  groupOrderForCategory,
  guides,
  toolGroupLabels,
  tools,
  type ToolCategory,
} from "@/lib/tools";

const hubCopy: Record<
  ToolCategory,
  { lead: string; bullets: string[]; pick: string }
> = {
  chemistry: {
    lead: "Use these chemistry calculators for homework and lab prep: balance a reaction, convert moles, dilute a stock, or solve an ICE table. Each tool runs in the browser and shows the formula it used.",
    bullets: [
      "Reactions: balancer, redox, stoichiometry, limiting reagent, empirical formula",
      "Solutions: C₁V₁ dilution and molarity / mg/mL / ppm conversion",
      "Equilibrium and acids: Kc/Kp, Ksp, pH, phosphate and McIlvaine buffers",
      "Gases: PV = nRT and M = dRT/P (mm = dRT/P), plus kinetics, thermochemistry, and Nernst",
    ],
    pick: "Start with the Chemical Equation Balancer if you have a reaction, the Ksp Calculator for solubility-product homework, or the Phosphate Buffer Calculator for a named lab recipe. The chemistry formula sheet collects the equations in one place.",
  },
  math: {
    lead: "The math tools plot dynamical systems and algebraic work that show up in differential equations and linear algebra. The Phase Portrait Generator is a plotter for 2D autonomous ODEs—center, spiral, saddle, and limit cycles.",
    bullets: [
      "Phase portraits: vector field, nullclines, and equilibrium classification",
      "2D graphing for y = f(x) with local extrema",
      "Time / parametric graphing",
      "Linear systems up to 6×6 with RREF",
    ],
    pick: "If you searched for a phase portrait plotter or generator, open that tool first. Use the graphing calculator for ordinary functions and the linear solver when you linearize near an equilibrium.",
  },
  computing: {
    lead: "Computing tools on this site are small browser utilities that sit next to the science calculators. The HTML Executor runs HTML, CSS, and JavaScript from a local .html file or from the three editors.",
    bullets: [
      "HTML Executor: open an .html file, split style/script, sandboxed preview",
      "Binary calculator: convert and compute across bases",
      "Hex color picker: HEX, RGB, and HSL",
    ],
    pick: "If you need to run HTML in the browser, use the HTML Executor (file import included). Binary and color conversion are on their own pages.",
  },
};

export function CategoryHub({ category }: { category: ToolCategory }) {
  const page = categoryHubs[category];
  const copy = hubCopy[category];
  const items = tools.filter(
    (tool) => tool.category === category && tool.status === "live",
  );
  const relatedGuides = guides.filter((guide) => {
    if (category === "chemistry") return guide.slug === "chemistry-formulas";
    if (category === "math") return false;
    if (category === "computing") return false;
    return false;
  });
  const physicsGuides =
    category === "math"
      ? guides.filter(
          (guide) =>
            guide.slug === "physicsgre" || guide.slug === "electricfield",
        )
      : [];
  const extra = [...relatedGuides, ...physicsGuides];

  return (
    <>
      <JsonLd
        data={buildCollectionJsonLd(page, [
          ...items.map((tool) => ({ name: tool.title, href: tool.href })),
          ...extra.map((guide) => ({ name: guide.title, href: guide.href })),
        ])}
      />
      <ToolHero
        title={page.title}
        description={page.description}
        isSectionRoot
      />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <article className="prose-ost max-w-none border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
          <p>{copy.lead}</p>
          <ul>
            {copy.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{copy.pick}</p>
          {category === "chemistry" ? (
            <p>
              Keep the{" "}
              <Link href="/guides/chemistry-formulas">
                chemistry formula sheet
              </Link>{" "}
              open while you work.
            </p>
          ) : null}
          {category === "math" ? (
            <p>
              Physics GRE formulas live on the{" "}
              <Link href="/guides/physicsgre">Physics GRE equation sheet</Link>.
            </p>
          ) : null}

          {groupOrderForCategory(category).map((group) => {
            const groupItems = items.filter((tool) => tool.group === group);
            if (groupItems.length === 0) return null;
            return (
              <div key={group} className="not-prose mt-8">
                <h2 className="mb-1 border-b border-[var(--border)] pb-1 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
                  {toolGroupLabels[group]}
                </h2>
                <ul className="divide-y divide-[var(--border)]">
                  {groupItems.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={tool.href}
                        className="group flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-6"
                      >
                        <span className="shrink-0 font-medium group-hover:text-[var(--accent)] sm:w-56">
                          {tool.title}
                        </span>
                        <span className="text-sm text-[var(--muted)]">
                          {tool.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {extra.length > 0 ? (
            <div className="not-prose mt-8">
              <h2 className="mb-1 border-b border-[var(--border)] pb-1 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
                Related guides
              </h2>
              <ul className="divide-y divide-[var(--border)]">
                {extra.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={guide.href}
                      className="group flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-6"
                    >
                      <span className="shrink-0 font-medium group-hover:text-[var(--accent)] sm:w-56">
                        {guide.title}
                      </span>
                      <span className="text-sm text-[var(--muted)]">
                        {guide.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </section>
    </>
  );
}
