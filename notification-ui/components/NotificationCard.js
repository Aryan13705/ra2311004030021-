import { getPriorityColor } from "../utils/helpers";

const TYPE_ICON = {
  Placement: "🎓",
  Result: "📊",
  Event: "📅"
};

const TYPE_BORDER = {
  Placement: "#28a745",
  Result: "#ffc107",
  Event: "#dc3545"
};

export default function NotificationCard({ item }) {
  const bgColor = getPriorityColor(item.Type);
  const borderColor = TYPE_BORDER[item.Type] || "#999";
  const icon = TYPE_ICON[item.Type] || "🔔";

  return (
    <div style={{
      background: bgColor,
      borderLeft: `5px solid ${borderColor}`,
      borderRadius: "10px",
      padding: "14px 16px",
      marginBottom: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
    }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <span style={{ fontSize: "18px" }}>{icon}</span>
        <span style={{
          fontWeight: "700",
          fontSize: "14px",
          color: borderColor,
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          {item.Type}
        </span>
      </div>
      <p style={{
        margin: "0 0 8px 0",
        fontSize: "15px",
        color: "#333",
        lineHeight: "1.5"
      }}>
        {item.Message}
      </p>
      <small style={{ color: "#666", fontSize: "12px" }}>
        🕐 {new Date(item.Timestamp).toLocaleString()}
      </small>
    </div>
  );
}
