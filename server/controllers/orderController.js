import OrderModel from "../models/OrderModel.js";
import SellerModel from "../models/SellerModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import APIFeatures from "../utils/apiFeatures.js";
import {
	createDoc,
	getAllByOwner,
	getById,
	getOneByOwner,
} from "./handlerFactory.js";

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = createDoc(OrderModel, [
	"items",
	"shippingAddress",
	"paymentMethod",
	"taxPrice",
	"shippingPrice",
]);

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = getById(OrderModel);

// @desc    Get seller orders
// @route   GET /api/v1/orders/seller
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
		const matchingOrders = await OrderModel.find({ status: queryObj.status }).select('_id');
		const matchingOrderIds = matchingOrders.map(o => o._id);
		filter.orderId = { $in: matchingOrderIds };
		delete queryObj.status; // Remove so APIFeatures doesn't apply it to OrderItemsModel
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
			populate: { path: "userId", select: "name email" },
		})
		.populate("items.item", "name coverImage brand price");

	// Execute query
	const orderItems = await features.query;

	// Get total count for pagination
	const countFeatures = new APIFeatures(OrderItemsModel.find(filter), queryObj)
		.filter();
	const total = await countFeatures.query.countDocuments();

	const transformedOrders = orderItems.map((oi) => ({
		id: oi.orderId?._id || oi._id,
		status: oi.orderId?.status || "Pending",
		date: oi.createdAt,
		customer: {
			name: oi.orderId?.userId?.name || "Unknown",
			email: oi.orderId?.userId?.email || "N/A",
		},
		total: oi.totalPrice?.amount || 0,
		items: oi.items.map((item) => ({
			name: item.item?.name || "Product",
			quantity: item.quantity,
			price: item.price?.amount || 0,
			image: item.item?.coverImage?.secure_url || "📦", // Default icon if no image
		})),
	}));

	// Send response with total count
	res.status(200).json({
		status: "success",
		results: transformedOrders.length,
		data: {
			data: transformedOrders,
			total
		}
	});
});

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
export const getMyOrders = getAllByOwner(OrderModel);

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders/:id
// @access  Private
export const getMyOrder = getOneByOwner(OrderModel);
