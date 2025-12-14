import CategoryModel from "../models/CategoryModel.js";
import {
	createDoc,
	deleteAllDocs,
	deleteDoc,
	getAllDocs,
	updateDoc,
} from "./handlerFactory.js";

//  @desc   add new category
// @Route  POST /api/v1/categories
// @access Private/Admin

export const createCategory = createDoc(CategoryModel, "CategoryModel", [
	"name",
	"description",
]);

//  @desc   update category
// @Route  PATCH /api/v1/categories/:id
// @access Private/Admin
export const updateCategory = updateDoc(CategoryModel, "CategoryModel", [
	"name",
	"description",
	"isActive",
]);
//  @desc   delete category
// @Route  DELETE /api/v1/categories/:id
// @access Private/Admin
export const deleteCategory = deleteDoc(CategoryModel);

//  @desc   get all categories
// @Route  PATCH /api/v1/categories
// @access puplic
export const getAllCategories = getAllDocs(CategoryModel);

//  @desc   delete all categories
// @Route  DELETE /api/v1/categories
// @access Private/Admin
export const deleteAllCategories = deleteAllDocs(CategoryModel);
