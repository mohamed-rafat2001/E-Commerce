import mongoose from "mongoose";
import ProductModel from "./ProductModel.js";
const ReviewsSchema = new mongoose.Schema(
	{
		userId: {
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
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } },
	{ timestamps: true }
);
ReviewsSchema.pre(/^find/, function (next) {
	this.populate("userId", "firstName lastName profileImg");
	next();
});
//  calculate ratings and average ratings
ReviewsSchema.statics.calculateRatings = async function (productId) {
	const stats = await this.aggregate([
		{
			$match: { productId },
		},
		{
			$group: {
				_id: "$productId",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);
	if (stats.length > 0) {
		await ProductModel.findByIdAndUpdate(productId, {
			ratingAverage: stats[0].avgRating,
			ratingQuantity: stats[0].nRating,
		});
	} else {
		await ProductModel.findByIdAndUpdate(productId, {
			ratingAverage: 0,
			ratingQuantity: 0,
		});
	}
	return stats;
};
//  add rating to product
ReviewsSchema.post("save", async function () {
	await this.constructor.calculateRatings(this.productId);
});

//  update rating in product
ReviewsSchema.post(/^findOneAnd/, async function (doc) {
	if (doc) {
		await doc.constructor.calculateRatings(doc.productId);
	}
});

export default mongoose.model("ProductReviewsModel", ReviewsSchema);
