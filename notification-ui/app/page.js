"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import NotificationCard from "../components/NotificationCard";
import SidebarFilter from "../components/Filter";
import Pager from "../components/Pagination";
import {
  rankNotifications, loadReadSet, persistRead, SAMPLE_DATA
} from "../utils/helpers";
import logger from "../utils/logger";

const PER_PAGE = 5;
const ENDPOINT = "http://20.207.122.201/evaluation-service/notifications";

export default function InboxPage() {
  const [inbox,    setInbox]    = useState([]);
  const [filter,   setFilter]   = useState("All");
  const [page,     setPage]     = useState(1);
  const [busy,     setBusy]     = useState(true);
  const [readSet,  setReadSet]  = useState(new Set());
  const [mockMode, setMockMode] = useState(false);

  // Hydrate read-state from localStorage after first paint
  useEffect(() => {
    logger.info("InboxPage mounted — loading read-state from localStorage");
    setReadSet(loadReadSet());
  }, []);

  const pullNotifications = useCallback(async () => {
    logger.info(`Fetching notifications from ${ENDPOINT}`);
    setBusy(true);

    try {
      const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

      if (!token) {
        logger.warn("NEXT_PUBLIC_AUTH_TOKEN not set — request will be sent without Authorization header");
      }

      const qs   = new URLSearchParams({ limit: "100" });
      const url  = `${ENDPOINT}?${qs}`;
      logger.debug(`GET ${url}`);

      const resp = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      logger.info(`Response received — status ${resp.status}`);

      if (!resp.ok) throw new Error(`Non-2xx response: ${resp.status}`);

      const body  = await resp.json();
      const items = rankNotifications(body.notifications ?? body);

      logger.info(`Fetched ${items.length} notifications — ranked by priority`);
      logger.debug("Type breakdown", {
        Placement: items.filter(n => n.Type === "Placement").length,
        Result:    items.filter(n => n.Type === "Result").length,
        Event:     items.filter(n => n.Type === "Event").length,
      });

      setInbox(items);
      setMockMode(false);

    } catch (err) {
      logger.warn(`Live API unavailable (${err.message}) — falling back to mock data`);
      const ranked = rankNotifications(SAMPLE_DATA);
      logger.info(`Loaded ${ranked.length} mock notifications`);
      setInbox(ranked);
      setMockMode(true);
    } finally {
      setBusy(false);
      logger.debug("Fetch cycle complete");
    }
  }, []);

  useEffect(() => {
    pullNotifications();
  }, [pullNotifications]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    logger.info(`Filter changed to "${filter}" — resetting to page 1`);
    setPage(1);
  }, [filter]);

  function markRead(id) {
    logger.info(`Marking notification as read: ${id}`);
    const next = new Set(readSet);
    next.add(id);
    persistRead(next);
    setReadSet(next);
  }

  function markAllRead() {
    const ids = visible.map(n => n.ID);
    logger.info(`Marking ${ids.length} notifications as read (bulk)`);
    const next = new Set(readSet);
    ids.forEach(id => next.add(id));
    persistRead(next);
    setReadSet(next);
  }

  const visible = filter === "All" ? inbox : inbox.filter(n => n.Type === filter);
  const slice   = visible.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const unread  = inbox.filter(n => !readSet.has(n.ID)).length;

  const counts = {
    All:       inbox.length,
    Placement: inbox.filter(n => n.Type === "Placement").length,
    Result:    inbox.filter(n => n.Type === "Result").length,
    Event:     inbox.filter(n => n.Type === "Event").length,
  };

  logger.debug(`Rendering InboxPage — filter="${filter}" page=${page} visible=${visible.length} unread=${unread}`);

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
          onClick={() => { logger.info("Manual refresh triggered"); pullNotifications(); }}
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
            {mockMode && <><span className="meta-dot">·</span><span style={{ color: "#f59e0b" }}>demo data</span></>}
          </div>
        </div>

        {mockMode && (
          <div className="info-banner">
            ℹ️ &nbsp;No live token — showing demo data. Set <code>NEXT_PUBLIC_AUTH_TOKEN</code> in <code>.env.local</code>.
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
            onSelect={(p) => { logger.info(`Page changed to ${p}`); setPage(p); }}
          />
        )}
      </main>
    </div>
  );
}
