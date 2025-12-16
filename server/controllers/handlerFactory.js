import { Model } from "mongoose";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import validationBody from "../utils/validationBody.js";

export const createDoc = (Model, modelName, objectFields) =>
	catchAsync(async (req, res, next) => {
		// validation
		const object = validationBody(req.body, objectFields);
		if (Object.keys(object).length == 0)
			return next(new appError("please provide valid fields to update", 400));

		// create new doc
		let doc = Model;

		if (modelName === "ProductReviewsModel") {
			doc = await doc.create({
				userId: req.user._id,
				productId: req.params.id,
				...object,
			});
		} else if (modelName === "WishListModel" || modelName === "OrderModel") {
			doc = await doc.findOne({ userId: req.user._id });
			if (!doc) {
				doc = await doc.create({
					userId: req.user._id,
					items: [req.params.id],
				});
			} else {
				const itemExist = doc.items.find(
					(item) => item.toString() === req.params.id
				);
				if (!itemExist) {
					doc = await doc.findByIdAndUpdate(
						doc._id,
						{ $push: { items: req.params.id } },
						{ new: true, runValidators: true }
					);
				}
				doc = await doc.findByIdAndUpdate(
					doc._id,
					{ $pull: { items: req.params.id } },
					{ new: true, runValidators: true }
				);
			}
		} else {
			doc = await doc.create({
				userId: req.user._id,
				...object,
			});
		}
		// check if doc created
		if (!doc) return next(new appError("doc not create", 400));
		// send response
		return sendResponse(res, 200, doc);
	});
export const addItemToList = (Model) =>
	catchAsync(async (req, res, next) => {
		const { quantity } = req.body;
		let doc = Model;
		doc = await doc.findOne({ userId: req.user._id });
		if (!doc) {
			doc = await doc.create({
				userId: req.user._id,
				items: [{ item: req.params.id, quantity: quantity || 1 }],
			});
		} else {
			// Check if product already exists in cart
			const itemExist = doc.items.find(
				(item) => item.item.toString() === req.params.id
			);

			if (itemExist) {
				// Update quantity if product exists
				doc = await doc.findOneAndUpdate(
					{ _id: doc._id, "items.item": req.params.id },
					{ $inc: { "items.$.quantity": quantity || 1 } },
					{ new: true, runValidators: true }
				);
			} else {
				// Push new item if product doesn't exist
				doc = await doc.findByIdAndUpdate(
					doc._id,
					{
						$push: {
							items: { item: req.params.id, quantity: quantity || 1 },
						},
					},
					{ new: true, runValidators: true }
				);
			}
		}
		// check if doc created
		if (!doc) return next(new appError("doc not create", 400));
		// send response
		return sendResponse(res, 200, doc);
	});
// update doc
export const updateDoc = (Model, modelName, objectFields) =>
	catchAsync(async (req, res, next) => {
		// validation
		const object = validationBody(req.body, objectFields);
		if (Object.keys(object).length == 0)
			return next(new appError("please provide valid fields to update", 400));

		let doc = Model;
		// update doc
		if (modelName === "UserModel") {
			doc = await doc.findByIdAndUpdate(
				req.user._id,
				{ ...object },
				{ new: true, runValidators: true }
			);
		} else if (modelName === "SellerModel" || modelName === "CustomerModel") {
			doc = await doc.findOneAndUpdate(
				{ userId: req.user._id },
				{ ...object },
				{ new: true, runValidators: true }
			);
		} else {
			doc = await doc.findOneAndUpdate(
				{ _id: req.params.id, userId: req.user._id },
				{ ...object },
				{ new: true, runValidators: true }
			);
		}

		// check if doc updated
		if (!doc) return next(new appError("doc didn't update", 400));
		// send response
		sendResponse(res, 200, doc);
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
export const deleteDoc = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		// check if doc deleted
		if (!doc) return next(new appError("doc not found", 400));
		// send response
		sendResponse(res, 200, {});
	});

// delete all docs in db
export const deleteAllDocs = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.deleteMany({});
		// check if docs deleted
		if (!docs) return next(new appError("docs not delete", 400));
		// send response
		sendResponse(res, 200, {});
	});

// delete doc by owner
export const deleteDocByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOneAndDelete({
			_id: req.params.id,
			userId: req.user._id,
		});
		// check if doc deleted
		if (!doc) return next(new appError("doc not delete", 400));
		// send response
		sendResponse(res, 200, doc);
	});

// get doc by owner
export const getDocByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOne({ userId: req.user._id });
		// check if doc deleted
		if (!doc) return next(new appError("doc not found", 400));
		// send response
		sendResponse(res, 200, {});
	});
// delete items from doc list by owner
export const deleteFromDocList = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOneAndUpdate(
			{ userId: req.user._id },
			{ $pull: { items: req.params.id } },
			{ new: true, runValidators: true }
		);
		// check if doc deleted
		if (!doc) return next(new appError("doc not delete", 400));
		// send response
		sendResponse(res, 200, doc);
	});
