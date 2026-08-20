// client/src/components/SampleCard.jsx
import LabelPicker from "./LabelPicker";

const mockSample = {
  id: "sample-1",
  type: "text", // could also be "image"
  content: "The food arrived cold and the service was slow.",
};

function SampleCard() {
  return (
    <div
      className="card"
      style={{
        width: "320px",
        padding: "var(--space-5)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
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
        {mockSample.type === "image" ? (
          <img
            src={mockSample.content}
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
            {mockSample.content}
          </p>
        )}
      </div>

      <LabelPicker sampleId={mockSample.id} />
    </div>
  );
}

export default SampleCard;