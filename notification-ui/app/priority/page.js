"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box, Container, Typography, Alert, CircularProgress,
  AppBar, Toolbar, Button, Badge, Slider, Paper,
  Divider, Chip, IconButton, Tooltip
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Link from "next/link";

import NotificationCard from "../../components/NotificationCard";
import { sortNotifications, getReadIds, markAsRead, markAllRead, MOCK_NOTIFICATIONS } from "../../utils/helpers";

const API_BASE = "http://20.207.122.201/evaluation-service/notifications";

export default function PriorityPage() {
  const [allData, setAllData]     = useState([]);
  const [topN, setTopN]           = useState(10);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [readIds, setReadIds]     = useState(new Set());
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => { setReadIds(getReadIds()); }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      const res = await fetch(`${API_BASE}?limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setAllData(sortNotifications(json.notifications || json));
      setUsingMock(false);
    } catch (err) {
      console.warn("Using mock data:", err.message);
      setAllData(sortNotifications(MOCK_NOTIFICATIONS));
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRead = (id) => {
    markAsRead(id);
    setReadIds(getReadIds());
  };

  const handleMarkAllRead = () => {
    markAllRead(priorityList.map(n => n.ID));
    setReadIds(getReadIds());
  };

  const priorityList  = allData.slice(0, topN);
  const unreadCount   = priorityList.filter(n => !readIds.has(n.ID)).length;
  const totalUnread   = allData.filter(n => !readIds.has(n.ID)).length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f4f8" }}>
      {/* ── AppBar ── */}
      <AppBar position="sticky" elevation={2} sx={{ background: "linear-gradient(135deg, #1565c0, #1e88e5)" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Badge badgeContent={totalUnread} color="error" max={99}>
              <NotificationsIcon />
            </Badge>
            <Typography variant="h6" fontWeight={700}>
              Campus Notifications
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              component={Link}
              href="/"
              color="inherit"
              size="small"
              sx={{ fontWeight: 600 }}
              startIcon={<NotificationsIcon />}
            >
              All
            </Button>
            <Button
              component={Link}
              href="/priority"
              color="inherit"
              variant="contained"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.25)", fontWeight: 700 }}
              startIcon={<StarIcon />}
            >
              Priority
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* ── Header ── */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: "1px solid #e0e7ef" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <EmojiEventsIcon color="warning" />
              <Box>
                <Typography variant="h5" fontWeight={800} color="primary.dark">
                  Priority Inbox
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Top {topN} most important notifications
                  {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchData} size="small" color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DoneAllIcon />}
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </Button>
              )}
            </Box>
          </Box>

          {/* ── Top-N Slider ── */}
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Show top <strong>{topN}</strong> notifications
            </Typography>
            <Slider
              value={topN}
              onChange={(_, val) => setTopN(val)}
              min={5}
              max={Math.max(20, allData.length)}
              step={5}
              marks={[
                { value: 5,  label: "5" },
                { value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" },
              ]}
              valueLabelDisplay="auto"
              color="primary"
              sx={{ maxWidth: 400 }}
            />
          </Box>

          {usingMock && (
            <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2 }}>
              Showing mock data — add <strong>NEXT_PUBLIC_AUTH_TOKEN</strong> to .env.local for live data.
            </Alert>
          )}
        </Paper>

        {/* ── Priority legend ── */}
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip label="🎓 Placement — highest" color="success" size="small" />
          <Chip label="📊 Result — medium"    color="warning" size="small" />
          <Chip label="📅 Event — lowest"     color="error"   size="small" />
        </Box>

        {/* ── States ── */}
        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>⚠️ {error}</Alert>
        )}

        {!loading && priorityList.length === 0 && (
          <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Typography fontSize={40}>🔕</Typography>
            <Typography color="text.secondary">No notifications found.</Typography>
          </Paper>
        )}

        {/* ── Cards ── */}
        {!loading && priorityList.map((item, idx) => (
          <Box key={item.ID} position="relative">
            {idx < 3 && (
              <Chip
                label={`#${idx + 1}`}
                size="small"
                color={idx === 0 ? "warning" : "default"}
                sx={{
                  position: "absolute", top: 8, right: 8, zIndex: 1,
                  fontWeight: 700, fontSize: "11px"
                }}
              />
            )}
            <NotificationCard
              item={item}
              isRead={readIds.has(item.ID)}
              onRead={handleRead}
            />
          </Box>
        ))}
      </Container>
    </Box>
  );
}
