/** Local (no-LLM) generators from highlighted lesson text. */

export type NotebookArtifact = {
  kind: 'flashcard' | 'summary' | 'quiz' | 'mnemonic' | 'formula'
  title: string
  front: string
  back: string
}

export function generateFromSelection(text: string): NotebookArtifact[] {
  const t = text.trim().replace(/\s+/g, ' ')
  if (t.length < 8) return []

  const formula =
    t.match(/[A-Za-z][^=]{0,20}=\s*[^=.]{2,60}/)?.[0] ??
    t.match(/[∫Σ∑Δ].{3,40}/)?.[0] ??
    null

  const summary =
    t.length > 140 ? `${t.slice(0, 137)}…` : t

  const mnemonic = `Memory hook: link “${t.slice(0, 40)}” to a picture — what moves, what stays constant, what equation owns it?`

  const quizQ = `In your own words: what does this mean? “${t.slice(0, 80)}${t.length > 80 ? '…' : ''}”`
  const quizA = summary

  const out: NotebookArtifact[] = [
    {
      kind: 'flashcard',
      title: 'Flashcard',
      front: t.slice(0, 100) + (t.length > 100 ? '…' : ''),
      back: summary,
    },
    {
      kind: 'summary',
      title: 'Summary',
      front: 'Key idea',
      back: summary,
    },
    {
      kind: 'quiz',
      title: 'Mini-quiz',
      front: quizQ,
      back: quizA,
    },
    {
      kind: 'mnemonic',
      title: 'Mnemonic',
      front: 'Remember it',
      back: mnemonic,
    },
  ]

  if (formula) {
    out.push({
      kind: 'formula',
      title: 'Formula extract',
      front: formula.trim(),
      back: `From highlight: ${t.slice(0, 80)}…`,
    })
  }

  return out
}
