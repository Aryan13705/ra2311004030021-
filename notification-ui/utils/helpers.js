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
  if (type === "Placement") return "#e8f5e9"; // green
  if (type === "Result")    return "#fff8e1"; // amber
  return "#fce4ec";                           // pink/red (Event)
}

export function getPriorityBorder(type) {
  if (type === "Placement") return "#43a047";
  if (type === "Result")    return "#fb8c00";
  return "#e53935";
}

export function getPriorityChipColor(type) {
  if (type === "Placement") return "success";
  if (type === "Result")    return "warning";
  return "error";
}

// Read/unread tracking via localStorage
export function getReadIds() {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem("readNotifications") || "[]"));
  } catch { return new Set(); }
}

export function markAsRead(id) {
  if (typeof window === "undefined") return;
  const ids = getReadIds();
  ids.add(id);
  localStorage.setItem("readNotifications", JSON.stringify([...ids]));
}

export function markAllRead(ids) {
  if (typeof window === "undefined") return;
  const existing = getReadIds();
  ids.forEach(id => existing.add(id));
  localStorage.setItem("readNotifications", JSON.stringify([...existing]));
}

// Mock data fallback
export const MOCK_NOTIFICATIONS = [
  { ID: "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", Type: "Placement", Message: "CSX Corporation hiring — apply before May 10", Timestamp: "2026-04-22 17:51:18" },
  { ID: "f1234567-89ab-cdef-0123-456789abcdef", Type: "Placement", Message: "TCS recruitment drive on campus next week",   Timestamp: "2026-04-21 10:30:00" },
  { ID: "c2345678-89ab-cdef-0123-456789abcdef", Type: "Placement", Message: "Infosys off-campus hiring for 2026 batch",    Timestamp: "2026-04-20 09:00:00" },
  { ID: "d146095a-0d86-4a34-9e69-3900a14576bc", Type: "Result",    Message: "Mid-sem results published on the portal",     Timestamp: "2026-04-22 17:51:30" },
  { ID: "0005513a-142b-4bbc-8678-eefec65e1ede", Type: "Result",    Message: "End-sem schedule released — check dates",     Timestamp: "2026-04-22 17:50:54" },
  { ID: "e3456789-89ab-cdef-0123-456789abcdef", Type: "Result",    Message: "Supplementary exam results declared",         Timestamp: "2026-04-19 11:30:00" },
  { ID: "81589ada-0ad3-4f77-9554-f52fb558e09d", Type: "Event",     Message: "Farewell ceremony — Hall A, 6 PM Saturday",  Timestamp: "2026-04-22 17:51:06" },
  { ID: "a9876543-21fe-dcba-9876-543210fedcba", Type: "Event",     Message: "Tech Summit 2026 — register by April 30",     Timestamp: "2026-04-20 14:15:45" },
  { ID: "d4567890-89ab-cdef-0123-456789abcdef", Type: "Event",     Message: "Annual sports day — May 5, ground floor",     Timestamp: "2026-04-18 08:00:00" },
  { ID: "e5678901-89ab-cdef-0123-456789abcdef", Type: "Event",     Message: "Cultural fest registrations now open",        Timestamp: "2026-04-17 16:00:00" },
];
