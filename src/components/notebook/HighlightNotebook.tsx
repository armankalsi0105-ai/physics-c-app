'use client'

import { useCallback, useEffect, useState } from 'react'
import { BookMarked, X } from 'lucide-react'
import { generateFromSelection } from '@/lib/notebook/generate'
import { useProgress } from '@/context/ProgressContext'
import { todayKey } from '@/lib/storage'

type Props = { day: number }

export function HighlightNotebook({ day }: Props) {
  const { addNotebookCard, unlockHidden } = useProgress()
  const [sel, setSel] = useState('')
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onUp = () => {
      const s = window.getSelection()?.toString().trim() ?? ''
      if (s.length < 12) {
        setSel('')
        setPos(null)
        return
      }
      const range = window.getSelection()?.getRangeAt(0)
      const rect = range?.getBoundingClientRect()
      if (!rect) return
      const root = document.querySelector('.day-view')
      if (!root || !range || !root.contains(range.commonAncestorContainer)) {
        return
      }
      setSel(s)
      setPos({ x: rect.left + rect.width / 2, y: rect.bottom + 8 })
    }
    document.addEventListener('mouseup', onUp)
    return () => document.removeEventListener('mouseup', onUp)
  }, [])

  const save = useCallback(
    (front: string, back: string) => {
      addNotebookCard({
        id: `nb-${Date.now()}`,
        front,
        back,
        source: sel.slice(0, 80),
        createdAt: todayKey(),
        day,
      })
      unlockHidden('notebook-scholar')
      setOpen(false)
      setSel('')
      setPos(null)
    },
    [addNotebookCard, day, sel, unlockHidden],
  )

  if (!pos || !sel) return null

  const arts = generateFromSelection(sel)

  return (
    <div
      className="notebook-popup"
      style={{ left: pos.x, top: pos.y }}
      role="dialog"
      aria-label="Notebook from selection"
    >
      {!open ? (
        <button
          type="button"
          className="btn-primary"
          onClick={() => setOpen(true)}
        >
          <BookMarked className="h-4 w-4" />
          Notebook
        </button>
      ) : (
        <div className="notebook-popup__panel">
          <div className="notebook-popup__head">
            <strong>Save from highlight</strong>
            <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul>
            {arts.map((a) => (
              <li key={a.kind}>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => save(a.front, a.back)}
                >
                  {a.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
