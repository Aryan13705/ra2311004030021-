"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import NotificationCard from "../../components/NotificationCard";
import {
  rankNotifications, loadReadSet, persistRead, SAMPLE_DATA
} from "../../utils/helpers";

const ENDPOINT = "http://20.207.122.201/evaluation-service/notifications";

export default function PriorityPage() {
  const [inbox,    setInbox]    = useState([]);
  const [topN,     setTopN]     = useState(10);
  const [busy,     setBusy]     = useState(true);
  const [readSet,  setReadSet]  = useState(new Set());
  const [mockMode, setMockMode] = useState(false);

  useEffect(() => setReadSet(loadReadSet()), []);

  const pull = useCallback(async () => {
    setBusy(true);
    try {
      const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      const resp  = await fetch(`${ENDPOINT}?limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!resp.ok) throw new Error("non-2xx");
      const body = await resp.json();
      setInbox(rankNotifications(body.notifications ?? body));
      setMockMode(false);
    } catch {
      setInbox(rankNotifications(SAMPLE_DATA));
      setMockMode(true);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { pull(); }, [pull]);

  function markRead(id) {
    const next = new Set(readSet);
    next.add(id);
    persistRead(next);
    setReadSet(next);
  }

  function markAllRead() {
    const next = new Set(readSet);
    shortlist.forEach(n => next.add(n.ID));
    persistRead(next);
    setReadSet(next);
  }

  const shortlist   = inbox.slice(0, topN);
  const unreadHere  = shortlist.filter(n => !readSet.has(n.ID)).length;
  const totalUnread = inbox.filter(n => !readSet.has(n.ID)).length;

  return (
    <div className="shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-dot">📢</div>
          <div>
            <div className="brand-name">Campus<br />Notify</div>
          </div>
        </div>

        <p className="nav-section-label">Pages</p>

        <Link href="/" className="nav-link">
          <span className="nav-icon">📬</span>
          All Notifications
          {totalUnread > 0 && <span className="badge-count">{totalUnread}</span>}
        </Link>

        <Link href="/priority" className="nav-link active">
          <span className="nav-icon">⭐</span>
          Priority Inbox
        </Link>

        <div className="sidebar-divider" />

        {/* Top-N Slider */}
        <div style={{ padding: "4px 20px" }}>
          <p className="filter-label" style={{ marginBottom: 8 }}>Top-N limit</p>
          <div className="slider-row">
            <span className="slider-val">{topN}</span>
            <span className="slider-label">notifications</span>
          </div>
          <input
            type="range"
            min={5}
            max={Math.max(20, inbox.length)}
            step={5}
            value={topN}
            onChange={e => setTopN(Number(e.target.value))}
          />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", color:"var(--text-muted)", fontFamily:"var(--mono)", marginTop:4 }}>
            <span>5</span><span>10</span><span>15</span><span>20</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        <button
          className="nav-link"
          onClick={pull}
          style={{ background:"none", border:"none", cursor:"pointer", width:"100%", textAlign:"left" }}
        >
          <span className="nav-icon">↻</span>
          Refresh
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="content">
        <div className="page-header">
          <h1 className="page-title">⭐ Priority Inbox</h1>
          <div className="page-meta">
            <span>{busy ? "syncing…" : `Top ${topN} of ${inbox.length}`}</span>
            {unreadHere > 0 && (
              <><span className="meta-dot">·</span><span>{unreadHere} unread</span></>
            )}
            {mockMode && (
              <><span className="meta-dot">·</span><span style={{ color:"#f59e0b" }}>demo data</span></>
            )}
          </div>
        </div>

        {mockMode && (
          <div className="info-banner">
            ℹ️ &nbsp;No live token — showing demo data. Set <code>NEXT_PUBLIC_AUTH_TOKEN</code> in <code>.env.local</code>.
          </div>
        )}

        {/* Priority legend */}
        <div className="legend-row">
          <span className="legend-chip" style={{ background:"#052e16", color:"#22c55e" }}>🎓 Placement — weight 3</span>
          <span className="legend-chip" style={{ background:"#451a03", color:"#f59e0b" }}>📈 Result — weight 2</span>
          <span className="legend-chip" style={{ background:"#4c0519", color:"#f43f5e" }}>📅 Event — weight 1</span>
        </div>

        <div className="toolbar">
          {unreadHere > 0 && (
            <button className="btn btn-ghost" onClick={markAllRead}>
              ✓ Mark all read
            </button>
          )}
          <button className="btn btn-ghost" onClick={pull}>↻ Refresh</button>
        </div>

        {busy && <div className="spinner" />}

        {!busy && shortlist.length === 0 && (
          <div className="state-box">
            <div className="state-emoji">📭</div>
            <p>No notifications yet.</p>
          </div>
        )}

        {!busy && (
          <div className="notif-list">
            {shortlist.map((item, idx) => (
              <NotificationCard
                key={item.ID}
                item={item}
                isRead={readSet.has(item.ID)}
                onRead={markRead}
                rank={idx + 1}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
