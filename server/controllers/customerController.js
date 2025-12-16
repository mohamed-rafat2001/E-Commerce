import CustomerModel from "../models/CustomerModel.js";
import { updateDoc } from "./handlerFactory.js";

//  @desc  add addresses to customer
// @Route  PATCH /api/v1/customer/addresses
// @access Private/Customer
export const addAddressestoCustomer = updateDoc(
	CustomerModel,

	["addresses"]
);
