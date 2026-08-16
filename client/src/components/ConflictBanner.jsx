// client/src/components/ConflictBanner.jsx

// Shows a warning banner when the API tells us this sample was
// already labeled differently by someone else in the meantime.
function ConflictBanner({ isVisible, onDismiss }) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="conflict-banner">
      <span className="conflict-banner__text">
        This sample was already labeled by someone else. Please refresh and
        try again.
      </span>
      <button
        type="button"
        className="conflict-banner__dismiss"
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  );
}

export default ConflictBanner;