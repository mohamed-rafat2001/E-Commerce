import WishListModel from "../models/WishListModel.js";
import {
	createDoc,
	deleteDocByOwner,
	deleteFromDocList,
	getDocByOwner,
} from "./handlerFactory.js";

//  @desc  create wishlist and push products to it
//  POST /api/v1/wishlist
//  private/User
export const addToWishList = createDoc(WishListModel);

//  @desc  delete wishlist by owner "user"
//  DELETE /api/v1/wishlist/:id
//  private/User
export const deleteWishList = deleteDocByOwner(WishListModel);

//  @desc  delete items from wishlist by owner "user"
//  PATCH /api/v1/wishlist/:id
//  private/User
export const deleteFromWishList = deleteFromDocList(WishListModel);

//  @desc  show wishlist
//  GET /api/v1/wishlist
//  private/User
export const showWishList = getDocByOwner(WishListModel);
