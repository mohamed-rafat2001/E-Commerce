import mongoose from "mongoose";

let connectionPromise = null;

export async function dbConnect() {
	const dbPassword = process.env.DB_PASSWORD;
	const dbURL = process.env.DB_URL
		? process.env.DB_URL.replace("<db_password>", dbPassword)
		: undefined;

	if (!dbURL) {
		throw new Error("DB_URL is not defined in environment variables");
	}

	if (mongoose.connection.readyState === 1) {
		return mongoose.connection;
	}

	if (connectionPromise) {
		return connectionPromise;
	}

	connectionPromise = mongoose.connect(dbURL)
		.then((connection) => {
			console.info("db is connected");

			return connection;
		})
		.catch((error) => {
			connectionPromise = null;
			console.error(error.message);
			throw error;
		});

	return connectionPromise;
}

export default dbConnect;
