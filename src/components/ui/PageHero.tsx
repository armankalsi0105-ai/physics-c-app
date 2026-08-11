import type { ReactNode } from 'react'

type Props = {
  /** Small spaced label above the title, e.g. "Day 01 / 20". */
  eyebrow: ReactNode
  title: ReactNode
  /** Dot-separated facts under the title. Falsy entries are dropped. */
  meta?: ReactNode[]
  /** Right-hand slot — a progress ring, a timer, a control. */
  aside?: ReactNode
  /** Oversized display glyph cropped along the bottom edge. */
  watermark?: string
  /** Chips or actions below the meta line. */
  children?: ReactNode
}

/**
 * The full-bleed band at the top of every route. Each page owns a different
 * kind of content, but arriving anywhere should feel the same — so the band,
 * its gradient, and the type scale live here rather than per page.
 */
export function PageHero({
  eyebrow,
  title,
  meta,
  aside,
  watermark,
  children,
}: Props) {
  const facts = (meta ?? []).filter(Boolean)

  return (
    <header className="page-hero">
      {watermark && (
        <span className="page-hero__watermark" aria-hidden>
          {watermark}
        </span>
      )}

      <div className="page-hero__top">
        <p className="page-hero__eyebrow">{eyebrow}</p>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>

      <h1 className="page-hero__title">{title}</h1>

      {facts.length > 0 && (
        <p className="page-hero__meta">
          {facts.map((fact, i) => (
            <span key={i} className="page-hero__fact">
              {i > 0 && (
                <span className="page-hero__sep" aria-hidden>
                  ·
                </span>
              )}
              {fact}
            </span>
          ))}
        </p>
      )}

      {children && <div className="page-hero__actions">{children}</div>}
    </header>
  )
}
