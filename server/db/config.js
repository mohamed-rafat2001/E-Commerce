import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbURL = process.env.DB_URL.replace(
	"<db_password>",
	process.env.DB_PASSWORD
);
export default function dbConnect() {
	mongoose
		.connect(dbURL)
		.then(() => console.log("db is connected"))
		.catch((e) => console.log(e.message));
}
