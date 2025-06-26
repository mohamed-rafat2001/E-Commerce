import catchAsync from "../middelwares/catchAsync.js";
import UserModel from "../models/UserModel.js";
import appError from "../utils/appError.js";
import { passwordResetCodeTemplate } from "../utils/emailTempletes.js";
import sendCookies from "../utils/sendCookies.js";
import sendEmail from "../utils/sendEmail.js";
import sendResponse from "../utils/sendRespons.js";

export const signUp = catchAsync(async (req, res, next) => {
	const { name, email, phone, password, confirmPassword, location } = req.body;
	const user = await UserModel.create({
		name,
		email,
		phone,
		password,
		confirmPassword,
		location,
	});

	// check if user created
	if (!user) return next(new appError("user not created", 400));

	// create token
	const token = user.CreateToken();
	user.password = undefined;
	// send cookies
	sendCookies(res, token);
	// send response to client
	sendResponse(res, 201, { user, token });
});
export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password)
		return next(new appError("please provide email and password", 400));

	// find the user using email
	const user = await UserModel.findOne({ email });
	const isPasswordCorrect = await user.credientals(password, user.password);

	// check if password and email  is correct
	if (!user || !isPasswordCorrect)
		return next(new appError("email or password is incorrect", 400));

	// create token
	const token = user.CreateToken();

	// send cookies
	sendCookies(res, token);
	// send response
	user.password = undefined;
	sendResponse(res, 200, { user, token });
});

// logOut function
export const logOut = catchAsync(async (req, res, next) => {
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
			user.name,
			user.passwordResetExpires
		),
	});
	// check if email is sent
	if (!Email) return next(new appError("something went wrong", 400));
	// send response to client
	sendResponse(res, 200, {  });
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

	const token = user.CreateToken();

	sendCookies(res, token);
	sendResponse(res, 200, { user, token });
});

// update password
export const updatePassword = catchAsync(async (req, res, next) => {
	const { newPassword, currentPassword, confirmPassword } = req.body;
	// check if newPassword, currentPassword, confirmPassword are provided
	if (!newPassword || !currentPassword || !confirmPassword)
		return next(new appError("please provide all fields", 400));

	const user = await UserModel.findById(req.user._id).select("+password");
	const isPasswordCorrect = await user.credientals(
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

	// create token
	const token = user.CreateToken();
	sendCookies(res, token);
	sendResponse(res, 200, { user, token });
});
