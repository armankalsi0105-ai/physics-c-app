/** Parse derivation / worked-example steps for the Logic Debugger. */

export type DebugStep = {
  index: number
  raw: string
  action: string
  equation: string
  vars: Record<string, string>
  explanation: string
  commonMistake: string
}

const VAR_RE = /\b([a-zA-Z][_a-zA-Z0-9]*(?:₀|₁|₂|₃|₄|₅|₆|₇|₈|₉|[0-9])*)\b/g

export function parseDebugSteps(steps: string[]): DebugStep[] {
  return steps.map((raw, index) => {
    const colon = raw.match(/^([^:]{2,40}):\s*(.+)$/)
    const action = colon ? colon[1].trim() : `Step ${index + 1}`
    const equation = colon ? colon[2].trim() : raw.trim()
    const vars: Record<string, string> = {}
    for (const m of equation.matchAll(VAR_RE)) {
      const sym = m[1]
      if (sym.length === 1 || /[_₀-₉0-9]/.test(sym)) {
        vars[sym] = vars[sym] ?? 'tracked symbol'
      }
    }
    const explanation = colon
      ? `${action}: apply this change to reach “${equation.slice(0, 60)}${equation.length > 60 ? '…' : ''}”.`
      : `Carry the algebra carefully; keep units and signs consistent.`
    const commonMistake = /sign|−|-/.test(equation)
      ? 'Watch the sign — a missing minus flips the physics story.'
      : /∫|integrat/i.test(raw)
        ? 'Forgot the constant or limits on the definite integral.'
        : 'Skipping an intermediate equation often drops a factor.'
    return { index, raw, action, equation, vars, explanation, commonMistake }
  })
}
