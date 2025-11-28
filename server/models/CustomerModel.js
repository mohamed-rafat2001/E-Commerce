import mongoose from "mongoose";
import validator from "validator";
const CustomerSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		phoneNumber: {
			type: String,
			required: [true, "phone number is required"],
			trim: true,
			validate: [validator.isMobilePhone, "please enter valid phone number"],
		},
		addresses: String,
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
