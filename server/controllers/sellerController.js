import SellerModel from "../models/SellerModel.js";
import { updateByOwner } from "./handlerFactory.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import appError from "../utils/appError.js";

//  @desc  complete seller's doc
// @Route  PATCH /api/v1/seller/
// @access Private/Seller
export const completeSellerDoc = updateByOwner(SellerModel, [
	"brand",
	"brandImg",
	"description",
	"businessEmail",
	"businessPhone",
	"primaryCategory",
]);

//  @desc  add addresses to seller
// @Route  PATCH /api/v1/seller/addresses
// @access Private/Seller
export const addAddressestoSeller = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) return next(new appError("Seller not found", 404));

	if (!req.body.addresses) {
		return next(new appError("Please provide address data", 400));
	}

	seller.addresses.push(req.body.addresses);
	await seller.save();

	sendResponse(res, 201, seller);
});

//  @desc  add PayoutMethod to seller
// @Route  PATCH /api/v1/seller/PayoutMethod
// @access Private/Seller
export const addPayoutMethodtoSeller = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) return next(new appError("Seller not found", 404));

	if (!req.body.payoutMethods) {
		return next(new appError("Please provide payout method data", 400));
	}

	seller.payoutMethods.push(req.body.payoutMethods);
	await seller.save();

	sendResponse(res, 201, seller);
});

// add review to seller
