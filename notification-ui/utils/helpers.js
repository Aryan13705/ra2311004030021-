// Priority weights — higher = more important
export const WEIGHT = { Placement: 3, Result: 2, Event: 1 };

// Sort by weight descending, then by recency
export function rankNotifications(list) {
  return [...list].sort((a, b) => {
    const diff = WEIGHT[b.Type] - WEIGHT[a.Type];
    return diff !== 0 ? diff : new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

// CSS class helpers
export function cardClass(type) {
  return type?.toLowerCase() ?? "event";
}

export function tagClass(type) {
  return `notif-type-tag tag-${type?.toLowerCase() ?? "event"}`;
}

export function iconWrapClass(type) {
  return `notif-icon-wrap ${type?.toLowerCase() ?? "event"}`;
}

export function typeIcon(type) {
  return { Placement: "🎓", Result: "📈", Event: "📅" }[type] ?? "🔔";
}

// Relative time  e.g. "2h ago"
export function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── localStorage read/unread ───────────────────────
const LS_KEY = "campus_read_ids_v2";

export function loadReadSet() {
  if (typeof window === "undefined") return new Set();
  try   { return new Set(JSON.parse(localStorage.getItem(LS_KEY) ?? "[]")); }
  catch { return new Set(); }
}

export function persistRead(set) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify([...set]));
}

// ─── Mock data ──────────────────────────────────────
export const SAMPLE_DATA = [
  { ID: "p1", Type: "Placement", Message: "CSX Corporation is conducting a hiring drive for 2026 graduates — apply before May 10", Timestamp: "2026-04-22 17:51:18" },
  { ID: "p2", Type: "Placement", Message: "TCS recruitment walk-in on campus — bring resume and transcripts",                    Timestamp: "2026-04-21 10:30:00" },
  { ID: "p3", Type: "Placement", Message: "Infosys Systems Engineer off-campus registration now open for 2026 batch",            Timestamp: "2026-04-20 09:00:00" },
  { ID: "p4", Type: "Placement", Message: "Wipro WILP hybrid placement programme — last date to apply is April 28",              Timestamp: "2026-04-18 14:00:00" },
  { ID: "r1", Type: "Result",    Message: "Mid-semester results have been uploaded to the student portal",                       Timestamp: "2026-04-22 17:51:30" },
  { ID: "r2", Type: "Result",    Message: "End-semester exam schedule is out — download the timetable from academics portal",     Timestamp: "2026-04-22 17:50:54" },
  { ID: "r3", Type: "Result",    Message: "Supplementary examination results declared for B.Tech 3rd year students",             Timestamp: "2026-04-19 11:30:00" },
  { ID: "e1", Type: "Event",     Message: "Farewell ceremony for 2026 batch — Hall A, Saturday 6 PM, all students welcome",      Timestamp: "2026-04-22 17:51:06" },
  { ID: "e2", Type: "Event",     Message: "Tech Summit 2026 — keynotes, workshops and project demos. Register by April 30",      Timestamp: "2026-04-20 14:15:45" },
  { ID: "e3", Type: "Event",     Message: "Annual sports day May 5th — register your team with the sports secretary by May 1",   Timestamp: "2026-04-18 08:00:00" },
];
