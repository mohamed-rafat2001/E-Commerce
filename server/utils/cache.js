import redisClient from "./redisClient.js";
import { promisify } from "util";
import zlib from "zlib";

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// Threshold for compressing cached values (bytes)
const COMPRESSION_THRESHOLD = 1024; // 1KB

/**
 * Retrieve parsed data from Redis.
 * Supports compressed values (prefixed with "gz:").
 */
export const getCache = async (key) => {
	try {
		if (redisClient.status !== "ready") return null;

		const cached = await redisClient.get(key);

		if (!cached) return null;

		// Handle compressed data
		if (cached.startsWith("gz:")) {
			const compressed = Buffer.from(cached.slice(3), "base64");
			const decompressed = await gunzip(compressed);

			return JSON.parse(decompressed.toString());
		}

		return JSON.parse(cached);
	} catch (err) {
		console.warn(`[Redis - getCache Error] Failed to read ${key}:`, err.message);

		return null;
	}
};

/**
 * Store data into Redis with optional compression for large values.
 */
export const setCache = async (key, value, ttlSeconds = 600) => {
	try {
		if (redisClient.status !== "ready") return;

		const jsonString = JSON.stringify(value);

		// Compress large payloads to save Redis memory
		if (jsonString.length > COMPRESSION_THRESHOLD) {
			const compressed = await gzip(Buffer.from(jsonString));

			await redisClient.setex(key, ttlSeconds, "gz:" + compressed.toString("base64"));
		} else {
			await redisClient.setex(key, ttlSeconds, jsonString);
		}
	} catch (err) {
		console.warn(`[Redis - setCache Error] Failed to write ${key}:`, err.message);
	}
};

/**
 * Delete a specific key from Redis.
 */
export const deleteCache = async (key) => {
	try {
		if (redisClient.status !== "ready") return;
		await redisClient.del(key);
	} catch (err) {
		console.warn(`[Redis - deleteCache Error] Failed to delete ${key}:`, err.message);
	}
};

/**
 * Delete multiple keys matching a pattern using SCAN (non-blocking).
 */
export const deleteCacheByPattern = async (pattern) => {
	try {
		if (redisClient.status !== "ready") return;

		let cursor = "0";

		do {
			const [nextCursor, keys] = await redisClient.scan(
				cursor,
				"MATCH",
				pattern,
				"COUNT",
				100,
			);

			cursor = nextCursor;

			if (keys.length > 0) {
				// Use pipeline for batch delete (single round-trip)
				const pipeline = redisClient.pipeline();

				keys.forEach((k) => pipeline.del(k));
				await pipeline.exec();
			}
		} while (cursor !== "0");
	} catch (err) {
		console.warn(`[Redis - deleteCacheByPattern Error] pattern ${pattern}:`, err.message);
	}
};

/**
 * Batch GET multiple keys using pipeline (single round-trip).
 */
export const getCacheMulti = async (keys) => {
	try {
		if (redisClient.status !== "ready") return keys.map(() => null);
		if (!keys.length) return [];

		const pipeline = redisClient.pipeline();

		keys.forEach((k) => pipeline.get(k));
		const results = await pipeline.exec();

		return Promise.all(results.map(async ([err, val]) => {
			if (err || !val) return null;
			try {
				if (val.startsWith("gz:")) {
					const compressed = Buffer.from(val.slice(3), "base64");
					const decompressed = await gunzip(compressed);

					return JSON.parse(decompressed.toString());
				}

				return JSON.parse(val);
			} catch {
				return null;
			}
		}));
	} catch (err) {
		console.warn("[Redis - getCacheMulti Error]:", err.message);

		return keys.map(() => null);
	}
};

/**
 * Batch SET multiple key-value pairs using pipeline (single round-trip).
 */
export const setCacheMulti = async (entries, ttlSeconds = 600) => {
	try {
		if (redisClient.status !== "ready") return;
		if (!entries.length) return;

		const pipeline = redisClient.pipeline();

		for (const { key, value } of entries) {
			const jsonString = JSON.stringify(value);

			if (jsonString.length > COMPRESSION_THRESHOLD) {
				const compressed = await gzip(Buffer.from(jsonString));

				pipeline.setex(key, ttlSeconds, "gz:" + compressed.toString("base64"));
			} else {
				pipeline.setex(key, ttlSeconds, jsonString);
			}
		}
		await pipeline.exec();
	} catch (err) {
		console.warn("[Redis - setCacheMulti Error]:", err.message);
	}
};

// ===================================================================
// Application Caching Configuration & Helpers
// ===================================================================

export const CACHE_CONFIG = {
	ProductModel: { prefix: "products", ttl: 600 },       // 10 minutes
	CategoryModel: { prefix: "categories", ttl: 3600 },    // 60 minutes
	SubCategoryModel: { prefix: "subcategories", ttl: 3600 },
	BrandModel: { prefix: "brands", ttl: 900 },            // 15 minutes
	ReviewsModel: { prefix: "reviews", ttl: 300 },         // 5 minutes
	SellerModel: { prefix: "sellers", ttl: 900 },

	// Semantic cache keys with specific TTLs
	PRODUCT_BY_CATEGORY: { prefix: "products:category", ttl: 600 },
	PRODUCT_DETAIL: { prefix: "product", ttl: 1800 },       // 30 minutes
	BRAND_FULL: { prefix: "brand:full", ttl: 900 },          // 15 minutes
	SEARCH_RESULTS: { prefix: "search", ttl: 300 },          // 5 minutes
	HOME_FEATURED: { prefix: "home:featured", ttl: 3600 },   // 60 minutes
};

/**
 * Helper to build consistent keys.
 */
export const buildCacheKey = (prefix, identifier, req, extraParams = {}) => {
	let key = `${prefix}:${identifier}`;
	const params = { ...req.query, ...extraParams };

	if (Object.keys(params).length > 0) {
		const sortedParams = Object.keys(params).sort().reduce((acc, k) => {
			acc[k] = params[k];

			return acc;
		}, {});

		key += `:${JSON.stringify(sortedParams)}`;
	}

	return key;
};

/**
 * Handle model-specific cache invalidation after db write.
 * Uses pipeline for batch invalidation (single round-trip).
 */
export const invalidateCacheForModel = async (Model, doc) => {
	const config = CACHE_CONFIG[Model.modelName];

	if (!config) return;

	const { prefix } = config;

	switch (Model.modelName) {
	case "ProductModel":
		await deleteCacheByPattern(`${prefix}:all*`);
		if (doc && doc._id) await deleteCache(`${prefix}:id:${doc._id}`);
		if (doc && doc._id) await deleteCache(`product:${doc._id}`); // detail cache
		if (doc && doc.userId) await deleteCacheByPattern(`sellers:id:${doc.userId}:products*`);
		if (doc && doc.brandId) await deleteCacheByPattern(`${prefix}:brand:${doc.brandId}*`);
		if (doc && doc.primaryCategory) {
			await deleteCache(`products:category:${doc.primaryCategory}`);
		}
		// Also invalidate home featured since product changes affect it
		await deleteCache("home:featured");
		break;

	case "CategoryModel":
		await deleteCacheByPattern(`${prefix}:all*`);
		if (doc && doc._id) await deleteCache(`${prefix}:id:${doc._id}`);
		if (doc && doc._id) await deleteCacheByPattern(`subcategories:category:${doc._id}*`);
		break;

	case "SubCategoryModel":
		await deleteCacheByPattern(`${prefix}:all*`);
		if (doc && doc._id) await deleteCache(`${prefix}:id:${doc._id}`);
		if (doc && (doc.categoryId || doc.categoryId?._id)) {
			await deleteCacheByPattern(`${prefix}:category:${doc.categoryId?._id || doc.categoryId}*`);
		}
		break;

	case "BrandModel":
		await deleteCacheByPattern(`${prefix}:all*`);
		if (doc && doc._id) await deleteCache(`${prefix}:id:${doc._id}`);
		if (doc && doc._id) await deleteCache(`brand:full:${doc._id}`);
		break;

	case "ReviewsModel":
		if (doc && (doc.itemId || doc.itemId?._id)) {
			await deleteCacheByPattern(`reviews:product:${doc.itemId?._id || doc.itemId}*`);
		}
		break;

	case "SellerModel":
		if (doc && doc.userId) await deleteCache(`${prefix}:id:${doc.userId}`);
		if (doc && doc._id) await deleteCache(`${prefix}:id:${doc._id}`);
		break;
	}
};
