import catchAsync from "../middlewares/catchAsync.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import CustomerModel from "../models/CustomerModel.js";
import SellerModel from "../models/SellerModel.js";
import appError from "../utils/appError.js";
import { passwordResetCodeTemplate } from "../utils/emailTemplates.js";
import sendCookies from "../utils/sendCookies.js";
import sendEmail from "../utils/sendEmail.js";
import sendResponse from "../utils/sendResponse.js";


export const signUp = catchAsync(async (req, res, next) => {
	const {
		firstName,
		lastName,
		phoneNumber,
		email,
		password,
		confirmPassword,
		role,
		// Seller fields
		brand,
		description,
		businessEmail,
		businessPhone,
		primaryCategory,
		// Customer address fields
		label,
		recipientName,
		addressPhone,
		line1,
		line2,
		city,
		state,
		postalCode,
		country,
	} = req.body;

	const user = await UserModel.create({
		firstName,
		lastName,
		email,
		password,
		phoneNumber,
		confirmPassword,
		role: role === "Seller" ? role : "Customer",
	});

	// check if user created
	if (!user) return next(new appError("user not created", 400));

	// create tokens
	const accessToken = user.CreateAccessToken();
	const refreshToken = user.CreateRefreshToken();
	
	let userModel;
	const userRole = user.role;

	if (userRole === "Customer") {
		const address = line1 ? [{
			label: label || "Home",
			recipientName: recipientName || `${firstName} ${lastName}`,
			phone: addressPhone || phoneNumber,
			line1,
			line2,
			city,
			state,
			postalCode,
			country,
			isDefault: true
		}] : [];

		userModel = await CustomerModel.create({
			userId: user._id,
			addresses: address,
		});
	} else if (userRole === "Seller") {
		userModel = await SellerModel.create({
			userId: user._id,
			brand,
			description,
			businessEmail,
			businessPhone,
			primaryCategory: (primaryCategory && primaryCategory !== "undefined") ? primaryCategory : undefined,
		});
	}

	// check if user model created
	if (!userModel) {
		// Rollback user creation if profile creation fails
		await UserModel.findByIdAndDelete(user._id);
		return next(new appError(`${userRole} profile not created`, 400));
	}

	// send cookies
	sendCookies(res, accessToken, refreshToken);
	
	// Get populated profile model to maintain consistent response structure
	const populatedUser = await userModel.constructor.findById(userModel._id)
		.populate("userId", "firstName lastName email phoneNumber role profileImg");

	// send response to client
	sendResponse(res, 201, { user: populatedUser });
});

export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password)
		return next(new appError("please provide email and password", 400));

	// find the user using email
	const user = await UserModel.findOne({ email }).select("+password");
	if (!user) return next(new appError("email or password is incorrect", 400));
	const isPasswordCorrect = await user.correctPassword(password, user.password);

	// check if password and email  is correct
	if (!isPasswordCorrect)
		return next(new appError("email or password is incorrect", 400));

	// create tokens
	const accessToken = user.CreateAccessToken();
	const refreshToken = user.CreateRefreshToken();

	// send cookies
	sendCookies(res, accessToken, refreshToken);
	
	// Get populated profile model to maintain consistent response structure
	let userProfile;
	if (user.role === "Customer") {
		userProfile = await CustomerModel.findOne({ userId: user._id })
			.populate("userId", "firstName lastName email phoneNumber role profileImg");
	} else if (user.role === "Seller") {
		userProfile = await SellerModel.findOne({ userId: user._id })
			.populate("userId", "firstName lastName email phoneNumber role profileImg");
	} else if (user.role === "Admin" || user.role === "SuperAdmin") {
		userProfile = user;
	}

	if (!userProfile) return next(new appError("User profile not found", 404));

	// send response
	sendResponse(res, 200, { user: userProfile });
});

export const refreshToken = catchAsync(async (req, res, next) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		return next(new appError("You are not logged in! Please log in to get access.", 401));
	}

	// Verify refresh token
	const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

	// Check if user still exists
	const user = await UserModel.findById(decoded._id);
	if (!user) {
		return next(new appError("The user belonging to this token no longer exists.", 401));
	}

	// Create new tokens
	const newAccessToken = user.CreateAccessToken();
	const newRefreshToken = user.CreateRefreshToken();

	// Send new cookies
	sendCookies(res, newAccessToken, newRefreshToken);

	sendResponse(res, 200, { status: "success" });
});

// logOut function
export const logOut = catchAsync(async (req, res, next) => {
	sendCookies(res, null, null);
	sendResponse(res, 200, {});
});

// getUser function
export const getMe = catchAsync(async (req, res, next) => {
	let user;
	const role = req.user.role;
	// find the user depend on user role
	if (role === "Customer") {
		user = await CustomerModel.findOne({ userId: req.user._id })
			.populate("userId", "firstName lastName email phoneNumber role profileImg");
	} else if (role === "Seller") {
		user = await SellerModel.findOne({ userId: req.user._id })
			.populate("userId", "firstName lastName email phoneNumber role profileImg");
	} else if (role === "Admin" || role === "SuperAdmin") {
		user = req.user;
	}

	if (!user) return next(new appError("user not found", 400));

	sendResponse(res, 200, { user });
});

// update personal details in user model
export const updatePersonalDetails = catchAsync(async (req, res, next) => {
	const { firstName, lastName, phoneNumber, email, profileImg } = req.body;
	
	const user = await UserModel.findByIdAndUpdate(
		req.user._id,
		{ firstName, lastName, phoneNumber, email, profileImg },
		{ new: true, runValidators: true }
	);

	if (!user) return next(new appError("User not found", 404));

	// Return consistent populated profile structure
	let userProfile;
	if (user.role === "Customer") {
		userProfile = await CustomerModel.findOne({ userId: user._id })
			.populate("userId", "firstName lastName email phoneNumber role profileImg");
	} else if (user.role === "Seller") {
		userProfile = await SellerModel.findOne({ userId: user._id })
			.populate("userId", "firstName lastName email phoneNumber role profileImg");
	} else if (user.role === "Admin" || user.role === "SuperAdmin") {
		userProfile = user;
	}

	sendResponse(res, 200, { user: userProfile });
});

// delete me from UserModel and another models = change status from active to deleted
export const deleteMe = catchAsync(async (req, res, next) => {
	// find user in UserModel AND change the status
	const user = await UserModel.findByIdAndUpdate(
		req.user._id,
		{ status: "deleted" },
		{ runValidators: true, new: true }
	);
	let model;
	const role = req.user.role;
	if (role === "Customer") model = CustomerModel;
	if (role === "Seller") model = SellerModel;

	// change the status
	let profileDeleted;
	if (model) {
		profileDeleted = await model.findOneAndUpdate(
			{ userId: req.user._id },
			{ status: "deleted" },
			{ runValidators: true, new: true }
		);
	}
	
	if (!user && !profileDeleted) return next(new appError("user didn't deleted"));
	sendCookies(res, "");
	sendResponse(res, 200, {});
});

// forgotPassword password
export const forgotPassword = catchAsync(async (req, res, next) => {
	const { email } = req.body;

	if (!email) return next(new appError("please provide email", 400));

	// find the user using email
	const user = await UserModel.findOne({ email });
	if (!user) return next(new appError("user not found", 400));

	// create passwordResetToken
	const resetCode = user.createPasswordResetCode();
	await user.save({ validateBeforeSave: false });
	// sendEmail to user contain the uniqeCode
	if (!resetCode) return next(new appError("something went wrong", 400));
	const Email = sendEmail({
		email: user.email,
		subject: "password reset token",
		html: passwordResetCodeTemplate(
			resetCode,
			`${user.firstName} ${user.lastName}`,
			user.passwordResetExpires
		),
	});
	// check if email is sent
	if (!Email) return next(new appError("something went wrong", 400));
	// send response to client
	sendResponse(res, 200, {});
});

export const resetPassword = catchAsync(async (req, res, next) => {
	// get resetCode and password from req.body
	const { resetCode, password, confirmPassword } = req.body;
	// check if resetCode and password are provided
	if (!resetCode || !password || !confirmPassword)
		return next(new appError("please provide all fields", 400));

	// find the user using resetCode
	const user = await UserModel.findOne({
		passwordResetCode: resetCode,
		passwordResetExpires: { $gt: Date.now() },
	});
	if (!user) return next(new appError("invalid reset code", 400));

	// update the user password
	user.password = password;
	user.confirmPassword = confirmPassword;
	user.passwordResetCode = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	const accessToken = user.CreateAccessToken();
	const refreshToken = user.CreateRefreshToken();

	sendCookies(res, accessToken, refreshToken);
	sendResponse(res, 200, { user });
});

// update password
export const updatePassword = catchAsync(async (req, res, next) => {
	const { newPassword, currentPassword, confirmPassword } = req.body;
	// check if newPassword, currentPassword, confirmPassword are provided
	if (!newPassword || !currentPassword || !confirmPassword)
		return next(new appError("please provide all fields", 400));

	const user = await UserModel.findById(req.user._id).select("+password");
	const isPasswordCorrect = await user.correctPassword(
		currentPassword,
		user.password
	);
	// check if password is correct
	if (!user || !isPasswordCorrect)
		return next(new appError("invalid credentials", 400));

	// update the password
	user.password = newPassword;
	user.confirmPassword = confirmPassword;
	await user.save();

	// create tokens
	const accessToken = user.CreateAccessToken();
	const refreshToken = user.CreateRefreshToken();

	sendCookies(res, accessToken, refreshToken);
	sendResponse(res, 200, { user });
});
