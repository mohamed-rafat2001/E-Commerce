import CustomerModel from "../models/CustomerModel.js";
import { updateByOwner } from "./handlerFactory.js";

//  @desc  add addresses to customer
// @Route  PATCH /api/v1/customer/addresses
// @access Private/Customer
export const addAddressestoCustomer = updateByOwner(
	CustomerModel,

	["addresses"]
);
