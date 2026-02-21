import mongoose from "mongoose";
import slugify from "slugify";
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
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual populate for subcategories
categorySchema.virtual("subCategories", {
	ref: "SubCategoryModel",
	localField: "_id",
	foreignField: "categoryId",
});

categorySchema.pre("save", async function () {
	if (!this.isModified("name")) return;
	this.slug = slugify(this.name, { lower: true });
});

// categorySchema.index({ slug: 1 }, { unique: true });
export default mongoose.model("CategoryModel", categorySchema);
