import mongoose from "mongoose";
import { moneySchema } from "./commonSchemas.js";
import ProductModel from "./ProductModel.js";

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
				price: moneySchema,
				_id: false,
			},
		],
		totalPrice: moneySchema,
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

cartSchema.pre(/^find/, function () {
	this.populate("items.item");
	this.find({
		active: {
			$ne: false,
		},
	});
});

cartSchema.pre("save", async function () {
	if (!this.isModified("items")) {
		return;
	}

	let currency = "USD";
	let grandTotal = 0;

	for (const item of this.items) {
		// Use lean() to bypass ProductModel's heavy pre-find hooks
		// (which cascade populate reviews, brand, category, etc.)
		const productId = item.item?._id || item.item;
		if (!productId) continue;

		const product = await ProductModel.findById(productId)
			.select("price")
			.lean();

		if (product && product.price) {
			const unitPrice = product.price.amount;
			const itemSubtotal = unitPrice * item.quantity;

			item.price = {
				amount: itemSubtotal,
				currency: product.price.currency || "USD",
			};

			currency = product.price.currency || "USD";
			grandTotal += itemSubtotal;
		}
	}

	this.totalPrice = {
		amount: grandTotal,
		currency: currency,
	};
});

export default mongoose.model("CartModel", cartSchema);
