import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// add product to wishlist
export const addToWishlist = (id) => addFunc(`wishlist/${id}`);

// delete product from wishlist
export const deleteFromWishlist = (id) => updateFunc(`wishlist/${id}`);

// show  wishlist
export const showWishList = () => getFunc(`wishlist/user`);

// delete  cart
export const deleteWishlist = (id) => deleteFunc(`wishlist/${id}`);
