import serverless from "serverless-http";
import { app } from "../app.js";
import dbConnect from "../db/config.js";

// Ensure DB is connected
dbConnect();

export const handler = serverless(app);
