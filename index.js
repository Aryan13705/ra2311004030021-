const axios = require("axios");
const logger = require("./logger");
const mockData = require("./mockData");

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function getTopNotifications(limit = 10) {
  try {
    logger.info("Fetching notifications...");

    let response;

    // Use mock data if USE_MOCK is set
    if (process.env.USE_MOCK === "true") {
      logger.info("Using mock data");
      response = { data: mockData };
    } else {
      const authToken = process.env.AUTH_TOKEN;
      if (!authToken) {
        throw new Error("AUTH_TOKEN environment variable is required. Use USE_MOCK=true for testing.");
      }

      response = await axios.get(
        "http://20.207.122.201/evaluation-service/notifications",
        {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
    }

    const notifications = response.data.notifications;

    logger.info(`Fetched ${notifications.length} notifications`);

    const sorted = notifications.sort((a, b) => {
      const weightDiff =
        TYPE_WEIGHT[b.Type] - TYPE_WEIGHT[a.Type];

      if (weightDiff !== 0) return weightDiff;

      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const topNotifications = sorted.slice(0, limit);

    logger.info("Top notifications calculated");

    return topNotifications;

  } catch (error) {
    logger.error("Error fetching notifications");
    console.error(error);
  }
}

// Run
getTopNotifications().then((data) => {
  console.log("FINAL OUTPUT:", data);
});