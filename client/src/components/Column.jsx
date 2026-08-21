import { useState } from 'react';
import SampleCard from "./SampleCard";

const API_URL = 'http://localhost:5000/samples';

function Column({ title, samples, onSelectSample, onSampleUpdate }) {
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragStart(e, sampleId) {
    e.dataTransfer.setData('text/plain', sampleId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e) {
    e.preventDefault(); // required to allow dropping here
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  async function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);

    const sampleId = e.dataTransfer.getData('text/plain');
    if (!sampleId) return;

    // already in this column — nothing to do
    if (samples.some((s) => s.id === sampleId)) return;

    try {
      const response = await fetch(`${API_URL}/${sampleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: title }),
      });

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      const data = await response.json();
      if (onSampleUpdate) onSampleUpdate(data);
    } catch (err) {
      console.error('Failed to move sample:', err);
    }
  }

  return (
    <div
      className={`column column-${slug}${isDragOver ? ' column-drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <span className="dot" />
        <h2>{title}</h2>
      </div>
      <div className="column-samples">
        {samples.length === 0 ? (
          <div className="column-empty">
            <div className="column-empty-icon">🗂️</div>
            <p>No samples yet</p>
          </div>
        ) : (
          samples.map((sample) => (
            <div
              key={sample.id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, sample.id)}
              className="sample-drag-wrapper"
            >
              <SampleCard
                sample={sample}
                onClick={() => onSelectSample(sample)}
                onSampleUpdate={onSampleUpdate}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Column;