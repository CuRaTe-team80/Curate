import { useState } from 'react';
import './BulkActionBar.css';

const LABELS = [
  { name: 'Positive', icon: '\u2713', color: 'var(--color-success)' },
  { name: 'Negative', icon: '\u2717', color: 'var(--color-danger)' },
  { name: 'Cat', icon: '\uD83D\uDC31', color: 'var(--color-accent)' },
  { name: 'Dog', icon: '\uD83D\uDC36', color: 'var(--color-accent)' },
];

function BulkActionBar({ selectedCount, onApplyLabel, onClear }) {
  const [isApplying, setIsApplying] = useState(false);

  if (selectedCount === 0) return null;

  async function handleClick(label) {
    setIsApplying(true);
    await onApplyLabel(label);
    setIsApplying(false);
  }

  return (
    <div className="bulk-action-bar">
      <span className="bulk-action-count">
        {selectedCount} sample{selectedCount > 1 ? 's' : ''} selected
      </span>

      <div className="bulk-action-buttons">
        {LABELS.map(({ name, icon, color }) => (
          <button
            key={name}
            type="button"
            className="btn"
            disabled={isApplying}
            onClick={() => handleClick(name)}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: `1px solid ${color}`,
              color,
              opacity: isApplying ? 0.6 : 1,
            }}
          >
            <span aria-hidden="true">{icon}</span> {name}
          </button>
        ))}
      </div>

      <button type="button" className="btn btn-secondary" onClick={onClear} disabled={isApplying}>
        Clear
      </button>
    </div>
  );
}

export default BulkActionBar;