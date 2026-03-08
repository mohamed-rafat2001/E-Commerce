import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import * as cartService from "../services/cartService.js";

// @desc    Get authenticated user's cart (enriched with live product data)
// @access  Private/Customer
export const getCart = catchAsync(async (req, res, next) => {
	const cart = await cartService.getCart(req.user._id);
	sendResponse(res, 200, cart);
});

// @desc    Add item to cart (or increment quantity if already exists)
// @access  Private/Customer
export const addToCart = catchAsync(async (req, res, next) => {
	const { itemId, product_id, quantity } = req.body;
	const productId = itemId || product_id;

	if (!productId) {
		return next(new appError("Product ID is required (itemId or product_id)", 400));
	}

	const cart = await cartService.addItem(req.user._id, {
		product_id: productId,
		quantity: quantity || 1,
	});

	sendResponse(res, 200, cart);
});

// @desc    Update item quantity in cart
// @access  Private/Customer
export const updateItemQuantity = catchAsync(async (req, res, next) => {
	const { quantity } = req.body;
	const productId = req.params.id;

	if (!productId) {
		return next(new appError("Product ID is required", 400));
	}
	if (!quantity) {
		return next(new appError("Quantity is required", 400));
	}

	const cart = await cartService.updateItemQuantity(
		req.user._id,
		productId,
		quantity
	);

	sendResponse(res, 200, cart);
});

// @desc    Remove an item from cart
// @access  Private/Customer
export const removeFromCart = catchAsync(async (req, res, next) => {
	const productId = req.params.id;

	if (!productId) {
		return next(new appError("Product ID is required", 400));
	}

	const cart = await cartService.removeItem(req.user._id, productId);
	sendResponse(res, 200, cart);
});

// @desc    Clear entire cart
// @access  Private/Customer
export const clearCart = catchAsync(async (req, res, next) => {
	const cart = await cartService.clearCart(req.user._id);
	sendResponse(res, 200, cart);
});

// @desc    Merge guest cart items into authenticated user's cart
// @route   POST /api/v1/cart/merge
// @access  Private/Customer
export const mergeGuestCart = catchAsync(async (req, res, next) => {
	const { guest_items } = req.body;

	if (!guest_items || !Array.isArray(guest_items)) {
		return next(new appError("guest_items array is required", 400));
	}

	const cart = await cartService.mergeGuestCart(req.user._id, guest_items);
	sendResponse(res, 200, cart);
});

// @desc    Validate cart for checkout
// @access  Private/Customer
export const validateCart = catchAsync(async (req, res, next) => {
	const result = await cartService.validateCartForCheckout(req.user._id);
	sendResponse(res, 200, result);
});
