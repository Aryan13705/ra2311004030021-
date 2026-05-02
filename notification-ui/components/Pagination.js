export default function Pager({ total, current, perPage, onSelect }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;

  return (
    <div className="pager">
      <button
        className="pager-btn"
        disabled={current === 1}
        onClick={() => onSelect(current - 1)}
      >
        ←
      </button>

      {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          className={`pager-btn ${current === n ? "active" : ""}`}
          onClick={() => onSelect(n)}
        >
          {n}
        </button>
      ))}

      <button
        className="pager-btn"
        disabled={current === pages}
        onClick={() => onSelect(current + 1)}
      >
        →
      </button>
    </div>
  );
}
