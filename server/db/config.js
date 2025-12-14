import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbPassword = process.env.DB_PASSWORD;
const dbURL = process.env.DB_URL
	? process.env.DB_URL.replace("<db_password>", dbPassword)
	: undefined;

export default function dbConnect() {
	if (!dbURL) {
		console.error("DB_URL is not defined in environment variables");
		return;
	}
	mongoose
		.connect(dbURL)
		.then(() => console.log("db is connected"))
		.catch((e) => console.log(e.message));
}
