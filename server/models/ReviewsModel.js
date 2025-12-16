import mongoose from "mongoose";
import ProductModel from "./ProductModel.js";
import SellerModel from "./SellerModel.js";
const ReviewsSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		itemId: {
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
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
		id: false,
	}
);
ReviewsSchema.pre(/^find/, function (next) {
	this.populate("userId", "firstName lastName profileImg");
	next();
});
//  calculate ratings and average ratings
ReviewsSchema.statics.calculateRatings = async function (itemId) {
	const stats = await this.aggregate([
		{
			$match: { itemId },
		},
		{
			$group: {
				_id: "$itemId",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);
	if (stats.length > 0) {
		const item = await ProductModel.findById(itemId);
		const seller = await SellerModel.findOne({ userId: itemId });
		if (item) {
			await ProductModel.findByIdAndUpdate(itemId, {
				ratingAverage: stats[0].avgRating,
				ratingCount: stats[0].nRating,
			});
		} else if (seller) {
			await SellerModel.findOneAndUpdate(
				{ userId: itemId },
				{
					ratingAverage: stats[0].avgRating,
					ratingCount: stats[0].nRating,
				}
			);
		}
	} else {
		await ProductModel.findByIdAndUpdate(itemId, {
			ratingAverage: 0,
			ratingCount: 0,
		});
		await SellerModel.findOneAndUpdate(
			{ userId: itemId },
			{
				ratingAverage: 0,
				ratingCount: 0,
			}
		);
	}
	return stats;
};
//  add rating to product
ReviewsSchema.post("save", async function () {
	await this.constructor.calculateRatings(this.itemId);
});

//  update rating in product
ReviewsSchema.post(/^findOneAnd/, async function (doc) {
	if (doc) {
		await doc.constructor.calculateRatings(doc.itemId);
	}
});

export default mongoose.model("ReviewsModel", ReviewsSchema);
