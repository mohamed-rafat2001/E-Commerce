import CustomerModel from "../models/CustomerModel.js";
import { updateByOwner } from "./handlerFactory.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import appError from "../utils/appError.js";

// @desc Get customer profile (including addresses)
// @Route GET /api/v1/customers/profile
// @access Private/Customer
export const getCustomerProfile = catchAsync(async (req, res, next) => {
	const customer = await CustomerModel.findOne({ userId: req.user._id });
	if (!customer) return next(new appError("Customer not found", 404));
	sendResponse(res, 200, customer);
});

// @desc Add addresses to customer
// @Route PATCH /api/v1/customers/addresses
// @access Private/Customer
export const addAddressestoCustomer = catchAsync(async (req, res, next) => {
	const customer = await CustomerModel.findOne({ userId: req.user._id });
	if (!customer) return next(new appError("Customer not found", 404));

	// Expecting { addresses: { ...addressData } } from body to match factory behavior
	if (!req.body.addresses) {
		return next(new appError("Please provide address data", 400));
	}

	customer.addresses.push(req.body.addresses);
	await customer.save();

	sendResponse(res, 201, customer);
});

// @desc Delete address from customer
// @Route DELETE /api/v1/customers/addresses/:addressId
// @access Private/Customer
export const deleteAddressFromCustomer = catchAsync(async (req, res, next) => {
	const customer = await CustomerModel.findOne({ userId: req.user._id });
	if (!customer) return next(new appError("Customer not found", 404));

	customer.addresses = customer.addresses.filter(
		(addr) => addr._id.toString() !== req.params.addressId
	);

	await customer.save();
	sendResponse(res, 200, customer);
});

// @desc Update address
// @Route PATCH /api/v1/customers/addresses/:addressId
// @access Private/Customer
export const updateAddress = catchAsync(async (req, res, next) => {
	const customer = await CustomerModel.findOne({ userId: req.user._id });
	if (!customer) return next(new appError("Customer not found", 404));

	const addressIndex = customer.addresses.findIndex(
		(addr) => addr._id.toString() === req.params.addressId
	);

	if (addressIndex === -1) return next(new appError("Address not found", 404));

	customer.addresses[addressIndex] = {
		...customer.addresses[addressIndex].toObject(),
		...req.body,
	};

	await customer.save();
	sendResponse(res, 200, customer);
});

// @desc Set default address
// @Route PATCH /api/v1/customers/addresses/:addressId/default
// @access Private/Customer
export const setDefaultAddress = catchAsync(async (req, res, next) => {
	const customer = await CustomerModel.findOne({ userId: req.user._id });
	if (!customer) return next(new appError("Customer not found", 404));

	customer.addresses.forEach((addr) => {
		addr.isDefault = addr._id.toString() === req.params.addressId;
	});

	await customer.save();
	sendResponse(res, 200, customer);
});

