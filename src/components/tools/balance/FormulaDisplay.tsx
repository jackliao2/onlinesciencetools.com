import type { ReactNode } from "react";

function isElementStart(char: string): boolean {
  return char >= "A" && char <= "Z";
}

/**
 * Render a formula with subscripts (H2O → H₂O). Hydrate multipliers after · stay
 * on the baseline (CuSO4·5H2O).
 */
export function FormulaDisplay({
  formula,
  className,
}: {
  formula: string;
  className?: string;
}) {
  const nodes: ReactNode[] = [];
  let i = 0;
  let afterHydrateDot = false;

  while (i < formula.length) {
    const ch = formula[i];

    if (ch === "·" || ch === "•") {
      nodes.push(
        <span key={`${i}-dot`} className="px-0.5">
          ·
        </span>,
      );
      afterHydrateDot = true;
      i += 1;
      continue;
    }

    if (/\d/.test(ch)) {
      let j = i;
      while (j < formula.length && /\d/.test(formula[j])) j += 1;
      const digits = formula.slice(i, j);
      if (afterHydrateDot) {
        nodes.push(<span key={`${i}-hyd`}>{digits}</span>);
        afterHydrateDot = false;
      } else {
        nodes.push(<sub key={`${i}-sub`}>{digits}</sub>);
      }
      i = j;
      continue;
    }

    afterHydrateDot = false;

    if (isElementStart(ch)) {
      let j = i + 1;
      if (j < formula.length && formula[j] >= "a" && formula[j] <= "z") j += 1;
      nodes.push(<span key={`${i}-el`}>{formula.slice(i, j)}</span>);
      i = j;
      continue;
    }

    nodes.push(<span key={`${i}-ch`}>{ch}</span>);
    i += 1;
  }

  return <span className={className}>{nodes}</span>;
}
