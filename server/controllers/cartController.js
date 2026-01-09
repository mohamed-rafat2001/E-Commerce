import catchAsync from "../middlewares/catchAsync.js";
import CartModel from "../models/CartModel.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import {
	deleteFromDocList,
	deleteOneByOwner,
	getOneByOwner,
} from "./handlerFactory.js";

//  @desc  create Cart and push products to it
//  PATCH /api/v1/cart
//  private/User
export const addToCart = catchAsync(async (req, res, next) => {
	const { quantity, itemId } = req.body;

	let cart = await CartModel.findOne({ userId: req.user._id, active: true });

	if (!cart) {
		cart = await CartModel.create({
			userId: req.user._id,
			items: [{ item: itemId, quantity: quantity || 1 }],
		});
	} else {
		// Check if item already exists in model
		const itemExist = cart.items.find(
			(item) =>
				item.item?._id?.toString() === itemId ||
				item.item?.toString() === itemId
		);

		if (itemExist) {
			// Update quantity if item exists
			itemExist.quantity += Number(quantity) || 1;
		} else {
			// Push new item if item doesn't exist
			cart.items.push({ item: itemId, quantity: Number(quantity) || 1 });
		}

		// Explicitly mark as modified to trigger pre-save hooks
		cart.markModified("items");
		// Save the document to trigger pre-save hooks (like price calculation)
		await cart.save();
	}

	// check if cart created
	if (!cart) return next(new appError("cart not created", 400));
	// send response
	sendResponse(res, 200, cart);
});

//  @desc  delete Cart by owner "user"
//  DELETE /api/v1/cart/:id
//  private/User
export const deleteCart = deleteOneByOwner(CartModel);

//  @desc  delete items from wishlist by owner "user"
//  PAtch /api/v1/cart/:id
//  private/User
export const deleteFromCart = deleteFromDocList(CartModel);

//  @desc  show Cart
//  GET /api/v1/cart
//  private/User
export const showCart = getOneByOwner(CartModel);
