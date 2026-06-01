import jwt from "jsonwebtoken";
import * as UserModelModule from "../models/UserModel.js";
import { catchAsync } from "./catchAsync.js";
import appError from "../utils/appError.js";

const resolveModuleDefault = (moduleValue) => moduleValue?.default ?? moduleValue;
const UserModel = resolveModuleDefault(UserModelModule);

//authentication
export const Protect = catchAsync(async (req, res, next) => {
	if (!process.env.JWT_ACCESS_SECRET) {
		return next(new appError("Missing auth environment variable: JWT_ACCESS_SECRET", 500));
	}

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
				new appError("The user belonging to this token no longer exists.", 401),
			);
		}

		if (user.status !== "active") {
			return next(new appError("Your account has been deactivated.", 403));
		}

		// check if password was changed after token was issued
		if (user.changedPasswordAfter(decode.iat)) {
			return next(
				new appError("User recently changed password! Please log in again.", 401),
			);
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
				new appError("you don't have permission to perform this action", 403),
			);
		next();
	};
};
