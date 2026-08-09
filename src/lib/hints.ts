import type { Problem } from '@/lib/types'

export type ProgressiveHints = {
  concept: string
  formula: string
  setup: string
}

const ABBREV: [RegExp, string][] = [
  [/\bvs\./gi, 'vs‧'],
  [/\be\.g\./gi, 'eg‧'],
  [/\bi\.e\./gi, 'ie‧'],
  [/\bFig\./gi, 'Fig‧'],
  [/\bEq\./gi, 'Eq‧'],
  [/\bapprox\./gi, 'approx‧'],
  [/\bDr\./gi, 'Dr‧'],
  [/\bMr\./gi, 'Mr‧'],
  [/\bMrs\./gi, 'Mrs‧'],
  [/\bNo\./gi, 'No‧'],
]

function protectAbbreviations(s: string) {
  return ABBREV.reduce((acc, [re, rep]) => acc.replace(re, rep), s)
}

function restoreAbbreviations(s: string) {
  return s
    .replace(/vs‧/gi, 'vs.')
    .replace(/eg‧/gi, 'e.g.')
    .replace(/ie‧/gi, 'i.e.')
    .replace(/Fig‧/gi, 'Fig.')
    .replace(/Eq‧/gi, 'Eq.')
    .replace(/approx‧/gi, 'approx.')
    .replace(/Dr‧/gi, 'Dr.')
    .replace(/Mr‧/gi, 'Mr.')
    .replace(/Mrs‧/gi, 'Mrs.')
    .replace(/No‧/gi, 'No.')
}

/** Split into sentences without breaking on abbreviations like "vs." */
function splitSentences(text: string): string[] {
  const protected_ = protectAbbreviations(text)
  return protected_
    .split(/(?<=[.!?])\s+/)
    .map((p) => restoreAbbreviations(p.trim()))
    .filter(Boolean)
}

function looksLikeEquation(s: string) {
  return /[=∫Σ∑Δ]/.test(s) || /\b(d\/dx|dx\/dt|dv\/dt)\b/.test(s)
}

/** Pull the most formula-like fragment from steps / hint. */
function extractFormula(problem: Problem, concept: string): string {
  const candidates = [
    ...problem.steps.filter(looksLikeEquation),
    concept,
    problem.solution,
  ]

  for (const c of candidates) {
    // Prefer an explicit named formula: "v_avg = ..."
    const named = c.match(
      /\b([a-zA-Z][_a-zA-Z0-9]*(?:\([^)]*\))?)\s*=\s*[^=.]{2,60}/,
    )
    if (named && looksLikeEquation(named[0])) return named[0].trim()
  }

  // Keyword → standard AP formulas
  const blob = `${concept} ${problem.prompt} ${problem.hint}`.toLowerCase()
  if (/average velocity|v_?avg|slope of x\s*vs/.test(blob)) {
    return 'v_avg = Δx / Δt = (x_f − x_i) / (t_f − t_i)'
  }
  if (/instantaneous velocity|dx\/dt/.test(blob)) {
    return 'v(t) = dx/dt'
  }
  if (/acceleration|dv\/dt|d²x/.test(blob)) {
    return 'a(t) = dv/dt = d²x/dt²'
  }
  if (/slope/.test(blob) && /line|linear|graph/.test(blob)) {
    return 'm = (y₂ − y₁) / (x₂ − x₁)'
  }
  if (/power rule|derivative of/.test(blob)) {
    return "d/dx [xⁿ] = n xⁿ⁻¹"
  }
  if (/product rule/.test(blob)) {
    return "(uv)′ = u′v + uv′"
  }
  if (/chain rule/.test(blob)) {
    return 'd/dx [f(g(x))] = f′(g(x)) · g′(x)'
  }
  if (/∫|integrat|area under|displacement from/.test(blob)) {
    return 'Δx = ∫_{t₁}^{t₂} v(t) dt'
  }
  if (/newton|Σf|net force|\bma\b/.test(blob)) {
    return 'ΣF = ma'
  }
  if (/work.?energy|Δk/.test(blob)) {
    return 'W_net = ΔK'
  }
  if (/impulse|momentum change|∫\s*f/.test(blob)) {
    return 'J = ∫ F dt = Δp'
  }
  if (/spring|hooke|\bkx\b/.test(blob)) {
    return 'F = −kx ,  U_s = ½kx²'
  }

  const step0 = problem.steps[0]
  if (step0 && looksLikeEquation(step0)) return step0

  return 'Write the governing equation that links the given quantities.'
}

function buildSetup(problem: Problem, formula: string): string {
  const step0 = problem.steps[0]
  const step1 = problem.steps[1]

  if (step0 && step1) {
    return `${step0}. Then ${step1.replace(/^[A-Z]/, (c) => c.toLowerCase())}`
  }
  if (step0) {
    return `Start here: ${step0}. Substitute into ${formula.split(',')[0].trim()}.`
  }
  return `List knowns, plug into ${formula.split(',')[0].trim()}, and solve for the unknown.`
}

/** Build 3-tier hints from explicit problem.hints or smart inference. */
export function getProgressiveHints(problem: Problem): ProgressiveHints {
  if (problem.hints) return problem.hints

  const raw = problem.hint?.trim() || 'Think about the governing relationship.'
  const parts = splitSentences(raw)

  // Only treat as multi-sentence tiers when we truly have 3+ real sentences
  // AND later sentences look like formula/setup (not fragments like "t.").
  if (parts.length >= 3 && parts[1].length > 4 && parts[2].length > 8) {
    return {
      concept: parts[0],
      formula: parts[1],
      setup: parts.slice(2).join(' '),
    }
  }

  // One solid concept sentence (the usual curriculum case), or a bad split
  // like "…x vs." / "t." — keep the full hint as the concept.
  const concept =
    parts.length >= 2 && parts[1].length <= 4
      ? raw
      : parts[0] || raw

  const formula = extractFormula(problem, concept)
  const setup = buildSetup(problem, formula)

  return { concept, formula, setup }
}
