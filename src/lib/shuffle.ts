/**
 * Shuffling helpers.
 *
 * Anything shuffled during the first render of a client component has to agree
 * between the server pass and hydration, so `Math.random()` is off limits
 * there — it silently throws away the server HTML and re-renders the tree.
 * Use `seededShuffle` for opening state and `shuffle` only in event handlers.
 */

export function shuffleWith<T>(arr: readonly T[], rand: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Random order — safe after mount (event handlers, effects). */
export function shuffle<T>(arr: readonly T[]): T[] {
  return shuffleWith(arr, Math.random)
}

/** mulberry32 — a small, fast, deterministic PRNG. */
export function seededRandom(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/** Same order on the server and the client for a given seed. */
export function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  return shuffleWith(arr, seededRandom(Math.imul(seed, 2654435761)))
}

/** FNV-1a — turns an id like `d1-slope` into a stable numeric seed. */
export function hashSeed(key: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}
