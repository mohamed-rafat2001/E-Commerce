import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		items: [
			{
				item: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "ProductModel",
				},
				quantity: { type: Number, default: 1 },
			},
		],
	},
	{ timestamps: true }
);
cartSchema.pre("findOne", function (next) {
	this.populate("items.product");
	next();
});
export default mongoose.model("CartModel", cartSchema);
