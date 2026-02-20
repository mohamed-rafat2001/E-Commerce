import SellerModel from "../models/SellerModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";
import OrderModel from "../models/OrderModel.js";
import { updateByOwner } from "./handlerFactory.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import appError from "../utils/appError.js";

//  @desc  Get seller's own profile
// @Route  GET /api/v1/sellers/profile
// @access Private/Seller
export const getSellerProfile = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) return next(new appError("Seller profile not found", 404));
	sendResponse(res, 200, seller);
});

//  @desc  complete seller's doc
// @Route  PATCH /api/v1/seller/
// @access Private/Seller
export const completeSellerDoc = updateByOwner(SellerModel, [
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
export const addAddressestoSeller = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) return next(new appError("Seller not found", 404));

	if (!req.body.addresses) {
		return next(new appError("Please provide address data", 400));
	}

	seller.addresses.push(req.body.addresses);
	await seller.save();

	sendResponse(res, 201, seller);
});

//  @desc  add PayoutMethod to seller
// @Route  PATCH /api/v1/seller/PayoutMethod
// @access Private/Seller
export const addPayoutMethodtoSeller = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) return next(new appError("Seller not found", 404));

	if (!req.body.payoutMethods) {
		return next(new appError("Please provide payout method data", 400));
	}

	seller.payoutMethods.push(req.body.payoutMethods);
	await seller.save();

	sendResponse(res, 201, seller);
});

// @desc    Get seller dashboard statistics
// @route   GET /api/v1/sellers/dashboard-stats
// @access  Private/Seller
export const getSellerDashboardStats = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) return next(new appError("Seller profile not found", 404));

	// 1. Total Products
	const totalProducts = await ProductModel.countDocuments({ userId: req.user._id });

	// 2. Total Orders and Revenue from OrderItems
	const orderItems = await OrderItemsModel.find({ sellerId: seller._id })
		.populate("orderId")
		.sort("-createdAt");

	const totalOrders = orderItems.length;
	const totalRevenue = orderItems.reduce((sum, item) => sum + (item.totalPrice?.amount || 0), 0);
	const pendingOrdersCount = orderItems.filter(oi => oi.orderId?.status === "Pending").length;

	// 3. Low stock items
	const lowStockItems = await ProductModel.countDocuments({ 
		userId: req.user._id, 
		countInStock: { $lte: 5 } 
	});

	// 4. Recent orders (transformed for UI)
	const recentOrders = orderItems.slice(0, 5).map(oi => ({
		id: oi.orderId?._id || oi._id,
		customer: oi.orderId?.userId?.name || "Unknown",
		amount: oi.totalPrice?.amount || 0,
		status: oi.orderId?.status || "Pending",
		date: oi.createdAt
	}));

	// 5. Top products
	// (Simplification: just get top 5 products by sales if we had a sales field, 
	// or calculate from orderItems)
	const topProducts = await ProductModel.find({ userId: req.user._id })
		.sort("-ratingAverage") // Placeholder sorting
		.limit(5)
		.select("name price ratingAverage");

	sendResponse(res, 200, {
		totalProducts,
		totalOrders,
		totalRevenue,
		pendingOrders: pendingOrdersCount,
		lowStockItems,
		recentOrders,
		topProducts
	});
});

// @desc    Get seller analytics
// @route   GET /api/v1/sellers/analytics
// @access  Private/Seller
export const getSellerAnalytics = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) return next(new appError("Seller profile not found", 404));

	const orderItems = await OrderItemsModel.find({ sellerId: seller._id })
		.populate("orderId")
		.populate("items.item", "name price category brand coverImage")
		.sort("-createdAt");

	// Group by month for chart data
	const monthlyRevenue = {};
	const monthlyOrders = {};
	orderItems.forEach(item => {
		const date = new Date(item.createdAt);
		const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		const monthLabel = date.toLocaleString('default', { month: 'short' });
		if (!monthlyRevenue[monthKey]) {
			monthlyRevenue[monthKey] = { month: monthLabel, revenue: 0, orders: 0 };
		}
		monthlyRevenue[monthKey].revenue += (item.totalPrice?.amount || 0);
		monthlyRevenue[monthKey].orders += 1;
	});

	const revenueTrend = Object.keys(monthlyRevenue)
		.sort()
		.slice(-12)
		.map(key => monthlyRevenue[key]);

	// Order status breakdown
	const statusBreakdown = {
		Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0
	};
	orderItems.forEach(oi => {
		const status = oi.orderId?.status || 'Pending';
		if (statusBreakdown[status] !== undefined) statusBreakdown[status]++;
	});

	// Top products by revenue
	const productRevenue = {};
	orderItems.forEach(oi => {
		oi.items.forEach(item => {
			const productId = item.item?._id?.toString();
			if (productId) {
				if (!productRevenue[productId]) {
					productRevenue[productId] = {
						name: item.item.name,
						image: item.item.coverImage?.secure_url || '📦',
						sales: 0,
						revenue: 0
					};
				}
				productRevenue[productId].sales += item.quantity;
				productRevenue[productId].revenue += (item.price?.amount || 0);
			}
		});
	});

	const topProducts = Object.values(productRevenue)
		.sort((a, b) => b.revenue - a.revenue)
		.slice(0, 5);

	// Recent sales
	const recentSales = orderItems.slice(0, 10).map(oi => ({
		date: oi.createdAt,
		product: oi.items?.[0]?.item?.name || 'Product',
		amount: oi.totalPrice?.amount || 0,
		status: oi.orderId?.status || 'Pending'
	}));

	// Total products
	const totalProducts = await ProductModel.countDocuments({ userId: req.user._id });
	const activeProducts = await ProductModel.countDocuments({ userId: req.user._id, status: 'active' });
	const draftProducts = await ProductModel.countDocuments({ userId: req.user._id, status: 'draft' });

	sendResponse(res, 200, {
		revenueTrend,
		statusBreakdown,
		topProducts,
		recentSales,
		totalRevenue: orderItems.reduce((sum, item) => sum + (item.totalPrice?.amount || 0), 0),
		totalOrders: orderItems.length,
		totalProducts,
		activeProducts,
		draftProducts,
		sellerRating: { average: seller.ratingAverage, count: seller.ratingCount },
	});
});

// @desc    Update order status by seller (Processing → Shipped)
// @route   PATCH /api/v1/sellers/orders/:orderId/status
// @access  Private/Seller
export const updateSellerOrderStatus = catchAsync(async (req, res, next) => {
	const { status } = req.body;
	const { orderId } = req.params;

	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) return next(new appError("Seller profile not found", 404));

	// Verify the seller owns items in this order
	const orderItem = await OrderItemsModel.findOne({
		orderId,
		sellerId: seller._id
	});

	if (!orderItem) {
		return next(new appError("Order not found or not associated with your store", 404));
	}

	const order = await OrderModel.findById(orderId);
	if (!order) return next(new appError("Order not found", 404));

	// Sellers can only transition: Pending→Processing, Processing→Shipped
	const allowedTransitions = {
		Pending: ['Processing'],
		Processing: ['Shipped'],
	};

	const allowed = allowedTransitions[order.status];
	if (!allowed || !allowed.includes(status)) {
		return next(new appError(
			`Cannot transition from ${order.status} to ${status}. Allowed: ${allowed?.join(', ') || 'none'}`,
			400
		));
	}

	order.status = status;
	if (status === 'Processing') {
		order.isPaid = true;
		order.paidAt = Date.now();
	}

	const updatedOrder = await order.save();
	sendResponse(res, 200, updatedOrder);
});

// add review to seller
