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

// @desc Add payment method to customer
// @Route PATCH /api/v1/customers/payment-methods
// @access Private/Customer
export const addPaymentMethod = catchAsync(async (req, res, next) => {
	const customer = await CustomerModel.findOne({ userId: req.user._id });
	if (!customer) return next(new appError("Customer not found", 404));

	if (!req.body.paymentMethod) {
		return next(new appError("Please provide payment method data", 400));
	}

	// If this is the first payment method or requested as default, unset other defaults
	if (customer.paymentMethods.length === 0 || req.body.paymentMethod.isDefault) {
		customer.paymentMethods.forEach((pm) => (pm.isDefault = false));
		req.body.paymentMethod.isDefault = true;
	}

	customer.paymentMethods.push(req.body.paymentMethod);
	await customer.save();

	sendResponse(res, 201, customer);
});

// @desc Delete payment method from customer
// @Route DELETE /api/v1/customers/payment-methods/:paymentMethodId
// @access Private/Customer
export const deletePaymentMethod = catchAsync(async (req, res, next) => {
	const customer = await CustomerModel.findOne({ userId: req.user._id });
	if (!customer) return next(new appError("Customer not found", 404));

	customer.paymentMethods = customer.paymentMethods.filter(
		(pm) => pm._id.toString() !== req.params.paymentMethodId
	);

	await customer.save();
	sendResponse(res, 200, customer);
});

// @desc Set default payment method
// @Route PATCH /api/v1/customers/payment-methods/:paymentMethodId/default
// @access Private/Customer
export const setDefaultPaymentMethod = catchAsync(async (req, res, next) => {
	const customer = await CustomerModel.findOne({ userId: req.user._id });
	if (!customer) return next(new appError("Customer not found", 404));

	customer.paymentMethods.forEach((pm) => {
		pm.isDefault = pm._id.toString() === req.params.paymentMethodId;
	});

	await customer.save();
	sendResponse(res, 200, customer);
});

// @desc Update payment method
// @Route PATCH /api/v1/customers/payment-methods/:paymentMethodId
// @access Private/Customer
export const updatePaymentMethod = catchAsync(async (req, res, next) => {
	const customer = await CustomerModel.findOne({ userId: req.user._id });
	if (!customer) return next(new appError("Customer not found", 404));

	const paymentIndex = customer.paymentMethods.findIndex(
		(pm) => pm._id.toString() === req.params.paymentMethodId
	);

	if (paymentIndex === -1) return next(new appError("Payment method not found", 404));

	customer.paymentMethods[paymentIndex] = {
		...customer.paymentMethods[paymentIndex].toObject(),
		...req.body,
	};

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

