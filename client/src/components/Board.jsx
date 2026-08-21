// client/src/components/Board.jsx
import { useState, useEffect, useMemo } from "react";
import SearchFilterBar from "./SearchFilterBar";
import Column from "./Column";

function Board() {
  const [samples, setSamples] = useState([]); // full data from the API
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("/samples")
      .then((res) => res.json())
      .then((data) => setSamples(data));
  }, []);

  // Recomputed whenever a dependency changes — no API call, no reload,
  // just filtering the array already held in memory.
  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      const matchesSearch = sample.content
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "All" ||
        sample.type.toLowerCase() === typeFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All" || sample.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [samples, searchTerm, typeFilter, statusFilter]);

  const columns = ["Unlabeled", "In Review", "Labeled"];

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
        style={{ display: "flex", gap: "var(--space-5)" }}
      >
        {columns.map((columnStatus) => (
          <Column
            key={columnStatus}
            status={columnStatus}
            samples={filteredSamples.filter((s) => s.status === columnStatus)}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;