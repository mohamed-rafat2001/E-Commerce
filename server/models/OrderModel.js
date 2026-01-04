import mongoose from "mongoose";
import { addressSchema, moneySchema } from "./commonSchemas.js";

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		sellerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		items: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "OrderItemsModel",
		},
		shippingAddress: addressSchema,
		paymentMethod: {
			type: String,
			enum: ["card", "paypal", "bank_transfer", "cash_on_delivery", "wallet"],
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

orderSchema.pre("save", async function (next) {
	if (!this.isModified("items")) return next();

	await this.populate("items");

	const itemsTotal = this.items?.totalPrice?.amount || 0;
	const currency = this.items?.totalPrice?.currency || "USD";

	this.itemsPrice = { amount: itemsTotal, currency };

	// Update tax and shipping currency to match items
	if (this.taxPrice) this.taxPrice.currency = currency;
	if (this.shippingPrice) this.shippingPrice.currency = currency;

	const tax = this.taxPrice?.amount || 0;
	const shipping = this.shippingPrice?.amount || 0;

	this.totalPrice = {
		amount: itemsTotal + tax + shipping,
		currency: currency,
	};

	next();
});

export default mongoose.model("OrderModel", orderSchema);
