import serverless from "serverless-http";
import { app } from "../app.js";
import { dbConnect } from "../db/config.js";

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;
	await dbConnect();

	return serverlessHandler(event, context);
};
