import mongoose from "mongoose";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import validationBody from "../utils/validationBody.js";
import APIFeatures from "../utils/apiFeatures.js";

// ===================================================================
// Helper Functions for Specialized Validations
// ===================================================================

/**
 * Validates relationships for ProductModel creation/updates
 */
const validateProductReferences = async (object, req) => {
	// Clean up empty string values for reference fields
	if (object.brandId === "") delete object.brandId;
	if (object.primaryCategory === "") delete object.primaryCategory;
	if (object.subCategory === "") delete object.subCategory;

	// Validate brand
	if (object.brandId) {
		const BrandModel = mongoose.model("BrandModel");
		const SellerModel = mongoose.model("SellerModel");

		const seller = await SellerModel.findOne({ userId: req.user._id });
		if (!seller) throw new appError("Seller profile not found", 404);

		const brand = await BrandModel.findOne({
			_id: object.brandId,
			sellerId: seller._id,
		});
		if (!brand) throw new appError("Brand not found or doesn't belong to you", 404);
	}

	// Validate primary category
	if (object.primaryCategory) {
		const CategoryModel = mongoose.model("CategoryModel");
		const category = await CategoryModel.findById(object.primaryCategory);
		if (!category) throw new appError("Primary category not found", 404);
	}

	// Validate sub-category relationship
	if (object.subCategory) {
		const SubCategoryModel = mongoose.model("SubCategoryModel");
		const subCategory = await SubCategoryModel.findById(object.subCategory);
		if (!subCategory) throw new appError("Sub category not found", 404);

		const targetCategoryId =
			object.primaryCategory ||
			(req.params.id ? (await mongoose.model("ProductModel").findById(req.params.id))?.primaryCategory : null);

		const subCategoryParentId =
			subCategory.categoryId._id || subCategory.categoryId;

		if (targetCategoryId && subCategoryParentId.toString() !== targetCategoryId.toString()) {
			throw new appError("Sub category doesn't belong to the selected primary category", 400);
		}
	}

	// Validate image array length
	if (object.images && object.images.length > 10) {
		throw new appError("Maximum 10 additional images allowed", 400);
	}

	return object;
};


// ===================================================================
// Generic CRUD Factory Controllers
// ===================================================================

/**
 * Creates a generic document.
 */
export const createDoc = (Model, Fields = []) =>
	catchAsync(async (req, res, next) => {
		let object = req.body;

		// Filter fields if provided
		if (Fields.length !== 0) {
			object = validationBody(req.body, Fields);
			if (!object || Object.keys(object).length === 0) {
				return next(new appError("Please provide valid fields to create", 400));
			}
		}

		// Run specialized product validation if applicable
		if (Model.modelName === "ProductModel") {
			object = await validateProductReferences(object, req);
		}

		// Inject appropriate user ownership ID based on the model
		const userId = req.user._id;
		let createData = { ...object };

		if (Model.modelName === "ReviewsModel") {
			createData = { ...createData, userId, itemId: req.params.id };
		} else {
			createData = { ...createData, userId };
		}

		const doc = await Model.create(createData);
		if (!doc) return next(new appError("Document could not be created", 400));

		return sendResponse(res, 201, doc);
	});

/**
 * Updates a document strictly enforcing ownership.
 */
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

		sendResponse(res, 200, doc);
	});

/**
 * Removes an item from an array field belonging to an owned document (e.g., Wishlist).
 */
export const deleteFromDocList = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOne({ userId: req.user._id });
		if (!doc) return next(new appError("Document not found", 404));

		if (Model.modelName === "WishListModel") {
			doc.items.pull(req.params.id);
		}

		await doc.save();
		sendResponse(res, 200, doc);
	});

/**
 * Deletes a generic document by ID enforcing user ownership.
 */
export const deleteOneByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOneAndDelete({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!doc) return next(new appError("Document could not be deleted", 400));

		sendResponse(res, 200, {});
	});

/**
 * Deletes all documents owned by the logged-in user.
 */
export const deleteManyByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.deleteMany({ userId: req.user._id });
		if (!docs) return next(new appError("Documents could not be deleted", 400));

		sendResponse(res, 200, {});
	});

/**
 * Gets a single specific document ensuring it is owned by the logged-in user.
 */
export const getOneByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const userId = req.user._id;
		let doc;

		if (req.params.id === "user") {
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

		sendResponse(res, 200, doc);
	});

/**
 * Queries all documents strictly filtered by the logged-in user's ID.
 */
export const getAllByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const userId = req.user._id;
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

		res.status(200).json({
			status: "success",
			results: docs.length,
			total: totalDocs,
			data: docs,
		});
	});

/**
 * Retrieves a generic document by ID without ownership checks (typically for public/admin reading).
 */
export const getById = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findById(req.params.id);
		if (!doc) return next(new appError("Document not found", 404));

		sendResponse(res, 200, doc);
	});

/**
 * Queries all available documents globally for a model (Admin/Public).
 */
export const getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const features = new APIFeatures(Model.find(), req.query)
			.filter()
			.search(Model.schema)
			.sort()
			.limitFields()
			.paginate();

		// Handle relations population dynamically
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

		const countFeatures = new APIFeatures(Model.find(), req.query)
			.filter()
			.search(Model.schema);
		const totalDocs = await countFeatures.query.countDocuments();

		res.status(200).json({
			status: "success",
			results: docs.length,
			total: totalDocs,
			data: docs,
		});
	});

/**
 * Wipes out every document in a collection (Admin/Seeder only).
 */
export const deleteAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.deleteMany();
		if (!docs) return next(new appError("Documents could not be deleted", 400));

		sendResponse(res, 200, {});
	});

/**
 * Deletes a single document globally bypassing ownership checks (Admin).
 */
export const deleteById = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.findByIdAndDelete(req.params.id);
		if (!docs) return next(new appError("Document not found", 404));

		sendResponse(res, 200, {});
	});

/**
 * Updates a document globally bypassing ownership checks (Admin).
 */
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

		sendResponse(res, 200, doc);
	});

// Aliases
export const updateDoc = updateById;
export const deleteOne = deleteById;
