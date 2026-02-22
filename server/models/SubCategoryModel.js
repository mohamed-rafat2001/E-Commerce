import mongoose from "mongoose";
import slugify from "slugify";

const SubCategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Subcategory name is required"],
			trim: true,
			minlength: 2,
			maxlength: 100,
		},
		slug: {
			type: String,
			required: false,
			trim: true,
			lowercase: true,
		},
		image: {
			public_id: String,
			secure_url: String,
		},
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CategoryModel",
			required: [true, "Category reference is required"],
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 500,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Indexes
SubCategorySchema.index({ categoryId: 1, isActive: 1 });
SubCategorySchema.index({ name: 1 });
SubCategorySchema.index({ slug: 1 }, { unique: true, sparse: true });

// Virtual populate for products (if needed)
SubCategorySchema.virtual("products", {
	ref: "ProductModel",
	localField: "_id",
	foreignField: "subCategory",
});

// Virtual populate for product count
SubCategorySchema.virtual("productCount", {
	ref: "ProductModel",
	localField: "_id",
	foreignField: "subCategory",
	count: true
});

// Populate middleware
SubCategorySchema.pre(/^find/, function () {
	this.populate("categoryId", "name description");
});

// Generate slug before saving
SubCategorySchema.pre("save", async function () {
	if (!this.isModified("name")) return;
	this.slug = slugify(this.name, { lower: true, strict: true });
});

export default mongoose.model("SubCategoryModel", SubCategorySchema);