import "./SampleCard.css";
import LabelPicker from "./LabelPicker";

// Displays one mock sample (text or image) with a LabelPicker underneath.
// Using hardcoded mock data for now — real sample data comes from the API next sprint.
const mockSample = {
  type: "text", // could also be "image"
  content: "The food arrived cold and the service was slow.",
};

function SampleCard() {
  return (
    <div className="sample-card">
      <div className="sample-card__content">
        {mockSample.type === "image" ? (
          <img
            src={mockSample.content}
            alt="Sample to label"
            className="sample-card__image"
          />
        ) : (
          <p className="sample-card__text">{mockSample.content}</p>
        )}
      </div>

      <LabelPicker />
    </div>
  );
}

export default SampleCard;