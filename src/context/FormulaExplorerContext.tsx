'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type FormulaExplorerCtx = {
  open: boolean
  query: string
  openExplorer: (query?: string) => void
  closeExplorer: () => void
}

const Ctx = createContext<FormulaExplorerCtx | null>(null)

export function FormulaExplorerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const openExplorer = useCallback((q = '') => {
    setQuery(q)
    setOpen(true)
  }, [])

  const closeExplorer = useCallback(() => {
    setOpen(false)
  }, [])

  const value = useMemo(
    () => ({ open, query, openExplorer, closeExplorer }),
    [open, query, openExplorer, closeExplorer],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useFormulaExplorer() {
  const ctx = useContext(Ctx)
  if (!ctx) {
    return {
      open: false,
      query: '',
      openExplorer: (_q?: string) => {},
      closeExplorer: () => {},
    }
  }
  return ctx
}
