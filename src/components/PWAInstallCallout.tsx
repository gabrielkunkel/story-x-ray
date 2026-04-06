interface Props {
  onDismiss: () => void
}

export default function PWAInstallCallout({ onDismiss }: Props) {
  return (
    <div className="install-callout" role="status">
      <div className="install-callout__content">
        <span className="install-callout__headline">Add Story X-Ray to your desktop</span>
        <span className="install-callout__body">
          Click the install icon in your Chrome address bar to keep it a click away.
        </span>
      </div>
      <button
        className="install-callout__dismiss btn-ghost"
        onClick={onDismiss}
        aria-label="Dismiss install prompt"
      >
        ×
      </button>
    </div>
  )
}
