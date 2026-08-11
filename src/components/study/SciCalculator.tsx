'use client'

import { useState } from 'react'
import { Calculator as CalcIcon, Delete } from 'lucide-react'

const BUTTONS = [
  ['C', '(', ')', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', 'π', '='],
  ['sin', 'cos', 'tan', '√'],
  ['ln', 'log', '^', 'x²'],
]

function tokenizeEval(expr: string): number | null {
  try {
    let s = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'PI')
      .replace(/√/g, 'sqrt')
      .replace(/\^/g, '**')
      .replace(/\s+/g, '')

    // Whitelist: numbers, arithmetic, ** power, and approved identifiers only.
    if (
      !/^(?:PI|sin|cos|tan|ln|log|sqrt|\d+(?:\.\d+)?|\*\*|[+\-*/()])+$/.test(s)
    ) {
      return null
    }

    s = s
      .replace(/\bPI\b/g, `(${Math.PI})`)
      .replace(/\bsin\b/g, 'Math.sin')
      .replace(/\bcos\b/g, 'Math.cos')
      .replace(/\btan\b/g, 'Math.tan')
      .replace(/\bln\b/g, 'Math.log')
      .replace(/\blog\b/g, 'Math.log10')
      .replace(/\bsqrt\b/g, 'Math.sqrt')

     
    const result = Function(`"use strict"; return (${s})`)()
    return typeof result === 'number' && Number.isFinite(result) ? result : null
  } catch {
    return null
  }
}

export function SciCalculator({ collapsed = false }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(!collapsed)
  const [expr, setExpr] = useState('')
  const [display, setDisplay] = useState('0')

  const press = (key: string) => {
    if (key === 'C') {
      setExpr('')
      setDisplay('0')
      return
    }
    if (key === '=') {
      const v = tokenizeEval(expr)
      if (v == null) setDisplay('Error')
      else {
        const out = Number(v.toPrecision(10))
        setDisplay(String(out))
        setExpr(String(out))
      }
      return
    }
    if (key === 'x²') {
      const next = `(${expr || display})**2`
      setExpr(next)
      const v = tokenizeEval(next)
      setDisplay(v == null ? next : String(Number(v.toPrecision(10))))
      return
    }
    if (['sin', 'cos', 'tan', 'ln', 'log', '√'].includes(key)) {
      const next = `${expr}${key}(`
      setExpr(next)
      setDisplay(next)
      return
    }
    const next = expr === '0' && key !== '.' ? key : expr + key
    setExpr(next)
    setDisplay(next)
  }

  const backspace = () => {
    const next = expr.slice(0, -1)
    setExpr(next)
    setDisplay(next || '0')
  }

  return (
    <div className="calc-widget">
      <button
        type="button"
        className="calc-widget__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <CalcIcon className="h-4 w-4" />
        Calculator
      </button>
      {open && (
        <div className="calc-pad">
          <div className="calc-display" aria-live="polite">
            {display}
          </div>
          <div className="calc-grid">
            {BUTTONS.flat().map((key) => (
              <button
                key={key}
                type="button"
                className={`calc-key ${key === '=' ? 'calc-key--eq' : ''} ${
                  ['÷', '×', '−', '+', '^'].includes(key) ? 'calc-key--op' : ''
                }`}
                onClick={() => press(key)}
              >
                {key}
              </button>
            ))}
            <button
              type="button"
              className="calc-key calc-key--wide"
              onClick={backspace}
              aria-label="Backspace"
            >
              <Delete className="h-4 w-4" />
            </button>
          </div>
          <p className="calc-note">Trig in radians · π supported</p>
        </div>
      )}
    </div>
  )
}
