"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import NotificationCard from "../components/NotificationCard";
import SidebarFilter from "../components/Filter";
import Pager from "../components/Pagination";
import {
  rankNotifications, loadReadSet, persistRead, SAMPLE_DATA
} from "../utils/helpers";

const PER_PAGE   = 5;
const ENDPOINT   = "http://20.207.122.201/evaluation-service/notifications";

export default function InboxPage() {
  const [inbox,    setInbox]    = useState([]);
  const [filter,   setFilter]   = useState("All");
  const [page,     setPage]     = useState(1);
  const [busy,     setBusy]     = useState(true);
  const [readSet,  setReadSet]  = useState(new Set());
  const [mockMode, setMockMode] = useState(false);

  // hydrate read state from localStorage after mount
  useEffect(() => setReadSet(loadReadSet()), []);

  const pullNotifications = useCallback(async () => {
    setBusy(true);
    try {
      const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      const qs    = new URLSearchParams({ limit: "100" });
      const resp  = await fetch(`${ENDPOINT}?${qs}`, {
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

  useEffect(() => { pullNotifications(); }, [pullNotifications]);
  useEffect(() => { setPage(1); }, [filter]);

  function markRead(id) {
    const next = new Set(readSet);
    next.add(id);
    persistRead(next);
    setReadSet(next);
  }

  function markAllRead() {
    const next = new Set(readSet);
    visible.forEach(n => next.add(n.ID));
    persistRead(next);
    setReadSet(next);
  }

  const visible  = filter === "All" ? inbox : inbox.filter(n => n.Type === filter);
  const slice    = visible.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const unread   = inbox.filter(n => !readSet.has(n.ID)).length;

  const counts = {
    All:       inbox.length,
    Placement: inbox.filter(n => n.Type === "Placement").length,
    Result:    inbox.filter(n => n.Type === "Result").length,
    Event:     inbox.filter(n => n.Type === "Event").length,
  };

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

        <Link href="/" className="nav-link active">
          <span className="nav-icon">📬</span>
          All Notifications
          {unread > 0 && <span className="badge-count">{unread}</span>}
        </Link>

        <Link href="/priority" className="nav-link">
          <span className="nav-icon">⭐</span>
          Priority Inbox
        </Link>

        <div className="sidebar-divider" />

        <SidebarFilter active={filter} onChange={setFilter} counts={counts} />

        <div className="sidebar-divider" />

        <button
          className="nav-link"
          onClick={pullNotifications}
          style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
        >
          <span className="nav-icon">↻</span>
          Refresh
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="content">
        <div className="page-header">
          <h1 className="page-title">All Notifications</h1>
          <div className="page-meta">
            <span>{busy ? "syncing…" : `${visible.length} notifications`}</span>
            {unread > 0 && <><span className="meta-dot">·</span><span>{unread} unread</span></>}
            {mockMode && <><span className="meta-dot">·</span><span style={{color:"#f59e0b"}}>demo data</span></>}
          </div>
        </div>

        {mockMode && (
          <div className="info-banner">
            ℹ️ &nbsp;No live token — showing demo data. Set <code>NEXT_PUBLIC_AUTH_TOKEN</code> in <code>.env.local</code> to connect the real API.
          </div>
        )}

        <div className="toolbar">
          {unread > 0 && (
            <button className="btn btn-ghost" onClick={markAllRead}>
              ✓ Mark visible read
            </button>
          )}
        </div>

        {busy && <div className="spinner" />}

        {!busy && visible.length === 0 && (
          <div className="state-box">
            <div className="state-emoji">🔕</div>
            <p>No notifications match this filter.</p>
          </div>
        )}

        {!busy && (
          <div className="notif-list">
            {slice.map(item => (
              <NotificationCard
                key={item.ID}
                item={item}
                isRead={readSet.has(item.ID)}
                onRead={markRead}
              />
            ))}
          </div>
        )}

        {!busy && (
          <Pager
            total={visible.length}
            current={page}
            perPage={PER_PAGE}
            onSelect={setPage}
          />
        )}
      </main>
    </div>
  );
}
