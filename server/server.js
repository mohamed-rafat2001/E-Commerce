import dotenv from "dotenv";
dotenv.config();
process.on("uncaughtException", (err) => {
	console.log(err.name, err.message);
	console.log("UNCAUGHT EXCEPTION ... SHUTTING DOWN..");
	process.exit(1);
});

const port = process.env.PORT;
import { app } from "./app.js";

const server = app.listen(port, () => {
	console.log(`server running at port ${port}`);
});

process.on("unhandledRejection", (err) => {
	console.log(err.name, err.message);
	console.log("UNHANDLED REJUCTION ... SHUTTING DOWN..");
	server.close(() => {
		process.exit(1);
	});
});
