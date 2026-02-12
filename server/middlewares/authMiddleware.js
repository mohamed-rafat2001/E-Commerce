import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import catchAsync from "./catchAsync.js";
import appError from "../utils/appError.js";

//authentication
export const Protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.accessToken) {
		token = req.cookies.accessToken;
	}

	if (!token) {
		return next(new appError("You are not logged in! Please log in to get access.", 401));
	}

	// verification token
	try {
		const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		// check user if still exist
		const user = await UserModel.findById(decode._id);

		if (!user) {
			return next(
				new appError("The user belonging to this token no longer exists.", 401)
			);
		}

		if (user.status !== "active") {
			return next(new appError("Your account has been deactivated.", 403));
		}

		req.user = user;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return next(new appError("Token expired", 401));
		}
		return next(new appError("Invalid token", 401));
	}
});

//authorization and permession
export const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			return next(
				new appError("you don't have permission to perform this action", 400)
			);
		next();
	};
};
