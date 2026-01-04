import mongoose from "mongoose";
import { moneySchema } from "./commonSchemas.js";

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
	},
	{ timestamps: true }
);

cartSchema.pre("save", async function (next) {
	if (!this.isModified("items")) return next();

	// Use populate to get product details directly
	await this.populate("items.item");

	let currency = "USD";
	let grandTotal = 0;

	this.items.forEach((item) => {
		if (item.item && item.item.price) {
			const unitPrice = item.item.price.amount;
			const itemSubtotal = unitPrice * item.quantity;

			// Set the item price to the subtotal for that quantity
			item.price = {
				amount: itemSubtotal,
				currency: item.item.price.currency,
			};

			currency = item.item.price.currency;
			// Add this item's subtotal to the grand total
			grandTotal += itemSubtotal;
		}
	});

	this.totalPrice = {
		amount: grandTotal,
		currency: currency,
	};

	next();
});
cartSchema.pre("findOne", function (next) {
	this.populate("items.item");
	next();
});

export default mongoose.model("CartModel", cartSchema);
