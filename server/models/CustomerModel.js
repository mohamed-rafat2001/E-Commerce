import mongoose from "mongoose";
import { addressSchema, paymentMethodSchema } from "./commonSchemas.js";

const CustomerSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},

		addresses: [addressSchema],
		paymentMethods: [paymentMethodSchema],
		loyaltyPoints: {
			type: Number,
			default: 0,
			min: 0,
		},
		status: {
			type: String,
			enum: ["active", "suspended", "deleted"],
			default: "active",
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CustomerSchema.index({ status: 1 });
export default mongoose.model("CustomerModel", CustomerSchema);
