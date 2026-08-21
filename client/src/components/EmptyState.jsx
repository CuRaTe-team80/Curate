import './EmptyState.css';

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        
      </div>

      <h2>No samples yet</h2>

      <p>
        There are no samples to display at the moment.
      </p>
    </div>
  );
}

export default EmptyState;