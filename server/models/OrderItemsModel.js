import mongoose from "mongoose";
import { moneySchema } from "./commonSchemas.js";

const orderItemsSchema = new mongoose.Schema(
	{
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "OrderModel",
			required: true,
		},
		sellerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SellerModel",
			required: true,
		},
		items: [
			{
				item: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "ProductModel",
					required: true,
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

orderItemsSchema.pre("save", async function (next) {
	if (!this.isModified("items")) return next();

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

	this.totalPrice = { amount: grandTotal, currency };

	next();
});

export default mongoose.model("OrderItemsModel", orderItemsSchema);
