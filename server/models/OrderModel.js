import mongoose from "mongoose";
import { addressSchema, moneySchema } from "./commonSchemas.js";

const orderSchema = new mongoose.Schema(
	{
		orderNumber: {
			type: String,
			unique: true,
			trim: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		guestEmail: {
			type: String,
			trim: true,
		},
		guestName: {
			type: String,
			trim: true,
		},
		guestPhone: {
			type: String,
			trim: true,
		},
		sellerIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "SellerModel",
			},
		],
		couponCode: {
			type: String,
			trim: true,
			uppercase: true,
		},
		items: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "OrderItemsModel",
			},
		],
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
		discountAmount: {
			type: new mongoose.Schema(
				{
					amount: { type: Number, default: 0, min: 0 },
					currency: { type: String, default: "USD", trim: true, uppercase: true },
				},
				{ _id: false }
			),
			default: () => ({ amount: 0, currency: "USD" }),
		},
		shippingDiscountAmount: {
			type: new mongoose.Schema(
				{
					amount: { type: Number, default: 0, min: 0 },
					currency: { type: String, default: "USD", trim: true, uppercase: true },
				},
				{ _id: false }
			),
			default: () => ({ amount: 0, currency: "USD" }),
		},
		appliedDiscounts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "DiscountModel",
			},
		],
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

orderSchema.pre("save", async function () {
	if (!this.orderNumber) {
		const now = new Date();
		const datePart =
			now.getFullYear().toString() +
			String(now.getMonth() + 1).padStart(2, "0") +
			String(now.getDate()).padStart(2, "0");
		const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
		this.orderNumber = `ORD-${datePart}-${randomPart}`;
	}
});

orderSchema.pre("save", async function () {
	if (!this.isModified("items")) return;

	await this.populate("items");

	// Calculate total amount from all valid OrderItems
	const itemsTotal = this.items.reduce((sum, item) => {
		return sum + (item.totalPrice?.amount || 0);
	}, 0);
	
	const currency = this.items?.[0]?.totalPrice?.currency || "USD";

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
});

export default mongoose.model("OrderModel", orderSchema);
