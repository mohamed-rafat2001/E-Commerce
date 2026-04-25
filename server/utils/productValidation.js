import mongoose from "mongoose";
import appError from "./appError.js";

/**
 * Validates relationships for ProductModel creation/updates
 */
export const validateProductReferences = async (object, req) => {
	// Clean up empty string values for reference fields
	if (object.brandId === "") delete object.brandId;
	if (object.primaryCategory === "") delete object.primaryCategory;
	if (object.subCategory === "") delete object.subCategory;

	// Validate brand
	if (object.brandId) {
		const BrandModel = mongoose.model("BrandModel");
		const SellerModel = mongoose.model("SellerModel");

		const seller = await SellerModel.findOne({ userId: req.user._id });

		if (!seller) throw new appError("Seller profile not found", 404);

		const brand = await BrandModel.findOne({
			_id: object.brandId,
			sellerId: seller._id,
		});

		if (!brand) throw new appError("Brand not found or doesn't belong to you", 404);
	}

	// Validate primary category
	if (object.primaryCategory) {
		const CategoryModel = mongoose.model("CategoryModel");
		const category = await CategoryModel.findById(object.primaryCategory);

		if (!category) throw new appError("Primary category not found", 404);
	}

	// Validate sub-category relationship
	if (object.subCategory) {
		const SubCategoryModel = mongoose.model("SubCategoryModel");
		const subCategory = await SubCategoryModel.findById(object.subCategory);

		if (!subCategory) throw new appError("Sub category not found", 404);

		const targetCategoryId =
            object.primaryCategory ||
            (req.params.id ? (await mongoose.model("ProductModel").findById(req.params.id))?.primaryCategory : null);

		const subCategoryParentId =
            subCategory.categoryId._id || subCategory.categoryId;

		if (targetCategoryId && subCategoryParentId.toString() !== targetCategoryId.toString()) {
			throw new appError("Sub category doesn't belong to the selected primary category", 400);
		}
	}

	// Validate image array length
	if (object.images && object.images.length > 10) {
		throw new appError("Maximum 10 additional images allowed", 400);
	}

	return object;
};
