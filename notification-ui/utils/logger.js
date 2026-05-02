/**
 * logger.js — Frontend logging middleware for Campus Notify UI
 *
 * Mirrors the interface of the backend logging middleware (logger.js)
 * so all logging follows the same [LEVEL]: message format across the stack.
 *
 * Rules:
 *  - All log output goes through this module — never raw console.*
 *  - INFO  → operational events (fetches, filter changes, page loads)
 *  - WARN  → recoverable issues (API unavailable, falling back to mock)
 *  - ERROR → failures that affect the user (bad response, parse error)
 *  - DEBUG → developer-level detail (data shapes, counts)
 */

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const MIN_LEVEL  = LOG_LEVELS.DEBUG; // show everything in dev

function stamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function emit(level, msg, data) {
  if (LOG_LEVELS[level] < MIN_LEVEL) return;

  const line = `[${level}] [${stamp()}] ${msg}`;

  if (level === "ERROR") {
    // eslint-disable-next-line no-console
    console.error(line, data !== undefined ? data : "");
  } else if (level === "WARN") {
    // eslint-disable-next-line no-console
    console.warn(line, data !== undefined ? data : "");
  } else {
    // eslint-disable-next-line no-console
    console.log(line, data !== undefined ? data : "");
  }
}

const logger = {
  info:  (msg, data) => emit("INFO",  msg, data),
  warn:  (msg, data) => emit("WARN",  msg, data),
  error: (msg, data) => emit("ERROR", msg, data),
  debug: (msg, data) => emit("DEBUG", msg, data),
};

export default logger;
