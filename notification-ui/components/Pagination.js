export default function Pagination({ total, page, setPage, limit }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div style={{ marginTop: "20px", display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        style={{
          padding: "6px 12px",
          background: page === 1 ? "#e9e9e9" : "#0070f3",
          color: page === 1 ? "#aaa" : "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: page === 1 ? "default" : "pointer",
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        ← Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => setPage(num)}
          style={{
            padding: "6px 12px",
            background: page === num ? "#0070f3" : "#f0f0f0",
            color: page === num ? "#fff" : "#333",
            border: `2px solid ${page === num ? "#0070f3" : "transparent"}`,
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: page === num ? "700" : "400",
            fontSize: "14px",
            transition: "all 0.15s ease",
            minWidth: "36px"
          }}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        style={{
          padding: "6px 12px",
          background: page === totalPages ? "#e9e9e9" : "#0070f3",
          color: page === totalPages ? "#aaa" : "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: page === totalPages ? "default" : "pointer",
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        Next →
      </button>
    </div>
  );
}
