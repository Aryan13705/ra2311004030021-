export default function Filter({ filter, setFilter }) {
  const types = ["All", "Placement", "Result", "Event"];

  const colors = {
    All: "#0070f3",
    Placement: "#28a745",
    Result: "#ffc107",
    Event: "#dc3545"
  };

  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {types.map((t) => {
        const isActive = filter === t;
        return (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: "8px 16px",
              background: isActive ? colors[t] : "#f0f0f0",
              color: isActive ? "#fff" : "#555",
              border: `2px solid ${isActive ? colors[t] : "transparent"}`,
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: isActive ? "700" : "500",
              fontSize: "14px",
              transition: "all 0.2s ease",
              boxShadow: isActive ? `0 3px 10px ${colors[t]}44` : "none",
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
