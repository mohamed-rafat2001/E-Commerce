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
	} else if (req.cookies.token) token = req.cookies.token;
	else  {
		return next(new appError("no token", 404));
	}

	// veryfication token
	const decode = jwt.verify(token, process.env.JWT_KEY);

	// check user if still exist
	const user = await UserModel.findById(decode._id);

	if (!user)
		return next(
			new appError("the user belong to this token does'nt exist", 400)
		);
	req.user = user;
	next();
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
