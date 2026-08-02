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

  let js = cleaned
    .replace(/\bln\b/gi, "Math.log")
    .replace(/\blog\b/gi, "Math.log")
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
    .replace(/\be\b/gi, "Math.E");

  for (const variable of variables) {
    const re = new RegExp(`\\b${variable}\\b`, "gi");
    js = js.replace(re, variable.toLowerCase());
  }

  const params = variables.map((v) => v.toLowerCase()).join(", ");
  return new Function(params, `"use strict"; return (${js});`) as (
    ...args: number[]
  ) => number;
}
