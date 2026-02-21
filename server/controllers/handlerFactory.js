import mongoose from "mongoose";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import validationBody from "../utils/validationBody.js";
import OrderItemsModel from "../models/OrderItemsModel.js";
import ProductModel from "../models/ProductModel.js";

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
		
		// Additional validation for ProductModel references
		if (Model.modelName === "ProductModel") {
			// Validate brand exists and belongs to seller
			if (object.brandId) {
				const BrandModel = mongoose.model("BrandModel");
				const brand = await BrandModel.findOne({
					_id: object.brandId,
					sellerId: req.user._id
				});
				if (!brand) {
					return next(new appError("Brand not found or doesn't belong to you", 404));
				}
			}
			
			// Validate categories exist
			if (object.primaryCategory) {
				const CategoryModel = mongoose.model("CategoryModel");
				const category = await CategoryModel.findById(object.primaryCategory);
				if (!category) {
					return next(new appError("Primary category not found", 404));
				}
			}
			
			if (object.subCategory) {
				const SubCategoryModel = mongoose.model("SubCategoryModel");
				const subCategory = await SubCategoryModel.findById(object.subCategory);
				if (!subCategory) {
					return next(new appError("Sub category not found", 404));
				}
				// Validate that subcategory belongs to the primary category
				if (object.primaryCategory && subCategory.categoryId.toString() !== object.primaryCategory) {
					return next(new appError("Sub category doesn't belong to the selected primary category", 400));
				}
			}
			
			// Validate images array length
			if (object.images && object.images.length > 10) {
				return next(new appError("Maximum 10 additional images allowed", 400));
			}
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
				if (!object.items || object.items.length === 0) {
					return next(new appError("No order items provided", 400));
				}

				// Fetch products to verify IDs and get seller info
				const productIds = object.items.map((item) => item.item);
				const products = await ProductModel.find({ _id: { $in: productIds } });

				if (products.length !== object.items.length) {
					return next(new appError("Some products were not found", 404));
				}

				const productMap = products.reduce((acc, p) => {
					acc[p._id.toString()] = p;
					return acc;
				}, {});

				const orderId = new mongoose.Types.ObjectId();

				// Group items by seller using a hash map for O(N) efficiency
				const itemsBySeller = object.items.reduce((acc, entry) => {
					const product = productMap[entry.item.toString()];
					const sellerId = product?.userId?.toString();

					if (sellerId) {
						if (!acc[sellerId]) acc[sellerId] = [];
						acc[sellerId].push({
							item: entry.item,
							quantity: entry.quantity,
						});
					}
					return acc;
				}, {});

				const sellerIds = Object.keys(itemsBySeller);
				if (sellerIds.length === 0) {
					return next(new appError("Invalid items data: Sellers not found", 400));
				}

				// Create an OrderItems document for each seller in parallel
				const orderItemsDocs = await Promise.all(
					sellerIds.map(async (sellerId) => {
						return await OrderItemsModel.create({
							orderId,
							sellerId,
							items: itemsBySeller[sellerId],
						});
					})
				);

				// Create the main Order document
				doc = await Model.create({
					...object,
					_id: orderId,
					items: orderItemsDocs.map((d) => d._id),
					userId: req.user._id,
					sellerIds,
					shippingAddress: object.shippingAddress || req.user?.addresses?.[0],
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
		return sendResponse(res, 201, doc);
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
		
		// Additional validation for ProductModel references on update
		if (Model.modelName === "ProductModel" && object) {
			// Validate brand exists and belongs to seller
			if (object.brandId) {
				const BrandModel = mongoose.model("BrandModel");
				const brand = await BrandModel.findOne({
					_id: object.brandId,
					sellerId: req.user._id
				});
				if (!brand) {
					return next(new appError("Brand not found or doesn't belong to you", 404));
				}
			}
			
			// Validate categories exist
			if (object.primaryCategory) {
				const CategoryModel = mongoose.model("CategoryModel");
				const category = await CategoryModel.findById(object.primaryCategory);
				if (!category) {
					return next(new appError("Primary category not found", 404));
				}
			}
			
			if (object.subCategory) {
				const SubCategoryModel = mongoose.model("SubCategoryModel");
				const subCategory = await SubCategoryModel.findById(object.subCategory);
				if (!subCategory) {
					return next(new appError("Sub category not found", 404));
				}
				// Validate that subcategory belongs to the primary category
				if (object.primaryCategory && subCategory.categoryId.toString() !== object.primaryCategory) {
					return next(new appError("Sub category doesn't belong to the selected primary category", 400));
				}
			}
			
			// Validate images array length
			if (object.images && object.images.length > 10) {
				return next(new appError("Maximum 10 additional images allowed", 400));
			}
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
				doc = await Model.findOneAndUpdate(
					{ userId },
					{ ...object },
					{ new: true, runValidators: true }
				);
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

		if (req.params.id === "user") {
			if (Model.modelName === "CartModel") {
				doc = await Model.findOne({ userId, active: true });
			} else {
				doc = await Model.findOne({ userId });
			}
		} else {
			const query = { _id: req.params.id };
			if (Model.modelName === "OrderItemsModel") {
				query.sellerId = userId;
			} else {
				query.userId = userId;
			}
			doc = await Model.findOne(query);
		}

		if (!doc) {
			if (Model.modelName === "CartModel") {
				return sendResponse(res, 200, { items: [], totalPrice: { amount: 0, currency: "USD" } });
			}
			if (Model.modelName === "WishListModel") {
				return sendResponse(res, 200, { items: [] });
			}
			return next(new appError("doc not Found", 404));
		}

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
		} else {
			docs = await Model.find({
				userId,
			});
		}

		if (!docs) return next(new appError("docs not Found", 404));

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
		// Basic filtering
		const queryObj = { ...req.query };
		const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
		excludedFields.forEach(el => delete queryObj[el]);

		// Advanced filtering (gte, lte, etc.)
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

		let query = Model.find(JSON.parse(queryStr));

		// Search (Name & Description)
		if (req.query.search) {
			const searchRegex = new RegExp(req.query.search, 'i');
			const searchConditions = [{ name: searchRegex }];
			
			// Check if description field exists in schema paths (optional, but good practice)
			// For now, assuming description exists if it's searchable
			if (Model.schema.paths.description) {
				searchConditions.push({ description: searchRegex });
			}
			
			query = query.find({ $or: searchConditions });
		}

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdAt');
		}

		// Limiting fields
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			query = query.select('-__v');
		}

		// Pagination
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 100;
		const skip = (page - 1) * limit;

		query = query.skip(skip).limit(limit);

		// Population
		if (req.query.populate) {
			let populateFields;
			try {
				// check if it is a JSON string
				if (req.query.populate.startsWith('{') || req.query.populate.startsWith('[')) {
					populateFields = JSON.parse(req.query.populate);
				} else {
					populateFields = req.query.populate.split(',').join(' ');
				}
			} catch (e) {
				populateFields = req.query.populate.split(',').join(' ');
			}
			query = query.populate(populateFields);
		}

		const docs = await query;
		const totalDocs = await Model.countDocuments(JSON.parse(queryStr));

		if (!docs) return next(new appError("docs not Found", 400));

		res.status(200).json({
			status: "success",
			results: docs.length,
			total: totalDocs,
			data: docs,
		});
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

export const updateDoc = updateById;
export const deleteOne = deleteById;
