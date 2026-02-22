import UserModel from "../models/UserModel.js";
import SellerModel from "../models/SellerModel.js";
import CustomerModel from "../models/CustomerModel.js";
import ProductModel from "../models/ProductModel.js";
import BrandModel from "../models/BrandModel.js";
import CategoryModel from "../models/CategoryModel.js";
import CartModel from "../models/CartModel.js";
import WishListModel from "../models/WishListModel.js";
import ReviewsModel from "../models/ReviewsModel.js";
import OrderModel from "../models/OrderModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";
import appError from "../utils/appError.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

import {
	getAll as fetchAll,
	getById as fetchById,
	updateById as modifyById,
	deleteById as removeById,
	deleteAll as removeAll,
	createDoc as createOneDoc,
} from "./handlerFactory.js";

const models = {
	users: {
		model: UserModel,
		createFields: [
			"firstName",
			"lastName",
			"email",
			"phoneNumber",
			"password",
			"confirmPassword",
			"role",
			"status",
		],
		updateFields: [
			"firstName",
			"lastName",
			"email",
			"phoneNumber",
			"role",
			"status",
		],
	},
	sellers: {
		model: SellerModel,
		createFields: [
			"brand",
			"brandImg",
			"description",
			"businessEmail",
			"businessPhone",
			"primaryCategory",
			"status",
			"verificationStatus",
		],
		updateFields: [
			"brand",
			"brandImg",
			"description",
			"businessEmail",
			"businessPhone",
			"primaryCategory",
			"status",
			"verificationStatus",
		],
	},
	customers: {
		model: CustomerModel,
		createFields: ["loyaltyPoints", "status"],
		updateFields: ["loyaltyPoints", "status"],
	},
	products: {
		model: ProductModel,
		createFields: [
			"name",
			"price",
			"countInStock",
			"brand",
			"category",
			"description",
			"image",
			"status",
			"visibility",
		],
		updateFields: [
			"name",
			"price",
			"countInStock",
			"brand",
			"category",
			"description",
			"image",
			"status",
			"visibility",
		],
	},
	categories: {
		model: CategoryModel,
		createFields: ["name", "description", "coverImage", "isActive"],
		updateFields: ["name", "description", "coverImage", "isActive"],
	},
	brands: {
		model: BrandModel,
		createFields: ["name", "description", "logo", "website", "isActive", "sellerId", "primaryCategory", "subCategories"],
		updateFields: ["name", "description", "logo", "website", "isActive", "primaryCategory", "subCategories"],
	},
	carts: {
		model: CartModel,
		createFields: [],
		updateFields: [],
	},
	wishlists: {
		model: WishListModel,
		createFields: [],
		updateFields: [],
	},
	reviews: {
		model: ReviewsModel,
		createFields: ["review", "rating", "isVisible"],
		updateFields: ["review", "rating", "isVisible"],
	},
	orders: {
		model: OrderModel,
		createFields: ["status", "isPaid", "paymentMethod"],
		updateFields: ["status", "isPaid", "paymentMethod"],
	}
};

export const resolveModel = (req, res, next, modelName) => {
	if (!models[modelName]) {
		return next(new appError(`Model ${modelName} not found`, 404));
	}
	req.Model = models[modelName].model;
	req.createFields = models[modelName].createFields;
	req.updateFields = models[modelName].updateFields;
	next();
};

export const getAll = (req, res, next) => {
	const fn = fetchAll(req.Model);
	return fn(req, res, next);
};

export const getOne = (req, res, next) => {
	const fn = fetchById(req.Model);
	return fn(req, res, next);
};

export const createOne = (req, res, next) => {
	const fn = createOneDoc(req.Model, req.createFields);
	return fn(req, res, next);
};

export const updateOne = (req, res, next) => {
	const fn = modifyById(req.Model, req.updateFields);
	return fn(req, res, next);
};

export const deleteOne = (req, res, next) => {
	const fn = removeById(req.Model);
	return fn(req, res, next);
};

export const deleteAll = (req, res, next) => {
	const fn = removeAll(req.Model);
	return fn(req, res, next);
};

// get dashboard stats
export const getDashboardStats = catchAsync(async (req, res, next) => {
	const [
		totalUsers,
		totalProducts,
		totalOrders,
		totalCategories,
		totalBrands,
		recentOrders,
		revenueData
	] = await Promise.all([
		UserModel.countDocuments({ status: { $ne: 'deleted' } }),
		ProductModel.countDocuments({ status: { $ne: 'deleted' } }),
		OrderModel.countDocuments(),
		CategoryModel.countDocuments(),
		BrandModel.countDocuments(),
		OrderModel.find()
			.sort('-createdAt')
			.limit(5)
			.populate('userId', 'firstName lastName email profileImg'),
		OrderModel.aggregate([
			{ $match: { isPaid: true } },
			{
				$group: {
					_id: null,
					totalRevenue: { $sum: '$totalPrice.amount' }
				}
			}
		])
	]);

	// Calculate changes (placeholder logic - could be compared with last month)
	const stats = [
		{
			id: 1,
			name: 'Total Users',
			value: totalUsers.toLocaleString(),
			change: '+12%',
			changeType: 'positive',
			icon: 'UsersIcon',
			gradient: 'from-indigo-500 to-purple-600',
		},
		{
			id: 2,
			name: 'Total Products',
			value: totalProducts.toLocaleString(),
			change: '+5%',
			changeType: 'positive',
			icon: 'ProductIcon',
			gradient: 'from-emerald-500 to-teal-600',
		},
		{
			id: 3,
			name: 'Total Orders',
			value: totalOrders.toLocaleString(),
			change: '+25%',
			changeType: 'positive',
			icon: 'OrderIcon',
			gradient: 'from-orange-500 to-red-500',
		},
		{
			id: 4,
			name: 'Total Revenue',
			value: `$${(revenueData[0]?.totalRevenue || 0).toLocaleString()}`,
			change: '+18%',
			changeType: 'positive',
			icon: 'AnalyticsIcon',
			gradient: 'from-pink-500 to-rose-500',
		},
		{
			id: 5,
			name: 'Total Brands',
			value: totalBrands.toLocaleString(),
			change: '+8%',
			changeType: 'positive',
			icon: 'TagIcon',
			gradient: 'from-blue-500 to-cyan-500',
		},
	];

	res.status(200).json({
		status: 'success',
		data: {
			stats,
			recentOrders,
			totalCategories
		}
	});
});

// @desc    Get detailed admin analytics
// @route   GET /api/v1/admin/analytics
// @access  Private/Admin
export const getAnalytics = catchAsync(async (req, res, next) => {
	const { timeRange } = req.query; // 'week', 'month', 'year'
	
	// Default to last 30 days if not specified
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 30);

	// 1. Revenue Data (Daily for last 30 days)
	const revenueData = await OrderModel.aggregate([
		{
			$match: {
				createdAt: { $gte: startDate, $lte: endDate },
				isPaid: true
			}
		},
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
				revenue: { $sum: "$totalPrice.amount" },
				orders: { $sum: 1 }
			}
		},
		{ $sort: { _id: 1 } },
		{
			$project: {
				date: "$_id",
				revenue: 1,
				orders: 1,
				_id: 0
			}
		}
	]);

	// 2. Top Products (by revenue)
	const topProducts = await OrderItemsModel.aggregate([
		{
			$match: {
				createdAt: { $gte: startDate, $lte: endDate }
			}
		},
		{ $unwind: "$items" },
		{
			$group: {
				_id: "$items.item",
				sales: { $sum: "$items.quantity" },
				revenue: { $sum: "$items.price.amount" } // Assuming price is stored per item in array
			}
		},
		{ $sort: { revenue: -1 } },
		{ $limit: 5 },
		{
			$lookup: {
				from: "products",
				localField: "_id",
				foreignField: "_id",
				as: "product"
			}
		},
		{ $unwind: "$product" },
		{
			$project: {
				id: "$_id",
				name: "$product.name",
				sales: 1,
				revenue: 1
			}
		}
	]);

	// 3. Top Sellers (by revenue)
	const topSellers = await OrderItemsModel.aggregate([
		{
			$match: {
				createdAt: { $gte: startDate, $lte: endDate }
			}
		},
		{
			$group: {
				_id: "$sellerId",
				sales: { $sum: 1 }, // Count of order items (approximate orders)
				revenue: { $sum: "$totalPrice.amount" }
			}
		},
		{ $sort: { revenue: -1 } },
		{ $limit: 5 },
		{
			$lookup: {
				from: "sellers",
				localField: "_id",
				foreignField: "_id",
				as: "seller"
			}
		},
		{ $unwind: "$seller" },
		{
			$lookup: {
				from: "users",
				localField: "seller.userId",
				foreignField: "_id",
				as: "user"
			}
		},
		{ $unwind: "$user" },
		{
			$project: {
				id: "$_id",
				name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
				sales: 1,
				revenue: 1
			}
		}
	]);

	// 4. User Growth (Monthly for last 6 months)
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
	
	const userGrowthData = await UserModel.aggregate([
		{
			$match: {
				createdAt: { $gte: sixMonthsAgo }
			}
		},
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
				users: { $sum: 1 }
			}
		},
		{ $sort: { _id: 1 } },
		{
			$project: {
				month: "$_id",
				users: 1,
				_id: 0
			}
		}
	]);

	// 5. Overall Stats
	const totalRevenue = await OrderModel.aggregate([
		{ $match: { isPaid: true } },
		{ $group: { _id: null, total: { $sum: "$totalPrice.amount" } } }
	]);
	
	const totalOrders = await OrderModel.countDocuments();
	const totalUsers = await UserModel.countDocuments();
	const totalProducts = await ProductModel.countDocuments();

	// 6. User Distribution by Role
	const usersByRole = await UserModel.aggregate([
		{
			$group: {
				_id: "$role",
				count: { $sum: 1 }
			}
		}
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
		usersByRole
	};

	sendResponse(res, 200, {
		stats,
		revenueData,
		topProducts,
		topSellers,
		userGrowthData
	});
});

// @desc    Get full user details including role-specific data
// @route   GET /api/v1/admin/users/:id/full
// @access  Private/Admin
export const getUserFullDetails = catchAsync(async (req, res, next) => {
	const user = await UserModel.findById(req.params.id);
	if (!user) return next(new appError("User not found", 404));

	let userDetails = user.toObject();

	if (user.role === "Seller") {
		const seller = await SellerModel.findOne({ userId: user._id });
		if (seller) {
			userDetails.seller = seller.toObject();
		}
	} else if (user.role === "Customer") {
		const customer = await CustomerModel.findOne({ userId: user._id });
		if (customer) {
			userDetails.customer = customer.toObject();
		}
	}

	sendResponse(res, 200, userDetails);
});
