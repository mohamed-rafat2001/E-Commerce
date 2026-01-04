import OrderModel from "../models/OrderModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";

import {
	createDoc,
	getAllDocs,
	getAllDocsByOwner,
	getDocByOwner,
	getSingDoc,
} from "./handlerFactory.js";

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = createDoc(OrderModel, [
	"cartId",
	// "shippingAddress",
	"paymentMethod",
	// "taxPrice",
	// "shippingPrice",
]);

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = getSingDoc(OrderModel);

// @desc    Update order status
// @route   PATCH /api/v1/orders/:id/status
// @access  Private
export const updateOrderStatus = catchAsync(async (req, res, next) => {
	const { status } = req.body;
	const order = await OrderModel.findById(req.params.id);

	if (!order) {
		return next(new appError("Order not found", 404));
	}

	// Logic based on the requested status
	switch (status) {
		case "Processing": // Triggered after payment
			order.isPaid = true;
			order.paidAt = Date.now();
			if (req.body.paymentResult) {
				order.paymentResult = req.body.paymentResult;
			}
			order.status = "Processing";
			break;

		case "Shipped":
			if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
				return next(new appError("Not authorized to ship orders", 403));
			}
			order.status = "Shipped";
			break;

		case "Delivered":
			if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
				return next(new appError("Not authorized to deliver orders", 403));
			}
			order.isDelivered = true;
			order.deliveredAt = Date.now();
			order.status = "Delivered";
			break;

		case "Cancelled":
			// Users can cancel their own orders if Pending/Processing
			// Admins can cancel any order
			const isAdmin = ["Admin", "SuperAdmin"].includes(req.user.role);
			const isOwner = order.userId.toString() === req.user._id.toString();

			if (!isAdmin && !isOwner) {
				return next(new appError("Not authorized to cancel this order", 403));
			}

			if (!isAdmin && !["Pending", "Processing"].includes(order.status)) {
				return next(
					new appError(
						`Cannot cancel order that is already ${order.status}`,
						400
					)
				);
			}

			order.status = "Cancelled";
			break;

		default:
			return next(new appError("Invalid status transition", 400));
	}

	const updatedOrder = await order.save();
	sendResponse(res, 200, updatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
export const getMyOrders = getAllDocsByOwner(OrderModel);

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders/:id
// @access  Private
export const getMyOrder = getDocByOwner(OrderModel);

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getAllOrders = getAllDocs(OrderModel);
