import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  async function handleExport() {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/samples/export`);

      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'curate-samples-export.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Could not export samples. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div>
      <button type="button" className="btn btn-secondary" onClick={handleExport} disabled={isExporting}>
        {isExporting ? 'Exporting...' : '↓ Export CSV'}
      </button>
      {error && <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>{error}</p>}
    </div>
  );
}

export default ExportButton;