import mongoose from "mongoose";
import { addressSchema, moneySchema } from "./commonSchemas.js";

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
			required: true,
		},
		items: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "ProductModel",
					required: true,
				},
				name: { type: String, required: true },
				quantity: { type: Number, required: true },
				image: { type: String },
				price: moneySchema,
			},
		],
		shippingAddress: addressSchema,
		paymentMethod: {
			type: String,
			required: true,
		},
		paymentResult: {
			id: String,
			status: String,
			update_time: String,
			email_address: String,
		},
		itemsPrice: moneySchema,
		taxPrice: moneySchema,
		shippingPrice: moneySchema,
		totalPrice: moneySchema,
		isPaid: {
			type: Boolean,
			required: true,
			default: false,
		},
		paidAt: {
			type: Date,
		},
		isDelivered: {
			type: Boolean,
			required: true,
			default: false,
		},
		deliveredAt: {
			type: Date,
		},
		status: {
			type: String,
			enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
			default: "Pending",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("OrderModel", orderSchema);
