import express from "express";
import cors from "cors";
import dbConnect from "./db/config.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";

// import hpp from "hpp";
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
// app.use(
// 	mongoSanitize({
// 		replaceWith: "_",
// 		// Only sanitize the request body, not query or params
// 		sanitize: ({ body }) => body,
// 	})
// );

// Prevent parameter pollution
// app.use(hpp());

// Routers
import authRouter from "./routers/authRouter.js";
import productRouter from "./routers/productRouter.js";
import globalError from "./controllers/globalErrorController.js";
import reviewRouter from "./routers/reviewRouter.js";

app.use("/api/v1/authentications", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);

// globall error handler
app.use(globalError);
