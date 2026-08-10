'use client'

import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Check, Copy } from 'lucide-react'
import { FormulaWithClip } from '@/components/FormulaWithClip'
import { KatexErrorBoundary } from '@/components/ErrorBoundary'
import { Latex, tryLatex } from '@/components/Latex'
import { findFormulaClip } from '@/data/formulaClips'
import {
  MathText,
  looksLikeFormula,
  normalizeMath,
  splitIntoParagraphs,
  splitInlineFormulas,
} from '@/components/MathInline'

type Props = {
  text: string
  className?: string
  steps?: boolean
}

function needsMarkdownEngine(text: string): boolean {
  return (
    /\$\$[\s\S]+?\$\$|\$[^$\n]+\$/.test(text) ||
    /^#{1,3}\s/m.test(text) ||
    /^\|(.+\|)+$/m.test(text) ||
    /^>\s/m.test(text) ||
    /```/.test(text) ||
    /\[.+\]\(.+\)/.test(text)
  )
}

function CopyEquation({ latex }: { latex: string }) {
  const [ok, setOk] = useState(false)
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(latex)
      setOk(true)
      window.setTimeout(() => setOk(false), 1200)
    } catch {
      /* ignore */
    }
  }, [latex])
  return (
    <button
      type="button"
      className="eq-copy"
      onClick={copy}
      aria-label="Copy equation"
      title="Copy equation"
    >
      {ok ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

function FormulaBlock({ formula, context }: { formula: string; context: string }) {
  const latex = tryLatex(formula)
  return (
    <div className="eq-display">
      <div className="eq-display__scroll">
        <KatexErrorBoundary>
          <FormulaWithClip formula={formula} context={context} block>
            {latex ? <Latex latex={latex} display /> : <MathText text={formula} />}
          </FormulaWithClip>
        </KatexErrorBoundary>
      </div>
      <CopyEquation latex={formula} />
    </div>
  )
}

function LegacyRichText({ text, className }: { text: string; className: string }) {
  const paragraphs = splitIntoParagraphs(text)
  return (
    <div className={`prose-lesson rich-text ${className}`.trim()}>
      {paragraphs.map((p, i) => {
        if (looksLikeFormula(p) && !p.includes('. ')) {
          return <FormulaBlock key={i} formula={p} context={p} />
        }
        const chunks = splitInlineFormulas(p)
        const seenClips = new Set<string>()
        return (
          <div key={i} className="prose-p">
            {chunks.map((c, j) => {
              if (c.type !== 'formula') {
                return <MathText key={j} text={c.value} />
              }
              const clip = findFormulaClip(c.value, p)
              const skipClip = Boolean(clip && seenClips.has(clip.id))
              if (clip && !skipClip) seenClips.add(clip.id)
              const latex = tryLatex(c.value)
              return (
                <span key={j} className="eq-inline-wrap">
                  <FormulaWithClip
                    formula={c.value}
                    context={p}
                    skipClip={skipClip}
                  >
                    {latex ? (
                      <span className="eq-inline">
                        <Latex latex={latex} />
                      </span>
                    ) : (
                      <MathText text={c.value} />
                    )}
                  </FormulaWithClip>
                </span>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function MarkdownRichText({ text, className }: { text: string; className: string }) {
  return (
    <div className={`prose-lesson rich-text ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [
            rehypeKatex,
            { throwOnError: false, strict: 'ignore', output: 'html' },
          ],
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
        components={{
          p: ({ children }) => <div className="prose-p">{children}</div>,
          blockquote: ({ children }) => (
            <aside className="callout callout--tip">{children}</aside>
          ),
          table: ({ children }) => (
            <div className="table-scroll">
              <table>{children}</table>
            </div>
          ),
          code: ({ className: cn, children, ...props }) => {
            const isBlock = Boolean(cn)
            if (!isBlock) {
              return (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <pre className="code-block">
                <code className={cn} {...props}>
                  {children}
                </code>
              </pre>
            )
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

/**
 * Unified lesson renderer — Markdown+KaTeX when delimiters present,
 * otherwise curriculum Unicode math with FormulaWithClip + optional KaTeX.
 */
export function RichText({ text, className = '', steps = false }: Props) {
  if (steps) {
    return (
      <span className={`rich-inline ${className}`.trim()}>
        <MathText text={text} />
      </span>
    )
  }

  if (needsMarkdownEngine(text)) {
    return <MarkdownRichText text={text} className={className} />
  }
  return <LegacyRichText text={normalizeMath(text)} className={className} />
}

export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="step-list">
      {steps.map((s, i) => (
        <li key={i}>
          <RichText text={s} steps />
        </li>
      ))}
    </ol>
  )
}
