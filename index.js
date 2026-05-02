const axios  = require("axios");
const logger  = require("./logger");
const mockData = require("./mockData");

const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

/**
 * Fetches and ranks the top-N campus notifications.
 * Priority = type weight (Placement > Result > Event) + recency tiebreaker.
 *
 * @param {number} limit - Max notifications to return (default 10)
 */
async function getTopNotifications(limit = 10) {
  logger.info(`getTopNotifications called — limit=${limit}`);

  try {
    let response;

    if (process.env.USE_MOCK === "true") {
      logger.info("USE_MOCK=true — loading local mock dataset");
      response = { data: mockData };
    } else {
      const authToken = process.env.AUTH_TOKEN;

      if (!authToken) {
        logger.error("AUTH_TOKEN environment variable is not set — cannot authenticate with the API");
        throw new Error("Missing AUTH_TOKEN. Set USE_MOCK=true for local testing.");
      }

      logger.info("Fetching notifications from evaluation-service API");
      logger.debug(`Endpoint: http://20.207.122.201/evaluation-service/notifications`);

      response = await axios.get(
        "http://20.207.122.201/evaluation-service/notifications",
        {
          timeout: 5000,
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      logger.info(`API responded — HTTP 200`);
    }

    const notifications = response.data.notifications;
    logger.info(`Raw notification count: ${notifications.length}`);

    // Sort by priority weight first, then by recency
    const sorted = [...notifications].sort((a, b) => {
      const weightDiff = TYPE_WEIGHT[b.Type] - TYPE_WEIGHT[a.Type];
      return weightDiff !== 0 ? weightDiff : new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    logger.debug(`Sorted — top item: [${sorted[0]?.Type}] ${sorted[0]?.Message}`);

    const top = sorted.slice(0, limit);
    logger.info(`Returning top ${top.length} priority notifications`);

    // Log breakdown by type
    const breakdown = top.reduce((acc, n) => {
      acc[n.Type] = (acc[n.Type] || 0) + 1;
      return acc;
    }, {});
    logger.debug(`Top-${limit} breakdown: ${JSON.stringify(breakdown)}`);

    return top;

  } catch (err) {
    logger.error(`Failed to fetch notifications — ${err.message}`);
    throw err;
  }
}

// Entry point
logger.info("Starting notification priority service");
getTopNotifications()
  .then(data => {
    logger.info(`FINAL OUTPUT ready — ${data.length} notifications`);
    console.log("FINAL OUTPUT:", data);
  })
  .catch(err => {
    logger.error(`Unhandled failure: ${err.message}`);
    process.exit(1);
  });