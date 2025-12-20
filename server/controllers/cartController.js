import CartModel from "../models/CartModel.js";
import {
	addItemToList,
	deleteDoc,
	deleteDocByOwner,
	deleteFromDocList,
	getDocByOwner,
} from "./handlerFactory.js";

//  @desc  create Cart and push products to it
//  PATCH /api/v1/cart
//  private/User
export const addToCart = addItemToList(CartModel);

//  @desc  delete Cart by owner "user"
//  DELETE /api/v1/cart/:id
//  private/User
export const deleteCart = deleteDoc(CartModel);

//  @desc  delete items from wishlist by owner "user"
//  PAtch /api/v1/cart/:id
//  private/User
export const deleteFromCart = deleteFromDocList(CartModel);

//  @desc  show Cart
//  GET /api/v1/cart
//  private/User
export const showCart = getDocByOwner(CartModel);
