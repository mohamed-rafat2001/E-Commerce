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
		numReviews: {
			type: Number,
			default: 0,
		},
		reviews: [],
		rating: {
			type: Number,
			default: 0,
		},
		countInStock: {
			type: Number,
			default: 0,
			required: [true, "countInStock is required"],
		},
	},
	{ timestamps: true }
);
export default mongoose.model("ProductModel", productSchema);
