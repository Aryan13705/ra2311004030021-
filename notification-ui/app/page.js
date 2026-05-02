"use client";

import { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";
import { sortNotifications } from "../utils/helpers";

export default function Home() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LIMIT = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "http://20.207.122.201/evaluation-service/notifications"
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const sorted = sortNotifications(json.notifications || json);
        setData(sorted);
      } catch (err) {
        setError("Failed to fetch notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Filter
  const filtered =
    filter === "All"
      ? data
      : data.filter((item) => item.Type === filter);

  // Pagination
  const start = (page - 1) * LIMIT;
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
        {/* Header */}
        <div style={{ marginBottom: "24px", borderBottom: "2px solid #f0f0f0", paddingBottom: "16px" }}>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800", color: "#111" }}>
            📢 Notifications
          </h1>
          <p style={{ margin: "6px 0 0", color: "#666", fontSize: "14px" }}>
            {loading ? "Fetching..." : `${filtered.length} notification${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Filter */}
        <Filter filter={filter} setFilter={setFilter} />

        {/* Loading state */}
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

        {/* Error state */}
        {error && (
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

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
            <p style={{ fontSize: "40px", margin: "0 0 8px" }}>🔕</p>
            <p style={{ margin: 0 }}>No notifications for this filter.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && paginated.map((item) => (
          <NotificationCard key={item.ID} item={item} />
        ))}

        {/* Pagination */}
        {!loading && !error && (
          <Pagination
            total={filtered.length}
            page={page}
            setPage={setPage}
            limit={LIMIT}
          />
        )}
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
