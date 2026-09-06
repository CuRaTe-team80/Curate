import "./SampleDetail.css";
import CommentSection from './CommentSection';

function SampleDetail({ sample, onClose }) {
  if (!sample) return null;

  return (
    <div className="sample-detail-overlay" onClick={onClose}>
      <div className="sample-detail" onClick={(e) => e.stopPropagation()}>
        <button className="sample-detail__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="sample-detail__header">
          <span className={`sample-detail__status sample-detail__status--${sample.status?.toLowerCase().replace(/\s+/g, "-")}`}>
            {sample.status}
          </span>
        </div>

        <div className="sample-detail__content">
          {sample.type === "image" ? (
            <img src={sample.content} alt="Sample" className="sample-detail__image" />
          ) : (
            <p className="sample-detail__text">{sample.content}</p>
          )}
        </div>

        <div className="sample-detail__label">
          <h3>Current Label</h3>
          <p>{sample.currentLabel ?? "Not labeled yet"}</p>
        </div>

        <div className="sample-detail__history">
          <h3>Label History</h3>
          {sample.history && sample.history.length > 0 ? (
            <ul>
              {sample.history.map((entry, i) => (
                <li key={i}>
                  <strong>{entry.label}</strong> by {entry.by} —{" "}
                  {new Date(entry.at).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="sample-detail__empty">No history yet.</p>
          )}
        </div>
      </div>
      <CommentSection sampleId={sample.id || sample._id} />
</div>
        );
}


export default SampleDetail;