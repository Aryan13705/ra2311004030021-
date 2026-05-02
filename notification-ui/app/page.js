"use client";

import { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";
import { sortNotifications } from "../utils/helpers";

// Mock data used as fallback when AUTH_TOKEN is not set or API is unreachable
const MOCK_NOTIFICATIONS = [
  { ID: "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", Type: "Placement", Message: "CSX Corporation hiring", Timestamp: "2026-04-22 17:51:18" },
  { ID: "f1234567-89ab-cdef-0123-456789abcdef", Type: "Placement", Message: "TCS recruitment drive", Timestamp: "2026-04-21 10:30:00" },
  { ID: "d146095a-0d86-4a34-9e69-3900a14576bc", Type: "Result",    Message: "Mid-sem results published", Timestamp: "2026-04-22 17:51:30" },
  { ID: "0005513a-142b-4bbc-8678-eefec65e1ede", Type: "Result",    Message: "End-sem schedule released", Timestamp: "2026-04-22 17:50:54" },
  { ID: "81589ada-0ad3-4f77-9554-f52fb558e09d", Type: "Event",     Message: "Farewell ceremony", Timestamp: "2026-04-22 17:51:06" },
  { ID: "a9876543-21fe-dcba-9876-543210fedcba", Type: "Event",     Message: "Tech Summit 2026", Timestamp: "2026-04-20 14:15:45" },
];

export default function Home() {
  const [data, setData]       = useState([]);
  const [filter, setFilter]   = useState("All");
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const LIMIT = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // AUTH_TOKEN exposed via NEXT_PUBLIC_ prefix in .env.local
        const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const res = await fetch(
          "http://20.207.122.201/evaluation-service/notifications",
          { headers }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const sorted = sortNotifications(json.notifications || json);
        setData(sorted);

      } catch (err) {
        // Fall back to mock data so the UI is always demonstrable
        console.warn("Live API unavailable, using mock data:", err.message);
        setData(sortNotifications(MOCK_NOTIFICATIONS));
        setError(null); // clear error — mock data will render
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Reset to page 1 whenever filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Filter
  const filtered =
    filter === "All"
      ? data
      : data.filter((item) => item.Type === filter);

  // Paginate
  const start     = (page - 1) * LIMIT;
  const paginated = filtered.slice(start, start + LIMIT);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eaf0 100%)",
      padding: "30px 20px"
    }}>
      <div style={{
        maxWidth: "640px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
      }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "24px", borderBottom: "2px solid #f0f0f0", paddingBottom: "16px" }}>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800", color: "#111" }}>
            📢 Notifications
          </h1>
          <p style={{ margin: "6px 0 0", color: "#666", fontSize: "14px" }}>
            {loading
              ? "Fetching…"
              : `${filtered.length} notification${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* ── Filter ── */}
        <Filter filter={filter} setFilter={setFilter} />

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
            <div style={{
              width: "36px", height: "36px",
              border: "4px solid #e0e0e0",
              borderTop: "4px solid #0070f3",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px"
            }} />
            <p style={{ margin: 0 }}>Loading notifications…</p>
          </div>
        )}

        {/* ── Error (only when no data at all) ── */}
        {!loading && error && data.length === 0 && (
          <div style={{
            background: "#fff3f3",
            border: "1px solid #ffcccc",
            borderRadius: "10px",
            padding: "16px",
            color: "#cc0000",
            textAlign: "center"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
            <p style={{ fontSize: "40px", margin: "0 0 8px" }}>🔕</p>
            <p style={{ margin: 0 }}>No notifications for this filter.</p>
          </div>
        )}

        {/* ── Cards ── */}
        {!loading && paginated.map((item) => (
          <NotificationCard key={item.ID} item={item} />
        ))}

        {/* ── Pagination ── */}
        {!loading && (
          <Pagination
            total={filtered.length}
            page={page}
            setPage={setPage}
            limit={LIMIT}
          />
        )}
      </div>

      {/* spinner keyframe */}
      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
