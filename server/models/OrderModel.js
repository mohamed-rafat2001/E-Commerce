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
				{ _id: false },
			),
			default: () => ({ amount: 0, currency: "USD" }),
		},
		shippingDiscountAmount: {
			type: new mongoose.Schema(
				{
					amount: { type: Number, default: 0, min: 0 },
					currency: { type: String, default: "USD", trim: true, uppercase: true },
				},
				{ _id: false },
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
	},
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

export default mongoose.model("OrderModel", orderSchema);
