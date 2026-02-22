import mongoose from "mongoose";
import validator from "validator";

const BrandSchema = new mongoose.Schema(
	{
		sellerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SellerModel",
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			required: [true, "description is required"],
		},
		logo: {
			public_id: String,
			secure_url: String,
		},
		website: {
			type: String,
			trim: true,
			validate: [validator.isURL, "please enter a valid URL"],
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
		isActive: {
			type: Boolean,
			default: true,
		},
		primaryCategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CategoryModel",
		},
		subCategories: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "CategoryModel",
		}],
		ratingAverage: {
			type: Number,
			min: 0,
			max: 5,
			default: 0,
			set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
		},
		ratingCount: {
			type: Number,
			min: 0,
			default: 0,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

// Virtual populate for products
BrandSchema.virtual("products", {
	ref: "ProductModel",
	localField: "_id",
	foreignField: "brandId",
});

// Indexes
BrandSchema.index({ sellerId: 1, isActive: 1 });
BrandSchema.index({ name: 1 });
BrandSchema.index({ primaryCategory: 1 });

// Populate middleware
BrandSchema.pre(/^find/, function () {
	this.populate("primaryCategory", "name description");
	this.populate("subCategories", "name description");
});

export default mongoose.model("BrandModel", BrandSchema);