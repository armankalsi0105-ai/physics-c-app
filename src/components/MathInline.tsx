import { Fragment, type ReactNode } from 'react'

/**
 * Normalizes mixed ASCII/Unicode math into consistent readable text,
 * then renders superscripts/subscripts.
 */

const SUP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', 'n': 'ⁿ', 'i': 'ⁱ',
}

const SUB: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  'n': 'ₙ', 'm': 'ₘ', 'x': 'ₓ', 't': 'ₜ', 'i': 'ᵢ',
  'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ',
}

const ASCII_TOKEN =
  /([A-Za-z0-9)\]}])(\^|_)(\{[^{}]+\}|\([^()]+\)|-?[A-Za-z0-9]+)/g

function stripWrap(s: string) {
  if (
    (s.startsWith('{') && s.endsWith('}')) ||
    (s.startsWith('(') && s.endsWith(')'))
  ) {
    return s.slice(1, -1)
  }
  return s
}

function mapChars(raw: string, table: Record<string, string>) {
  return [...raw].map((ch) => table[ch] ?? ch).join('')
}

export function normalizeMath(input: string): string {
  let s = input
    .replace(/ \* /g, ' · ')
    .replace(/\*\*/g, '^')
    .replace(/->/g, '→')
    .replace(/=>/g, '⇒')
    .replace(/<=/g, '≤')
    .replace(/>=/g, '≥')
    .replace(/!=/g, '≠')
    .replace(/\bdx\/dt\b/g, 'dx/dt')
    .replace(/\bdv\/dt\b/g, 'dv/dt')
    .replace(/\bd²x\/dt²\b/g, 'd²x/dt²')
    .replace(/\b1\/2\b/g, '½')
    .replace(/\b1\/2\s*a/g, '½a')

  s = s.replace(ASCII_TOKEN, (_m, base: string, kind: string, raw: string) => {
    const inner = stripWrap(raw)
    if (kind === '^') {
      const mapped = mapChars(inner, SUP)
      if ([...inner].every((ch) => SUP[ch])) return `${base}${mapped}`
      return `${base}^${inner}`
    }
    const mapped = mapChars(inner, SUB)
    if ([...inner].every((ch) => SUB[ch])) return `${base}${mapped}`
    return `${base}_${inner}`
  })

  return s
}

const REMAINING_ASCII =
  /([A-Za-z0-9)\]}])(\^|_)(\{[^{}]+\}|\([^()]+\)|-?[A-Za-z0-9]+)/g

export function MathText({ text }: { text: string }) {
  const cleaned = normalizeMath(text)
  const nodes: ReactNode[] = []
  let last = 0
  let key = 0

  for (const m of cleaned.matchAll(REMAINING_ASCII)) {
    const idx = m.index ?? 0
    if (idx > last) nodes.push(cleaned.slice(last, idx))
    const [, base, kind, raw] = m
    const script = stripWrap(raw)
    nodes.push(
      <Fragment key={key++}>
        {base}
        {kind === '^' ? <sup>{script}</sup> : <sub>{script}</sub>}
      </Fragment>,
    )
    last = idx + m[0].length
  }
  if (last < cleaned.length) nodes.push(cleaned.slice(last))

  return <>{nodes}</>
}

const FORMULA_LINE =
  /^(?:[A-Za-z]′?\([^)]*\)\s*=|d\/dx|d²|∫|Σ|∑|lim|v\([t]\)|a\([t]\)|x\([t]\)|F\s*=|W\s*=|τ\s*=|L\s*=)/

export function looksLikeFormula(line: string) {
  const t = line.trim()
  if (t.length < 4) return false
  if (FORMULA_LINE.test(t)) return true
  const mathHits = (t.match(/[=∫Σ∑√·^₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹′″]/g) ?? []).length
  const words = t.split(/\s+/).length
  return mathHits >= 2 && words <= 14
}

export function splitIntoParagraphs(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  if (/\n\s*\n/.test(normalized)) {
    return normalized.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean)
  }

  const soft = normalized
    .replace(
      /\. (\b(?:Constant|Sum|Product|Quotient|Chain|Power|Difference|Constant multiple) rule:?)/gi,
      '.\n\n$1',
    )
    .replace(
      /\. (\b(?:With|For|If|When|Use|These|In Leibniz|Start|Integrate|Eliminate|Notation|Average|The limit)\b)/g,
      '.\n\n$1',
    )
    .replace(/\n{3,}/g, '\n\n')

  return soft.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean)
}

export function splitInlineFormulas(
  paragraph: string,
): { type: 'text' | 'formula'; value: string }[] {
  const parts: { type: 'text' | 'formula'; value: string }[] = []
  const rhs = String.raw`(?:(?!\s(?:and|or)\s+[A-Za-z]′?\()[^,;.—–])+`
  const pattern = new RegExp(
    String.raw`((?:d\/dx|d²x\/dt²|lim\([^)]*\))\s*(?:\([^)]*\)|[^=,;.—–]+?)?(?:\s*=\s*${rhs})?|(?:\b[a-zA-Z]′?\([^)]*\)\s*=\s*${rhs}))`,
    'g',
  )

  let last = 0
  for (const m of paragraph.matchAll(pattern)) {
    const idx = m.index ?? 0
    if (idx > last) {
      parts.push({ type: 'text', value: paragraph.slice(last, idx) })
    }
    const value = m[0].trim().replace(/[.]+$/, '')
    if (value) parts.push({ type: 'formula', value })
    last = idx + m[0].length
  }
  if (last < paragraph.length) {
    parts.push({ type: 'text', value: paragraph.slice(last) })
  }
  return parts.length ? parts : [{ type: 'text', value: paragraph }]
}
