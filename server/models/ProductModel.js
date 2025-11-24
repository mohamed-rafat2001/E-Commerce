import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		name: {
			type: String,
			required: [true, "Product name is required"],
			minLength: 3,
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Product description is required"],
			minLength: 3,
			trim: true,
		},
		image: String,
		brand: {
			type: String,
			required: [true, "Product Brand is required"],
			minLength: 2,
			trim: true,
		},
		category: {
			type: String,
			required: [true, "Product category is required"],
			minLength: 2,
			trim: true,
		},
		price: {
			type: Number,
			default: 0,
			required: [true, "Product price is required"],
			trim: true,
		},
		ratingAverage: {
			type: Number,
			default: 0,
		},
		ratingQuantity: {
			type: Number,
			default: 0,
		},
		countInStock: {
			type: Number,
			default: 0,
			required: [true, "countInStock is required"],
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } },
	{ timestamps: true }
);
//  mongoose indexs price
productSchema.index({ price: 1 });

// virtual populate
productSchema.virtual("reviews", {
	ref: "ProductReviewsModel",
	localField: "_id",
	foreignField: "productId",
});
//  mongoose query middlewares
productSchema.pre("findOne", function (next) {
	this.populate("reviews");
	next();
});
export default mongoose.model("ProductModel", productSchema);
