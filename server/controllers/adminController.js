import UserModel from "../models/UserModel.js";
import SellerModel from "../models/SellerModel.js";
import CustomerModel from "../models/CustomerModel.js";
import ProductModel from "../models/ProductModel.js";
import CategoryModel from "../models/CategoryModel.js";
import CartModel from "../models/CartModel.js";
import WishListModel from "../models/WishListModel.js";
import ReviewsModel from "../models/ReviewsModel.js";
import OrderModel from "../models/OrderModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";
import appError from "../utils/appError.js";
import catchAsync from "../middlewares/catchAsync.js";

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
	carts: {
		model: CartModel,
		createFields: ["items"],
		updateFields: ["items"],
	},
	wishlists: {
		model: WishListModel,
		createFields: ["items"],
		updateFields: ["items"],
	},
	reviews: {
		model: ReviewsModel,
		createFields: ["rating", "comment", "itemId"],
		updateFields: ["rating", "comment"],
	},
	orders: {
		model: OrderModel,
		createFields: [
			"sellerId",
			"items",
			"shippingAddress",
			"paymentMethod",
			"taxPrice",
			"shippingPrice",
		],
		updateFields: ["status", "isPaid", "isDelivered", "shippingAddress"],
	},
	orderitems: {
		model: OrderItemsModel,
		createFields: ["orderId", "items"],
		updateFields: ["items"],
	},
};

export const resolveModel = (req, res, next) => {
	const modelName = req.params.model.toLowerCase();
	const config = models[modelName];

	if (!config) {
		return next(new appError(`No model found with name: ${modelName}`, 404));
	}

	req.Model = config.model;
	req.createFields = config.createFields;
	req.updateFields = config.updateFields;
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
		recentOrders,
		revenueData
	] = await Promise.all([
		UserModel.countDocuments({ status: { $ne: 'deleted' } }),
		ProductModel.countDocuments({ status: { $ne: 'deleted' } }),
		OrderModel.countDocuments(),
		CategoryModel.countDocuments(),
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
