import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  showGraph: boolean
  onToggleGraph: () => void
  showDiagnostics: boolean
  diagnosticCount: number
  onToggleDiagnostics: () => void
  onExportJSON: () => void
  onExportMarkdown: () => void
  onImportJSON: (file: File) => void
}

export default function BoardHeader({
  title,
  showGraph,
  onToggleGraph,
  showDiagnostics,
  diagnosticCount,
  onToggleDiagnostics,
  onExportJSON,
  onExportMarkdown,
  onImportJSON,
}: Props) {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <header className="board-header">
      <button className="btn-ghost board-header__back" onClick={() => navigate('/')}>
        ←
      </button>
      <h1 className="board-header__title">{title}</h1>
      <button className="btn-ghost board-header__action" onClick={onExportJSON} title="Export as JSON">
        ↓ JSON
      </button>
      <button className="btn-ghost board-header__action" onClick={onExportMarkdown} title="Export as Markdown">
        ↓ MD
      </button>
      <button className="btn-ghost board-header__action" onClick={() => fileInputRef.current?.click()} title="Import JSON">
        ↑
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onImportJSON(file)
          e.target.value = ''
        }}
      />
      <button
        className={`btn-ghost board-header__graph-toggle${showGraph ? ' board-header__graph-toggle--active' : ''}`}
        onClick={onToggleGraph}
        title={showGraph ? 'Hide waveform' : 'Show waveform'}
      >
        ∿
      </button>
      <button
        className={`btn-ghost board-header__diag-toggle${showDiagnostics ? ' board-header__diag-toggle--active' : ''}`}
        onClick={onToggleDiagnostics}
        title={showDiagnostics ? 'Hide diagnostics' : 'Show diagnostics'}
      >
        ⚠{diagnosticCount > 0 ? ` ${diagnosticCount}` : ''}
      </button>
    </header>
  )
}
