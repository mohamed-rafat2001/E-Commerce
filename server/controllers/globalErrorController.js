import appError from "../utils/appError.js";

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new appError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new appError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = `Invalid input data. ${errors.join(". ")}`;
	return new appError(message, 400);
};

const handleJWTError = () =>
	new appError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
	new appError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (error, res) => {
	res.status(error.statusCode).json({
		status: error.status,
		error,
		message: error.message,
		stack: error.stack,
	});
};
const sendErrorProd = (error, res) => {
	// Operational, trusted error: send message to client
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		});
	} else {
		// Programming or other unknown error: don't leak error details
		console.error("ERROR 💥", error);
		res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
};
export default function globalError(error, req, res, next) {
	error.status = error.status || "error";
	error.statusCode = error.statusCode || 500;

	if (process.env.NODE_MODE === "DEV") {
		sendErrorDev(error, res);
	} else if (process.env.NODE_MODE === "PROD") {
		let errorCopy = { ...error };
		errorCopy.message = error.message;

		if (errorCopy.name === "CastError")
			errorCopy = handleCastErrorDB(errorCopy);
		if (errorCopy.code === 11000)
			errorCopy = handleDuplicateFieldsDB(errorCopy);
		if (errorCopy.name === "ValidationError")
			errorCopy = handleValidationErrorDB(errorCopy);
		if (errorCopy.name === "JsonWebTokenError") errorCopy = handleJWTError();
		if (errorCopy.name === "TokenExpiredError")
			errorCopy = handleJWTExpiredError();

		sendErrorProd(errorCopy, res);
	}
}
