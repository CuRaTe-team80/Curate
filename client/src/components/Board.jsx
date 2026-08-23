import { useState, useEffect, useMemo, useCallback } from 'react';
import SearchFilterBar from './SearchFilterBar';
import Column from './Column';
import SampleDetail from './SampleDetail';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import './Board.css';
import { useLocalCache } from '../hooks/useLocalCache';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../context/ToastContext';

const API_URL = 'http://localhost:5000/samples';

const COLUMNS = [
  'Unlabeled',
  'In Review',
  'Labeled',
];

function Board() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);

  const { showToast } = useToast();

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Client-side persistence
  const {
    loadCache,
    clearCache,
  } = useLocalCache('board_state', samples);

  // Handle sample updates from local actions and Socket.io
  const handleSampleUpdate = useCallback((updatedSample) => {
    setSamples((previousSamples) =>
      previousSamples.map((sample) =>
        sample.id === updatedSample.id
          ? updatedSample
          : sample
      )
    );

    setSelectedSample((previousSelectedSample) =>
      previousSelectedSample &&
      previousSelectedSample.id === updatedSample.id
        ? updatedSample
        : previousSelectedSample
    );
  }, []);

  // Fetch samples and restore cached board state
  useEffect(() => {
    const cached = loadCache();

    if (cached && cached.length > 0) {
      setSamples(cached);
      setLoading(false);
    }

    fetch(API_URL)
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

        // Fresh server data is available
        clearCache();
      })
      .catch((fetchError) => {
        // Keep cached board visible if the API is temporarily unavailable
        if (!cached || cached.length === 0) {
          setError(fetchError.message);
        }

        setLoading(false);
      });
  }, [loadCache, clearCache]);

  // Listen for real-time updates from Socket.io
  useSocket(handleSampleUpdate, showToast);

  // Apply search and filters
  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      const matchesSearch = (sample.content || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === 'All' ||
        (
          sample.type &&
          sample.type.toLowerCase() === typeFilter.toLowerCase()
        );

      const matchesStatus =
        statusFilter === 'All' ||
        sample.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    samples,
    searchTerm,
    typeFilter,
    statusFilter,
  ]);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Empty state
  if (samples.length === 0) {
    return <EmptyState />;
  }

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

      <div
        style={{
          display: 'flex',
          gap: 'var(--space-5)',
        }}
      >
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
          />
        ))}
      </div>

      <SampleDetail
        sample={selectedSample}
        onClose={() => setSelectedSample(null)}
      />
    </div>
  );
}

export default Board;