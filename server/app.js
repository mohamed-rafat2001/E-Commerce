import express from "express";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";

// db connection moved to server.js
export const app = express();

const resolveModuleDefault = (moduleValue) => moduleValue?.default ?? moduleValue;

// ─── GZIP/Brotli Compression ─────────────────────────────────────
// Compresses all API responses. Brotli is preferred if client supports it.
// This reduces JSON payload sizes by 60-80%.
app.use(compression({
	level: 6, // Balance between speed and compression ratio
	threshold: 1024, // Only compress responses > 1KB
	filter: (req, res) => {
		if (req.headers["x-no-compression"]) return false;

		return compression.filter(req, res);
	},
}));

const normalizeOrigin = (value) => (value || "").trim().replace(/\/+$/, "");
const splitEnvOrigins = (value) => normalizeOrigin(value)
	.split(",")
	.map((v) => normalizeOrigin(v))
	.filter(Boolean);

const allowedOrigins = new Set([
	"http://localhost:5173",
	"http://localhost:5174",
	"http://127.0.0.1:5173",
	"http://127.0.0.1:5174",
	...splitEnvOrigins(process.env.CLIENT_URL),
	...splitEnvOrigins(process.env.CLIENT_URLS),
].map((v) => normalizeOrigin(v)));

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin) {
			callback(null, true);
			return;
		}

		const normalized = normalizeOrigin(origin);

		callback(null, allowedOrigins.has(normalized));
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "Access-Control-Allow-Headers", "If-None-Match"],
	exposedHeaders: ["ETag"],
};

app.use(cors(corsOptions));
app.options("/{*splat}", cors(corsOptions));

app.get("/api/v1/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

// set security HTTP headers.
app.use(helmet());

// ─── ETag Support ─────────────────────────────────────────────────
// Express enables weak ETags by default. This ensures the client can
// send If-None-Match headers and receive 304 Not Modified responses,
// avoiding re-downloading unchanged data.
app.set("etag", "weak");

// ─── Keep-Alive ───────────────────────────────────────────────────
// Ensure HTTP keep-alive connections so TCP handshakes aren't repeated.
app.use((_req, res, next) => {
	res.set("Connection", "keep-alive");
	res.set("Keep-Alive", "timeout=65, max=1000");
	next();
});

//limit requests from same API
const limiter = rateLimit({
	max: 5000,
	windowMs: 60 * 60 * 1000, // 1 hour
	message: "too many requests for this IP, Please try again in an hour",
});

app.use("/api", limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// from cookie
app.use(cookieParser());

// Data sanitization against noSQL query injection
app.use((req, _res, next) => {
	if (req.body) mongoSanitize.sanitize(req.body);
	if (req.query) mongoSanitize.sanitize(req.query);
	if (req.params) mongoSanitize.sanitize(req.params);
	next();
});

// Prevent parameter pollution
app.use(hpp());

// ─── Dynamic Sitemap Generation ──────────────────────────────────
import ProductModel from "./models/ProductModel.js";
import BrandModel from "./models/BrandModel.js";
import CategoryModel from "./models/CategoryModel.js";

app.get("/sitemap.xml", async (_req, res) => {
	try {
		const baseUrl = process.env.CLIENT_URL || "https://shopynow.com";
        
		// Fetch static and dynamic routes
		const [products, brands, categories] = await Promise.all([
			ProductModel.find({ countInStock: { $gt: 0 } }, "_id updatedAt").limit(1000).lean(),
			BrandModel.find({ isActive: true }, "_id updatedAt").lean(),
			CategoryModel.find({}, "_id updatedAt").lean(),
		]);

		let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/products</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${baseUrl}/brands</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/categories</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;

		// Add Products
		products.forEach((p) => {
			xml += `
    <url>
        <loc>${baseUrl}/products/${p._id}</loc>
        <lastmod>${(p.updatedAt || new Date()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
		});

		// Add Brands
		brands.forEach((b) => {
			xml += `
    <url>
        <loc>${baseUrl}/brands/${b._id}</loc>
        <lastmod>${(b.updatedAt || new Date()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;
		});

		// Add Categories
		categories.forEach((c) => {
			xml += `
    <url>
        <loc>${baseUrl}/products?category=${c._id}</loc>
        <lastmod>${(c.updatedAt || new Date()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;
		});

		xml += "\n</urlset>";

		res.header("Content-Type", "application/xml");
		res.status(200).send(xml);
	} catch (error) {
		console.error("Sitemap generation error:", error);
		res.status(500).end();
	}
});

// ─── Redis Health Check Endpoint ──────────────────────────────────
import redisClient from "./utils/redisClient.js";

app.get("/api/v1/health/cache", async (_req, res) => {
	try {
		if (redisClient.status !== "ready") {
			return res.status(503).json({
				status: "unhealthy",
				message: "Redis is not connected",
			});
		}

		const info = await redisClient.info("memory");
		const statsRaw = await redisClient.info("stats");

		// Parse memory usage
		const memMatch = info.match(/used_memory_human:(\S+)/);
		const maxMemMatch = info.match(/maxmemory_human:(\S+)/);

		// Parse hit/miss stats
		const hitsMatch = statsRaw.match(/keyspace_hits:(\d+)/);
		const missesMatch = statsRaw.match(/keyspace_misses:(\d+)/);
		const hits = parseInt(hitsMatch?.[1] || "0");
		const misses = parseInt(missesMatch?.[1] || "0");
		const hitRate = hits + misses > 0
			? ((hits / (hits + misses)) * 100).toFixed(2) + "%"
			: "N/A";

		const dbSize = await redisClient.dbsize();

		res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
		res.json({
			status: "healthy",
			memoryUsed: memMatch?.[1] || "unknown",
			maxMemory: maxMemMatch?.[1] || "unlimited",
			totalKeys: dbSize,
			cacheHitRate: hitRate,
			cacheHits: hits,
			cacheMisses: misses,
		});
	} catch (err) {
		res.status(500).json({
			status: "error",
			message: err.message,
		});
	}
});

// Routers
import authRouter from "./routers/authRouter.js";
import sellerRouter from "./routers/sellerRouter.js";
import customerRouter from "./routers/customerRouter.js";
import productRouter from "./routers/productRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import subCategoryRouter from "./routers/subCategoryRouter.js";
import cartRouter from "./routers/cartRouter.js";
import wishListRouter from "./routers/wishListRouter.js";
import globalError from "./controllers/globalErrorController.js";
import reviewRouter from "./routers/reviewRouter.js";
import orderRouter from "./routers/orderRouter.js";
import adminRouter from "./routers/adminRouter.js";
import uploadRouter from "./routers/uploadRouter.js";
import brandRouter from "./routers/brandRouter.js";
import discountRouter from "./routers/discountRouter.js";

const authRoutes = resolveModuleDefault(authRouter);
const adminRoutes = resolveModuleDefault(adminRouter);
const sellerRoutes = resolveModuleDefault(sellerRouter);
const customerRoutes = resolveModuleDefault(customerRouter);
const productRoutes = resolveModuleDefault(productRouter);
const cartRoutes = resolveModuleDefault(cartRouter);
const wishListRoutes = resolveModuleDefault(wishListRouter);
const reviewRoutes = resolveModuleDefault(reviewRouter);
const categoryRoutes = resolveModuleDefault(categoryRouter);
const subCategoryRoutes = resolveModuleDefault(subCategoryRouter);
const orderRoutes = resolveModuleDefault(orderRouter);
const uploadRoutes = resolveModuleDefault(uploadRouter);
const brandRoutes = resolveModuleDefault(brandRouter);
const discountRoutes = resolveModuleDefault(discountRouter);
const globalErrorHandler = resolveModuleDefault(globalError);

app.use("/api/v1/authentications", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/sellers", sellerRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishListRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/discounts", discountRoutes);

// global error handler
app.use(globalErrorHandler);
