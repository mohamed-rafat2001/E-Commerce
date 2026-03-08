import redisClient from "./redisClient.js";

/**
 * Retrieve parsed data from Redis.
 */
export const getCache = async (key) => {
    try {
        if (redisClient.status !== "ready") return null;

        const cached = await redisClient.get(key);
        if (cached) {
            return JSON.parse(cached);
        }
        return null;
    } catch (err) {
        console.warn(`[Redis - getCache Error] Failed to read ${key}:`, err.message);
        return null;
    }
};

/**
 * Store data into Redis.
 */
export const setCache = async (key, value, ttlSeconds = 600) => {
    try {
        if (redisClient.status !== "ready") return;

        await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
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
 * Delete multiple keys matching a pattern.
 */
export const deleteCacheByPattern = async (pattern) => {
    try {
        if (redisClient.status !== "ready") return;

        let cursor = "0";
        do {
            // Scan matching keys in batches of 100
            const [nextCursor, keys] = await redisClient.scan(
                cursor,
                "MATCH",
                pattern,
                "COUNT",
                100
            );
            cursor = nextCursor;

            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } while (cursor !== "0");
    } catch (err) {
        console.warn(`[Redis - deleteCacheByPattern Error] pattern ${pattern}:`, err.message);
    }
};

// ===================================================================
// Application Caching Configuration & Helpers
// ===================================================================

export const CACHE_CONFIG = {
    ProductModel: { prefix: "products", ttl: 600 },
    CategoryModel: { prefix: "categories", ttl: 3600 },
    SubCategoryModel: { prefix: "subcategories", ttl: 3600 },
    BrandModel: { prefix: "brands", ttl: 7200 },
    ReviewsModel: { prefix: "reviews", ttl: 300 },
    SellerModel: { prefix: "sellers", ttl: 900 }
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
 */
export const invalidateCacheForModel = async (Model, doc) => {
    const config = CACHE_CONFIG[Model.modelName];
    if (!config) return;

    const { prefix } = config;

    switch (Model.modelName) {
        case "ProductModel":
            await deleteCacheByPattern(`${prefix}:all*`);
            if (doc && doc._id) await deleteCache(`${prefix}:id:${doc._id}`);
            if (doc && doc.userId) await deleteCache(`sellers:id:${doc.userId}:products*`);
            if (doc && doc.brandId) await deleteCacheByPattern(`${prefix}:brand:${doc.brandId}*`);
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
