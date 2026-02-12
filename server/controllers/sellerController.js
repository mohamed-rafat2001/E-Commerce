import SellerModel from "../models/SellerModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";
import { updateByOwner } from "./handlerFactory.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import appError from "../utils/appError.js";

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

	// Reuse dashboard stats logic or provide more detailed analytics
	// For now, let's provide a similar response but structured for charts
	const orderItems = await OrderItemsModel.find({ sellerId: seller._id })
		.sort("-createdAt");

	// Group by month for chart data (simplified)
	const monthlyRevenue = {};
	orderItems.forEach(item => {
		const month = new Date(item.createdAt).toLocaleString('default', { month: 'short' });
		monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (item.totalPrice?.amount || 0);
	});

	const revenueTrend = Object.keys(monthlyRevenue).map(month => ({
		month,
		revenue: monthlyRevenue[month]
	}));

	sendResponse(res, 200, {
		revenueTrend,
		totalRevenue: orderItems.reduce((sum, item) => sum + (item.totalPrice?.amount || 0), 0),
		totalOrders: orderItems.length
	});
});

// add review to seller
