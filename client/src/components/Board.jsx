import { useState, useEffect, useMemo, useCallback } from 'react';
import SearchFilterBar from './SearchFilterBar';
import Column from './Column';
import SampleDetail from './SampleDetail';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import BulkActionBar from './BulkActionBar';
import ExportButton from './ExportButton';
import PresenceBar from './PresenceBar';
import './Board.css';
import { useLocalCache } from '../hooks/useLocalCache';
import { useSocket } from '../hooks/useSocket';
import { usePresence } from '../hooks/usePresence';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import AddSampleForm from './AddSampleForm';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const COLUMNS = ['Unlabeled', 'In Review', 'Labeled'];

function getEmailFromToken(t) {
  if (!t) return null;
  try {
    const base64Url = t.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map(function (c) {
        return '%' + c.charCodeAt(0).toString(16).padStart(2, '0');
      }).join('')
    );
    return JSON.parse(json).email;
  } catch (err) {
    return null;
  }
}



function Board(props) {
  const boardId = props.boardId;
  const boardLabels = props.labels;
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [focusedId, setFocusedId] = useState(null);

  const { showToast } = useToast();
  const { token } = useAuth();
  const currentEmail = getEmailFromToken(token);
  const presenceUsers = usePresence(boardId, currentEmail);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const cacheKey = boardId ? 'board_state_' + boardId : 'board_state';
  const { loadCache, clearCache } = useLocalCache(cacheKey, samples);

  const handleSampleUpdate = useCallback((updatedSample) => {
    setSamples(function (previousSamples) {
      return previousSamples.map(function (sample) {
        return sample.id === updatedSample.id ? updatedSample : sample;
      });
    });
    setSelectedSample(function (previousSelectedSample) {
      return previousSelectedSample && previousSelectedSample.id === updatedSample.id
        ? updatedSample
        : previousSelectedSample;
    });
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds(function (prev) {
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

  function handleSampleAdded(newSample) {
  setSamples((prev) => [...prev, newSample]);
}

  async function handleBulkApply(label) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    try {
      const updated = await Promise.all(
        ids.map(function (id) {
          return fetch(BASE_URL + '/samples/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentLabel: label }),
          }).then(function (response) {
            if (!response.ok) {
              throw new Error('Failed to update sample ' + id);
            }
            return response.json();
          });
        })
      );

      updated.forEach(function (sample) { handleSampleUpdate(sample); });
      showToast('Applied "' + label + '" to ' + ids.length + ' sample' + (ids.length > 1 ? 's' : ''));
      clearSelection();
    } catch (bulkError) {
      showToast('Failed to apply label to one or more samples', 'error');
    }
  }

  async function applyLabelToSample(sampleId, label) {
    try {
      const response = await fetch(BASE_URL + '/samples/' + sampleId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentLabel: label }),
      });
      if (!response.ok) throw new Error('Failed to update sample');
      const data = await response.json();
      handleSampleUpdate(data);
      showToast('Labeled "' + label + '" via keyboard shortcut');
    } catch (err) {
      showToast('Failed to apply label', 'error');
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
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to fetch samples');
        }
        return response.json();
      })
      .then(function (data) {
        setSamples(data);
        setLoading(false);
        setError(null);
      })
      .catch(function (fetchError) {
        if (!cached || cached.length === 0) {
          setError(fetchError.message);
        }
        setLoading(false);
      });
  }, [loadCache, clearCache, boardId]);

  useSocket(handleSampleUpdate, showToast);

  const filteredSamples = useMemo(() => {
    return samples.filter(function (sample) {
      const matchesSearch = (sample.content || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || (sample.type && sample.type.toLowerCase() === typeFilter.toLowerCase());
      const matchesStatus = statusFilter === 'All' || sample.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [samples, searchTerm, typeFilter, statusFilter]);

  // Flat, on-screen order (grouped by column, same order the board renders them)
  const flatOrder = useMemo(() => {
    const list = [];
    COLUMNS.forEach(function (columnStatus) {
      filteredSamples.forEach(function (sample) {
        if (sample.status === columnStatus) list.push(sample.id);
      });
    });
    return list;
  }, [filteredSamples]);

  // Keyboard shortcuts: arrow keys move focus, 1/2 apply a label to the focused card
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (flatOrder.length === 0) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedId(function (current) {
          const index = flatOrder.indexOf(current);
          const nextIndex = index === -1 ? 0 : Math.min(index + 1, flatOrder.length - 1);
          return flatOrder[nextIndex];
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedId(function (current) {
          const index = flatOrder.indexOf(current);
          const prevIndex = index === -1 ? 0 : Math.max(index - 1, 0);
          return flatOrder[prevIndex];
        });
      } else if (e.key === '1' && focusedId) {
        applyLabelToSample(focusedId, 'Positive');
      } else if (e.key === '2' && focusedId) {
        applyLabelToSample(focusedId, 'Negative');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return function () {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [flatOrder, focusedId]);

  if (loading) return <LoadingState />;
if (error) return <ErrorState message={error} />;

return (
  <div className="board">
    <PresenceBar users={presenceUsers} />

    <p className="board-shortcut-hint">
      Tip: use arrow keys to move between cards, press 1 or 2 to label the focused card.
    </p>

    <div className="board-toolbar">
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <ExportButton />
    </div>

    <AddSampleForm boardId={boardId} onSampleAdded={handleSampleAdded} />

    {samples.length === 0 ? (
      <EmptyState />
    ) : (
      <>
        <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
          {COLUMNS.map(function (columnStatus) {
            return (
              <Column
                key={columnStatus}
                title={columnStatus}
                status={columnStatus}
                samples={filteredSamples.filter(function (sample) { return sample.status === columnStatus; })}
                onSelectSample={setSelectedSample}
                onSampleUpdate={handleSampleUpdate}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                focusedId={focusedId}
                labels={boardLabels}
              />
            );
          })}
        </div>

        <SampleDetail sample={selectedSample} onClose={() => setSelectedSample(null)} />

        <BulkActionBar
          selectedCount={selectedIds.size}
          onApplyLabel={handleBulkApply}
          onClear={clearSelection}
        />
      </>
    )}
  </div>
);
}

export default Board;
