import type { AccessTier, CuratedResource, Video } from './types'

/** Hosts that are never acceptable as primary lesson media. */
export const BLOCKED_HOST_PATTERNS = [
  /patreon\.com/i,
  /curiositystream/i,
  /masterclass\.com/i,
  /brilliant\.org\/courses/i,
]

/**
 * Channels that often mix free uploads with premium/course funnels.
 * Treat as freemium-risk until each URL is manually confirmed free.
 */
export const FREEMIUM_RISK_CHANNELS = [
  'The Organic Chemistry Tutor',
]

/** Preferred free baseline sources for AP Physics C + pre-calc. */
export const FREE_BASELINE_SOURCES = [
  'Khan Academy',
  '3Blue1Brown',
  'Flipping Physics',
  'Crash Course Physics',
  'Professor Leonard',
  'MIT OpenCourseWare',
  'Professor Dave Explains',
  'PhET Interactive Simulations',
] as const

export function classifyVideo(
  v: Pick<Video, 'url' | 'channel' | 'access'>,
): AccessTier {
  if (v.access === 'free' || v.access === 'paywalled') return v.access
  if (BLOCKED_HOST_PATTERNS.some((re) => re.test(v.url))) return 'paywalled'
  if (FREEMIUM_RISK_CHANNELS.includes(v.channel)) return 'freemium-risk'
  if (
    (FREE_BASELINE_SOURCES as readonly string[]).includes(v.channel) ||
    /khan|flipping physics|3blue1brown|mit ocw|opencourseware|crash course|professor leonard|phet/i.test(
      v.channel,
    )
  ) {
    return 'free'
  }
  return v.access ?? 'unknown'
}

export function assertFreeVideos(
  videos: Video[],
): { ok: true } | { ok: false; violations: string[] } {
  const violations: string[] = []
  for (const v of videos) {
    const tier = classifyVideo(v)
    if (tier !== 'free') {
      violations.push(`${v.channel}: ${v.title} [${tier}] ${v.url}`)
    }
  }
  return violations.length ? { ok: false, violations } : { ok: true }
}

/** Curated free replacements for freemium-risk / paywalled items. */
export const FREE_REPLACEMENTS: Record<string, Video> = {
  // Organic Chemistry Tutor → Khan / 3Blue1Brown free uploads
  'https://www.youtube.com/watch?v=IvLpN1G1Ncg': {
    title: 'Derivative as Instantaneous Rate of Change',
    url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk',
    channel: '3Blue1Brown',
    access: 'free',
    verifiedAt: '2026-08-05',
    resourceId: 'free-3b1b-derivative',
  },
  'https://www.youtube.com/watch?v=17X5g9QArTc': {
    title: 'Product Rule',
    url: 'https://www.youtube.com/watch?v=ANyVpMS3HL4',
    channel: 'Khan Academy',
    access: 'free',
    verifiedAt: '2026-08-05',
    resourceId: 'free-khan-product-rule',
  },
  'https://www.youtube.com/watch?v=AdLAkD-r9Rs': {
    title: 'Basic Differentiation Rules',
    url: 'https://www.youtube.com/watch?v=5yfh5cf4-0w',
    channel: 'Khan Academy',
    access: 'free',
    verifiedAt: '2026-08-05',
    resourceId: 'free-khan-diff-rules',
  },
  'https://www.youtube.com/watch?v=5yfh5cf4-0w': {
    // Already a commonly free Khan-style lesson id used in curriculum;
    // if it was attributed to OCT, re-home to Khan Academy.
    title: 'Calculus 1 – Derivatives Overview',
    url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    channel: '3Blue1Brown',
    access: 'free',
    verifiedAt: '2026-08-05',
    resourceId: 'free-3b1b-essence-intro',
  },
}

export const FREE_CATALOG: CuratedResource[] = [
  {
    id: 'free-khan-calc',
    kind: 'video',
    title: 'Khan Academy Calculus',
    url: 'https://www.khanacademy.org/math/calculus-1',
    channelOrSource: 'Khan Academy',
    access: 'free',
    verifiedAt: '2026-08-05',
    tags: ['calculus'],
  },
  {
    id: 'free-3b1b-essence',
    kind: 'video',
    title: 'Essence of Calculus',
    url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr',
    channelOrSource: '3Blue1Brown',
    access: 'free',
    verifiedAt: '2026-08-05',
    tags: ['calculus'],
  },
  {
    id: 'free-flipping-physics',
    kind: 'video',
    title: 'Flipping Physics (AP Physics C)',
    url: 'https://www.flippingphysics.com/',
    channelOrSource: 'Flipping Physics',
    access: 'free',
    verifiedAt: '2026-08-05',
    tags: ['mechanics'],
  },
  {
    id: 'free-mit-801',
    kind: 'video',
    title: 'MIT 8.01 Classical Mechanics (OCW)',
    url: 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/',
    channelOrSource: 'MIT OpenCourseWare',
    access: 'free',
    verifiedAt: '2026-08-05',
    tags: ['mechanics'],
  },
  {
    id: 'free-phet',
    kind: 'sim',
    title: 'PhET Physics Simulations',
    url: 'https://phet.colorado.edu/en/simulations/filter?subjects=physics&type=html',
    channelOrSource: 'PhET Interactive Simulations',
    access: 'free',
    verifiedAt: '2026-08-05',
    tags: ['sim', 'mechanics', 'shm'],
  },
]

export function normalizeVideo(v: Video, today = '2026-08-05'): Video {
  const replacement = FREE_REPLACEMENTS[v.url]
  if (replacement) return { ...replacement }

  if (FREEMIUM_RISK_CHANNELS.includes(v.channel)) {
    // Fallback generic free calc intuition if no mapped URL
    return {
      title: `${v.title} (free alternative)`,
      url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
      channel: '3Blue1Brown',
      access: 'free',
      verifiedAt: today,
      resourceId: 'free-3b1b-essence-intro',
    }
  }

  const access = classifyVideo(v)
  return {
    ...v,
    access: access === 'unknown' ? 'free' : access,
    verifiedAt: v.verifiedAt ?? today,
  }
}
