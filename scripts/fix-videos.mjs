// Replaces all curriculum videos with oEmbed-verified assignments.
// Usage: node scripts/fix-videos.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const POOL = {
  // Math
  essence1: { id: 'WUvTyaaNkzM', title: 'The Essence of Calculus', channel: '3Blue1Brown' },
  essence2: { id: '9vKqVkMQHKk', title: 'The Paradox of the Derivative', channel: '3Blue1Brown' },
  essence3: { id: 'S0_qX4VJhMQ', title: 'Derivative Formulas Through Geometry', channel: '3Blue1Brown' },
  essence4: { id: 'YG15m2VwSjA', title: 'Visualizing the Chain Rule and Product Rule', channel: '3Blue1Brown' },
  essence7: { id: 'kfF40MiS7zA', title: "Limits, L'Hôpital's Rule, and Epsilon-Delta Definitions", channel: '3Blue1Brown' },
  essence8: { id: 'rfG8ce4nNh0', title: 'Integration and the Fundamental Theorem of Calculus', channel: '3Blue1Brown' },
  taylor: { id: '3d6DsjIBzJ4', title: 'Taylor Series', channel: '3Blue1Brown' },
  vectors3b1b: { id: 'fNk_zzaMoSs', title: 'Vectors | Essence of Linear Algebra', channel: '3Blue1Brown' },
  dot3b1b: { id: 'LyGKycYT2v0', title: 'Dot Products and Duality', channel: '3Blue1Brown' },
  cross3b1b: { id: 'eu6i7WJeinw', title: 'Cross Products', channel: '3Blue1Brown' },
  khanSlope: { id: 'ANyVpMS3HL4', title: 'Derivative as Slope of a Tangent Line', channel: 'Khan Academy' },
  khanLimits: { id: 'riXcZT2ICjA', title: 'Introduction to Limits', channel: 'Khan Academy' },
  khanPower: { id: 'H-v4oraDjuM', title: 'Power Rule (with Rewriting the Expression)', channel: 'Khan Academy' },
  khanQuotient: { id: 'WqzY3xibFL8', title: 'Quotient Rule | Derivative Rules', channel: 'Khan Academy' },
  khanTrig1: { id: 'F21S9Wpi0y8', title: 'Basic Trigonometry (SOH CAH TOA)', channel: 'Khan Academy' },
  khanTrig2: { id: 'G-T_6hCdMQc', title: 'Basic Trigonometry II', channel: 'Khan Academy' },
  khanVectors: { id: 'ihNZlp7iUHE', title: 'Intro to Vectors & Scalars', channel: 'Khan Academy' },
  khanUnitVectors: { id: '2QjdcVTgTTA', title: 'Unit Vectors and Engineering Notation', channel: 'Khan Academy' },
  octProduct: { id: '17X5g9QArTc', title: 'Product Rule for Derivatives', channel: 'The Organic Chemistry Tutor' },
  octDerivs: { id: '5yfh5cf4-0w', title: 'Calculus 1 – Derivatives (Full Lesson)', channel: 'The Organic Chemistry Tutor' },
  octFormulas: { id: 'AdLAkD-r9Rs', title: 'Differentiation Formulas', channel: 'The Organic Chemistry Tutor' },
  octBasics: { id: 'IvLpN1G1Ncg', title: 'Basic Differentiation Rules', channel: 'The Organic Chemistry Tutor' },
  // Physics
  cc1: { id: 'ZM8ECpBuQYE', title: 'Motion in a Straight Line', channel: 'Crash Course Physics' },
  cc5: { id: 'kKKM8Y-u7ds', title: "Newton's Laws", channel: 'Crash Course Physics' },
  cc6: { id: 'fo_pmp5rtzo', title: 'Friction', channel: 'Crash Course Physics' },
  cc9: { id: 'w4QFJb9a8vo', title: 'Work, Energy, and Power', channel: 'Crash Course Physics' },
  cc10: { id: 'Y-QOfc2XqOk', title: 'Collisions', channel: 'Crash Course Physics' },
  cc11: { id: 'fmXFWi-WfyU', title: 'Rotational Motion', channel: 'Crash Course Physics' },
  cc16: { id: 'jxstE6A_CYQ', title: 'Simple Harmonic Motion', channel: 'Crash Course Physics' },
  fpDeriv: { id: '2Efn8ruX60Q', title: 'Derivative Introduction (Kinematics)', channel: 'Flipping Physics' },
  fpVelGraph: { id: 'RkbIiUbFxSQ', title: 'Instantaneous and Average Velocity Using a Graph', channel: 'Flipping Physics' },
  fpRotDyn1: { id: 'cFeZt_0UzVg', title: 'AP Physics C: Rotational Dynamics Review – 1 of 2', channel: 'Flipping Physics' },
  fpShm: { id: 'nEsqBVtXRsE', title: 'AP Physics C: Simple Harmonic Motion Review', channel: 'Flipping Physics' },
  fpMomentum: { id: 'WtUbnIr7WbU', title: 'AP Physics C: Momentum, Impulse, Collisions & Center of Mass Review', channel: 'Flipping Physics' },
  tsaoDrag: { id: 'W-5aqdBitlQ', title: 'AP Physics C – Drag Forces', channel: 'Allen Tsao (The STEM Coach)' },
  peWork: { id: 'KvPb33VWY74', title: 'AP Physics C: Work, Energy & Power In-Depth Review', channel: 'ProjectExplained' },
  daveProjectile: { id: 'aY8z2qO44WA', title: 'Kinematics Part 3: Projectile Motion', channel: 'Professor Dave Explains' },
}

// day -> { math: [poolKeys], physics: [poolKeys] }
const ASSIGN = {
  1: { math: ['essence1', 'khanSlope'], physics: ['cc1', 'fpVelGraph'] },
  2: { math: ['khanLimits', 'essence7'], physics: ['fpDeriv', 'fpVelGraph'] },
  3: { math: ['khanPower', 'octBasics'], physics: ['fpDeriv', 'fpVelGraph'] },
  4: { math: ['octProduct', 'khanQuotient'], physics: ['fpVelGraph', 'cc1'] },
  5: { math: ['essence4', 'octFormulas'], physics: ['daveProjectile', 'khanUnitVectors'] },
  6: { math: ['khanTrig1', 'khanTrig2'], physics: ['khanVectors', 'vectors3b1b'] },
  7: { math: ['dot3b1b', 'vectors3b1b'], physics: ['cc9', 'peWork'] },
  8: { math: ['cross3b1b', 'dot3b1b'], physics: ['cc11', 'fpRotDyn1'] },
  9: { math: ['essence8', 'essence2'], physics: ['fpDeriv', 'fpVelGraph'] },
  10: { math: ['essence8', 'essence1'], physics: ['peWork', 'cc9'] },
  11: { math: ['essence2', 'octDerivs'], physics: ['cc5', 'cc6'] },
  12: { math: ['essence7', 'essence8'], physics: ['tsaoDrag', 'cc5'] },
  13: { math: ['essence8', 'essence2'], physics: ['peWork', 'cc9'] },
  14: { math: ['essence3', 'essence2'], physics: ['peWork', 'cc9'] },
  15: { math: ['essence8', 'essence1'], physics: ['fpMomentum', 'cc10'] },
  16: { math: ['essence8', 'essence2'], physics: ['fpMomentum', 'cc10'] },
  17: { math: ['essence8', 'cross3b1b'], physics: ['fpRotDyn1', 'cc11'] },
  18: { math: ['cross3b1b', 'dot3b1b'], physics: ['fpRotDyn1', 'cc11'] },
  19: { math: ['taylor', 'essence3'], physics: ['fpShm', 'cc16'] },
  20: { math: ['essence1', 'essence8'], physics: ['peWork', 'fpMomentum'] },
}

async function verify(id) {
  const url = `https://www.youtube.com/watch?v=${id}`
  const res = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  )
  return res.ok
}

// Verify entire pool first
let allOk = true
for (const [key, v] of Object.entries(POOL)) {
  const ok = await verify(v.id)
  if (!ok) {
    console.error(`POOL VIDEO DEAD: ${key} (${v.id})`)
    allOk = false
  }
}
if (!allOk) {
  console.error('Aborting — fix pool first.')
  process.exit(1)
}
console.log(`Pool verified: ${Object.keys(POOL).length} videos all live.`)

const toVideo = (key) => ({
  title: POOL[key].title,
  url: `https://www.youtube.com/watch?v=${POOL[key].id}`,
  channel: POOL[key].channel,
})

for (const path of ['src/data/curriculum.json', 'data/curriculum.json']) {
  const c = JSON.parse(readFileSync(path, 'utf8'))
  for (const day of c.days) {
    const a = ASSIGN[day.day]
    if (!a) continue
    day.math.videos = a.math.map(toVideo)
    day.physics.videos = a.physics.map(toVideo)
  }
  writeFileSync(path, JSON.stringify(c, null, 2))
  console.log(`Wrote ${path}`)
}
