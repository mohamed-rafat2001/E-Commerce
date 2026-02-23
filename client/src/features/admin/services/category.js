import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// add category
export const addCategory = (category) => addFunc("admin/categories", category);

// get all categories
export const getCategories = (params) => getFunc("categories", { params });

// delete all categories
export const deleteCategories = () => deleteFunc("admin/categories");

// delete category
export const deleteCategory = (id) => deleteFunc(`admin/categories/${id}`);

// update category
export const updateCategory = ({ id, data }) =>
	updateFunc(`admin/categories/${id}`, data);
