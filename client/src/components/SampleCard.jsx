import LabelPicker from "./LabelPicker";

function SampleCard({ sample, onClick, onSampleUpdate, isSelected, onToggleSelect }) {
  return (
    <div
      className={`card${isSelected ? ' card-selected' : ''}`}
      onClick={onClick}
      style={{
        width: "320px",
        padding: "var(--space-5)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <label className="sample-select" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={!!isSelected}
          onChange={onToggleSelect}
        />
      </label>

      <div
        style={{
          padding: "var(--space-4)",
          minHeight: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
        }}
      >
        {sample.type === "image" ? (
          <img
            src={sample.content}
            alt="Sample to label"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        ) : (
          <p
            style={{
              margin: 0,
              color: "var(--color-text)",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            {sample.content}
          </p>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <LabelPicker sampleId={sample.id} onSampleUpdate={onSampleUpdate} />
      </div>
    </div>
  );
}

export default SampleCard;