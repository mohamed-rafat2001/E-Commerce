import catchAsync from "../middelwares/catchAsync.js";
import productModel from "../models/productModel.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendRespons.js";

//  @desc   add new product
// @Route  POST /api/v1/products
// @access Private/Admin
export const addProduct = catchAsync(async (req, res, next) => {
	const { name, price, countInStock, brand, category, description, image } =
		req.body;
	// validation
	if (!name || !price || !countInStock || !brand || !category)
		return next(new appError("please provide all fields", 400));
	// create new product
	const product = await productModel.create({
		user: req.user._id,
		name,
		price,
		countInStock,
		brand,
		category,
		description,
		image,
	});
	// check if product created
	if (!product) return next(new appError("failed to add product", 400));
	// send response
	sendResponse(res, 201, product);
});

// @desc   get all products
// @Route  GET /api/v1/products
// @access Public
export const getAllProducts = catchAsync(async (req, res, next) => {
	const products = await productModel.find({});
	// check if products exist
	if (!products) return next(new appError("products not found", 400));
	// send response
	sendResponse(res, 200, { results: products.length, products });
});

//  @desc   get single product
//  @Route  GET /api/v1/products/:id
//  @access Public
export const getSingleProduct = catchAsync(async (req, res, next) => {
	const product = await productModel.findById(req.params.id);
	// check if product exist
	if (!product) return next(new appError("product not found", 400));
	// send response
	sendResponse(res, 200, product);
});

//  @desc   delete product
//  @Route  DELETE /api/v1/products/:id
//  @access Private/Admin
export const deleteProduct = catchAsync(async (req, res, next) => {
	const product = await productModel.findByIdAndDelete(req.params.id);
	// check if product deleted
	if (!product) return next(new appError("product not delete", 400));
	// send response
	sendResponse(res, 200, product);
});

//  @desc   update product
//  @Route  PATCH /api/v1/products/:id
//  @access Private/Admin
export const updateProduct = catchAsync(async (req, res, next) => {
	const { name, price, countInStock, brand, category, image, description } =
		req.body;
	// validation
	if (
		!name ||
		!price ||
		!countInStock ||
		!brand ||
		!category ||
		!description ||
		!image
	)
		return next(new appError("please provide all fields", 400));
	// update product
	const product = await productModel.findByIdAndUpdate(
		req.params.id,
		{
			name,
			price,
			countInStock,
			brand,
			category,
			image,
			description,
		},
		{ new: true, runValidators: true }
	);
	// check if product updated
	if (!product) return next(new appError("product not update", 400));
	// send response
	sendResponse(res, 200, product);
});

//  @desc  delete all products
//  @Route  DELETE /api/v1/products
//  @access Private/Admin
export const deleteAllProducts = catchAsync(async (req, res, next) => {
	const products = await productModel.deleteMany({});
	// check if products deleted
	if (!products) return next(new appError("products not delete", 400));
	// send response
	sendResponse(res, 200, products);
});
