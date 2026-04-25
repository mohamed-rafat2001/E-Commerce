import dotenv from "dotenv";
dotenv.config({ quiet: true });
process.on("uncaughtException", (err) => {
	console.error(err.name, err.message);
	console.error("UNCAUGHT EXCEPTION ... SHUTTING DOWN..");
	process.exit(1);
});

const port = process.env.PORT;

import { app } from "./app.js";
import dbConnect from "./db/config.js";

// Connect to DB
dbConnect();

const server = app.listen(port, () => {
	console.info(`server running at port ${port}`);
});

process.on("unhandledRejection", (err) => {
	console.error(err.name, err.message);
	console.error("UNHANDLED REJECTION ... SHUTTING DOWN..");
	server.close(() => {
		process.exit(1);
	});
});
