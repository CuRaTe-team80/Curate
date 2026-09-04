// client/src/components/LabelPicker.jsx
import { useState } from "react";
import ConflictBanner from "./ConflictBanner";
import { useToast } from "../context/ToastContext";

const LABELS = [
  { name: "Positive", icon: "\u2713", color: "var(--color-success)" },
  { name: "Negative", icon: "\u2717", color: "var(--color-danger)" },
  { name: "Cat", icon: "\uD83D\uDC31", color: "var(--color-accent)" },
  { name: "Dog", icon: "\uD83D\uDC36", color: "var(--color-accent)" },
];

function LabelPicker({ sampleId, sampleUpdatedAt, onSampleUpdate }) {
  const { showToast } = useToast();

  const [selectedLabel, setSelectedLabel] = useState(null);
  const [conflictSample, setConflictSample] = useState(null);
  const [lastKnownUpdatedAt, setLastKnownUpdatedAt] = useState(sampleUpdatedAt);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleLabelClick(label) {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/samples/${sampleId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentLabel: label,
            clientUpdatedAt: lastKnownUpdatedAt,
          }),
        }
      );

      if (response.status === 409) {
  const data = await response.json();

  setConflictSample(data.currentSample);

  showToast("Conflict detected: sample was updated by another user.", "warning");

  setIsSaving(false);
  return;
}

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      setSelectedLabel(data.currentLabel ?? label);
      setLastKnownUpdatedAt(data.updatedAt);
      setConflictSample(null);

      showToast("Label saved", "success");

      if (onSampleUpdate) {
        onSampleUpdate(data);
      }
    } catch (err) {
      setError("Could not save label. Please try again.");
      showToast("Error saving label", "error");
    } finally {
      setIsSaving(false);
    }
  }

  function handleRefresh() {
    if (!conflictSample) return;
    setSelectedLabel(conflictSample.currentLabel ?? null);
    setLastKnownUpdatedAt(conflictSample.updatedAt);
    setConflictSample(null);
    if (onSampleUpdate) {
      onSampleUpdate(conflictSample);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <ConflictBanner
        isVisible={Boolean(conflictSample)}
        onRefresh={handleRefresh}
      />

      {error && (
        <p style={{ margin: 0, color: "var(--color-danger)" }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        {LABELS.map(({ name, icon, color }) => {
          const isActive = selectedLabel === name;

          return (
            <button
              key={name}
              type="button"
              disabled={isSaving}
              className="btn"
              onClick={() => handleLabelClick(name)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1)",
                backgroundColor: isActive
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
                border: `1px solid ${
                  isActive ? "var(--color-primary)" : color
                }`,
                color: isActive
                  ? "var(--color-surface)"
                  : color,
                opacity: isSaving ? 0.6 : 1,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "0.9em" }}>
                {icon}
              </span>
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LabelPicker;