import serverless from "serverless-http";
import { app } from "../app.js";
import { dbConnect } from "../db/config.js";

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;

	try {
		await dbConnect();
	} catch (error) {
		console.error("Database bootstrap failed:", error.message);

		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				status: "error",
				message: error.message || "Database connection failed",
			}),
		};
	}

	return serverlessHandler(event, context);
};
