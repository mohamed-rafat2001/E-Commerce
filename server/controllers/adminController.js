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
		createFields: ["name", "description", "image", "isActive"],
		updateFields: ["name", "description", "image", "isActive"],
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

export const getAll = (req, res, next) => fetchAll(req.Model)(req, res, next);
export const getOne = (req, res, next) => fetchById(req.Model)(req, res, next);
export const createOne = (req, res, next) =>
	createOneDoc(req.Model, req.createFields)(req, res, next);
export const updateOne = (req, res, next) =>
	modifyById(req.Model, req.updateFields)(req, res, next);
export const deleteOne = (req, res, next) =>
	removeById(req.Model)(req, res, next);
export const deleteAll = (req, res, next) =>
	removeAll(req.Model)(req, res, next);
