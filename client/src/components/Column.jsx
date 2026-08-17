function Column({ title, samples }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      <div className="column-samples">
        {samples.map((sample) => (
          <div key={sample.id} className="sample-placeholder">
            {sample.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Column;