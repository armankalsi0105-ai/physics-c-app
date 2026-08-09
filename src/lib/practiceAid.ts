import type { Problem } from '@/lib/types'

export type PracticeAid = {
  given: string[]
  find: string
  bridge: string
  pitfall: string
  units?: string
}

/** Pull useful “given / find” scaffolding from the problem prompt. */
export function buildPracticeAid(problem: Problem): PracticeAid {
  const prompt = problem.prompt
  const given: string[] = []

  // Equations: x(t) = …, v = …, F = …
  const eqMatches = prompt.matchAll(
    /\b([a-zA-Z][_a-zA-Z0-9]*(?:\([^)]*\))?)\s*=\s*([^.;!?]+)/g,
  )
  for (const m of eqMatches) {
    const expr = `${m[1]} = ${m[2].trim()}`
    if (expr.length < 80) given.push(expr)
  }

  // Time / interval windows
  const interval = prompt.match(
    /from\s+t\s*=\s*([-\d.]+)\s*to\s+t\s*=\s*([-\d.]+)\s*(s|sec)?/i,
  )
  if (interval) {
    given.push(`Time interval: t = ${interval[1]} → ${interval[2]} ${interval[3] ?? 's'}`.trim())
  }

  const atT = prompt.match(/\bat\s+t\s*=\s*([-\d.]+)\s*(s|sec)?/i)
  if (atT && !interval) {
    given.push(`Evaluate at t = ${atT[1]} ${atT[2] ?? 's'}`.trim())
  }

  // Masses, angles, speeds mentioned as “m = …” already caught; add bare facts
  const angle = prompt.match(/\b(\d+(?:\.\d+)?)\s*°/)
  if (angle) given.push(`Angle θ = ${angle[1]}°`)

  if (!given.length) {
    given.push('Read the prompt carefully and list every number + its unit.')
  }

  // What to find
  let find = 'the requested quantity'
  const findMatch = prompt.match(
    /(?:what is|find|determine|calculate|compute)\s+([^?]+)\??/i,
  )
  if (findMatch) {
    find = findMatch[1].replace(/\s+/g, ' ').trim()
  } else if (problem.type === 'mc') {
    find = 'the best choice among the options'
  }

  const blob = `${prompt} ${problem.hint}`.toLowerCase()
  let bridge =
    'Connect the physical meaning to a formula before plugging in numbers.'
  let pitfall = 'Don’t mix average and instantaneous quantities.'

  if (/average velocity|v_?avg/.test(blob)) {
    bridge =
      'Average velocity is the net change in position over the total time — the secant slope on an x–t graph, not the speedometer reading at one instant.'
    pitfall =
      'Using dx/dt when the question asks for average velocity (or vice versa).'
  } else if (/instantaneous|dx\/dt|at the instant/.test(blob)) {
    bridge =
      'Instantaneous velocity is the derivative — the tangent slope at one moment on the x–t graph.'
    pitfall = 'Using Δx/Δt over a wide interval when you need the value at one t.'
  } else if (/acceleration/.test(blob)) {
    bridge =
      'Acceleration is how velocity changes with time: a = dv/dt. On a v–t graph, that’s the slope.'
    pitfall = 'Confusing the slope of x–t (velocity) with the slope of v–t (acceleration).'
  } else if (/slope/.test(blob)) {
    bridge =
      'Slope = rise/run. In physics graphs, identify what each axis measures before interpreting the slope.'
    pitfall = 'Reading the axes wrong (e.g., treating an x–t slope as acceleration).'
  } else if (/derivative|d\/dx|power rule|product rule|chain rule/.test(blob)) {
    bridge =
      'Derivatives measure instantaneous rate of change. Apply the matching rule, then simplify.'
    pitfall = 'Forgetting the chain rule on compositions like sin(2x) or e^{3t}.'
  } else if (/integral|∫|area under|antiderivative/.test(blob)) {
    bridge =
      'Integrals accumulate change. The area under a v–t curve is displacement; under an F–t curve is impulse.'
    pitfall = 'Dropping the constant of integration or mixing definite vs indefinite integrals.'
  } else if (/force|newton|Σf|friction|normal/.test(blob)) {
    bridge =
      'Draw a free-body diagram first. Resolve into components, then write ΣF = ma for each axis.'
    pitfall = 'Missing a force (friction, tension) or using the wrong sign convention.'
  } else if (/energy|work|potential|kinetic/.test(blob)) {
    bridge =
      'Work–energy links forces to motion without always needing acceleration: W_net = ΔK.'
    pitfall = 'Including non-conservative work incorrectly in conservation statements.'
  } else if (/momentum|impulse|collision/.test(blob)) {
    bridge =
      'Impulse equals change in momentum. Isolated systems conserve total momentum.'
    pitfall = 'Assuming kinetic energy is conserved in every collision (only elastic ones).'
  }

  let units: string | undefined
  if (problem.type === 'numeric') {
    if (/m\/s\b|velocity|speed/.test(blob)) units = 'm/s'
    else if (/m\/s\^?2|acceleration/.test(blob)) units = 'm/s²'
    else if (/\bnewton|\bN\b|force/.test(blob)) units = 'N'
    else if (/\bjoule|\bJ\b|energy|work/.test(blob)) units = 'J'
    else if (/kg·m\/s|momentum|impulse/.test(blob)) units = 'kg·m/s'
    else if (/\bmeter|\bposition|\bdisplacement|\bm\b/.test(blob) && !/m\/s/.test(blob))
      units = 'm'
  }

  return { given: unique(given), find, bridge, pitfall, units }
}

function unique(items: string[]) {
  return [...new Set(items)]
}
