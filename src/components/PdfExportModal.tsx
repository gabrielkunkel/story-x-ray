interface Props {
  onChoose: (includeScores: boolean) => void
  onClose: () => void
}

export default function PdfExportModal({ onChoose, onClose }: Props) {
  return (
    <div
      className="capture-overlay"
      tabIndex={-1}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="pdf-export-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Export PDF"
      >
        <h2 className="pdf-export-modal__heading">Export PDF</h2>
        <div className="pdf-export-modal__actions">
          <button
            className="btn-primary"
            autoFocus
            onClick={() => onChoose(false)}
          >
            Without Scores
          </button>
          <button
            className="btn-ghost"
            onClick={() => onChoose(true)}
          >
            With Scores
          </button>
        </div>
      </div>
    </div>
  )
}
