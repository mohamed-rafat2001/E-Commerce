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
import DiscountModel from "../models/DiscountModel.js";
import appError from "../utils/appError.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { fetchDashboardStats, fetchAnalyticsData } from "../services/adminAnalyticsService.js";

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
	},
	discounts: {
		model: DiscountModel,
		createFields: [
			"name", "description", "type", "value", "maxDiscountAmount",
			"minOrderValue", "scope", "targetIds", "priority",
			"startDate", "endDate", "isActive", "usageLimit",
		],
		updateFields: [
			"name", "description", "type", "value", "maxDiscountAmount",
			"minOrderValue", "scope", "targetIds", "priority",
			"startDate", "endDate", "isActive", "usageLimit",
		],
	},
};

import BrandFollowerModel from "../models/BrandFollowerModel.js";

export const resolveModel = (req, res, next, modelName) => {
	if (!models[modelName]) {
		return next(new appError(`Model ${modelName} not found`, 404));
	}
	req.Model = models[modelName].model;
	req.modelName = modelName;
	req.createFields = models[modelName].createFields;
	req.updateFields = models[modelName].updateFields;
	next();
};

export const getAll = catchAsync(async (req, res, next) => {
	// For brands, use custom handler that adds followersCount
	if (req.modelName === "brands") {
		const { default: APIFeatures } = await import("../utils/apiFeatures.js");

		let filter = {};
		const features = new APIFeatures(BrandModel.find(filter), req.query)
			.filter()
			.search(BrandModel.schema)
			.sort()
			.limitFields()
			.paginate();

		if (req.query.populate) {
			let populateFields;
			try {
				if (req.query.populate.startsWith("{") || req.query.populate.startsWith("[")) {
					populateFields = JSON.parse(req.query.populate);
				} else {
					populateFields = req.query.populate.split(",").join(" ");
				}
			} catch (e) {
				populateFields = req.query.populate.split(",").join(" ");
			}
			features.query = features.query.populate(populateFields);
		}

		const docs = await features.query;

		const countFeatures = new APIFeatures(BrandModel.find(filter), req.query)
			.filter()
			.search(BrandModel.schema);
		const totalDocs = await countFeatures.query.countDocuments();

		// Attach followers count
		const brandsWithFollowers = await Promise.all(
			docs.map(async (brand) => {
				const brandObj = brand.toObject();
				brandObj.followersCount = await BrandFollowerModel.countDocuments({ brandId: brand._id });
				return brandObj;
			})
		);

		return res.status(200).json({
			status: "success",
			results: brandsWithFollowers.length,
			total: totalDocs,
			data: brandsWithFollowers,
		});
	}

	// Default: use generic handler
	const fn = fetchAll(req.Model);
	return fn(req, res, next);
});

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
	const data = await fetchDashboardStats();

	res.status(200).json({
		status: 'success',
		data
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

	const data = await fetchAnalyticsData(startDate, endDate);

	sendResponse(res, 200, data);
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
