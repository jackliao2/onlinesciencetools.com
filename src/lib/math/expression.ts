const ALLOWED_IDENTIFIERS = new Set([
  "x",
  "y",
  "t",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "abs",
  "sqrt",
  "exp",
  "log",
  "log10",
  "ln",
  "pow",
  "min",
  "max",
  "pi",
  "e",
]);

export function compileExpression(
  expression: string,
  variables: string[] = ["x", "y"],
): (...args: number[]) => number {
  const cleaned = expression.trim().replace(/\^/g, "**");
  if (!cleaned) {
    throw new Error("Expression cannot be empty.");
  }

  if (!/^[\d\s+\-*/().,a-zA-Z_^]+$/.test(cleaned.replace(/\*\*/g, ""))) {
    throw new Error("Expression contains unsupported characters.");
  }

  const identifiers = cleaned.match(/[A-Za-z_]+/g) ?? [];
  const allowed = new Set([
    ...ALLOWED_IDENTIFIERS,
    ...variables.map((v) => v.toLowerCase()),
  ]);

  for (const id of identifiers) {
    if (!allowed.has(id.toLowerCase())) {
      throw new Error(`Unknown identifier: ${id}`);
    }
  }

  // Placeholders first so later "log" → Math.log10 cannot rewrite Math.log from ln.
  let js = cleaned
    .replace(/\blog10\b/gi, "__LOG10__")
    .replace(/\bln\b/gi, "__LN__")
    // Classroom convention: log = log10; use ln for natural log.
    .replace(/\blog\b/gi, "__LOG10__")
    .replace(/\bsin\b/gi, "Math.sin")
    .replace(/\bcos\b/gi, "Math.cos")
    .replace(/\btan\b/gi, "Math.tan")
    .replace(/\basin\b/gi, "Math.asin")
    .replace(/\bacos\b/gi, "Math.acos")
    .replace(/\batan\b/gi, "Math.atan")
    .replace(/\babs\b/gi, "Math.abs")
    .replace(/\bsqrt\b/gi, "Math.sqrt")
    .replace(/\bexp\b/gi, "Math.exp")
    .replace(/\bpow\b/gi, "Math.pow")
    .replace(/\bmin\b/gi, "Math.min")
    .replace(/\bmax\b/gi, "Math.max")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/gi, "Math.E")
    .replace(/__LOG10__/g, "Math.log10")
    .replace(/__LN__/g, "Math.log");

  for (const variable of variables) {
    const re = new RegExp(`\\b${variable}\\b`, "gi");
    js = js.replace(re, variable.toLowerCase());
  }

  const params = variables.map((v) => v.toLowerCase()).join(", ");
  return new Function(params, `"use strict"; return (${js});`) as (
    ...args: number[]
  ) => number;
}
