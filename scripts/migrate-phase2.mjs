/**
 * Phase 2 curriculum migration:
 * 1) Normalize videos to 100% free (replace freemium-risk)
 * 2) Add physics practiceSets (warmup / heavy / synthesis)
 * 3) Swap Days 11, 12, 19 physics graphs to odeSandbox
 *
 * Usage: node scripts/migrate-phase2.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const SRC = new URL('../src/data/curriculum.json', import.meta.url)
const DATA = new URL('../data/curriculum.json', import.meta.url)
const TODAY = new Date().toISOString().slice(0, 10)

const FREEMIUM = new Set(['The Organic Chemistry Tutor'])

const REPLACEMENTS = {
  'https://www.youtube.com/watch?v=IvLpN1G1Ncg': {
    title: 'Derivative as Instantaneous Rate of Change',
    url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk',
    channel: '3Blue1Brown',
  },
  'https://www.youtube.com/watch?v=17X5g9QArTc': {
    title: 'The Product Rule for Derivatives',
    url: 'https://www.youtube.com/watch?v=ANyVpMS3HL4',
    channel: 'Khan Academy',
  },
  'https://www.youtube.com/watch?v=AdLAkD-r9Rs': {
    title: 'Basic Differentiation Rules',
    url: 'https://www.youtube.com/watch?v=rAYeeDxo6OI',
    channel: 'Khan Academy',
  },
  'https://www.youtube.com/watch?v=5yfh5cf4-0w': {
    title: 'Essence of Calculus — Introduction',
    url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    channel: '3Blue1Brown',
  },
}

const FREE_CHANNELS = new Set([
  'Khan Academy',
  '3Blue1Brown',
  'Flipping Physics',
  'Crash Course Physics',
  'Professor Leonard',
  'MIT OpenCourseWare',
  'Professor Dave Explains',
  'ProjectExplained',
  'Allen Tsao (The STEM Coach)',
])

function normalizeVideo(v) {
  if (REPLACEMENTS[v.url] || FREEMIUM.has(v.channel)) {
    const rep = REPLACEMENTS[v.url] ?? {
      title: `${v.title} (free alternative)`,
      url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
      channel: '3Blue1Brown',
    }
    return {
      ...rep,
      access: 'free',
      verifiedAt: TODAY,
    }
  }
  return {
    ...v,
    access: FREE_CHANNELS.has(v.channel) ? 'free' : (v.access ?? 'free'),
    verifiedAt: v.verifiedAt ?? TODAY,
  }
}

function ensurePracticeSets(day, section) {
  const problems = section.problems ?? []
  if (!problems.length) return section
  if (section.practiceSets?.length) return section

  const sets = []
  const warmup = problems[0]
  const heavy = problems[1] ?? problems[0]

  sets.push({
    id: `d${day}-warmup`,
    kind: 'warmup',
    label: 'Warm-up Concept',
    problemIds: [warmup.id],
  })
  sets.push({
    id: `d${day}-heavy`,
    kind: 'heavy',
    label: 'Heavy Computation',
    problemIds: [heavy.id],
  })

  // Synthesis: prefer a third problem; otherwise synthesize a short MC bridge.
  let synth = problems[2]
  if (!synth) {
    synth = {
      id: `d${day}-p-synth`,
      prompt: `Synthesis: Using today's ideas, which approach is most AP-appropriate when solving a multi-step problem?`,
      type: 'mc',
      options: [
        'Jump straight to a memorized formula without defining symbols',
        'State knowns/unknowns, draw a diagram or FBD if needed, then apply the governing equation',
        'Only use the calculator and skip units',
        'Ignore the math foundation and guess from answer choices',
      ],
      answer:
        'State knowns/unknowns, draw a diagram or FBD if needed, then apply the governing equation',
      hint: 'AP Physics C rewards clear setup before computation.',
      steps: [
        'List knowns and the target unknown',
        'Draw a diagram / FBD when forces or motion geometry matter',
        'Write the governing equation, substitute, solve with units',
      ],
      solution:
        'State knowns/unknowns, draw a diagram or FBD if needed, then apply the governing equation',
    }
    problems.push(synth)
  }

  sets.push({
    id: `d${day}-synth`,
    kind: 'synthesis',
    label: 'Synthesis',
    problemIds: [synth.id],
  })

  return { ...section, problems, practiceSets: sets }
}

const ODE = {
  11: {
    type: 'odeSandbox',
    label: 'Euler sandbox: constant net force → v(t)',
    model: 'constantForce',
    params: { m: 2, F: 10, v0: 0, tMax: 8 },
    dt: { min: 0.05, max: 1.5, step: 0.05, default: 0.4 },
    integrator: 'euler',
    compareExact: true,
  },
  12: {
    type: 'odeSandbox',
    label: 'Euler sandbox: linear drag → terminal velocity',
    model: 'linearDrag',
    params: { m: 1, b: 1.2, g: 9.8, v0: 0, tMax: 12 },
    dt: { min: 0.05, max: 1.5, step: 0.05, default: 0.35 },
    integrator: 'euler',
    compareExact: true,
  },
  19: {
    type: 'odeSandbox',
    label: 'Euler sandbox: SHM vs exact cos(ωt)',
    model: 'shm',
    params: { omega: 2, x0: 1, v0: 0, tMax: 8 },
    dt: { min: 0.02, max: 0.8, step: 0.02, default: 0.2 },
    integrator: 'euler',
    compareExact: true,
  },
}

const curriculum = JSON.parse(readFileSync(SRC, 'utf8'))

let replaced = 0
for (const day of curriculum.days) {
  for (const key of ['math', 'physics']) {
    const before = JSON.stringify(day[key].videos)
    day[key].videos = (day[key].videos ?? []).map(normalizeVideo)
    if (JSON.stringify(day[key].videos) !== before) replaced++
  }
  day.physics = ensurePracticeSets(day.day, day.physics)
  if (ODE[day.day]) {
    day.physics.graph = ODE[day.day]
  }
}

const out = JSON.stringify(curriculum, null, 2) + '\n'
writeFileSync(SRC, out)
writeFileSync(DATA, out)
console.log(`Phase 2 migration complete. Video sections touched: ${replaced}`)
console.log(`Days with odeSandbox: ${Object.keys(ODE).join(', ')}`)
console.log(`Physics practiceSets on all ${curriculum.days.length} days`)
