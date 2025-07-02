import { Model } from "mongoose";
import catchAsync from "../middelwares/catchAsync.js";
import appError from "../utils/appError.js";
import objectFilter from "../utils/objectFilter.js";
import sendResponse from "../utils/sendRespons.js";
import validationBody from "../utils/validationBody.js";

export const createDoc = (Model, modelName, objectFields) =>
	catchAsync(async (req, res, next) => {
		// validation
		const object = validationBody(req.body, objectFields);
		if (Object.keys(object).length == 0)
			return next(new appError("please provide all fields", 400));
		// create new product
		if (modelName == "ProductModel") {
			const doc = await Model.create({
				user: req.user._id,
				...object,
			});
			// check if product create
			if (!doc) return next(new appError("doc not create", 400));
			// send response
			return sendResponse(res, 200, doc);
		}
		//create new review
		else if (modelName == "ProductReviewsModel") {
			const doc = await Model.create({
				user: req.user._id,
				productId: req.params.id,
				...object,
			});
			// check if doc created
			if (!doc) return next(new appError("doc not create", 400));
			// send response
			return sendResponse(res, 201, doc);
		}
	});
//  getAllDocs
export const getAllDocs = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.find({});
		// check if docs exist
		if (!docs) return next(new appError("docs not found", 400));
		// send response
		sendResponse(res, 200, { results: docs.length, docs });
	});

//  getSingleDoc
export const getSingDoc = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findById(req.params.id);
		// check if doc exist
		if (!doc) return next(new appError("doc not found", 400));
		// send response
		sendResponse(res, 200, doc);
	});

// delete review by owner
export const deleteDocByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOneAndDelete({
			_id: req.params.id,
			user: req.user._id,
		});
		// check if doc deleted
		if (!doc) return next(new appError("doc not delete", 400));
		// send response
		sendResponse(res, 200, doc);
	});
export const deleteDoc = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		// check if doc deleted
		if (!doc) return next(new appError("doc not delete", 400));
		// send response
		sendResponse(res, 200, doc);
	});

export const deleteAllDocs = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.deleteMany({});
		// check if docs deleted
		if (!docs) return next(new appError("docs not delete", 400));
		// send response
		sendResponse(res, 200, docs);
	});
