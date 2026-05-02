const FILTERS = [
  { key: "All",       icon: "⬡",  label: "All",        dot: "#64748b" },
  { key: "Placement", icon: "🎓",  label: "Placements", dot: "#22c55e" },
  { key: "Result",    icon: "📈",  label: "Results",    dot: "#f59e0b" },
  { key: "Event",     icon: "📅",  label: "Events",     dot: "#f43f5e" },
];

export default function SidebarFilter({ active, onChange, counts }) {
  return (
    <div>
      <p className="filter-label">Filter by type</p>
      {FILTERS.map(({ key, icon, label, dot }) => (
        <button
          key={key}
          className={`filter-btn ${active === key ? "selected" : ""}`}
          onClick={() => onChange(key)}
        >
          <span className="filter-dot" style={{ background: active === key ? dot : "#2a3a5a" }} />
          <span>{icon} {label}</span>
          {counts?.[key] !== undefined && (
            <span className="filter-count">{counts[key]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
