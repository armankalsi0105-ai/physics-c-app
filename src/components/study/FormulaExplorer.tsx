'use client'

import { useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Latex, tryLatex } from '@/components/Latex'
import {
  FORMULA_EXPLORER,
  searchFormulas,
  type FormulaEntry,
} from '@/data/formulaExplorer'
import { useDialog } from '@/lib/useDialog'

type Props = {
  onClose: () => void
  initialQuery?: string
}

function FormulaDetail({ formula }: { formula: FormulaEntry }) {
  const latex = tryLatex(formula.latex)

  return (
    <div className="formula-explorer__detail">
      <div className="formula-explorer__formula">
        {latex ? (
          <Latex latex={latex} display />
        ) : (
          <span className="formula-inline">{formula.unicode}</span>
        )}
      </div>

      <p className="formula-explorer__meaning">{formula.meaning}</p>
      <p className="formula-explorer__units">
        <strong>Units:</strong> {formula.units}
      </p>

      <h4>Variables</h4>
      <ul className="formula-explorer__vars">
        {formula.variables.map((v) => (
          <li key={v.symbol}>
            <span className="formula-inline">{v.symbol}</span> — {v.meaning}{' '}
            <span className="formula-explorer__var-units">({v.units})</span>
          </li>
        ))}
      </ul>

      <h4>Common mistakes</h4>
      <ul className="formula-explorer__mistakes">
        {formula.mistakes.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>

      {formula.related.length > 0 && (
        <>
          <h4>Related</h4>
          <div className="formula-explorer__related">
            {formula.related.map((id) => (
              <span key={id} className="formula-explorer__tag">
                {id}
              </span>
            ))}
          </div>
        </>
      )}

      <h4>Derivation</h4>
      <ol className="formula-explorer__deriv">
        {formula.derivation.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  )
}

// Rendered only while open, so the opening query is just initial state.
export function FormulaExplorer({ onClose, initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery ?? '')
  const [selected, setSelected] = useState<FormulaEntry | null>(
    () => (initialQuery ? (searchFormulas(initialQuery)[0] ?? null) : null),
  )
  const panelRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchFormulas(query), [query])

  useDialog(true, onClose, panelRef)

  return (
    <>
      <div className="drawer-backdrop is-open" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        className="formula-explorer"
        role="dialog"
        aria-modal="true"
        aria-label="Formula explorer"
      >
        <header className="formula-explorer__head">
          <div>
            <p className="formula-explorer__kicker">Reference</p>
            <h2>Formula Explorer</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="formula-explorer__search">
          <Search className="h-4 w-4" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelected(null)
            }}
            placeholder="Search formulas…"
            aria-label="Search formulas"
          />
        </div>

        <div className="formula-explorer__body">
          <ul className="formula-explorer__list">
            {(query ? results : FORMULA_EXPLORER).map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  className={`formula-explorer__item${
                    selected?.id === f.id ? ' is-active' : ''
                  }`}
                  onClick={() => setSelected(f)}
                >
                  <span className="formula-inline">{f.unicode}</span>
                  <span className="formula-explorer__item-day">Day {f.day}</span>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <FormulaDetail formula={selected} />
          ) : (
            <p className="formula-explorer__empty">
              Select a formula or search to explore meaning, units, and derivation.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
