import serverless from "serverless-http";
import { app } from "../app.js";
import { dbConnect } from "../db/config.js";

const serverlessHandler = serverless(app);
const normalizeOrigin = (value) => (value || "").trim().replace(/\/+$/, "");
const splitEnvOrigins = (value) => normalizeOrigin(value)
	.split(",")
	.map((item) => normalizeOrigin(item))
	.filter(Boolean);

const allowedOrigins = new Set([
	"http://localhost:5173",
	"http://localhost:5174",
	"http://127.0.0.1:5173",
	"http://127.0.0.1:5174",
	...splitEnvOrigins(process.env.CLIENT_URL),
	...splitEnvOrigins(process.env.CLIENT_URLS),
].map((value) => normalizeOrigin(value)));

const buildCorsHeaders = (event) => {
	const requestOrigin = normalizeOrigin(
		event?.headers?.origin || event?.headers?.Origin,
	);
	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Allow-Headers, If-None-Match",
		"Vary": "Origin",
	};

	if (requestOrigin && allowedOrigins.has(requestOrigin)) {
		headers["Access-Control-Allow-Origin"] = requestOrigin;
	}

	return headers;
};

const getRequestMethod = (event) => event?.httpMethod
	|| event?.requestContext?.http?.method
	|| event?.headers?.[":method"]
	|| "";
const isProduction = () => {
	const nodeMode = (process.env.NODE_MODE || process.env.NODE_ENV || "").toLowerCase();
	const deploymentContext = (process.env.CONTEXT || "").toLowerCase();

	return nodeMode === "prod"
		|| nodeMode === "production"
		|| deploymentContext === "production";
};

export const handler = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;

	if (getRequestMethod(event).toUpperCase() === "OPTIONS") {
		return {
			statusCode: 204,
			headers: buildCorsHeaders(event),
			body: "",
		};
	}

	try {
		await dbConnect();
	} catch (error) {
		console.error("Database bootstrap failed:", error.message);
		const responseMessage = isProduction()
			? "Something went very wrong!"
			: error.message || "Database connection failed";

		return {
			statusCode: 500,
			headers: buildCorsHeaders(event),
			body: JSON.stringify({
				status: "error",
				message: responseMessage,
			}),
		};
	}

	return serverlessHandler(event, context);
};
