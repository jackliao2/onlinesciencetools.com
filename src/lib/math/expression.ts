type ExpressionFunction = (...args: number[]) => number;

const FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  abs: Math.abs,
  sqrt: Math.sqrt,
  exp: Math.exp,
  // Classroom convention: log is base 10; use ln for natural log.
  log: Math.log10,
  log10: Math.log10,
  ln: Math.log,
  pow: Math.pow,
  min: Math.min,
  max: Math.max,
};

type Token =
  | { type: "number"; value: number }
  | { type: "identifier"; value: string }
  | { type: "operator"; value: "+" | "-" | "*" | "/" | "^" }
  | { type: "leftParen" | "rightParen" | "comma" };

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const rest = expression.slice(i);
    if (/^\s/.test(rest)) {
      i += 1;
      continue;
    }
    const number = rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/i);
    if (number) {
      tokens.push({ type: "number", value: Number(number[0]) });
      i += number[0].length;
      continue;
    }
    const identifier = rest.match(/^[A-Za-z_]+/);
    if (identifier) {
      tokens.push({ type: "identifier", value: identifier[0].toLowerCase() });
      i += identifier[0].length;
      continue;
    }
    const char = expression[i];
    if (char === "(") tokens.push({ type: "leftParen" });
    else if (char === ")") tokens.push({ type: "rightParen" });
    else if (char === ",") tokens.push({ type: "comma" });
    else if ("+-*/^".includes(char)) {
      tokens.push({ type: "operator", value: char as "+" | "-" | "*" | "/" | "^" });
    } else {
      throw new Error(`Unsupported character: ${char}`);
    }
    i += 1;
  }
  return tokens;
}

export function compileExpression(
  expression: string,
  variables: string[] = ["x", "y"],
): ExpressionFunction {
  if (!expression.trim()) {
    throw new Error("Expression cannot be empty.");
  }
  const tokens = tokenize(expression);
  const variableIndices = new Map(
    variables.map((variable, index) => [variable.toLowerCase(), index]),
  );
  let position = 0;
  const peek = () => tokens[position];
  const take = () => tokens[position++];

  const parseExpression = (): ExpressionFunction => {
    let left = parseTerm();
    while (peek()?.type === "operator" && (peek() as Token & { value: string }).value.match(/[+-]/)) {
      const operator = (take() as { value: "+" | "-" }).value;
      const right = parseTerm();
      const previous = left;
      left = operator === "+" ? (...args) => previous(...args) + right(...args) : (...args) => previous(...args) - right(...args);
    }
    return left;
  };

  const parseTerm = (): ExpressionFunction => {
    let left = parseUnary();
    while (peek()?.type === "operator" && (peek() as Token & { value: string }).value.match(/[*/]/)) {
      const operator = (take() as { value: "*" | "/" }).value;
      const right = parseUnary();
      const previous = left;
      left = operator === "*" ? (...args) => previous(...args) * right(...args) : (...args) => previous(...args) / right(...args);
    }
    return left;
  };

  const parseUnary = (): ExpressionFunction => {
    if (peek()?.type === "operator" && (peek() as Token & { value: string }).value.match(/[+-]/)) {
      const operator = (take() as { value: "+" | "-" }).value;
      const operand = parseUnary();
      return operator === "+" ? operand : (...args) => -operand(...args);
    }
    return parsePower();
  };

  const parsePower = (): ExpressionFunction => {
    const base = parsePrimary();
    if (peek()?.type !== "operator" || (peek() as { value: string }).value !== "^") return base;
    take();
    const exponent = parseUnary();
    return (...args) => base(...args) ** exponent(...args);
  };

  const parsePrimary = (): ExpressionFunction => {
    const token = take();
    if (!token) throw new Error("Unexpected end of expression.");
    if (token.type === "number") return () => token.value;
    if (token.type === "leftParen") {
      const nested = parseExpression();
      if (take()?.type !== "rightParen") throw new Error("Expected closing parenthesis.");
      return nested;
    }
    if (token.type !== "identifier") throw new Error("Expected a number, variable, or function.");

    if (token.value === "pi") return () => Math.PI;
    if (token.value === "e") return () => Math.E;
    const variableIndex = variableIndices.get(token.value);
    if (variableIndex !== undefined) return (...args) => args[variableIndex];
    const fn = FUNCTIONS[token.value];
    if (!fn) throw new Error(`Unknown identifier: ${token.value}`);
    if (take()?.type !== "leftParen") throw new Error(`Expected parentheses after ${token.value}.`);
    const args: ExpressionFunction[] = [];
    if (peek()?.type !== "rightParen") {
      args.push(parseExpression());
      while (peek()?.type === "comma") {
        take();
        args.push(parseExpression());
      }
    }
    if (take()?.type !== "rightParen") throw new Error("Expected closing parenthesis.");
    return (...values) => fn(...args.map((arg) => arg(...values)));
  };

  const compiled = parseExpression();
  if (position !== tokens.length) throw new Error("Unexpected token in expression.");
  return compiled;
}
