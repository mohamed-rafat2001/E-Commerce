import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    // Retry strategy to prevent crashing if Redis is unavailable
    retryStrategy: (times) => {
        console.warn(`[Redis] Retrying connection (attempt ${times})...`);
        // Reconnect after 5 seconds
        return Math.min(times * 1000, 5000);
    },
    maxRetriesPerRequest: 1, // Don't hold up requests indefinitely
};

if (process.env.REDIS_PASSWORD) {
    redisConfig.password = process.env.REDIS_PASSWORD;
}

const redisClient = new Redis(redisConfig);

redisClient.on("connect", () => {
    console.log("[Redis] Connected to Redis successfully.");
});

redisClient.on("error", (err) => {
    console.warn(`[Redis Error] Connection failed. The App will fallback to MongoDB silently. Error: ${err.message}`);
});

export default redisClient;
