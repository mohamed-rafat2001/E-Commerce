import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisConfig = {
	host: process.env.REDIS_HOST || "127.0.0.1",
	port: process.env.REDIS_PORT || 6379,
	// Retry strategy to prevent crashing if Redis is unavailable
	retryStrategy: (times) => {
		console.warn(`[Redis] Retrying connection (attempt ${times})...`);

		return Math.min(times * 1000, 5000);
	},
	maxRetriesPerRequest: 1,
	// Enable keep-alive to maintain persistent connections
	keepAlive: 10000,
	// Connection timeout
	connectTimeout: 10000,
	// Enable ready check
	enableReadyCheck: true,
};

if (process.env.REDIS_PASSWORD) {
	redisConfig.password = process.env.REDIS_PASSWORD;
}

const redisClient = new Redis(redisConfig);

redisClient.on("connect", () => {
	console.info("[Redis] Connected to Redis successfully.");
});

// Set max memory policy on connection (allkeys-lru evicts least recently used keys when full)
redisClient.on("ready", async () => {
	try {
		// Set maxmemory policy to evict LRU keys when Redis is full
		await redisClient.config("SET", "maxmemory-policy", "allkeys-lru");
        
		// Set max memory to 256MB if not already configured
		const maxMem = await redisClient.config("GET", "maxmemory");

		if (maxMem[1] === "0") {
			await redisClient.config("SET", "maxmemory", "256mb");
			console.info("[Redis] Set maxmemory to 256MB with allkeys-lru policy.");
		}
	} catch (err) {
		// Config SET may not be available on managed Redis (e.g. Redis Cloud)
		console.warn(`[Redis] Could not set memory policy: ${err.message}`);
	}
});

redisClient.on("error", (err) => {
	console.warn(`[Redis Error] Connection failed. The App will fallback to MongoDB silently. Error: ${err.message}`);
});

export default redisClient;
