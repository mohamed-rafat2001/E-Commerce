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

		addresses: [addressSchema],
		preferredCategories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "CategoryModel",
			}
		],
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

SellerSchema.virtual("brands", {
	ref: "BrandModel",
	localField: "_id",
	foreignField: "sellerId",
});

// Virtual field for average brand rating (calculated from all active brands)
SellerSchema.virtual("averageBrandRating").get(function() {
	if (!this.brands || this.brands.length === 0) return 0;
	
	const activeBrands = this.brands.filter(brand => brand.isActive);
	if (activeBrands.length === 0) return 0;
	
	const totalRating = activeBrands.reduce((sum, brand) => sum + (brand.ratingAverage || 0), 0);
	return Math.round((totalRating / activeBrands.length) * 10) / 10; // Round to 1 decimal
});

// Virtual field for total reviews (sum of all active brand review counts)
SellerSchema.virtual("totalReviews").get(function() {
	if (!this.brands || this.brands.length === 0) return 0;
	
	const activeBrands = this.brands.filter(brand => brand.isActive);
	return activeBrands.reduce((sum, brand) => sum + (brand.ratingCount || 0), 0);
});

//  mongoose query middlewares
SellerSchema.pre(/^find/, function () {
	this.populate("reviews");
	this.populate({
		path: "brands",
		match: { isActive: true }
	});
	this.populate("preferredCategories", "name description");
});
SellerSchema.index({ status: 1 });
SellerSchema.index({ verificationStatus: 1 });
SellerSchema.index({ brand: 1 });
export default mongoose.model("SellerModel", SellerSchema);
