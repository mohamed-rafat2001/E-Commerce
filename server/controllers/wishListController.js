import catchAsync from "../middlewares/catchAsync.js";
import WishListModel from "../models/WishListModel.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import {
	deleteFromDocList,
	deleteOneByOwner,
	getOneByOwner,
} from "./handlerFactory.js";

//  @desc  create wishlist and push products to it
//  POST /api/v1/wishlist
//  private/User // admin
// export const addToWishList = createDoc(WishListModel);
export const addToWishList = catchAsync(async (req, res, next) => {
	let doc = await WishListModel.findOne({ userId: req.user._id });

	if (!doc) {
		doc = await WishListModel.create({
			userId: req.user._id,
			items: [req.params.id],
		});
	} else {
		const itemIndex = doc.items.findIndex(
			(id) => id.toString() === req.params.id
		);

		if (itemIndex === -1) {
			doc.items.push(req.params.id);
		} else {
			doc.items.splice(itemIndex, 1);
		}
		await doc.save();
	}
	// check if doc created
	if (!doc) return next(new appError("doc not create", 400));
	sendResponse(res, 200, doc);
});
//  @desc  delete wishlist by owner "user"
//  DELETE /api/v1/wishlist/:id
//  private/User
export const deleteWishList = deleteOneByOwner(WishListModel);

//  @desc  delete items from wishlist by owner "user"
//  PATCH /api/v1/wishlist/:id
//  private/User
export const deleteFromWishList = deleteFromDocList(WishListModel);

//  @desc  show wishlist
//  GET /api/v1/wishlist
//  private/User
export const showWishList = getOneByOwner(WishListModel);
