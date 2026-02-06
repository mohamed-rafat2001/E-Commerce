import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// add product to cart
export const addToCart = (product) => addFunc("cart", product);

// delete product from cart
export const deleteFromCart = (id) => updateFunc(`cart/${id}`);

// show  cart
export const showCart = () => getFunc(`cart/user`);

// delete  cart
export const deleteCart = (id) => deleteFunc(`cart/${id}`);
