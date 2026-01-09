import CategoryModel from "../models/CategoryModel.js";
import { getAll, getById } from "./handlerFactory.js";

//  @desc   get all categories
// @Route  PATCH /api/v1/categories
// @access Public
export const getAllCategories = getAll(CategoryModel);

//  @desc   get category by id
// @Route  DELETE /api/v1/categories
// @access Public
export const getCategory = getById(CategoryModel);
