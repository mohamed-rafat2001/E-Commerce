import { addFunc, deleteFunc, getFunc, updateFunc } from "./handlerFactory.js";

// add category
export const addCategory = (category) => addFunc("admin/categories", category);

// get all categories
export const getCategories = () => getFunc("categories");

// delete all categories
export const deleteCategories = () => deleteFunc("admin/categories");

// delete category
export const deleteCategory = (id) => deleteFunc(`admin/categories/${id}`);

// update category
export const updateCategory = (category, id) =>
	updateFunc(`admin/categories/${id}`, category);
