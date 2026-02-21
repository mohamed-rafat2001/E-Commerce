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