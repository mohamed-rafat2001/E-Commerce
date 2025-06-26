const sendErrorDev = (error, res) => {
	res.status(error.statusCode).json({
		status: error.status,
		error,
		message: error.message,
		stack: error.stack,
	});
};
const sendErrorProd = (error, res) => {
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		});
	} else {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		});
	}
};
export default function globalError(error, req, res, next) {
	error.status = error.status || "error";
	error.statusCode = error.statusCode || 500;

	if (process.env.NODE_MODE === "DEV") {
		sendErrorDev(error, res);
	} else if (process.env.NODE_MODE === "PROD") {
		sendErrorProd(error, res);
	}
}
