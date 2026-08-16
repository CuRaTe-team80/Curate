// client/src/components/LabelPicker.jsx
import { useState } from "react";
import "./LabelPicker.css";
import ConflictBanner from "./ConflictBanner";

// LabelPicker now sends a real PATCH request when a button is clicked.
// sampleId is required so we know which sample to update.
function LabelPicker({ sampleId }) {
  const labels = ["Positive", "Negative", "Cat", "Dog"];

  const [selectedLabel, setSelectedLabel] = useState(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleLabelClick(label) {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/samples/${sampleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });

      // Assumes the API returns 409 when another user already labeled
      // this sample differently in the meantime.
      if (response.status === 409) {
        setHasConflict(true);
        setIsSaving(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      setSelectedLabel(data.label ?? label);
      setHasConflict(false);
    } catch (err) {
      setError("Could not save label. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="label-picker">
      <ConflictBanner
        isVisible={hasConflict}
        onDismiss={() => setHasConflict(false)}
      />

      {error && <p className="label-picker__error">{error}</p>}

      <div className="label-picker__buttons">
        {labels.map((label) => (
          <button
            key={label}
            type="button"
            disabled={isSaving}
            className={
              "label-picker__button" +
              (selectedLabel === label ? " label-picker__button--active" : "")
            }
            onClick={() => handleLabelClick(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LabelPicker;