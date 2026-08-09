'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, X } from 'lucide-react'
import { Latex } from '@/components/Latex'
import { FORMULA_SECTIONS, FORMULA_SHEET } from '@/data/formulaSheet'

type Props = {
  open: boolean
  onClose: () => void
}

export function FormulaSheetDrawer({ open, onClose }: Props) {
  const [section, setSection] = useState(FORMULA_SECTIONS[0] ?? 'Kinematics')
  const items = useMemo(
    () => FORMULA_SHEET.filter((f) => f.section === section),
    [section],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`formula-drawer ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        aria-modal={open}
        role="dialog"
        aria-label="AP Formula Sheet"
      >
        <div className="formula-drawer__head">
          <div>
            <p className="formula-drawer__kicker">
              <BookOpen className="h-4 w-4" />
              Reference
            </p>
            <h2>AP Formula Sheet</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close formula sheet"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="formula-tabs" role="tablist">
          {FORMULA_SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={section === s}
              className={`formula-tab ${section === s ? 'is-active' : ''}`}
              onClick={() => setSection(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <ul className="formula-list">
          {items.map((f) => (
            <li key={f.id} className="formula-item">
              <p className="formula-item__title">{f.title}</p>
              <div className="formula-item__latex">
                <Latex latex={f.latex} display />
              </div>
              {f.note && <p className="formula-item__note">{f.note}</p>}
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}

export function FormulaSheetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="stat-chip formula-trigger"
      title="Open AP Formula Sheet"
    >
      <BookOpen className="h-3.5 w-3.5 text-[color:var(--accent)]" />
      <span className="hidden sm:inline">Formulas</span>
    </button>
  )
}
