'use client'

type Props = {
  amount: number
  earned?: boolean
  size?: 'sm' | 'md'
}

export function XPBadge({ amount, earned = false, size = 'sm' }: Props) {
  return (
    <span
      className={`xp-badge xp-badge--${size}${earned ? ' is-earned' : ''}`}
      aria-label={`${amount} XP`}
    >
      +{amount} XP
    </span>
  )
}
