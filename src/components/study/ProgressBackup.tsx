'use client'

import { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'
import { exportProgressJson, importProgressJson } from '@/lib/storage'

export function ProgressBackup() {
  const { state, replaceProgress } = useProgress()
  const inputRef = useRef<HTMLInputElement>(null)

  const onExport = () => {
    const blob = new Blob([exportProgressJson(state)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mastery-c-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport = async (file: File) => {
    try {
      const text = await file.text()
      const next = importProgressJson(text)
      const ok = window.confirm(
        'Replace your current progress with this backup? This cannot be undone.',
      )
      if (!ok) return
      replaceProgress(next)
    } catch {
      window.alert('Could not read that progress file.')
    }
  }

  return (
    <div className="backup-row">
      <button type="button" className="btn-ghost backup-btn" onClick={onExport}>
        <Download className="h-3.5 w-3.5" />
        Export
      </button>
      <button
        type="button"
        className="btn-ghost backup-btn"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-3.5 w-3.5" />
        Import
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void onImport(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
