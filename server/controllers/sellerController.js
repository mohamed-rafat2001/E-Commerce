import SellerModel from "../models/SellerModel.js";
import { updateDoc } from "./handlerFactory.js";

//  @desc  complete seller's doc
// @Route  PATCH /api/v1/seller/
// @access Private/Seller
export const completeSellerDoc = updateDoc(SellerModel, "SellerModel", [
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
export const addAddressestoSeller = updateDoc(SellerModel, "SellerModel", [
	"addresses",
]);
//  @desc  add PayoutMethod to seller
// @Route  PATCH /api/v1/seller/PayoutMethod
// @access Private/Seller
export const addPayoutMethodtoSeller = updateDoc(SellerModel, "SellerModel", [
	"defaultPayoutMethod",
]);
