import SubCategoryModel from "../models/SubCategoryModel.js";
import CategoryModel from "../models/CategoryModel.js";
import { 
	getAll as fetchAll, 
	getById as fetchById, 
	createDoc as createOneDoc, 
	updateById as updateOneById, 
	deleteById as deleteOneById 
} from "./handlerFactory.js";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";

//  @desc   Get all subcategories
// @Route   GET /api/v1/subcategories
// @access  Public
export const getAllSubCategories = fetchAll(SubCategoryModel);

//  @desc   Get subcategory by ID
// @Route   GET /api/v1/subcategories/:id
// @access  Public
export const getSubCategory = fetchById(SubCategoryModel);

//  @desc   Create new subcategory
// @Route   POST /api/v1/subcategories
// @access  Private/Admin
export const createSubCategory = createOneDoc(SubCategoryModel, [
	"name", 
	"image", 
	"categoryId", 
	"description"
]);

//  @desc   Update subcategory
// @Route   PATCH /api/v1/subcategories/:id
// @access  Private/Admin
export const updateSubCategory = updateOneById(SubCategoryModel, [
	"name", 
	"image", 
	"categoryId", 
	"description", 
	"isActive"
]);

//  @desc   Delete subcategory
// @Route   DELETE /api/v1/subcategories/:id
// @access  Private/Admin
export const deleteSubCategory = deleteOneById(SubCategoryModel);

//  @desc   Get subcategories by category ID
// @Route   GET /api/v1/categories/:categoryId/subcategories
// @access  Public
export const getSubCategoriesByCategory = catchAsync(async (req, res, next) => {
	const { categoryId } = req.params;
	
	// Verify category exists
	const category = await CategoryModel.findById(categoryId);
	if (!category) {
		return next(new appError("Category not found", 404));
	}
	
	const subCategories = await SubCategoryModel.find({ 
		categoryId, 
		isActive: true 
	}).populate("categoryId", "name description");
	
	sendResponse(res, 200, subCategories);
});

//  @desc   Get subcategory with products count
// @Route   GET /api/v1/subcategories/:id/details
// @access  Public
export const getSubCategoryDetails = catchAsync(async (req, res, next) => {
	const subCategory = await SubCategoryModel.findById(req.params.id)
		.populate("categoryId", "name description");
	
	if (!subCategory) {
		return next(new appError("Subcategory not found", 404));
	}
	
	// Add product count (this would require ProductModel import)
	// For now, we'll just return the subcategory with populated category
	sendResponse(res, 200, subCategory);
});

//  @desc   Get subcategories by brand ID
// @Route   GET /api/v1/subcategories/brand/:brandId
// @access  Private/Seller
export const getSubCategoriesByBrand = catchAsync(async (req, res, next) => {
	const { brandId } = req.params;
	
	// Import ProductModel to get products for this brand
	const ProductModel = (await import("../models/ProductModel.js")).default;
	
	// Get products for this brand
	const products = await ProductModel.find({ 
		brandId, 
		isActive: true 
	}).populate("subCategory", "name categoryId isActive");
	
	// Extract unique subcategories from products
	const subCategoryIds = [...new Set(products.map(p => p.subCategory?._id).filter(Boolean))];
	
	const subCategories = await SubCategoryModel.find({ 
		_id: { $in: subCategoryIds },
		isActive: true 
	}).populate("categoryId", "name description");
	
	sendResponse(res, 200, subCategories);
});