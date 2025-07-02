import catchAsync from "../middelwares/catchAsync.js";
import ProductModel from "../models/ProductModel.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendRespons.js";
import {
	createDoc,
	deleteAllDocs,
	deleteDoc,
	deleteDocByOwner,
	getAllDocs,
} from "./handelFactoryController.js";

//  @desc   add new product
// @Route  POST /api/v1/products
// @access Private/Admin

export const addProduct = createDoc(ProductModel, "ProductModel", [
	"name",
	"price",
	"countInStock",
	"brand",
	"category",
	"description",
	"image",
]);
// @desc   get all products
// @Route  GET /api/v1/products
// @access Public
export const getAllProducts = getAllDocs(ProductModel);

//  @desc   get single product
//  @Route  GET /api/v1/products/:id
//  @access Public
export const getSingleProduct = catchAsync(async (req, res, next) => {
	const product = await ProductModel.findById(req.params.id);
	// check if product exist
	if (!product) return next(new appError("product not found", 400));
	// send response
	sendResponse(res, 200, product);
});

//  @desc   delete product
//  @Route  DELETE /api/v1/products/:id
//  @access Private/superAdmin
export const deleteProduct = deleteDoc(ProductModel);

//  @desc   delete product

//  @access Private/superAdmin
export const deleteProductByOwner = deleteDocByOwner(ProductModel);

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
	const product = await ProductModel.findByIdAndUpdate(
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
//  @access Private/superAdmin
export const deleteAllProducts = deleteAllDocs(ProductModel);
