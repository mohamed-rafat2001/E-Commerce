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
				return next(
					new appError("please provide  val id fiel ds to update", 400)
				);
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

			case "OrderModel":
				if (!object.items) {
					return next(new appError("No order items", 400));
				}

				const orderId = new mongoose.Types.ObjectId();
				const allSellers = [];
				// Create a single OrderItems document containing all items for same seller
				items.forEach((item) => {
					if (!allSellers.includes(item.item.userId))
						allSellers.push(item.item.userId);
				});
				const allOrderItems = [];
				allSellers.forEach(async (id) => {
					let itemsForSameSeller = items.filter(
						(item) => item.item.userId.toString() == id
					);
					const orderItems = new OrderItemsModel({
						orderId,
						sellerId: id,
						items: itemsForSameSeller.map((item) => ({
							item: item.item,
							quantity: item.quantity,
						})),
					});
					const createdOrderItems = await orderItems.save();
					allOrderItems.push(createdOrderItems);
				});

				doc = await Model.create({
					_id: orderId,
					items: allOrderItems.map((item) => item),
					userId: req.user._id,
					sellerIds: allSellers,
					shippingAddress: req.user?.addresses?.[0],
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
// update doc by owner
export const updateByOwner = (Model, Fields = []) =>
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
		const userId = req.user._id;
		switch (Model.modelName) {
			case "UserModel":
				doc = await Model.findByIdAndUpdate(
					userId,
					{ ...object },
					{ new: true, runValidators: true }
				);
				break;

			case "SellerModel":
			case "CustomerModel":
				if (Fields.includes("addresses")) {
					doc = await Model.findOneAndUpdate(
						userId,
						{ $push: { addresses: object.addresses } },
						{ new: true, runValidators: true }
					);
				} else if (Fields.includes("payoutMethods")) {
					doc = await Model.findOneAndUpdate(
						userId,
						{ $push: { payoutMethods: object.payoutMethods } },
						{ new: true, runValidators: true }
					);
				} else {
					doc = await Model.findOneAndUpdate(
						userId,
						{ ...object },
						{ new: true, runValidators: true }
					);
				}
				break;

			default:
				doc = await Model.findOneAndUpdate(
					{ _id: req.params.id, userId },
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

// delete items from doc list by owner
export const deleteFromDocList = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOne({ userId: req.user._id });
		if (!doc) return next(new appError("document not found", 404));

		switch (Model.modelName) {
			case "CartModel":
				// For CartModel, items is an array of objects { item: ID, quantity: N }
				doc.items = doc.items.filter(
					(item) =>
						item.item?._id?.toString() !== req.params.id &&
						item.item?.toString() !== req.params.id
				);
				break;
			default:
				// For WishListModel, items is an array of IDs
				doc.items.pull(req.params.id);
				break;
		}

		// Save the document to trigger pre-save hooks
		await doc.save();

		// send response
		sendResponse(res, 200, doc);
	});

// delete one doc by owner
export const deleteOneByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const userId = req.user._id;
		const doc = await Model.findOneAndDelete({
			_id: req.params.id,
			userId,
		});

		if (!doc) return next(new appError("doc not deleted", 400));

		sendResponse(res, 200, {});
	});
// delete many docs by owner
export const deleteManyByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const userId = req.user._id;
		const docs = await Model.deleteMany({
			userId,
		});

		if (!docs) return next(new appError("docs not deleted", 400));

		sendResponse(res, 200, {});
	});
// get one doc by owner
export const getOneByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const userId = req.user._id;
		let doc;

		if (Model.modelName === "OrderItemsModel") {
			doc = await Model.findOne({
				_id: req.params.id,
				sellerId: userId,
			});
		}
		if (Model.modelName === "CartModel") {
			doc = await Model.findOne({
				_id: req.params.id,
				userId,
				active: true,
			});
		}

		doc = await Model.findOne({
			_id: req.params.id,
			userId,
		});

		if (!doc) return next(new appError("doc not Found", 400));

		sendResponse(res, 200, doc);
	});
// get all docs by owner
export const getAllByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const userId = req.user._id;
		let docs;

		if (Model.modelName === "OrderItemsModel") {
			docs = await Model.find({
				sellerId: userId,
			});
		}

		docs = await Model.find({
			userId,
		});

		if (!docs) return next(new appError("docs not Found", 400));

		sendResponse(res, 200, docs);
	});

// get doc by id
export const getById = (Model) =>
	catchAsync(async (req, res, next) => {
		//do id
		const _id = req.params.id;
		const doc = await Model.findById(_id);

		if (!doc) return next(new appError("doc not Found", 400));

		sendResponse(res, 200, doc);
	});

// get all docs
export const getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.find({});

		if (!docs) return next(new appError("docs not Found", 400));

		sendResponse(res, 200, docs);
	});

//delete all docs
export const deleteAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.deleteMany();

		if (!docs) return next(new appError("docs not deleted", 400));

		sendResponse(res, 200, {});
	});

//delete by id
export const deleteById = (Model) =>
	catchAsync(async (req, res, next) => {
		const _id = req.params.id;
		const docs = await Model.findByIdAndDelete(_id);

		if (!docs) return next(new appError("doc not deleted", 400));

		sendResponse(res, 200, {});
	});
// update doc by id
export const updateById = (Model, Fields = []) =>
	catchAsync(async (req, res, next) => {
		// validation body
		let object;

		if (Fields.length != 0) {
			object = validationBody(req.body, Fields);
			if (!object || Object.keys(object).length === 0)
				return next(new appError("please provide valid fields to update", 400));
		}
		//do id
		const _id = req.params.id;
		const doc = await Model.findByIdAndUpdate(_id, object, {
			runValidators: true,
			new: true,
		});

		if (!doc) return next(new appError("doc not updated", 400));

		sendResponse(res, 200, doc);
	});
