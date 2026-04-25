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
	{ timestamps: true },
);

export default mongoose.model("OrderItemsModel", orderItemsSchema);
