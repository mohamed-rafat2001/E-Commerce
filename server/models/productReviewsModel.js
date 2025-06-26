import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProductModel",
		},
		rating: {
			type: Number,
			required: [true, "rating is required"],
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: [true, "comment is required"],
			trim: true,
		},
	},
	{ timestamps: true }
);
export default mongoose.model("ProductReviewsModel", ReviewsSchema);
