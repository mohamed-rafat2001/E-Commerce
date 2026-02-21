import ProductModel from "../models/ProductModel.js";
import {
	createDoc,
	deleteManyByOwner,
	deleteOneByOwner,
	getAll,
	getAllByOwner,
	getById,
	updateByOwner,
} from "./handlerFactory.js";

//  @desc   add new product
// @Route  POST /api/v1/products
// @access Private/seller

export const addProduct = createDoc(ProductModel, [
	"name",
	"price",
	"countInStock",
	"brandId",
	"primaryCategory",
	"subCategory",
	"description",
	"coverImage",
	"images",
]);
// @desc   get all products
// @Route  GET /api/v1/products
// @access Public
export const getAllProducts = getAll(ProductModel);

// @desc   get all products by owner seller || admin
// @Route  GET /api/v1/products
// @access private seller
export const getProductsByOwner = getAllByOwner(ProductModel);

//  @desc   get single product
//  @Route  GET /api/v1/products/:id
//  @access Public
export const getSingleProduct = getById(ProductModel);

//  @desc   delete product
//  @Route  DELETE /api/v1/products/:id
//  @access Private/ seller
export const deleteProduct = deleteOneByOwner(ProductModel);

//  @desc   update product
//  @Route  PATCH /api/v1/products/:id
//  @access Private/ seller
export const updateProduct = updateByOwner(ProductModel, [
	"name",
	"price",
	"countInStock",
	"brandId",
	"primaryCategory",
	"subCategory",
	"description",
	"coverImage",
	"images",
]);

//  @desc  delete all products
//  @Route  DELETE /api/v1/products
//  @access Private/Admin || seller
export const deleteAllProducts = deleteManyByOwner(ProductModel);
