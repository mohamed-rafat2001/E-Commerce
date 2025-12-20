import mongoose from "mongoose";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import validationBody from "../utils/validationBody.js";
import OrderItemsModel from "../models/OrderItemsModel.js";

export const createDoc = (Model, Fields = []) =>
	catchAsync(async (req, res, next) => {
		// validation
		let object;
		if (Fields.length != 0) {
			object = validationBody(req.body, Fields);
			if (!object || Object.keys(object).length === 0)
				return next(new appError("please provide valid fields to update", 400));
		}

		// create new doc
		let doc;

		switch (Model.modelName) {
			case "ReviewsModel":
				doc = await Model.create({
					userId: req.user._id,
					itemId: req.params.id,
					...object,
				});
				break;

			case "WishListModel":
				const isDocExist = await Model.findOne({ userId: req.user._id });

				if (!isDocExist) {
					doc = await Model.create({
						userId: req.user._id,
						items: [req.params.id],
					});
				} else {
					const itemExist = isDocExist.items.find(
						(item) => item._id.toString() === req.params.id
					);

					if (!itemExist) {
						doc = await Model.findByIdAndUpdate(
							isDocExist._id,
							{ $push: { items: req.params.id } },
							{ new: true, runValidators: true }
						);
					} else {
						doc = await Model.findByIdAndUpdate(
							isDocExist._id,
							{ $pull: { items: req.params.id } },
							{ new: true, runValidators: true }
						);
					}
				}
				break;

			case "OrderModel":
				if (!req.body.items || req.body.items.length === 0) {
					return next(new appError("No order items", 400));
				}

				const orderId = new mongoose.Types.ObjectId();

				// Create a single OrderItems document containing all items
				const orderItems = new OrderItemsModel({
					orderId,
					items: req.body.items.map((item) => ({
						item: item.item,
						quantity: item.quantity,
					})),
				});

				const createdOrderItems = await orderItems.save();

				doc = await Model.create({
					_id: orderId,
					items: createdOrderItems._id,
					userId: req.user._id,
					sellerId: req.body.items[0].sellerId,
					...object,
				});
				break;

			default:
				const userId = req.user._id;
				doc = await Model.create({
					userId,
					...object,
				});
				break;
		}
		// check if doc created
		if (!doc) return next(new appError("doc not create", 400));
		// send response
		return sendResponse(res, 200, doc);
	});
export const addItemToList = (Model) =>
	catchAsync(async (req, res, next) => {
		if (!Model) return next(new appError("Model is not defined", 500));
		const { quantity, itemId } = req.body;
		let doc = Model;
		const isDocExist = await Model.findOne({ userId: req.user._id });

		if (!isDocExist) {
			doc = await doc.create({
				userId: req.user._id,
				items: [{ item: itemId, quantity: quantity || 1 }],
			});
		} else {
			// Check if item already exists in model
			const itemExist = isDocExist.items.find(
				(item) => item.item?._id.toString() === itemId
			);

			if (itemExist) {
				// Update quantity if item exists
				doc = await doc.findOneAndUpdate(
					{ _id: isDocExist._id, "items.item": itemId },
					{ $inc: { "items.$.quantity": quantity || 1 } },
					{ new: true, runValidators: true }
				);
			} else {
				// Push new item if item doesn't exist
				doc = await doc.findByIdAndUpdate(
					isDocExist._id,
					{
						$push: {
							items: { item: itemId, quantity: quantity || 1 },
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
export const updateDoc = (Model, Fields = []) =>
	catchAsync(async (req, res, next) => {
		// validation
		let object;
		if (Fields.length != 0) {
			object = validationBody(req.body, Fields);
			if (!object || Object.keys(object).length === 0)
				return next(new appError("please provide valid fields to update", 400));
		}
		// update doc
		let doc;
		const isAdmin = ["Admin", "SuperAdmin"].includes(req.user.role);

		switch (Model.modelName) {
			case "UserModel":
				// Admin can update any user by ID, users can only update themselves
				const userId = isAdmin ? req.params.id || req.user._id : req.user._id;
				doc = await Model.findByIdAndUpdate(
					userId,
					{ ...object },
					{ new: true, runValidators: true }
				);
				break;

			case "SellerModel":
			case "CustomerModel":
				// Admin can update any seller/customer by userId, users only their own
				const filter = isAdmin
					? { _id: req.params.id }
					: { userId: req.user._id };
				doc = await Model.findOneAndUpdate(
					filter,
					{ ...object },
					{ new: true, runValidators: true }
				);
				break;

			default:
				// Admin can update any doc by _id, users only their own
				const defaultFilter = isAdmin
					? { _id: req.params.id }
					: { _id: req.params.id, userId: req.user._id };
				doc = await Model.findOneAndUpdate(
					defaultFilter,
					{ ...object },
					{ new: true, runValidators: true }
				);
				break;
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
		let doc;
		const isAdmin = ["Admin", "SuperAdmin"].includes(req.user.role);

		if (isAdmin) {
			doc = await Model.findByIdAndDelete(req.params.id);
		} else {
			doc = await Model.findOneAndDelete({
				_id: req.params.id,
				userId: req.user._id,
			});
		}
		// check if doc deleted
		if (!doc) return next(new appError("doc not found", 400));
		// send response
		sendResponse(res, 200, {});
	});

// delete all docs in db
export const deleteAllDocs = (Model) =>
	catchAsync(async (req, res, next) => {
		let result;
		const isAdmin = ["Admin", "SuperAdmin"].includes(req.user.role);

		if (isAdmin) {
			result = await Model.deleteMany({});
		} else {
			result = await Model.deleteMany({
				userId: req.user._id,
			});
		}
		// check if docs deleted
		if (!result) return next(new appError("docs not deleted", 400));
		// send response
		sendResponse(res, 200, {});
	});

// get doc by owner
export const getDocByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOne({ userId: req.user._id });
		// check if doc deleted
		if (!doc) return next(new appError("doc not found", 400));
		// send response
		sendResponse(res, 200, doc);
	});

// get all docs by owner
export const getAllDocsByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.find({ userId: req.user._id });
		// check if doc deleted
		if (!doc) return next(new appError("doc not found", 400));
		// send response
		sendResponse(res, 200, doc);
	});
// delete items from doc list by owner
export const deleteFromDocList = (Model) =>
	catchAsync(async (req, res, next) => {
		let updateQuery;
		switch (Model.modelName) {
			case "CartModel":
				updateQuery = { $pull: { items: { item: req.params.id } } };
				break;
			default:
				updateQuery = { $pull: { items: req.params.id } };
				break;
		}

		const doc = await Model.findOneAndUpdate(
			{ userId: req.user._id },
			updateQuery,
			{ new: true, runValidators: true }
		);
		// check if doc deleted
		if (!doc) return next(new appError("doc not delete", 400));
		// send response
		sendResponse(res, 200, doc);
	});
