# Backend Redis Caching Implementation Prompt

## Your Role
You are a senior backend engineer adding a **Redis caching layer** to an existing Node.js + Express + MongoDB e-commerce application. The models already exist — do not redefine or modify them. Your job is to implement caching in the **service layer** (or controller layer if no service exists) for the correct models only.

---

## Tech Stack
- Backend: Node.js + Express
- Database: MongoDB via Mongoose
- Cache: Redis (use `ioredis` package)
- Cache strategy: **Cache-Aside** (read from cache first, fallback to DB, write to cache)

---

## ⚠️ Important Rules Before You Start

> **Do NOT modify any model files.**
> **Do NOT modify any route files.**
> **Do NOT add caching to every model blindly — only cache what makes sense.**
> Cache only data that is: frequently read, rarely changes, and is NOT user-action-sensitive.

---

## PART 1 — REDIS SETUP

Create a single Redis client file `utils/redisClient.js`:
- Connect using `ioredis`
- Handle connection errors gracefully — if Redis is down, the app must continue working using the database (never crash because Redis is unavailable)
- Export the client instance
- Log connection status on startup

Create a cache helper file `utils/cache.js` with these reusable functions:

**`getCache(key)`**
- Try to get value from Redis
- If found, parse JSON and return it
- If not found or Redis is down, return null

**`setCache(key, value, ttlSeconds)`**
- Stringify value and store in Redis with expiry
- If Redis is down, fail silently — do not throw

**`deleteCache(key)`**
- Delete a single key from Redis
- Fail silently if Redis is down

**`deleteCacheByPattern(pattern)`**
- Delete all keys matching a pattern (e.g. `"products:*"`)
- Use Redis SCAN to find matching keys, then delete them
- Use this for cache invalidation when data changes

---

## PART 2 — WHICH MODELS TO CACHE AND WHICH NOT TO

### ✅ CACHE THESE MODELS

#### `ProductModel`
- **Why:** Most read-heavy model in any e-commerce app. Every visitor hits product listings and detail pages.
- **Cache:**
  - All products list (with filters: category, brand, subcategory, price range)
  - Single product by ID
  - Featured / top-rated products
- **TTL:** 10 minutes
- **Invalidate when:** product is created, updated, deleted, or stock changes

#### `CategoryModel`
- **Why:** Categories rarely change but are loaded on almost every page (navbar, filters, homepage).
- **Cache:**
  - All categories list
  - Single category by ID or slug
- **TTL:** 1 hour
- **Invalidate when:** category is created, updated, or deleted

#### `SubCategoryModel`
- **Why:** Same reason as categories — used heavily in navigation and filters.
- **Cache:**
  - All subcategories
  - Subcategories by parent category
  - Single subcategory by ID
- **TTL:** 1 hour
- **Invalidate when:** subcategory is created, updated, or deleted

#### `BrandModel`
- **Why:** Brand lists are loaded in filters and product pages constantly.
- **Cache:**
  - All brands list
  - Single brand by ID
- **TTL:** 2 hours
- **Invalidate when:** brand is created, updated, or deleted

#### `ReviewsModel`
- **Why:** Reviews are fetched on every product detail page.
- **Cache:**
  - Reviews for a specific product (keyed by product ID)
- **TTL:** 5 minutes
- **Invalidate when:** a new review is added or deleted for that product

#### `SellerModel`
- **Why:** Seller public profile is shown on product pages and store pages.
- **Cache:**
  - Public seller profile by ID
  - Seller's product listings
- **TTL:** 15 minutes
- **Invalidate when:** seller updates their profile

---

### ❌ DO NOT CACHE THESE MODELS

#### `CartModel`
- **Why:** Cart is unique per customer and changes on every add/remove/update. Caching it would serve stale cart data.
- Always read directly from MongoDB.

#### `OrderModel` and `OrderItemsModel`
- **Why:** Order data must always be accurate. Customers checking order status, sellers updating status — all must see real-time data.
- Never cache order reads.

#### `CustomerModel` and `UserModel`
- **Why:** Contains sensitive personal data. Must always be fresh. Security risk if cached incorrectly.
- Always read directly from MongoDB.

#### `WishListModel`
- **Why:** Changes frequently with user actions (add/remove). Must always reflect the real current state.
- Always read directly from MongoDB.

---

## PART 3 — CACHE KEY NAMING CONVENTION

Use a consistent, hierarchical key format: `model:identifier:params`

```
products:all                          → all products (no filter)
products:all:category:electronics     → filtered by category
products:id:64abc123                  → single product
products:featured                     → featured products

categories:all                        → all categories
categories:id:64abc123                → single category

subcategories:all                     → all subcategories
subcategories:category:64abc123       → subcategories by parent category id

brands:all                            → all brands
brands:id:64abc123                    → single brand

reviews:product:64abc123             → reviews for a product

sellers:id:64abc123                   → seller public profile
sellers:id:64abc123:products          → seller's products
```

For list queries with dynamic filters (sort, page, limit, price range), **serialize the query params into the key**:
```
products:all:{"category":"electronics","page":1,"limit":20,"sort":"price"}
```
Use `JSON.stringify` on the query object (sorted keys) to build consistent keys.

---

## PART 4 — CACHE-ASIDE PATTERN (apply to every cached function)

Every function that reads data must follow this exact pattern:

```
1. Build the cache key from the function's parameters
2. Call getCache(key)
3. If cache HIT → parse and return cached data immediately
4. If cache MISS:
   a. Query MongoDB
   b. Call setCache(key, result, TTL)
   c. Return the result
```

Every function that writes (create / update / delete) must:
```
1. Perform the DB write operation
2. Invalidate all related cache keys using deleteCache or deleteCacheByPattern
3. Return the result
```

---

## PART 5 — CACHE INVALIDATION RULES

This is the most important part. Stale cache is worse than no cache.

### Product cache invalidation
- When a product is **created** → delete `products:all*` pattern
- When a product is **updated** → delete `products:id:{id}` + `products:all*` pattern
- When a product is **deleted** → delete `products:id:{id}` + `products:all*` pattern
- When **stock changes** (after order placed or cancelled) → delete `products:id:{id}`

### Category cache invalidation
- When a category is **created / updated / deleted** → delete `categories:all` + `categories:id:{id}` + `subcategories:category:{id}`

### SubCategory cache invalidation
- When a subcategory is **created / updated / deleted** → delete `subcategories:all` + `subcategories:id:{id}` + `subcategories:category:{parentId}`

### Brand cache invalidation
- When a brand is **created / updated / deleted** → delete `brands:all` + `brands:id:{id}`

### Review cache invalidation
- When a review is **added or deleted** for a product → delete `reviews:product:{productId}`

### Seller cache invalidation
- When a seller **updates their profile** → delete `sellers:id:{sellerId}`
- When a seller's **product is updated** → delete `sellers:id:{sellerId}:products`

---

## PART 6 — TTL REFERENCE TABLE

| Model | Operation | TTL |
|-------|-----------|-----|
| Product list | GET all / filtered | 10 minutes |
| Product detail | GET by ID | 10 minutes |
| Category list | GET all | 1 hour |
| Category detail | GET by ID | 1 hour |
| SubCategory list | GET all / by parent | 1 hour |
| Brand list | GET all | 2 hours |
| Brand detail | GET by ID | 2 hours |
| Reviews by product | GET | 5 minutes |
| Seller public profile | GET | 15 minutes |
| Seller products | GET | 10 minutes |

---

## PART 7 — ERROR HANDLING FOR REDIS

Redis failure must NEVER break the application. Follow this pattern everywhere:

```
try {
  const cached = await getCache(key);
  if (cached) return cached;
} catch (err) {
  // Redis is down — continue to DB silently
  console.warn('Redis unavailable, falling back to DB:', err.message);
}

// Always fall through to DB query if cache fails
const result = await Model.find(...);

try {
  await setCache(key, result, TTL);
} catch (err) {
  // Failed to write cache — not critical, ignore
}

return result;
```

---

## PART 8 — ENVIRONMENT VARIABLES

Add these to `.env`:
```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=           # leave empty if no auth
REDIS_TTL_DEFAULT=600     # 10 minutes in seconds
```

---

## PART 9 — WHAT NOT TO DO

- ❌ Do NOT cache cart data
- ❌ Do NOT cache order or order items data
- ❌ Do NOT cache customer or user personal data
- ❌ Do NOT cache wishlist data
- ❌ Do NOT crash the app if Redis is unavailable — always fall back to DB
- ❌ Do NOT use the same cache key for different queries — always include filter params in the key
- ❌ Do NOT forget to invalidate cache after any write operation
- ❌ Do NOT set TTL too high on frequently changing data (reviews, product stock)
- ❌ Do NOT modify any existing model, route, or middleware files

---

## Deliverables

Provide these files only:
1. `utils/redisClient.js` — Redis connection
2. `utils/cache.js` — getCache, setCache, deleteCache, deleteCacheByPattern helpers
3. Updated service/controller functions for: **Product, Category, SubCategory, Brand, Reviews, Seller** — with caching logic applied following the Cache-Aside pattern above

Do not touch: CartModel, OrderModel, OrderItemsModel, CustomerModel, UserModel, WishListModel, any route files, any model files.
