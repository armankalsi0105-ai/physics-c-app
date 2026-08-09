import { Latex, tryLatex } from '@/components/Latex'
import {
  MathText,
  looksLikeFormula,
} from '@/components/MathInline'
export {
  MathText,
  normalizeMath,
  looksLikeFormula,
  splitIntoParagraphs,
  splitInlineFormulas,
} from '@/components/MathInline'
export { RichText } from '@/components/content/RichText'

type RichTextProps = {
  text: string
  className?: string
  steps?: boolean
}
export type { RichTextProps }

type ParsedStep = {
  action?: string
  equation?: string
  result?: boolean
}

function parseStep(text: string): ParsedStep {
  const trimmed = text.trim()
  const result = trimmed.match(/^(?:result|answer|therefore|thus):?\s*(.+)$/i)
  if (result) return { action: 'Final answer', equation: result[1], result: true }

  const colon = trimmed.match(/^([^:]{2,35}):\s*(.+)$/)
  if (colon && looksLikeFormula(colon[2])) {
    return { action: colon[1], equation: colon[2] }
  }

  const toGet = trimmed.match(/^(.+?)\s+to get\s+(.+)$/i)
  if (toGet && looksLikeFormula(toGet[2])) {
    return { action: toGet[1], equation: toGet[2] }
  }

  const leadingAction = trimmed.match(
    /^(Start with|Use|Substitute|Set|Evaluate at|Differentiate|Integrate)\s+(.+=.+)$/i,
  )
  if (leadingAction) {
    return { action: leadingAction[1], equation: leadingAction[2] }
  }

  if (looksLikeFormula(trimmed)) return { equation: trimmed }
  return { action: trimmed }
}

/** Numbered, scan-friendly math/physics procedure used across the app. */
export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="procedure-list">
      {steps.map((step, index) => {
        const parsed = parseStep(step)
        return (
          <li
            key={`${index}-${step}`}
            className={
              parsed.result
                ? 'procedure-step procedure-step--result'
                : 'procedure-step'
            }
          >
            <span className="procedure-step__number" aria-hidden>
              {parsed.result ? '✓' : index + 1}
            </span>
            <div className="procedure-step__content">
              {parsed.action && (
                <span className="procedure-step__action">
                  <MathText text={parsed.action} />
                </span>
              )}
              {parsed.equation && (
                <span className="procedure-step__equation">
                  {tryLatex(parsed.equation) ? (
                    <Latex latex={tryLatex(parsed.equation)!} />
                  ) : (
                    <MathText text={parsed.equation} />
                  )}
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
