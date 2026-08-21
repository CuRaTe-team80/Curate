import { useState, useEffect, useMemo } from 'react';
import SearchFilterBar from './SearchFilterBar';
import Column from './Column';
import SampleDetail from './SampleDetail';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import './Board.css';

const API_URL = 'http://localhost:5000/samples';
const COLUMNS = ["Unlabeled", "In Review", "Labeled"];

function Board() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch samples');
        return res.json();
      })
      .then((data) => {
        setSamples(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function handleSampleUpdate(updatedSample) {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );
    setSelectedSample((prev) =>
      prev && prev.id === updatedSample.id ? updatedSample : prev
    );
  }

  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      const matchesSearch = (sample.content || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "All" ||
        (sample.type && sample.type.toLowerCase() === typeFilter.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || sample.status === statusFilter;

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

      <div style={{ display: "flex", gap: "var(--space-5)" }}>
        {COLUMNS.map((columnStatus) => (
          <Column
            key={columnStatus}
            title={columnStatus}
            status={columnStatus}
            samples={filteredSamples.filter((s) => s.status === columnStatus)}
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