export const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

export function sortNotifications(data) {
  return [...data].sort((a, b) => {
    const w = TYPE_WEIGHT[b.Type] - TYPE_WEIGHT[a.Type];
    if (w !== 0) return w;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

export function getPriorityColor(type) {
  if (type === "Placement") return "#d4edda"; // green
  if (type === "Result") return "#fff3cd";   // yellow
  return "#f8d7da";                          // red (Event)
}
