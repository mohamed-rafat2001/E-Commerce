import mongoose from "mongoose";
import ProductModel from "./ProductModel.js";
import BrandModel from "./BrandModel.js";
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
		brandId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BrandModel",
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
ReviewsSchema.pre(/^find/, function () {
	this.populate("userId", "firstName lastName profileImg");
});
//  calculate ratings and average ratings for products and brands
ReviewsSchema.statics.calculateRatings = async function (itemId) {
	// Calculate product ratings
	const productStats = await this.aggregate([
		{
			$match: { 
				itemId: new mongoose.Types.ObjectId(itemId),
				brandId: { $exists: false } // Only product reviews
			},
		},
		{
			$group: {
				_id: "$itemId",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);
	
	// Calculate brand ratings
	const brandStats = await this.aggregate([
		{
			$match: { 
				brandId: new mongoose.Types.ObjectId(itemId),
				itemId: { $exists: false } // Only brand reviews
			},
		},
		{
			$group: {
				_id: "$brandId",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);
	
	// Update product ratings
	if (productStats.length > 0) {
		const item = await ProductModel.findById(itemId);
		if (item) {
			await ProductModel.findByIdAndUpdate(itemId, {
				ratingAverage: productStats[0].avgRating,
				ratingCount: productStats[0].nRating,
			});
		}
	} else {
		await ProductModel.findByIdAndUpdate(itemId, {
			ratingAverage: 0,
			ratingCount: 0,
		});
	}
	
	// Update brand ratings
	if (brandStats.length > 0) {
		const brand = await BrandModel.findById(itemId);
		if (brand) {
			await BrandModel.findByIdAndUpdate(itemId, {
				ratingAverage: Math.round(brandStats[0].avgRating * 10) / 10,
				ratingCount: brandStats[0].nRating,
			});
		}
	} else {
		await BrandModel.findByIdAndUpdate(itemId, {
			ratingAverage: 0,
			ratingCount: 0,
		});
	}
	
	return { productStats, brandStats };
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
