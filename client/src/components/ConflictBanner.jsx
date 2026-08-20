// client/src/components/ConflictBanner.jsx

function ConflictBanner({ isVisible, onDismiss }) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-danger)",
        borderLeftWidth: "var(--space-1)",
        borderRadius: "8px",
      }}
    >
      <span aria-hidden="true" style={{ color: "var(--color-danger)", fontSize: "1.1em" }}>
        &#9888;
      </span>
      <span style={{ flex: 1, margin: 0, color: "var(--color-text)" }}>
        This sample was already labeled by someone else. Please refresh and
        try again.
      </span>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onDismiss}
        style={{ flexShrink: 0 }}
      >
        Dismiss
      </button>
    </div>
  );
}

export default ConflictBanner;