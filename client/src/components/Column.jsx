function Column({ title, samples }) {
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`column column-${slug}`}>
      <div className="column-header">
        <span className="dot" />
        <h2>{title}</h2>
      </div>
      <div className="column-samples">
        {samples.length === 0 ? (
          <div className="column-empty">
            <div className="column-empty-icon">🗂️</div>
            <p>No samples yet</p>
          </div>
        ) : (
          samples.map((sample) => (
            <div key={sample.id} className="sample-placeholder">
              {sample.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Column;