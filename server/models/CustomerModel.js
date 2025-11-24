import mongoose from "mongoose";
const CustomerSchema = new mongoose.Schema(
	{
		Customer: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			unique: true,
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
			enum: ["active", "suspended", "deleted"],
			default: "active",
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// Virtual to access user email when user is populated
CustomerSchema.virtual("email").get(function () {
	return this.populated("Customer") ? this.Customer?.email : undefined;
});

CustomerSchema.index({ status: 1 });
export default mongoose.model("CustomerModel", CustomerSchema);
