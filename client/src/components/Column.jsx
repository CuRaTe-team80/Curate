import { useState } from 'react';
import SampleCard from './SampleCard';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/samples';

function Column(props) {
  const title = props.title;
  const samples = props.samples;
  const onSelectSample = props.onSelectSample;
  const onSampleUpdate = props.onSampleUpdate;
  const selectedIds = props.selectedIds;
  const onToggleSelect = props.onToggleSelect;
  const focusedId = props.focusedId;

  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragStart(e, sampleId) {
  // Don't let a click on the checkbox or a label button start a drag
  if (e.target.closest('input, button, .sample-select')) {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData('text/plain', sampleId);
  e.dataTransfer.effectAllowed = 'move';
  }
 
  function handleDragOver(e) {
    e.preventDefault();
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

    if (samples.some(function (s) { return s.id === sampleId; })) return;

    try {
      const response = await fetch(API_URL + '/' + sampleId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: title }),
      });

      if (!response.ok) throw new Error('Request failed with status ' + response.status);

      const data = await response.json();
      if (onSampleUpdate) onSampleUpdate(data);
    } catch (err) {
      console.error('Failed to move sample:', err);
    }
  }

  return (
    <div
      className={'column column-' + slug + (isDragOver ? ' column-drag-over' : '')}
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
            <div className="column-empty-icon">Empty</div>
            <p>No samples yet</p>
          </div>
        ) : (
          samples.map(function (sample) {
            const isFocused = focusedId === sample.id;
            return (
              <div
                key={sample.id}
                draggable="true"
                onDragStart={function (e) { handleDragStart(e, sample.id); }}
                className={'sample-drag-wrapper' + (isFocused ? ' sample-focused' : '')}
              >
                <SampleCard
                  sample={sample}
                  onClick={function () { onSelectSample(sample); }}
                  onSampleUpdate={onSampleUpdate}
                  isSelected={selectedIds ? selectedIds.has(sample.id) : false}
                  onToggleSelect={function () { if (onToggleSelect) onToggleSelect(sample.id); }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Column;
