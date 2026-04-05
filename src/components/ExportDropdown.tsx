import { useState, useEffect, useRef } from 'react'

interface Props {
  onExportPDF: () => void
  onExportFountain: () => void
  onExportJSON: () => void
  onExportMarkdown: () => void
}

export default function ExportDropdown({
  onExportPDF,
  onExportFountain,
  onExportJSON,
  onExportMarkdown,
}: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function choose(fn: () => void) {
    fn()
    setOpen(false)
  }

  return (
    <div className="export-dropdown" ref={containerRef}>
      <button
        className="btn-ghost board-header__action"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        title="Export"
      >
        ↓ Export ▾
      </button>
      {open && (
        <div className="export-dropdown__menu" role="menu">
          <button className="export-dropdown__item" role="menuitem" onClick={() => choose(onExportPDF)}>
            PDF
          </button>
          <button className="export-dropdown__item" role="menuitem" onClick={() => choose(onExportFountain)}>
            Fountain
          </button>
          <button className="export-dropdown__item" role="menuitem" onClick={() => choose(onExportJSON)}>
            JSON
          </button>
          <button className="export-dropdown__item" role="menuitem" onClick={() => choose(onExportMarkdown)}>
            Markdown
          </button>
        </div>
      )}
    </div>
  )
}
