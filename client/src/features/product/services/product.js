import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// add product
export const addProduct = (product) => addFunc("products", product);

// get all products
export const getAllProducts = () => getFunc("products");

// delete all products
export const deleteProducts = () => deleteFunc("products");

// delete product
export const deletProduct = (id) => deleteFunc(`products/${id}`);

// update product
export const updateProduct = (product, id) =>
	updateFunc(`products/${id}`, product);

// get single product
export const getProduct = (id) => getFunc(`products/${id}`);
