import mongoose from "mongoose";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import validationBody from "../utils/validationBody.js";
import APIFeatures from "../utils/apiFeatures.js";
import {
	getCache,
	setCache,
	deleteCacheByPattern,
	CACHE_CONFIG,
	buildCacheKey,
	invalidateCacheForModel
} from "../utils/cache.js";
import { validateProductReferences } from "../utils/productValidation.js";

// ===================================================================
// Generic CRUD Factory Controllers
// ===================================================================

export const createDoc = (Model, Fields = []) =>
	catchAsync(async (req, res, next) => {
		let object = req.body;

		if (Fields.length !== 0) {
			object = validationBody(req.body, Fields);
			if (!object || Object.keys(object).length === 0) {
				return next(new appError("Please provide valid fields to create", 400));
			}
		}

		if (Model.modelName === "ProductModel") {
			object = await validateProductReferences(object, req);
		}

		const userId = req.user._id;
		let createData = { ...object };

		if (Model.modelName === "ReviewsModel") {
			createData = { ...createData, userId, itemId: req.params.id };
		} else {
			createData = { ...createData, userId };
		}

		const doc = await Model.create(createData);
		if (!doc) return next(new appError("Document could not be created", 400));

		// Invalidate cache
		await invalidateCacheForModel(Model, doc);

		return sendResponse(res, 201, doc);
	});

export const updateByOwner = (Model, Fields = []) =>
	catchAsync(async (req, res, next) => {
		let object = req.body;

		if (Fields.length !== 0) {
			object = validationBody(req.body, Fields);
			if (!object || Object.keys(object).length === 0) {
				return next(new appError("Please provide valid fields to update", 400));
			}
		}

		if (Model.modelName === "ProductModel") {
			object = await validateProductReferences(object, req);
		}

		const userId = req.user._id;
		let doc;

		switch (Model.modelName) {
			case "UserModel":
				doc = await Model.findByIdAndUpdate(userId, object, {
					new: true,
					runValidators: true,
				});
				break;

			case "SellerModel":
			case "CustomerModel":
				doc = await Model.findOneAndUpdate({ userId }, object, {
					new: true,
					runValidators: true,
				});
				break;

			default:
				doc = await Model.findOneAndUpdate(
					{ _id: req.params.id, userId },
					object,
					{ new: true, runValidators: true }
				);
				break;
		}

		if (!doc) return next(new appError("Document could not be updated or not found", 404));

		// Invalidate cache
		await invalidateCacheForModel(Model, doc);

		sendResponse(res, 200, doc);
	});

export const deleteFromDocList = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOne({ userId: req.user._id });
		if (!doc) return next(new appError("Document not found", 404));

		if (Model.modelName === "WishListModel") {
			doc.items.pull(req.params.id);
			// Also unwrap populated items to prevent Cast to ObjectId errors during save
			doc.items = doc.items.map(item => item._id || item);
		}

		await doc.save();
		
		await invalidateCacheForModel(Model, doc);
		sendResponse(res, 200, doc);
	});

export const deleteOneByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOneAndDelete({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!doc) return next(new appError("Document could not be deleted", 400));

		// Invalidate cache
		await invalidateCacheForModel(Model, doc);

		sendResponse(res, 200, {});
	});

export const deleteManyByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.deleteMany({ userId: req.user._id });
		if (!docs) return next(new appError("Documents could not be deleted", 400));

		// Invalidate cache (no specific doc, so clear all for owner if applicable)
		if (CACHE_CONFIG[Model.modelName]) {
			await deleteCacheByPattern(`${CACHE_CONFIG[Model.modelName].prefix}:*`);
		}

		sendResponse(res, 200, {});
	});

export const getOneByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const userId = req.user._id;
		const config = CACHE_CONFIG[Model.modelName];
		let cacheKey = null;

		if (config) {
			cacheKey = buildCacheKey(config.prefix, `owner:${userId}`, req);
			const cached = await getCache(cacheKey);
			if (cached) return sendResponse(res, 200, cached);
		}

		let doc;
		if (!req.params.id || req.params.id === "user") {
			doc = await Model.findOne({ userId });
		} else {
			doc = await Model.findOne({ _id: req.params.id, userId });
		}

		if (!doc) {
			if (Model.modelName === "WishListModel") {
				return sendResponse(res, 200, { items: [] });
			}
			return next(new appError("Document not found", 404));
		}

		if (cacheKey && config) {
			await setCache(cacheKey, doc, config.ttl);
		}

		sendResponse(res, 200, doc);
	});

export const getAllByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const userId = req.user._id;
		const config = CACHE_CONFIG[Model.modelName];
		let cacheKey = null;

		if (config) {
			// e.g. sellers:id:{sellerId}:products
			if (Model.modelName === "ProductModel") {
				cacheKey = buildCacheKey("sellers", `id:${userId}:products`, req);
			} else {
				cacheKey = buildCacheKey(config.prefix, `owner:${userId}`, req);
			}
			const cached = await getCache(cacheKey);
			if (cached) return res.status(200).json(cached);
		}

		const filter = { userId };

		const features = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.search(Model.schema)
			.sort()
			.limitFields()
			.paginate();

		const docs = await features.query;

		const countFeatures = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.search(Model.schema);

		const totalDocs = await countFeatures.query.countDocuments();

		const responseData = {
			status: "success",
			results: docs.length,
			total: totalDocs,
			data: docs,
		};

		if (cacheKey && config) {
			await setCache(cacheKey, responseData, config.ttl);
		}

		res.status(200).json(responseData);
	});

export const getById = (Model) =>
	catchAsync(async (req, res, next) => {
		const config = CACHE_CONFIG[Model.modelName];
		let cacheKey = null;

		if (config) {
			cacheKey = buildCacheKey(config.prefix, `id:${req.params.id}`, req);
			const cached = await getCache(cacheKey);
			if (cached) return sendResponse(res, 200, cached);
		}

		const doc = await Model.findById(req.params.id);
		if (!doc) return next(new appError("Document not found", 404));

		if (cacheKey && config) {
			await setCache(cacheKey, doc, config.ttl);
		}

		sendResponse(res, 200, doc);
	});

export const getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const config = CACHE_CONFIG[Model.modelName];
		let cacheKey = null;

		if (config) {
			cacheKey = buildCacheKey(config.prefix, "all", req);
			const cached = await getCache(cacheKey);
			if (cached) return res.status(200).json(cached);
		}

		// Handle ReviewsModel specially if viewing by product
		let filter = {};
		if (Model.modelName === "ReviewsModel" && req.params.id) {
			filter = { itemId: req.params.id };
			if (config) {
				cacheKey = buildCacheKey(config.prefix, `product:${req.params.id}`, req);
				const cached = await getCache(cacheKey);
				if (cached) return res.status(200).json(cached);
			}
		}

		const features = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.search(Model.schema)
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

		const countFeatures = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.search(Model.schema);
		const totalDocs = await countFeatures.query.countDocuments();

		const responseData = {
			status: "success",
			results: docs.length,
			total: totalDocs,
			data: docs,
		};

		if (cacheKey && config) {
			await setCache(cacheKey, responseData, config.ttl);
		}

		res.status(200).json(responseData);
	});

export const deleteAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.deleteMany();
		if (!docs) return next(new appError("Documents could not be deleted", 400));

		if (CACHE_CONFIG[Model.modelName]) {
			await deleteCacheByPattern(`${CACHE_CONFIG[Model.modelName].prefix}:*`);
		}

		sendResponse(res, 200, {});
	});

export const deleteById = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		if (!doc) return next(new appError("Document not found", 404));

		await invalidateCacheForModel(Model, doc);

		sendResponse(res, 200, {});
	});

export const updateById = (Model, Fields = []) =>
	catchAsync(async (req, res, next) => {
		let object = req.body;

		if (Fields.length !== 0) {
			object = validationBody(req.body, Fields);
			if (!object || Object.keys(object).length === 0) {
				return next(new appError("Please provide valid fields to update", 400));
			}
		}

		const doc = await Model.findByIdAndUpdate(req.params.id, object, {
			runValidators: true,
			new: true,
		});

		if (!doc) return next(new appError("Document could not be updated", 400));

		await invalidateCacheForModel(Model, doc);

		sendResponse(res, 200, doc);
	});

export const updateDoc = updateById;
export const deleteOne = deleteById;
