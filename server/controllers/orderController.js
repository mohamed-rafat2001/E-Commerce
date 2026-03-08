import OrderModel from "../models/OrderModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";
import SellerModel from "../models/SellerModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import APIFeatures from "../utils/apiFeatures.js";
import * as orderService from "../services/orderService.js";

// ========== CUSTOMER CONTROLLERS ==========

// @desc    Checkout — create orders from cart
// @access  Private/Customer
export const checkout = catchAsync(async (req, res, next) => {
	const { shippingAddress, paymentMethod, notes } = req.body;

	if (!paymentMethod) {
		return next(new appError("Payment method is required", 400));
	}
	if (!shippingAddress) {
		return next(new appError("Shipping address is required", 400));
	}

	const orders = await orderService.createOrdersFromCart(req.user._id, {
		shippingAddress,
		paymentMethod,
		notes,
	});

	res.status(201).json({
		status: "success",
		results: orders.length,
		data: orders,
	});
});

// @desc    Get logged-in customer's orders (with status filter and pagination)
// @access  Private/Customer
export const getMyOrders = catchAsync(async (req, res, next) => {
	const userId = req.user._id;
	let filter = { userId };

	const features = new APIFeatures(OrderModel.find(filter), req.query)
		.filter()
		.sort()
		.paginate();

	// Populate order items
	features.query = features.query.populate({
		path: "items",
		populate: {
			path: "items.item",
			select: "name coverImage price",
		},
	});

	const orders = await features.query;

	// Count total for pagination
	const countFeatures = new APIFeatures(
		OrderModel.find(filter),
		req.query
	).filter();
	const total = await countFeatures.query.countDocuments();

	res.status(200).json({
		status: "success",
		results: orders.length,
		total,
		data: orders,
	});
});

// @desc    Get a single order by ID (customer)
// @access  Private/Customer
export const getMyOrder = catchAsync(async (req, res, next) => {
	const order = await OrderModel.findOne({
		_id: req.params.id,
		userId: req.user._id,
	}).populate({
		path: "items",
		populate: {
			path: "items.item",
			select: "name coverImage price",
		},
	});

	if (!order) {
		return next(new appError("Order not found", 404));
	}

	sendResponse(res, 200, order);
});

// @desc    Cancel an order (customer, pending only)
// @access  Private/Customer
export const cancelOrder = catchAsync(async (req, res, next) => {
	const { reason } = req.body;
	const order = await orderService.cancelOrder(
		req.params.id,
		req.user._id,
		reason
	);
	sendResponse(res, 200, order);
});

// ========== SELLER CONTROLLERS ==========

// @desc    Get orders for the seller's products
// @access  Private/Seller
export const getSellerOrders = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) {
		return next(new appError("Seller profile not found", 404));
	}

	// Handle Status Filter (complex because it's on OrderModel)
	let filter = { sellerId: seller._id };
	const queryObj = { ...req.query };

	if (queryObj.status) {
		const matchingOrders = await OrderModel.find({
			status: queryObj.status,
		}).select("_id");
		const matchingOrderIds = matchingOrders.map((o) => o._id);
		filter.orderId = { $in: matchingOrderIds };
		delete queryObj.status;
	}

	// Initialize APIFeatures
	const features = new APIFeatures(OrderItemsModel.find(filter), queryObj)
		.filter()
		.sort()
		.paginate();

	// Populate necessary fields
	features.query = features.query
		.populate({
			path: "orderId",
			populate: { path: "userId", select: "firstName lastName email" },
		})
		.populate("items.item", "name coverImage price");

	const orderItems = await features.query;

	// Get total count for pagination
	const countFeatures = new APIFeatures(
		OrderItemsModel.find(filter),
		queryObj
	).filter();
	const total = await countFeatures.query.countDocuments();

	const transformedOrders = orderItems.map((oi) => ({
		id: oi.orderId?._id || oi._id,
		status: oi.orderId?.status || "Pending",
		date: oi.createdAt,
		customer: {
			name: oi.orderId?.userId
				? `${oi.orderId.userId.firstName || ""} ${oi.orderId.userId.lastName || ""}`.trim()
				: "Unknown",
			email: oi.orderId?.userId?.email || "N/A",
		},
		total: oi.totalPrice?.amount || 0,
		items: oi.items.map((item) => ({
			name: item.item?.name || "Product",
			quantity: item.quantity,
			price: item.price?.amount || 0,
			image: item.item?.coverImage?.secure_url || "📦",
		})),
	}));

	res.status(200).json({
		status: "success",
		results: transformedOrders.length,
		data: {
			data: transformedOrders,
			total,
		},
	});
});

// @desc    Seller updates order status (Pending→Processing, Processing→Shipped)
// @access  Private/Seller
export const updateOrderStatusBySeller = catchAsync(async (req, res, next) => {
	const { status, tracking_number, note } = req.body;

	if (!status) {
		return next(new appError("Status is required", 400));
	}

	const order = await orderService.updateOrderStatusBySeller(
		req.params.id,
		req.user._id,
		status,
		{ tracking_number, note }
	);

	sendResponse(res, 200, order);
});

// ========== ADMIN CONTROLLERS ==========

// @desc    Get all orders (admin, with filters)
// @access  Private/Admin
export const getAllOrders = catchAsync(async (req, res, next) => {
	const features = new APIFeatures(OrderModel.find(), req.query)
		.filter()
		.sort()
		.paginate();

	features.query = features.query
		.populate("userId", "firstName lastName email")
		.populate({
			path: "items",
			populate: {
				path: "items.item",
				select: "name coverImage price",
			},
		});

	const orders = await features.query;

	const countFeatures = new APIFeatures(OrderModel.find(), req.query).filter();
	const total = await countFeatures.query.countDocuments();

	res.status(200).json({
		status: "success",
		results: orders.length,
		total,
		data: orders,
	});
});

// @desc    Force update any order's status (admin)
// @access  Private/Admin
export const updateOrderStatusByAdmin = catchAsync(async (req, res, next) => {
	const { status, tracking_number, note } = req.body;

	if (!status) {
		return next(new appError("Status is required", 400));
	}

	const order = await orderService.updateOrderStatusByAdmin(
		req.params.id,
		req.user._id,
		status,
		{ note, tracking_number }
	);

	sendResponse(res, 200, order);
});
