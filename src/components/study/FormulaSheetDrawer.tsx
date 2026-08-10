'use client'

import { useMemo, useRef, useState } from 'react'
import { BookOpen, X } from 'lucide-react'
import { Latex } from '@/components/Latex'
import { FORMULA_SECTIONS, FORMULA_SHEET } from '@/data/formulaSheet'
import { useDialog } from '@/lib/useDialog'

type Props = {
  open: boolean
  onClose: () => void
}

export function FormulaSheetDrawer({ open, onClose }: Props) {
  const [section, setSection] = useState(FORMULA_SECTIONS[0] ?? 'Kinematics')
  const panelRef = useRef<HTMLElement>(null)
  const items = useMemo(
    () => FORMULA_SHEET.filter((f) => f.section === section),
    [section],
  )

  useDialog(open, onClose, panelRef)

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        ref={panelRef}
        className={`formula-drawer ${open ? 'is-open' : ''}`}
        // Off-canvas panels stay painted, so `inert` is what keeps their
        // controls out of the tab order and the a11y tree while closed.
        inert={!open}
        aria-modal={open || undefined}
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
      className="stat-chip formula-trigger show-from-md"
      title="Open AP Formula Sheet"
    >
      <BookOpen className="h-3.5 w-3.5 text-[color:var(--accent)]" />
      <span className="hidden lg:inline">Formulas</span>
    </button>
  )
}
