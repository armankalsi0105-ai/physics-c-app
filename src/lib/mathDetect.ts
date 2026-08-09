/** Heuristic: does this string look like a math/physics formula? */
export function looksLikeFormula(text: string): boolean {
  const t = text.trim()
  if (!t || t.length > 220) return false
  if (/[=∫∑√∂∆Δ≤≥≠≈→←⋅×÷±∞θωαβγμπ]|dx\/dt|dy\/dx|d\²|½|¾/.test(t)) return true
  if (/\\[a-zA-Z]+/.test(t)) return true
  if (/^[A-Za-z0-9_\s()[\]{}^\-+/*'=.,<>]+$/.test(t) && /=/.test(t) && t.length < 80) {
    return true
  }
  return false
}
