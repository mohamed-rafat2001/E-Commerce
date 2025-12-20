import mongoose from "mongoose";
import { moneySchema } from "./commonSchemas.js";

const orderItemsSchema = new mongoose.Schema(
	{
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "OrderModel",
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
	const grandTotal = this.items.reduce((total, item) => {
		if (item.item) {
			item.price = {
				amount: item.item.price.amount,
				currency: item.item.price.currency,
			};
			currency = item.item.price.currency;
			return total + item.price.amount * item.quantity;
		}
		return total;
	}, 0);

	this.totalPrice = { amount: grandTotal, currency };

	next();
});

export default mongoose.model("OrderItemsModel", orderItemsSchema);
