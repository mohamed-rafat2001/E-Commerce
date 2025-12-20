import WishListModel from "../models/WishListModel.js";
import {
	createDoc,
	deleteDoc,
	deleteFromDocList,
	getDocByOwner,
} from "./handlerFactory.js";

//  @desc  create wishlist and push products to it
//  POST /api/v1/wishlist
//  private/User // admin
export const addToWishList = createDoc(WishListModel);

//  @desc  delete wishlist by owner "user"
//  DELETE /api/v1/wishlist/:id
//  private/User
export const deleteWishList = deleteDoc(WishListModel);

//  @desc  delete items from wishlist by owner "user"
//  PATCH /api/v1/wishlist/:id
//  private/User
export const deleteFromWishList = deleteFromDocList(WishListModel);

//  @desc  show wishlist
//  GET /api/v1/wishlist
//  private/User
export const showWishList = getDocByOwner(WishListModel);
