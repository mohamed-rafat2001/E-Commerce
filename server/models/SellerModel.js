import mongoose from "mongoose";
const SellerSchema = new mongoose.Schema(
	{
		Seller: {
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
		companyName: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		addresses: String,
		ratingAverage: {
			type: Number,
			min: 0,
			max: 5,
			default: 0,
		},
		ratingCount: {
			type: Number,
			min: 0,
			default: 0,
		},
		status: {
			type: String,
			enum: ["pending", "active", "suspended", "closed"],
			default: "pending",
		},
		verificationStatus: {
			type: String,
			enum: ["unverified", "in_review", "verified", "rejected"],
			default: "unverified",
		},
		defaultPayoutMethod: String,
		balance: String,
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// Virtual to access user email when user is populated
SellerSchema.virtual("email").get(function () {
	return this.populated("Seller") ? this.Seller?.email : undefined;
});
SellerSchema.index({ status: 1 });
SellerSchema.index({ verificationStatus: 1 });
SellerSchema.index({ companyName: 1 });
export default mongoose.model("SellerModel", SellerSchema);
