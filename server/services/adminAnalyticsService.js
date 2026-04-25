import UserModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";
import BrandModel from "../models/BrandModel.js";
import CategoryModel from "../models/CategoryModel.js";
import OrderModel from "../models/OrderModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";

// ===================================================================
// Dashboard Aggregation
// ===================================================================

export const fetchDashboardStats = async () => {
	const [
		totalUsers,
		totalProducts,
		totalOrders,
		totalCategories,
		totalBrands,
		recentOrders,
		revenueData,
	] = await Promise.all([
		UserModel.countDocuments({ status: { $ne: "deleted" } }),
		ProductModel.countDocuments({ status: { $ne: "deleted" } }),
		OrderModel.countDocuments(),
		CategoryModel.countDocuments(),
		BrandModel.countDocuments(),
		OrderModel.find()
			.sort("-createdAt")
			.limit(5)
			.populate("userId", "firstName lastName email profileImg"),
		OrderModel.aggregate([
			{ $match: { isPaid: true } },
			{
				$group: {
					_id: null,
					totalRevenue: { $sum: "$totalPrice.amount" },
				},
			},
		]),
	]);

	const stats = [
		{
			id: 1,
			name: "Total Users",
			value: totalUsers.toLocaleString(),
			change: "+12%",
			changeType: "positive",
			icon: "UsersIcon",
			gradient: "from-indigo-500 to-purple-600",
		},
		{
			id: 2,
			name: "Total Products",
			value: totalProducts.toLocaleString(),
			change: "+5%",
			changeType: "positive",
			icon: "ProductIcon",
			gradient: "from-emerald-500 to-teal-600",
		},
		{
			id: 3,
			name: "Total Orders",
			value: totalOrders.toLocaleString(),
			change: "+25%",
			changeType: "positive",
			icon: "OrderIcon",
			gradient: "from-orange-500 to-red-500",
		},
		{
			id: 4,
			name: "Total Revenue",
			value: `$${(revenueData[0]?.totalRevenue || 0).toLocaleString()}`,
			change: "+18%",
			changeType: "positive",
			icon: "AnalyticsIcon",
			gradient: "from-pink-500 to-rose-500",
		},
		{
			id: 5,
			name: "Total Brands",
			value: totalBrands.toLocaleString(),
			change: "+8%",
			changeType: "positive",
			icon: "TagIcon",
			gradient: "from-blue-500 to-cyan-500",
		},
	];

	return { stats, recentOrders, totalCategories };
};

// ===================================================================
// Detailed Analytics Aggregation
// ===================================================================

export const fetchAnalyticsData = async (startDate, endDate) => {
	// 1. Revenue Data
	const revenueData = await OrderModel.aggregate([
		{
			$match: {
				createdAt: { $gte: startDate, $lte: endDate },
				isPaid: true,
			},
		},
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
				revenue: { $sum: "$totalPrice.amount" },
				orders: { $sum: 1 },
			},
		},
		{ $sort: { _id: 1 } },
		{
			$project: {
				date: "$_id",
				revenue: 1,
				orders: 1,
				_id: 0,
			},
		},
	]);

	// 2. Top Products
	const topProducts = await OrderItemsModel.aggregate([
		{
			$match: {
				createdAt: { $gte: startDate, $lte: endDate },
			},
		},
		{ $unwind: "$items" },
		{
			$group: {
				_id: "$items.item",
				sales: { $sum: "$items.quantity" },
				revenue: { $sum: "$items.price.amount" },
			},
		},
		{ $sort: { revenue: -1 } },
		{ $limit: 5 },
		{
			$lookup: {
				from: "products",
				localField: "_id",
				foreignField: "_id",
				as: "product",
			},
		},
		{ $unwind: "$product" },
		{
			$project: {
				id: "$_id",
				name: "$product.name",
				sales: 1,
				revenue: 1,
			},
		},
	]);

	// 3. Top Sellers
	const topSellers = await OrderItemsModel.aggregate([
		{
			$match: {
				createdAt: { $gte: startDate, $lte: endDate },
			},
		},
		{
			$group: {
				_id: "$sellerId",
				sales: { $sum: 1 },
				revenue: { $sum: "$totalPrice.amount" },
			},
		},
		{ $sort: { revenue: -1 } },
		{ $limit: 5 },
		{
			$lookup: {
				from: "sellers",
				localField: "_id",
				foreignField: "_id",
				as: "seller",
			},
		},
		{ $unwind: "$seller" },
		{
			$lookup: {
				from: "users",
				localField: "seller.userId",
				foreignField: "_id",
				as: "user",
			},
		},
		{ $unwind: "$user" },
		{
			$project: {
				id: "$_id",
				name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
				sales: 1,
				revenue: 1,
			},
		},
	]);

	// 4. User Growth
	const sixMonthsAgo = new Date();

	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

	const userGrowthData = await UserModel.aggregate([
		{
			$match: {
				createdAt: { $gte: sixMonthsAgo },
			},
		},
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
				users: { $sum: 1 },
			},
		},
		{ $sort: { _id: 1 } },
		{
			$project: {
				month: "$_id",
				users: 1,
				_id: 0,
			},
		},
	]);

	// 5. Overall Stats
	const totalRevenue = await OrderModel.aggregate([
		{ $match: { isPaid: true } },
		{ $group: { _id: null, total: { $sum: "$totalPrice.amount" } } },
	]);

	const totalOrders = await OrderModel.countDocuments();
	const totalUsers = await UserModel.countDocuments();
	const totalProducts = await ProductModel.countDocuments();

	// 6. User Distribution by Role
	const usersByRole = await UserModel.aggregate([
		{
			$group: {
				_id: "$role",
				count: { $sum: 1 },
			},
		},
	]);

	// 7. Product Stats
	const activeProducts = await ProductModel.countDocuments({ countInStock: { $gt: 0 } });
	const outOfStockProducts = await ProductModel.countDocuments({ countInStock: 0 });

	const stats = {
		totalRevenue: totalRevenue[0]?.total || 0,
		totalOrders,
		totalUsers,
		totalProducts,
		activeProducts,
		outOfStockProducts,
		usersByRole,
	};

	return {
		stats,
		revenueData,
		topProducts,
		topSellers,
		userGrowthData,
	};
};
