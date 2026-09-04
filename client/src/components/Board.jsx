import { useState, useEffect, useMemo, useCallback } from 'react';
import SearchFilterBar from './SearchFilterBar';
import Column from './Column';
import SampleDetail from './SampleDetail';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import BulkActionBar from './BulkActionBar';
import './Board.css';
import { useLocalCache } from '../hooks/useLocalCache';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../context/ToastContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const COLUMNS = ['Unlabeled', 'In Review', 'Labeled'];

function Board({ boardId }) {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const cacheKey = boardId ? 'board_state_' + boardId : 'board_state';
  const { loadCache, clearCache } = useLocalCache(cacheKey, samples);

  const handleSampleUpdate = useCallback((updatedSample) => {
    setSamples((previousSamples) =>
      previousSamples.map((sample) =>
        sample.id === updatedSample.id ? updatedSample : sample
      )
    );
    setSelectedSample((previousSelectedSample) =>
      previousSelectedSample && previousSelectedSample.id === updatedSample.id
        ? updatedSample
        : previousSelectedSample
    );
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  async function handleBulkApply(label) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    try {
      const updated = await Promise.all(
        ids.map((id) =>
          fetch(`${BASE_URL}/samples/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentLabel: label }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to update sample ${id}`);
            }
            return response.json();
          })
        )
      );

      updated.forEach((sample) => handleSampleUpdate(sample));
      showToast(`Applied "${label}" to ${ids.length} sample${ids.length > 1 ? 's' : ''}`);
      clearSelection();
    } catch (bulkError) {
      showToast('Failed to apply label to one or more samples', 'error');
    }
  }

  useEffect(() => {
    const cached = loadCache();
    if (cached && cached.length > 0) {
      setSamples(cached);
      setLoading(false);
    }

    const url = boardId
      ? BASE_URL + '/samples?boardId=' + boardId
      : BASE_URL + '/samples';

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch samples');
        }
        return response.json();
      })
      .then((data) => {
        setSamples(data);
        setLoading(false);
        setError(null);
        clearCache();
      })
      .catch((fetchError) => {
        if (!cached || cached.length === 0) {
          setError(fetchError.message);
        }
        setLoading(false);
      });
  }, [loadCache, clearCache, boardId]);

  useSocket(handleSampleUpdate, showToast);

  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      const matchesSearch = (sample.content || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === 'All' ||
        (sample.type && sample.type.toLowerCase() === typeFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || sample.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [samples, searchTerm, typeFilter, statusFilter]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (samples.length === 0) return <EmptyState />;

  return (
    <div className="board">
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
        {COLUMNS.map((columnStatus) => (
          <Column
            key={columnStatus}
            title={columnStatus}
            status={columnStatus}
            samples={filteredSamples.filter(
              (sample) => sample.status === columnStatus
            )}
            onSelectSample={setSelectedSample}
            onSampleUpdate={handleSampleUpdate}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        ))}
      </div>

      <SampleDetail sample={selectedSample} onClose={() => setSelectedSample(null)} />

      <BulkActionBar
        selectedCount={selectedIds.size}
        onApplyLabel={handleBulkApply}
        onClear={clearSelection}
      />
    </div>
  );
}

export default Board;