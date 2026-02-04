import CategoryModel from "../models/CategoryModel.js";
import { getAll, getById, createDoc, updateDoc, deleteOne } from "./handlerFactory.js";

//  @desc   get all categories
// @Route  PATCH /api/v1/categories
// @access Public
export const getAllCategories = getAll(CategoryModel);

//  @desc   get category by id
// @Route  DELETE /api/v1/categories
// @access Public
export const getCategory = getById(CategoryModel);

export const createCategory = createDoc(CategoryModel, ["name", "description", "coverImage"]);
export const updateCategory = updateDoc(CategoryModel, ["name", "description", "coverImage"]);
export const deleteCategory = deleteOne(CategoryModel);
