import SellerModel from "../models/SellerModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";

// ===================================================================
// Dashboard Aggregation
// ===================================================================

export const fetchSellerDashboardStats = async (user) => {
	const seller = await SellerModel.findOne({ userId: user._id });

	if (!seller) throw new Error("Seller profile not found");

	const totalProducts = await ProductModel.countDocuments({ userId: user._id });

	const orderItems = await OrderItemsModel.find({ sellerId: seller._id })
		.populate("orderId")
		.sort("-createdAt");

	const totalOrders = orderItems.length;
	const totalRevenue = orderItems.reduce((sum, item) => sum + (item.totalPrice?.amount || 0), 0);
	const pendingOrdersCount = orderItems.filter((oi) => oi.orderId?.status === "Pending").length;

	const lowStockItems = await ProductModel.countDocuments({
		userId: user._id,
		countInStock: { $lte: 5 },
	});

	const recentOrders = orderItems.slice(0, 5).map((oi) => ({
		id: oi.orderId?._id || oi._id,
		customer: oi.orderId?.userId?.name || "Unknown",
		amount: oi.totalPrice?.amount || 0,
		status: oi.orderId?.status || "Pending",
		date: oi.createdAt,
	}));

	const topProducts = await ProductModel.find({ userId: user._id })
		.sort("-ratingAverage")
		.limit(5)
		.select("name price ratingAverage");

	return {
		totalProducts,
		totalOrders,
		totalRevenue,
		pendingOrders: pendingOrdersCount,
		lowStockItems,
		recentOrders,
		topProducts,
	};
};

// ===================================================================
// Detailed Analytics Aggregation
// ===================================================================

export const fetchSellerAnalyticsData = async (user) => {
	const seller = await SellerModel.findOne({ userId: user._id });

	if (!seller) throw new Error("Seller profile not found");

	const orderItems = await OrderItemsModel.find({ sellerId: seller._id })
		.populate("orderId")
		.populate("items.item", "name price category brand coverImage")
		.sort("-createdAt");

	// Group by month
	const monthlyRevenue = {};

	orderItems.forEach((item) => {
		const date = new Date(item.createdAt);
		const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
		const monthLabel = date.toLocaleString("default", { month: "short" });

		if (!monthlyRevenue[monthKey]) {
			monthlyRevenue[monthKey] = { month: monthLabel, revenue: 0, orders: 0 };
		}
		monthlyRevenue[monthKey].revenue += (item.totalPrice?.amount || 0);
		monthlyRevenue[monthKey].orders += 1;
	});

	const revenueTrend = Object.keys(monthlyRevenue)
		.sort()
		.slice(-12)
		.map((key) => monthlyRevenue[key]);

	// Breakdown
	const statusBreakdown = {
		Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0,
	};

	orderItems.forEach((oi) => {
		const status = oi.orderId?.status || "Pending";

		if (statusBreakdown[status] !== undefined) statusBreakdown[status]++;
	});

	// Top Products
	const productRevenue = {};

	orderItems.forEach((oi) => {
		oi.items.forEach((item) => {
			const productId = item.item?._id?.toString();

			if (productId) {
				if (!productRevenue[productId]) {
					productRevenue[productId] = {
						name: item.item.name,
						image: item.item.coverImage?.secure_url || "📦",
						sales: 0,
						revenue: 0,
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

	// Recent Sales
	const recentSales = orderItems.slice(0, 10).map((oi) => ({
		id: oi.orderId?._id || oi._id,
		date: oi.createdAt,
		product: oi.items?.[0]?.item?.name || "Product",
		amount: oi.totalPrice?.amount || 0,
		status: oi.orderId?.status || "Pending",
	}));

	// Products total
	const totalProducts = await ProductModel.countDocuments({ userId: user._id });
	const activeProducts = await ProductModel.countDocuments({ userId: user._id, status: "active" });
	const draftProducts = await ProductModel.countDocuments({ userId: user._id, status: "draft" });

	return {
		revenueTrend,
		statusBreakdown,
		topProducts,
		recentSales,
		totalRevenue: orderItems.reduce((sum, item) => sum + (item.totalPrice?.amount || 0), 0),
		totalOrders: orderItems.length,
		totalProducts,
		activeProducts,
		draftProducts,
		sellerRating: { average: seller.averageBrandRating, count: seller.totalReviews },
	};
};
