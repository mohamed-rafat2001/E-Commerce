import mongoose from "mongoose";
import validator from "validator";
import { addressSchema, moneySchema } from "./commonSchemas.js";

const payoutMethodSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["bank_transfer", "paypal", "stripe", "cash"],
			required: true,
		},
		accountHolderName: {
			type: String,
			required: true,
			trim: true,
		},
		accountNumber: {
			type: String,
			required: true,
			trim: true,
		},
		bankName: {
			type: String,
			trim: true,
			required: true,
		},
		routingNumber: {
			type: String,
			trim: true,
			required: true,
		},
		notes: {
			type: String,
			trim: true,
		},
		isDefault: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false, timestamps: true }
);


const SellerSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		brand: {
			type: String,
			required: true,
			trim: true,
		},
		brandImg: {
				public_id: String,
				secure_url: String,
			},
		description: {
			type: String,
			trim: true,
			required: [true, "description is required"],
		},
		businessEmail: {
			type: String,
			required: [true, "email is required"],
			unique: true,
			trim: true,
			validate: [validator.isEmail, "please enter the valid email"],
		},
		businessPhone: {
			type: String,
			required: [true, "phone number is required"],
			trim: true,
			validate: [validator.isMobilePhone, "please enter valid phone number"],
		},
		primaryCategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CategoryModel",
		},

		addresses: [addressSchema],
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
			enum: ["active", "suspended", "deleted"],
			default: "active",
		},
		verificationStatus: {
			type: String,
			enum: ["unverified", "in_review", "verified", "rejected"],
			default: "unverified",
		},
		payoutMethods: [payoutMethodSchema],
		balance: moneySchema,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
		id: false,
	}
);
// virtual populate
SellerSchema.virtual("reviews", {
	ref: "ReviewsModel",
	localField: "userId",
	foreignField: "itemId",
});
//  mongoose query middlewares
SellerSchema.pre(/^find/, function () {
	this.populate("reviews");
	this.populate("primaryCategory","name description");
});
SellerSchema.index({ status: 1 });
SellerSchema.index({ verificationStatus: 1 });
SellerSchema.index({ brand: 1 });
export default mongoose.model("SellerModel", SellerSchema);
