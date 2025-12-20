import express from "express";
import cors from "cors";
import dbConnect from "./db/config.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import hpp from "hpp";
import cookieParser from "cookie-parser";
// db connected
dbConnect();
export const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"Content-Length",
			"X-Requested-With",
		],
	})
);
// set security HTTP headers.
app.use(helmet.xssFilter());

//limit requests from same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "too many requests for this IP, Please try again in an hour ",
});
app.use("/api", limiter);

// body pareser, reading date from body into req.body
app.use(express.json({ limit: "10kb" }));

// from cookie
app.use(cookieParser());
// Data sanitization against noSQL query injection
app.use((req, res, next) => {
	req.body = mongoSanitize.sanitize(req.body);
	req.params = mongoSanitize.sanitize(req.params);
	next();
});

// Prevent parameter pollution
app.use(hpp());

// Routers
import authRouter from "./routers/authRouter.js";
import sellerRouter from "./routers/sellerRouter.js";
import customerRouter from "./routers/customerRouter.js";
import productRouter from "./routers/productRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import cartRouter from "./routers/cartRouter.js";
import wishListRouter from "./routers/wishListRouter.js";
import globalError from "./controllers/globalErrorController.js";
import reviewRouter from "./routers/reviewRouter.js";
import orderRouter from "./routers/orderRouter.js";

app.use("/api/v1/authentications", authRouter);
app.use("/api/v1/sellers", sellerRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/wishlist", wishListRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter);

// global error handler
app.use(globalError);
