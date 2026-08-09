/**
 * Tiny expression evaluator for the polynomial/trig expressions used in
 * curriculum graph configs. Supports an optional set of named constants
 * (e.g. { k: 50 }) and returns NaN instead of throwing on bad input.
 */
export function evalExpression(
  expression: string,
  x: number,
  consts: Record<string, number> = {},
): number {
  let expr = expression
    .replace(/\^/g, '**')
    .replace(/(\d)([a-zA-Z(])/g, '$1*$2')
    .replace(/π/g, 'Math.PI')
    .replace(/\bpi\b/gi, 'Math.PI')
    .replace(/\bsin\b/g, 'Math.sin')
    .replace(/\bcos\b/g, 'Math.cos')
    .replace(/\btan\b/g, 'Math.tan')
    .replace(/\bexp\b/g, 'Math.exp')
    .replace(/\bsqrt\b/g, 'Math.sqrt')
    .replace(/\babs\b/g, 'Math.abs')

  for (const [name, value] of Object.entries(consts)) {
    if (!Number.isFinite(value)) continue
    expr = expr.replace(new RegExp(`\\b${name}\\b`, 'g'), `(${value})`)
  }

  expr = expr.replace(/\bx\b/g, `(${x})`).replace(/\bt\b/g, `(${x})`)

  try {
    const fn = new Function(`"use strict"; return (${expr});`)
    const y = fn()
    return typeof y === 'number' && Number.isFinite(y) ? y : NaN
  } catch {
    return NaN
  }
}

export function sampleExpression(
  expression: string,
  domain: [number, number],
  samples = 60,
  consts: Record<string, number> = {},
) {
  const [a, b] = domain
  const out: { x: number; y: number }[] = []
  for (let i = 0; i <= samples; i++) {
    const x = a + ((b - a) * i) / samples
    const y = evalExpression(expression, x, consts)
    if (Number.isFinite(y)) {
      out.push({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) })
    }
  }
  return out
}
