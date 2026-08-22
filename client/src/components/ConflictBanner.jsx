// client/src/components/ConflictBanner.jsx

import "./ConflictBanner.css";

// Displays a warning banner when the API reports a labeling conflict
// (a 409 response), with a button to reload the latest data.
function ConflictBanner({ isVisible, onRefresh }) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="conflict-banner" role="alert">
      <span className="conflict-banner__icon" aria-hidden="true">
        &#9888;
      </span>

      <span className="conflict-banner__text">
        This sample was updated by someone else. Your view is out of date —
        refresh to see the latest version before making changes.
      </span>

      <button
        type="button"
        className="btn conflict-banner__refresh"
        onClick={onRefresh}
      >
        Refresh
      </button>
    </div>
  );
}

export default ConflictBanner;