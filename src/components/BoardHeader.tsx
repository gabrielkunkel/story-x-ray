import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  showGraph: boolean
  onToggleGraph: () => void
  showDiagnostics: boolean
  diagnosticCount: number
  onToggleDiagnostics: () => void
}

export default function BoardHeader({
  title,
  showGraph,
  onToggleGraph,
  showDiagnostics,
  diagnosticCount,
  onToggleDiagnostics,
}: Props) {
  const navigate = useNavigate()

  return (
    <header className="board-header">
      <button className="btn-ghost board-header__back" onClick={() => navigate('/')}>
        ←
      </button>
      <h1 className="board-header__title">{title}</h1>
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
