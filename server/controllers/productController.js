import ProductModel from "../models/ProductModel.js";
import {
	createDoc,
	deleteAllDocs,
	deleteDoc,
	deleteDocByOwner,
	getAllDocs,
	getSingDoc,
	updateDoc,
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
export const getSingleProduct = getSingDoc(ProductModel);

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
export const updateProduct = updateDoc(ProductModel, "ProductModel", [
	"name",
	"price",
	"countInStock",
	"brand",
	"category",
	"description",
	"image",
]);

//  @desc  delete all products
//  @Route  DELETE /api/v1/products
//  @access Private/superAdmin
export const deleteAllProducts = deleteAllDocs(ProductModel);
