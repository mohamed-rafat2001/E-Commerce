import mongoose from "mongoose";
import slugify from "slugify";
import { moneySchema } from "./commonSchemas.js";

const productSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		name: {
			type: String,
			required: [true, "Product name is required"],
			minLength: 3,
			trim: true,
		},
		slug: {
			type: String,
			required: false,
			trim: true,
			lowercase: true,
			unique: true,
		},
		description: {
			type: String,
			required: [true, "Product description is required"],
			minLength: 3,
			trim: true,
		},
		coverImage: {
				public_id: String,
				secure_url: String,
			},
		images: [
			{
				public_id: String,
				secure_url: String,
			},
		],
		brand: {
			type: String,
			required: [true, "Product Brand is required"],
			minLength: 2,
			trim: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CategoryModel",
			required: [true, "Product category is required"],
		},
		price: moneySchema,
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
		countInStock: {
			type: Number,
			default: 0,
			required: [true, "countInStock is required"],
		},
		status: {
			type: String,
			enum: ["draft", "active", "inactive", "archived"],
			default: "draft",
		},
		visibility: {
			type: String,
			enum: ["public", "private"],
			default: "public",
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
		id: false,
	}
);
// virtual populate
productSchema.virtual("reviews", {
	ref: "ReviewsModel",
	localField: "_id",
	foreignField: "itemId",
});
//  mongoose query middlewares
productSchema.pre(/^find/, function () {
	this.populate("reviews");
	this.populate("category", "name description");
});

productSchema.pre("save", function (next) {
	if (!this.isModified("name")) return next();
	this.slug = slugify(this.name, { lower: true, strict: true });
	next();
});

//  mongoose indexs price
productSchema.index({ price: 1 });
productSchema.index({ userId: 1, status: 1 });

export default mongoose.model("ProductModel", productSchema);
