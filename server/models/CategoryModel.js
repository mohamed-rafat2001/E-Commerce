import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
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
		slug: {
			type: String,
			required: false,
			trim: true,
			lowercase: true,
		},
		description: {
			type: String,
			trim: true,
		},
		coverImage: {
				public_id: String,
				secure_url: String,
			},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);
// categorySchema.index({ slug: 1 }, { unique: true });
export default mongoose.model("CategoryModel", categorySchema);
