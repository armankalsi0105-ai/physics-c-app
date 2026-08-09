import { getConceptForDay } from '@/data/knowledgeGraph'
import type { MisconceptionTag, ProgressState } from '@/lib/types'

export type MisconceptionHint = {
  tag: MisconceptionTag
  label: string
  hint: string
}

/** Day-specific misconception hints keyed by day number. */
export const DAY_MISCONCEPTION_HINTS: Record<number, MisconceptionHint[]> = {
  1: [
    {
      tag: 'limits',
      label: 'Slope vs. secant',
      hint: 'Slope is rise/run on a tiny interval — not the whole chord.',
    },
  ],
  2: [
    {
      tag: 'limits',
      label: 'Limit notation',
      hint: 'The limit describes approach, not the value at the point.',
    },
  ],
  3: [
    {
      tag: 'chain_rule',
      label: 'Power rule',
      hint: 'Bring down the exponent, then reduce it by one.',
    },
    {
      tag: 'units',
      label: 'Units on derivatives',
      hint: 'd(position)/dt has units of velocity (m/s).',
    },
  ],
  4: [
    {
      tag: 'product_rule',
      label: 'Product rule',
      hint: '(fg)′ = f′g + fg′ — differentiate each factor once.',
    },
  ],
  5: [
    {
      tag: 'chain_rule',
      label: 'Chain rule',
      hint: 'Differentiate the outer function, multiply by inner derivative.',
    },
    {
      tag: 'vectors',
      label: '2D components',
      hint: 'Split motion into independent x and y equations.',
    },
  ],
  6: [
    {
      tag: 'vectors',
      label: 'Components',
      hint: 'Use cos for adjacent, sin for opposite relative to the angle.',
    },
  ],
  7: [
    {
      tag: 'vectors',
      label: 'Dot product sign',
      hint: 'W = F·d cos θ — only the parallel component does work.',
    },
    {
      tag: 'sign_error',
      label: 'Work sign',
      hint: 'Positive work adds energy; friction does negative work.',
    },
  ],
  8: [
    {
      tag: 'vectors',
      label: 'Cross product direction',
      hint: 'Use the right-hand rule: τ = r × F.',
    },
  ],
  9: [
    {
      tag: 'integrals',
      label: '+C constant',
      hint: 'Indefinite integrals need +C — it represents family of solutions.',
    },
  ],
  10: [
    {
      tag: 'integrals',
      label: 'Definite integral bounds',
      hint: '∫ₐᵇ f(x) dx = F(b) − F(a) — evaluate at upper minus lower.',
    },
    {
      tag: 'units',
      label: 'Work units',
      hint: 'Work from ∫F dx has units J = N·m.',
    },
  ],
  11: [
    {
      tag: 'fbd',
      label: 'Free-body diagram',
      hint: 'Draw only forces ON the object — not forces it exerts.',
    },
    {
      tag: 'sign_error',
      label: 'Sign conventions',
      hint: 'Pick a positive direction and stick with it for all forces.',
    },
  ],
  12: [
    {
      tag: 'integrals',
      label: 'Separable ODEs',
      hint: 'Separate variables: ∫dv/(g−bv/m) = ∫dt.',
    },
  ],
  13: [
    {
      tag: 'energy',
      label: 'Work–energy',
      hint: 'W_net = ΔK — only net work changes kinetic energy.',
    },
  ],
  14: [
    {
      tag: 'energy',
      label: 'Conservative forces',
      hint: 'F = −dU/dx — force points toward lower potential energy.',
    },
  ],
  15: [
    {
      tag: 'momentum',
      label: 'Impulse',
      hint: 'J = ∫F dt = Δp — area under F–t graph equals momentum change.',
    },
  ],
  16: [
    {
      tag: 'integrals',
      label: 'Center of mass',
      hint: 'x_cm = (1/M)∫ x dm — integrate over the mass distribution.',
    },
  ],
  17: [
    {
      tag: 'rotation',
      label: 'Moment of inertia',
      hint: 'I = ∫ r² dm — farther mass contributes more to I.',
    },
  ],
  18: [
    {
      tag: 'rotation',
      label: 'Torque & α',
      hint: 'Στ = Iα — rotational analog of ΣF = ma.',
    },
  ],
  19: [
    {
      tag: 'integrals',
      label: 'SHM ODE',
      hint: 'd²x/dt² = −ω²x has solution x = A cos(ωt + φ).',
    },
  ],
  20: [
    {
      tag: 'general',
      label: 'Mixed review',
      hint: 'Identify whether the problem needs a derivative, integral, or both.',
    },
  ],
}

const PROMPT_TAG_PATTERNS: [RegExp, MisconceptionTag][] = [
  [/chain|composite|outer.*inner/i, 'chain_rule'],
  [/product.*rule|fg.*prime/i, 'product_rule'],
  [/sign|direction|negative/i, 'sign_error'],
  [/free.?body|fbd|normal force|friction/i, 'fbd'],
  [/unit|dimension|joule|newton|meter/i, 'units'],
  [/limit|approach|instantaneous/i, 'limits'],
  [/energy|potential|kinetic|conserv/i, 'energy'],
  [/momentum|impulse|collision/i, 'momentum'],
  [/torque|angular|inertia|rotation/i, 'rotation'],
  [/vector|component|dot|cross/i, 'vectors'],
  [/integral|antideriv|area under/i, 'integrals'],
]

/** Infer a misconception tag from a problem prompt or reflection text. */
export function inferMisconception(
  day: number,
  prompt: string,
): MisconceptionTag {
  const dayHints = DAY_MISCONCEPTION_HINTS[day] ?? []
  const lower = prompt.toLowerCase()
  for (const hint of dayHints) {
    if (lower.includes(hint.label.toLowerCase().split(' ')[0])) {
      return hint.tag
    }
  }
  for (const [pattern, tag] of PROMPT_TAG_PATTERNS) {
    if (pattern.test(prompt)) return tag
  }
  const concept = getConceptForDay(day)
  if (concept?.id === 'fbd') return 'fbd'
  if (concept?.id === 'momentum') return 'momentum'
  if (concept?.id === 'shm') return 'integrals'
  return 'general'
}

export type FocusRecommendation = {
  day: number
  tag: MisconceptionTag
  label: string
  reason: string
}

/** Recommend a day + misconception to focus on from progress state. */
export function recommendFocus(state: ProgressState): FocusRecommendation | null {
  const counts = state.adaptive.misconceptionCounts
  const sorted = (Object.entries(counts) as [MisconceptionTag, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])

  if (sorted.length > 0) {
    const [tag] = sorted[0]
    const dayEntry = Object.entries(DAY_MISCONCEPTION_HINTS).find(([, hints]) =>
      hints.some((h) => h.tag === tag),
    )
    const day = dayEntry ? Number(dayEntry[0]) : state.activeDay
    const hint = dayEntry?.[1].find((h) => h.tag === tag)
    return {
      day,
      tag,
      label: hint?.label ?? tag.replace(/_/g, ' '),
      reason: `You've missed ${sorted[0][1]} question(s) tagged "${tag.replace(/_/g, ' ')}".`,
    }
  }

  const incomplete = state.completedDays.length
  const nextDay = Math.min(20, incomplete + 1)
  if (nextDay <= 20 && !state.completedDays.includes(nextDay)) {
    return {
      day: nextDay,
      tag: 'general',
      label: 'Continue sequence',
      reason: `Day ${nextDay} is your next unlocked lesson.`,
    }
  }

  return null
}

export type FocusChip = {
  text: string
  tag: MisconceptionTag | null
  day: number
}

/** Short chip label for today's adaptive focus. */
export function getTodaysFocusChip(day: number, state: ProgressState): FocusChip {
  const focusTags = state.adaptive.focusTags
  if (focusTags.length > 0) {
    const tag = focusTags[0]
    const hints = DAY_MISCONCEPTION_HINTS[day] ?? []
    const match = hints.find((h) => h.tag === tag)
    return {
      text: match ? `Focus: ${match.label}` : `Focus: ${tag.replace(/_/g, ' ')}`,
      tag,
      day,
    }
  }

  const concept = getConceptForDay(day)
  if (concept) {
    return {
      text: `Today: ${concept.label}`,
      tag: null,
      day,
    }
  }

  return { text: `Day ${day}`, tag: null, day }
}
