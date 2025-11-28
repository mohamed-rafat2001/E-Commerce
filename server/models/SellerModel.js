import mongoose from "mongoose";
import validator from "validator";
const SellerSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		phoneNumber: {
			type: String,
			required: [true, "phone number is required"],
			trim: true,
			validate: [validator.isMobilePhone, "please enter valid phone number"],
		},
		companyName: {
			type: String,
			required: false,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		addresses: String,
		ratingAverage: {
			type: Number,
			min: 0,
			max: 5,
			default: 0,
		},
		ratingCount: {
			type: Number,
			min: 0,
			default: 0,
		},
		status: {
			type: String,
			enum: ["pending", "active", "suspended", "closed"],
			default: "active",
		},
		verificationStatus: {
			type: String,
			enum: ["unverified", "in_review", "verified", "rejected"],
			default: "unverified",
		},
		defaultPayoutMethod: String,
		balance: String,
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

SellerSchema.index({ status: 1 });
SellerSchema.index({ verificationStatus: 1 });
SellerSchema.index({ companyName: 1 });
export default mongoose.model("SellerModel", SellerSchema);
