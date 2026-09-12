import { useState } from "react";
import ConflictBanner from "./ConflictBanner";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const DEFAULT_LABELS = ["Positive", "Negative", "Cat", "Dog"];

function LabelPicker({ sampleId, sampleUpdatedAt, onSampleUpdate, labels }) {
  const { showToast } = useToast();
  const labelOptions = labels && labels.length > 0 ? labels : DEFAULT_LABELS;

  const [selectedLabel, setSelectedLabel] = useState(null);
  const [isFlagged, setIsFlagged] = useState(false);
  const [conflictSample, setConflictSample] = useState(null);
  const [lastKnownUpdatedAt, setLastKnownUpdatedAt] = useState(sampleUpdatedAt);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  async function sendPatch(body) {
    const response = await fetch(`${API_URL}/samples/${sampleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, clientUpdatedAt: lastKnownUpdatedAt }),
    });

    if (response.status === 409) {
      const data = await response.json();
      setConflictSample(data.currentSample);
      showToast("Conflict detected: sample was updated by another user.", "warning");
      return null;
    }

    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return response.json();
  }

  async function handleLabelClick(label) {
    setIsSaving(true);
    setError(null);
    try {
      const data = await sendPatch({ currentLabel: label, status: "In Review" });
      if (!data) { setIsSaving(false); return; }

      setSelectedLabel(data.currentLabel ?? label);
      setIsFlagged(false);
      setLastKnownUpdatedAt(data.updatedAt);
      setConflictSample(null);

      showToast("Label saved", "success");
      if (onSampleUpdate) onSampleUpdate(data);
    } catch (err) {
      setError("Could not save label. Please try again.");
      showToast("Error saving label", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleFlagClick() {
    setIsSaving(true);
    setError(null);
    try {
      const data = await sendPatch({ isFlagged: true, status: "In Review" });
      if (!data) { setIsSaving(false); return; }

      setIsFlagged(true);
      setSelectedLabel(null);
      setLastKnownUpdatedAt(data.updatedAt);
      setConflictSample(null);

      showToast("Sample flagged as unclear", "success");
      if (onSampleUpdate) onSampleUpdate(data);
    } catch (err) {
      setError("Could not flag sample. Please try again.");
      showToast("Error flagging sample", "error");
    } finally {
      setIsSaving(false);
    }
  }

  function handleRefresh() {
    if (!conflictSample) return;
    setSelectedLabel(conflictSample.currentLabel ?? null);
    setIsFlagged(conflictSample.isFlagged ?? false);
    setLastKnownUpdatedAt(conflictSample.updatedAt);
    setConflictSample(null);
    if (onSampleUpdate) onSampleUpdate(conflictSample);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <ConflictBanner isVisible={Boolean(conflictSample)} onRefresh={handleRefresh} />

      {error && <p style={{ margin: 0, color: "var(--color-danger)" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", alignItems: "center" }}>
        {labelOptions.map((name) => {
          const isActive = selectedLabel === name && !isFlagged;
          return (
            <button
              key={name}
              type="button"
              disabled={isSaving}
              className="btn"
              onClick={() => handleLabelClick(name)}
              style={{
                backgroundColor: isActive ? "var(--color-primary)" : "var(--color-surface)",
                border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                color: isActive ? "var(--color-surface)" : "var(--color-text)",
                opacity: isSaving ? 0.6 : 1,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              {name}
            </button>
          );
        })}

        <button
          type="button"
          disabled={isSaving}
          className="btn"
          onClick={handleFlagClick}
          style={{
            backgroundColor: isFlagged ? "var(--color-warning, #f59e0b)" : "var(--color-surface)",
            border: `1px solid ${isFlagged ? "var(--color-warning, #f59e0b)" : "var(--color-text-muted)"}`,
            color: isFlagged ? "#fff" : "var(--color-text)",
            opacity: isSaving ? 0.6 : 1,
            cursor: isSaving ? "not-allowed" : "pointer",
          }}
        >
          🚩 Flag as unclear
        </button>
      </div>
    </div>
  );
}

export default LabelPicker;