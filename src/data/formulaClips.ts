/**
 * Short free “go deeper” videos keyed to formula concepts.
 * Prefer ~3–7 minute free-to-watch explainers (Khan, Flipping Physics, etc.).
 */

export type FormulaClip = {
  id: string
  title: string
  url: string
  channel: string
  /** Approximate length in minutes (rounded) */
  minutes: number
  /** Match against formula / surrounding text (case-insensitive) */
  match: RegExp
  topic: string
}

export const FORMULA_CLIPS: FormulaClip[] = [
  {
    id: 'kinematics-const-a',
    title: 'The Derivative and Uniformly Accelerated Motion Equations',
    url: 'https://www.youtube.com/watch?v=3scZlMIZa50',
    channel: 'Flipping Physics',
    minutes: 7,
    topic: 'Constant-acceleration kinematics (v₀ + at, ½at²)',
    match:
      /v\(t\)\s*=\s*v[₀0].*a\s*t|x\(t\)\s*=\s*x[₀0].*(?:½|1\/2)|v\s*=\s*v[₀0]\s*\+\s*at|x\s*=\s*x[₀0]\s*\+\s*v[₀0]t|½\s*a\s*t²|1\/2\s*a\s*t|AP kinematics/i,
  },
  {
    id: 'uam-intro',
    title: 'Introduction to Uniformly Accelerated Motion',
    url: 'https://www.youtube.com/watch?v=WCR2Ki6hFf4',
    channel: 'Flipping Physics',
    minutes: 7,
    topic: 'Uniformly accelerated motion (UAM)',
    match: /uniformly accelerated|UAM equation/i,
  },
  {
    id: 'motion-derivatives',
    title: 'Motion Problems with Derivatives',
    url: 'https://www.youtube.com/watch?v=b4w0xmuOiQo',
    channel: 'Khan Academy',
    minutes: 5,
    topic: 'v = dx/dt and a = dv/dt from x(t)',
    match:
      /v\s*=\s*dx\/dt|v\(t\)\s*=\s*dx\/dt|a\s*=\s*dv\/dt|a\(t\)\s*=\s*dv\/dt|d²x\/dt²|With x\(t\) known/i,
  },
  {
    id: 'power-rule',
    title: 'Power Rule (with Rewriting the Expression)',
    url: 'https://www.youtube.com/watch?v=H-v4oraDjuM',
    channel: 'Khan Academy',
    minutes: 4,
    topic: 'Power rule',
    match: /power\s*rule|d\/d[xt]\s*\[?\s*[xt]ⁿ|n\s*[xt]ⁿ⁻|d\/dx\s*\(?\s*x\^/i,
  },
  {
    id: 'product-rule',
    title: 'Product Rule',
    url: 'https://www.youtube.com/watch?v=79ngr0Bur38',
    channel: 'Khan Academy',
    minutes: 5,
    topic: 'Product rule',
    match: /\(uv\)′|u′v\s*\+\s*uv′|product\s*rule|f′g\s*\+\s*fg′/i,
  },
  {
    id: 'quotient-rule',
    title: 'Quotient Rule',
    url: 'https://www.youtube.com/watch?v=WqzY3xibFL8',
    channel: 'Khan Academy',
    minutes: 4,
    topic: 'Quotient rule',
    match: /quotient\s*rule|\(u\/v\)′|u′v\s*-\s*uv′/i,
  },
  {
    id: 'chain-rule',
    title: 'Visualizing the Chain Rule and Product Rule',
    url: 'https://www.youtube.com/watch?v=YG15m2VwSjA',
    channel: '3Blue1Brown',
    minutes: 16,
    topic: 'Chain rule',
    match: /f′\(g|chain\s*rule|d\/dx\s*f\(g|\(f\s*∘\s*g\)/i,
  },
  {
    id: 'derivative-slope',
    title: 'Derivative as Slope of a Tangent Line',
    url: 'https://www.youtube.com/watch?v=ANyVpMS3HL4',
    channel: 'Khan Academy',
    minutes: 16,
    topic: 'Derivative as slope',
    match: /lim.*h\s*→|tangent\s*line|instantaneous\s*rate|f′\(x\)\s*=\s*lim/i,
  },
  {
    id: 'newtons-laws',
    title: "Newton's Laws",
    url: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
    channel: 'Crash Course Physics',
    minutes: 11,
    topic: 'ΣF = ma',
    match: /ΣF\s*=\s*ma|∑F\s*=\s*ma|F_?net\s*=\s*ma|Newton.?s\s*second/i,
  },
  {
    id: 'work-energy',
    title: 'Work, Energy, and Power',
    url: 'https://www.youtube.com/watch?v=w4QFJb9a8vo',
    channel: 'Crash Course Physics',
    minutes: 10,
    topic: 'Work–energy / ½mv²',
    match: /W_?net\s*=\s*ΔK|work.?energy|½\s*m\s*v²|1\/2\s*mv\^?2/i,
  },
  {
    id: 'dot-product',
    title: 'The Vector Dot Product',
    url: 'https://www.youtube.com/watch?v=0iNrGpwZwog',
    channel: 'Professor Dave Explains',
    minutes: 7,
    topic: 'Dot product / F·Δr',
    match: /A·B|F·Δr|F·dr|F\s*·\s*d|dot\s*product|cos\s*θ.*work/i,
  },
  {
    id: 'cross-torque',
    title: 'Cross Products',
    url: 'https://www.youtube.com/watch?v=eu6i7WJeinw',
    channel: '3Blue1Brown',
    minutes: 9,
    topic: 'Cross product / τ = r × F',
    match: /τ\s*=\s*r|r\s*×\s*F|cross\s*product|sin\s*θ.*torque|A\s*×\s*B/i,
  },
  {
    id: 'impulse-momentum',
    title: 'Momentum, Impulse, Collisions',
    url: 'https://www.youtube.com/watch?v=WtUbnIr7WbU',
    channel: 'Flipping Physics',
    minutes: 12,
    topic: 'J = Δp / impulse',
    match: /J\s*=\s*Δp|∫\s*F\s*dt|impulse|p\s*=\s*mv/i,
  },
  {
    id: 'shm',
    title: 'Simple Harmonic Motion',
    url: 'https://www.youtube.com/watch?v=jxstE6A_CYQ',
    channel: 'Crash Course Physics',
    minutes: 9,
    topic: 'SHM / ω = √(k/m)',
    match: /ω\s*=\s*√|d²x\/dt²\s*=\s*-|A\s*cos\(ω|simple\s*harmonic|\bSHM\b/i,
  },
  {
    id: 'projectile',
    title: 'Projectile Motion',
    url: 'https://www.youtube.com/watch?v=aY8z2qO44WA',
    channel: 'Professor Dave Explains',
    minutes: 7,
    topic: 'Projectile motion',
    match: /v[₀0].*sin|v[₀0].*cos|projectile|range.*sin\s*2/i,
  },
  {
    id: 'drag-terminal',
    title: 'Drag Forces',
    url: 'https://www.youtube.com/watch?v=W-5aqdBitlQ',
    channel: 'Allen Tsao (The STEM Coach)',
    minutes: 12,
    topic: 'Drag / terminal velocity',
    match: /v_?t\s*=\s*mg\/b|mg\s*-\s*bv|terminal\s*veloc|drag\s*force/i,
  },
  {
    id: 'integral-ftc',
    title: 'Integration and the Fundamental Theorem of Calculus',
    url: 'https://www.youtube.com/watch?v=rfG8ce4nNh0',
    channel: '3Blue1Brown',
    minutes: 21,
    topic: 'Definite integrals / area',
    match: /∫_|definite\s*integral|fundamental\s*theorem|area under/i,
  },
]

export function findFormulaClip(
  formula: string,
  context = '',
): FormulaClip | null {
  const hay = `${formula} ${context}`
  for (const clip of FORMULA_CLIPS) {
    if (clip.match.test(hay)) return clip
  }
  return null
}

export function youtubeEmbedId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null
    return u.searchParams.get('v')
  } catch {
    return null
  }
}
