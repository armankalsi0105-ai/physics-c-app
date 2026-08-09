/**
 * Inject progressive hints objects onto every problem that lacks them.
 * Run: node scripts/inject-hints.mjs && npm run sync:curriculum
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dataPath = path.join(root, 'data', 'curriculum.json')

function looksLikeEquation(s) {
  return /[=∫Σ∑Δ]/.test(s) || /\b(d\/dx|dx\/dt|dv\/dt)\b/.test(s)
}

function extractFormula(problem, concept) {
  const blob = `${concept} ${problem.prompt} ${problem.hint}`.toLowerCase()
  if (/average velocity|v_?avg|slope of x/.test(blob))
    return 'v_avg = Δx / Δt'
  if (/instantaneous|dx\/dt/.test(blob)) return 'v(t) = dx/dt'
  if (/acceleration|dv\/dt/.test(blob)) return 'a = dv/dt'
  if (/slope/.test(blob)) return 'm = (y₂ − y₁)/(x₂ − x₁)'
  if (/power rule/.test(blob)) return 'd/dx [xⁿ] = n xⁿ⁻¹'
  if (/product rule/.test(blob)) return "(uv)′ = u′v + uv′"
  if (/chain rule/.test(blob)) return 'd/dx [f(g(x))] = f′(g(x)) · g′(x)'
  if (/∫|integrat|area under/.test(blob)) return 'Δx = ∫ v dt'
  if (/newton|Σf|net force|\bma\b/.test(blob)) return 'ΣF = ma'
  if (/work.?energy|Δk/.test(blob)) return 'W_net = ΔK'
  if (/impulse|momentum/.test(blob)) return 'J = ∫ F dt = Δp'
  if (/spring|hooke/.test(blob)) return 'F = −kx ; U = ½kx²'
  const step = (problem.steps || []).find(looksLikeEquation)
  return step || 'Write the governing equation linking givens to the unknown.'
}

function buildHints(problem) {
  if (problem.hints?.concept) return problem.hints
  const concept =
    (problem.hint || '').trim() ||
    'Identify what physical/math quantity the question asks for.'
  const formula = extractFormula(problem, concept)
  const step0 = problem.steps?.[0]
  const setup = step0
    ? `Start: ${step0}. Substitute into ${formula.split(';')[0].trim()}.`
    : `List knowns, apply ${formula.split(';')[0].trim()}, solve for the unknown.`
  return { concept, formula, setup }
}

function walkProblems(node, fn) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) walkProblems(item, fn)
    return
  }
  if (node.id && node.prompt && node.answer !== undefined && node.hint) {
    fn(node)
  }
  for (const v of Object.values(node)) walkProblems(v, fn)
}

const raw = fs.readFileSync(dataPath, 'utf8')
const data = JSON.parse(raw)
let count = 0
walkProblems(data, (p) => {
  if (!p.hints) {
    p.hints = buildHints(p)
    count++
  }
})
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n')
fs.copyFileSync(dataPath, path.join(root, 'src', 'data', 'curriculum.json'))
console.log(`Injected hints on ${count} problems; synced to src/data.`)
