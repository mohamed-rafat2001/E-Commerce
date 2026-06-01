import mongoose from "mongoose";

let connectionPromise = null;
const MONGODB_CONNECT_TIMEOUT_MS = 8000;

mongoose.set("bufferCommands", false);

export async function dbConnect() {
	const dbPassword = process.env.DB_PASSWORD;
	const rawDbURL = process.env.DB_URL;

	if (!rawDbURL) {
		throw new Error("DB_URL is not defined in environment variables");
	}

	if (rawDbURL.includes("<db_password>") && !dbPassword) {
		throw new Error("DB_PASSWORD is required because DB_URL contains <db_password>");
	}

	const dbURL = rawDbURL.replace("<db_password>", dbPassword ?? "");

	if (!/^mongodb(\+srv)?:\/\//.test(dbURL)) {
		throw new Error("DB_URL must start with mongodb:// or mongodb+srv://");
	}

	if (mongoose.connection.readyState === 1) {
		return mongoose.connection;
	}

	if (connectionPromise) {
		return connectionPromise;
	}

	connectionPromise = mongoose.connect(dbURL, {
		serverSelectionTimeoutMS: MONGODB_CONNECT_TIMEOUT_MS,
		connectTimeoutMS: MONGODB_CONNECT_TIMEOUT_MS,
		socketTimeoutMS: 20000,
		maxPoolSize: 5,
		autoSelectFamily: false,
		tls: dbURL.startsWith("mongodb+srv://"),
	})
		.then((connection) => {
			console.info("db is connected");

			return connection;
		})
		.catch((error) => {
			connectionPromise = null;
			const tlsHandshakeFailed = /tlsv1 alert internal error|SSL alert number 80/i.test(error.message);

			if (tlsHandshakeFailed) {
				throw new Error(
					"MongoDB TLS handshake failed. Check that DB_URL is a valid Atlas connection string, verify Atlas Network Access allows the deployment, and confirm the cluster is reachable from Netlify.",
				);
			}

			console.error(error.message);
			throw error;
		});

	return connectionPromise;
}

export default dbConnect;
