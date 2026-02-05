import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "firstName is required"],
			trim: true,
			minlength: 3,
		},
		lastName: {
			type: String,
			required: [true, "lastName is required"],
			trim: true,
			minlength: 3,
		},
		email: {
			type: String,
			required: [true, "email is required"],
			unique: true,
			trim: true,
			validate: [validator.isEmail, "please enter the valid email"],
		},
		phoneNumber: {
			type: String,
			required: [true, "phone number is required"],
			trim: true,
			validate: [validator.isMobilePhone, "please enter valid phone number"],
		},
		profileImg: {
				public_id: String,
				secure_url: String,
			},
		password: {
			type: String,
			required: [true, "password is required"],
			trim: true,
			select: false,
			validate: [validator.isStrongPassword, "please enter strong password"],
		},
		confirmPassword: {
			type: String,
			trim: true,
			required: [true, "confirm password is required"],
			validate: {
				validator: function (value) {
					return value === this.password;
				},
				message: "passwords are not the same",
			},
		},
		passwordResetCode: Number,
		passwordResetExpires: Date,
		role: {
			type: String,
			enum: ["Customer", "Seller", "Admin", "SuperAdmin"],
			default: "Customer",
		},
		status: {
			type: String,
			enum: ["active", "suspended", "deleted"],
			default: "active",
		},
	},
	{ timestamps: true }
);

// hash password before saving
userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;

	this.password = await bcryptjs.hash(this.password, 12);
	this.confirmPassword = undefined;
});
// create token using jsonwebtoken
userSchema.methods.CreateToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY, {
		expiresIn: process.env.JWT_EXPIRES,
	});
	return token;
};

// create passwordResetToken
userSchema.methods.createPasswordResetCode = function () {
	const buffer = crypto.randomBytes(6);
	let code = "";

	for (let i = 0; i < 6; i++) {
		code += (buffer[i] % 10).toString();
	}
	this.passwordResetCode = code;
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return code;
};
// check if password is correct
userSchema.methods.correctPassword = async function (password, userPassword) {
	return await bcryptjs.compare(password, userPassword);
};
export default mongoose.model("UserModel", userSchema);
