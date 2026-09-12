import { useState } from "react";
import LabelPicker from "./LabelPicker";

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/samples';

function SampleCard({ sample, onClick, onSampleUpdate, isSelected, onToggleSelect, labels }) {
  const [isSaving, setIsSaving] = useState(false);

  async function patchStatus(body) {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/${sample.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to update sample');
      const data = await response.json();
      if (onSampleUpdate) onSampleUpdate(data);
    } catch (err) {
      console.error('Failed to update sample status:', err);
    } finally {
      setIsSaving(false);
    }
  }

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
        <input type="checkbox" checked={!!isSelected} onChange={onToggleSelect} onClick={(e) => e.stopPropagation()} />
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
          <img src={sample.content} alt="Sample to label" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", objectFit: "cover" }} />
        ) : (
          <p style={{ margin: 0, color: "var(--color-text)", textAlign: "center", lineHeight: 1.5 }}>{sample.content}</p>
        )}
      </div>

      {sample.isFlagged && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning, #f59e0b)' }}>
          🚩 Flagged as unclear
        </span>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        {sample.status === 'Unlabeled' && (
          <LabelPicker sampleId={sample.id} sampleUpdatedAt={sample.updatedAt} onSampleUpdate={onSampleUpdate} labels={labels} />
        )}

        {sample.status === 'In Review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              Labeled: <strong>{sample.currentLabel || '—'}</strong>
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="btn" disabled={isSaving} onClick={(e) => { e.stopPropagation(); patchStatus({ status: 'Labeled' }); }}
                style={{ background: 'var(--color-success)', color: '#fff', border: 'none' }}>
                ✓ Approve
              </button>
              <button className="btn" disabled={isSaving} onClick={(e) => { e.stopPropagation(); patchStatus({ status: 'Unlabeled', currentLabel: null }); }}
                style={{ background: 'var(--color-danger)', color: '#fff', border: 'none' }}>
                ✕ Reject
              </button>
            </div>
          </div>
        )}

        {sample.status === 'Labeled' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              Final label: <strong>{sample.currentLabel || '—'}</strong>
            </p>
            <button className="btn btn-secondary" disabled={isSaving} onClick={(e) => { e.stopPropagation(); patchStatus({ status: 'In Review' }); }}>
              Reopen for review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SampleCard;