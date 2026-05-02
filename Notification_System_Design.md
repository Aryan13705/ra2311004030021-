# Stage 1

## Problem Statement

The campus notification platform receives a high volume of notifications across three types: **Placements**, **Results**, and **Events**. Students were losing track of the most important ones. The goal is to implement a **Priority Inbox** that always surfaces the top `n` most important unread notifications first.

---

## Approach

### Priority Scoring

Priority is determined by two factors combined:

1. **Type Weight** (primary sort key)

   | Type      | Weight |
   |-----------|--------|
   | Placement | 3      |
   | Result    | 2      |
   | Event     | 1      |

   Placements are highest priority — they are time-sensitive career opportunities. Results are next (academic impact). Events are the lowest (informational/social).

2. **Recency** (secondary sort key — tiebreaker)

   When two notifications share the same type weight, the more recent one (by `Timestamp`) is ranked higher. This ensures fresh information always floats to the top within a tier.

### Algorithm

```
sort(notifications, key = (TYPE_WEIGHT[b.Type] - TYPE_WEIGHT[a.Type]) || (b.Timestamp - a.Timestamp))
return sorted.slice(0, n)
```

This is a single-pass stable sort — **O(N log N)** time complexity, **O(N)** space.

---

## Maintaining Top-N as New Notifications Arrive

As new notifications keep coming in, we need an efficient strategy to avoid re-sorting the entire list every time.

### Solution: Min-Heap of size N

- Maintain a **min-heap** of size `n`, keyed on `(type_weight, timestamp)`.
- For each incoming notification:
  - If heap size < n → push directly.
  - If the new notification has **higher priority** than the heap's minimum → pop min, push new.
  - Otherwise → discard.
- Result: always O(log n) insertion, O(1) read of top-n.

This ensures **constant memory usage** (capped at `n` entries) and **efficient live updates** regardless of how many new notifications stream in.

---

## Implementation Details

- **Language**: JavaScript (Node.js)
- **File**: `index.js`
- **Auth**: Bearer token via `AUTH_TOKEN` environment variable
- **Fallback**: `USE_MOCK=true` uses local `mockData.js` when the live API is unavailable
- **Logging**: Custom middleware (`logger.js`) replaces raw `console.log` with tagged `[INFO]` / `[ERROR]` output

---

## Output

Running with mock data (`USE_MOCK=true node index.js`) returns the top 10 notifications sorted by priority:

```
[INFO]: Fetching notifications...
[INFO]: Using mock data
[INFO]: Fetched 6 notifications
[INFO]: Top notifications calculated
FINAL OUTPUT: [
  { ID: 'b283218f...', Type: 'Placement', Message: 'CSX Corporation hiring',  Timestamp: '2026-04-22 17:51:18' },
  { ID: 'f1234567...', Type: 'Placement', Message: 'TCS recruitment drive',   Timestamp: '2026-04-21 10:30:00' },
  { ID: 'd146095a...', Type: 'Result',    Message: 'mid-sem',                 Timestamp: '2026-04-22 17:51:30' },
  ...
]
```

Screenshot of actual output → `output.png`
