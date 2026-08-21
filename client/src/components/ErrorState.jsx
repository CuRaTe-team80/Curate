import './ErrorState.css';

function ErrorState({ message = 'Something went wrong while loading samples.' }) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state-icon" aria-hidden="true">
        ⚠
      </div>

      <h2>Unable to load samples</h2>

      <p>{message}</p>
    </div>
  );
}

export default ErrorState;