'use client'

type Props = {
  children: React.ReactNode
  className?: string
  title?: string
  kicker?: string
}

export function Card({ children, className = '', title, kicker }: Props) {
  return (
    <div className={`ui-card ${className}`}>
      {(kicker || title) && (
        <div className="ui-card__head">
          {kicker && <p className="ui-card__kicker">{kicker}</p>}
          {title && <h3 className="ui-card__title">{title}</h3>}
        </div>
      )}
      <div className="ui-card__body">{children}</div>
    </div>
  )
}
