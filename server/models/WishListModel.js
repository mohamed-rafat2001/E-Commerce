import mongoose from "mongoose";
const wishListSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		items: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "ProductModel",
			},
		],
	},
	{ timestamps: true }
);
wishListSchema.pre(/^find/, function () {
	this.populate("items");
});
export default mongoose.model("WishListModel", wishListSchema);
