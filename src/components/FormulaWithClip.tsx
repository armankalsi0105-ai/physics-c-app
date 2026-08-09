'use client'

import { useId, useState, type ReactNode } from 'react'
import { BookOpen, ExternalLink, PlayCircle, X } from 'lucide-react'
import {
  findFormulaClip,
  youtubeEmbedId,
  type FormulaClip,
} from '@/data/formulaClips'
import { useFormulaExplorer } from '@/context/FormulaExplorerContext'

type Props = {
  formula: string
  /** Surrounding paragraph text helps matching */
  context?: string
  /** Block vs inline presentation */
  block?: boolean
  /** Same clip already offered earlier in the paragraph */
  skipClip?: boolean
  children: ReactNode
}

export function FormulaWithClip({
  formula,
  context = '',
  block = false,
  skipClip = false,
  children,
}: Props) {
  const clip = skipClip ? null : findFormulaClip(formula, context)
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const { openExplorer } = useFormulaExplorer()

  const exploreBtn = (
    <button
      type="button"
      className="formula-clip-btn is-compact"
      onClick={() => openExplorer(formula)}
      title="Open in Formula Explorer"
    >
      <BookOpen className="h-3.5 w-3.5" />
      Explore
    </button>
  )

  if (!clip) {
    return block ? (
      <div className="formula-deep">
        <div className="formula-block">{children}</div>
        {exploreBtn}
      </div>
    ) : (
      <span className="formula-deep formula-deep--inline">
        <span className="formula-inline">{children}</span>
        {exploreBtn}
      </span>
    )
  }

  if (block) {
    return (
      <div className="formula-deep">
        <div className="formula-block">{children}</div>
        {exploreBtn}
        <ClipTrigger
          clip={clip}
          open={open}
          panelId={panelId}
          onToggle={() => setOpen((v) => !v)}
        />
        {open && (
          <ClipPanel clip={clip} panelId={panelId} onClose={() => setOpen(false)} />
        )}
      </div>
    )
  }

  return (
    <span className="formula-deep formula-deep--inline">
      <span className="formula-inline">{children}</span>
      {exploreBtn}
      <ClipTrigger
        clip={clip}
        open={open}
        panelId={panelId}
        onToggle={() => setOpen((v) => !v)}
        compact
      />
      {open && (
        <span className="formula-deep__break" role="presentation">
          <ClipPanel clip={clip} panelId={panelId} onClose={() => setOpen(false)} />
        </span>
      )}
    </span>
  )
}

function ClipTrigger({
  clip,
  open,
  panelId,
  onToggle,
  compact = false,
}: {
  clip: FormulaClip
  open: boolean
  panelId: string
  onToggle: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      className={`formula-clip-btn ${compact ? 'is-compact' : ''} ${
        open ? 'is-open' : ''
      }`}
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={panelId}
      title={`~${clip.minutes} min · ${clip.channel} · Free`}
    >
      <PlayCircle className="h-3.5 w-3.5" />
      {compact ? `~${clip.minutes} min` : `Go deeper · ~${clip.minutes} min`}
    </button>
  )
}

function ClipPanel({
  clip,
  panelId,
  onClose,
}: {
  clip: FormulaClip
  panelId: string
  onClose: () => void
}) {
  const id = youtubeEmbedId(clip.url)

  return (
    <div className="formula-clip-panel" id={panelId} role="region" aria-label={clip.title}>
      <div className="formula-clip-panel__head">
        <div>
          <p className="formula-clip-panel__kicker">
            ~{clip.minutes} min explainer · {clip.channel} · Free
          </p>
          <p className="formula-clip-panel__title">{clip.title}</p>
          <p className="formula-clip-panel__topic">{clip.topic}</p>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="Close video"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {id ? (
        <div className="formula-clip-panel__frame">
          <iframe
            title={clip.title}
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <a
          href={clip.url}
          target="_blank"
          rel="noreferrer"
          className="formula-clip-panel__link"
        >
          Open on YouTube
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  )
}
