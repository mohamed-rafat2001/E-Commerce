import OrderModel from "../models/OrderModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = catchAsync(async (req, res, next) => {
	const {
		items,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	if (items && items.length === 0) {
		return next(new appError("No order items", 400));
	} else {
		const order = new OrderModel({
			items,
			userId: req.user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		});

		const createdOrder = await order.save();
		sendResponse(res, 201, createdOrder);
	}
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = catchAsync(async (req, res, next) => {
	const order = await OrderModel.findById(req.params.id).populate(
		"userId",
		"name email"
	);

	if (order) {
		sendResponse(res, 200, order);
	} else {
		return next(new appError("Order not found", 404));
	}
});

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
export const updateOrderToPaid = catchAsync(async (req, res, next) => {
	const order = await OrderModel.findById(req.params.id);

	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.email_address,
		};
		order.status = "Processing"; // Update status when paid

		const updatedOrder = await order.save();
		sendResponse(res, 200, updatedOrder);
	} else {
		return next(new appError("Order not found", 404));
	}
});

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = catchAsync(async (req, res, next) => {
	const order = await OrderModel.findById(req.params.id);

	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();
		order.status = "Delivered";

		const updatedOrder = await order.save();
		sendResponse(res, 200, updatedOrder);
	} else {
		return next(new appError("Order not found", 404));
	}
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
export const getMyOrders = catchAsync(async (req, res, next) => {
	const orders = await OrderModel.find({ userId: req.user._id });
	sendResponse(res, 200, orders);
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getAllOrders = catchAsync(async (req, res, next) => {
	const orders = await OrderModel.find({}).populate("userId", "id name");
	sendResponse(res, 200, orders);
});
