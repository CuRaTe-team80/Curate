// client/src/components/LabelPicker.jsx
import { useState } from "react";
import ConflictBanner from "./ConflictBanner";

const LABELS = [
  { name: "Positive", icon: "\u2713", color: "var(--color-success)" },
  { name: "Negative", icon: "\u2717", color: "var(--color-danger)" },
  { name: "Cat", icon: "\uD83D\uDC31", color: "var(--color-accent)" },
  { name: "Dog", icon: "\uD83D\uDC36", color: "var(--color-accent)" },
];

function LabelPicker({ sampleId }) {
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
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
    >
      <ConflictBanner
        isVisible={hasConflict}
        onDismiss={() => setHasConflict(false)}
      />

      {error && (
        <p style={{ margin: 0, color: "var(--color-danger)" }}>{error}</p>
      )}

      <div
        style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
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
                backgroundColor: isActive ? "var(--color-primary)" : "var(--color-surface)",
                border: `1px solid ${isActive ? "var(--color-primary)" : color}`,
                color: isActive ? "var(--color-surface)" : color,
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