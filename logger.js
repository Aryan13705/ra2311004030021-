// logger.js — Logging middleware for Campus Notifications service
// Used by all modules — direct console.log usage is not permitted.
const logger = {
  info:  (msg) => console.log(`[INFO]: ${msg}`),
  warn:  (msg) => console.warn(`[WARN]: ${msg}`),
  error: (msg) => console.error(`[ERROR]: ${msg}`),
  debug: (msg) => console.log(`[DEBUG]: ${msg}`),
};

module.exports = logger;
