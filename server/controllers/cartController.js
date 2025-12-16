import CartModel from "../models/WishListModel.js";
import {
	addItemToList,
	deleteDocByOwner,
	deleteFromDocList,
	getDocByOwner,
} from "./handlerFactory.js";

//  @desc  create Cart and push products to it
//  POST /api/v1/wishlist
//  private/User
export const addToCart = addItemToList(CartModel);

//  @desc  delete Cart by owner "user"
//  DELETE /api/v1/Cart/:id
//  private/User
export const deleteCart = deleteDocByOwner(CartModel);

//  @desc  delete items from wishlist by owner "user"
//  DELETE /api/v1/Cart/:id
//  private/User
export const deleteFromCart = deleteFromDocList(CartModel);

export const showCart = getDocByOwner(CartModel);
