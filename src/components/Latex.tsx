'use client'

import katex from 'katex'
import { useMemo } from 'react'
import 'katex/dist/katex.min.css'

type Props = {
  /** KaTeX/LaTeX source */
  latex: string
  display?: boolean
  className?: string
}

/** Renders LaTeX via KaTeX. Falls back to monospace on parse errors. */
export function Latex({ latex, display = false, className = '' }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: display,
        strict: 'ignore',
      })
    } catch {
      return null
    }
  }, [latex, display])

  if (!html) {
    return (
      <code className={`font-mono text-sm ${className}`.trim()}>{latex}</code>
    )
  }

  return (
    <span
      className={`katex-host ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/**
 * Heuristic: if text looks like raw LaTeX (\\frac, \\sin, etc.), render with KaTeX;
 * otherwise return null so callers can fall back to MathText.
 */
export function tryLatex(text: string): string | null {
  const t = text.trim()
  if (/\\[a-zA-Z]+|\$\$|\\\(|\\\[/.test(t)) {
    return t.replace(/^\$+|\$+$/g, '').replace(/^\\\(|\\\)$/g, '')
  }
  return null
}
