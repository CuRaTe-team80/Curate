import './LoadingState.css';

function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p>Loading samples...</p>
    </div>
  );
}

export default LoadingState;