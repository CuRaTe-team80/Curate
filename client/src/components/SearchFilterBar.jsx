// client/src/components/SearchFilterBar.jsx

const TYPE_OPTIONS = ["All", "Text", "Image"];
const STATUS_OPTIONS = ["All", "Unlabeled", "In Review", "Labeled"];

// Controlled component — Board.jsx owns the actual filter state and
// passes down the current values plus setter callbacks.
function SearchFilterBar({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--space-5)",
        padding: "var(--space-4)",
        marginBottom: "var(--space-5)",
      }}
    >
      <input
        type="text"
        className="input"
        placeholder="Search samples..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ flex: 1, minWidth: "200px" }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.9em" }}>
          Type
        </span>
        <div style={{ display: "flex", gap: "var(--space-1)" }}>
          {TYPE_OPTIONS.map((option) => {
            const isActive = typeFilter === option;
            return (
              <button
                key={option}
                type="button"
                className="btn"
                onClick={() => onTypeFilterChange(option)}
                style={{
                  padding: "var(--space-1) var(--space-3)",
                  backgroundColor: isActive ? "var(--color-primary)" : "var(--color-surface)",
                  border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                  color: isActive ? "var(--color-surface)" : "var(--color-text-muted)",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.9em" }}>
          Status
        </span>
        <div style={{ display: "flex", gap: "var(--space-1)" }}>
          {STATUS_OPTIONS.map((option) => {
            const isActive = statusFilter === option;
            return (
              <button
                key={option}
                type="button"
                className="btn"
                onClick={() => onStatusFilterChange(option)}
                style={{
                  padding: "var(--space-1) var(--space-3)",
                  backgroundColor: isActive ? "var(--color-primary)" : "var(--color-surface)",
                  border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                  color: isActive ? "var(--color-surface)" : "var(--color-text-muted)",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SearchFilterBar;