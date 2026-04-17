import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// add product to wishlist (toggle behavior)
export const addToWishlist = (id) => addFunc(`wishlist/${id}`);

// force-add product to wishlist (no toggle — used during guest merge)
export const forceAddToWishlist = (id) => addFunc(`wishlist/${id}?forceAdd=true`);

// delete product from wishlist
export const deleteFromWishlist = (id) => updateFunc(`wishlist/${id}`);

// show  wishlist
export const showWishList = () => getFunc(`wishlist/user`);

// delete  cart
export const deleteWishlist = (id) => deleteFunc(`wishlist/${id}`);
