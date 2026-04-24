import DiscountModel from "../models/DiscountModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import appError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import APIFeatures from "../utils/apiFeatures.js";
import {
	validateSellerScope,
	enrichProductsWithDiscounts,
	resolveBestDiscount,
} from "../services/discountService.js";

// ── Allowed fields for create/update ──────────────────────────────────
const DISCOUNT_FIELDS = [
	"name",
	"description",
	"type",
	"value",
	"maxDiscountAmount",
	"minOrderValue",
	"scope",
	"targetIds",
	"priority",
	"startDate",
	"endDate",
	"isActive",
	"usageLimit",
];

// ===================================================================
// Admin Controllers
// ===================================================================

/**
 * Admin: Create a discount (any scope).
 * POST /api/v1/discounts/admin
 */
export const adminCreateDiscount = catchAsync(async (req, res, next) => {
	const data = {};
	DISCOUNT_FIELDS.forEach((key) => {
		if (req.body[key] !== undefined) data[key] = req.body[key];
	});

	data.creatorRole = "Admin";
	data.creatorId = req.user._id;

	// Admins get higher default priority
	if (data.priority === undefined) data.priority = 100;

	const discount = await DiscountModel.create(data);
	sendResponse(res, 201, discount);
});

/**
 * Admin: Update any discount.
 * PATCH /api/v1/discounts/admin/:id
 */
export const adminUpdateDiscount = catchAsync(async (req, res, next) => {
	const updates = {};
	DISCOUNT_FIELDS.forEach((key) => {
		if (req.body[key] !== undefined) updates[key] = req.body[key];
	});

	const discount = await DiscountModel.findByIdAndUpdate(
		req.params.id,
		updates,
		{ new: true, runValidators: true }
	);

	if (!discount) return next(new appError("Discount not found", 404));
	sendResponse(res, 200, discount);
});

/**
 * Admin: Delete any discount.
 * DELETE /api/v1/discounts/admin/:id
 */
export const adminDeleteDiscount = catchAsync(async (req, res, next) => {
	const discount = await DiscountModel.findByIdAndDelete(req.params.id);
	if (!discount) return next(new appError("Discount not found", 404));
	sendResponse(res, 200, {});
});

/**
 * Admin: Get all discounts with filtering, sorting, pagination.
 * GET /api/v1/discounts/admin
 */
export const adminGetAllDiscounts = catchAsync(async (req, res, next) => {
	const features = new APIFeatures(DiscountModel.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const discounts = await features.query.lean();

	const countFeatures = new APIFeatures(DiscountModel.find(), req.query).filter();
	const total = await countFeatures.query.countDocuments();

	res.status(200).json({
		status: "success",
		results: discounts.length,
		total,
		data: discounts,
	});
});

/**
 * Admin: Get a single discount by ID.
 * GET /api/v1/discounts/admin/:id
 */
export const adminGetDiscount = catchAsync(async (req, res, next) => {
	const discount = await DiscountModel.findById(req.params.id).lean();
	if (!discount) return next(new appError("Discount not found", 404));
	sendResponse(res, 200, discount);
});

/**
 * Admin: Toggle discount active/inactive.
 * PATCH /api/v1/discounts/admin/:id/toggle
 */
export const adminToggleDiscount = catchAsync(async (req, res, next) => {
	const discount = await DiscountModel.findById(req.params.id);
	if (!discount) return next(new appError("Discount not found", 404));

	discount.isActive = !discount.isActive;
	await discount.save();

	sendResponse(res, 200, discount);
});

// ===================================================================
// Seller Controllers
// ===================================================================

/**
 * Seller: Create a discount (seller_all or single_product only).
 * POST /api/v1/discounts/seller
 */
export const sellerCreateDiscount = catchAsync(async (req, res, next) => {
	const data = {};
	DISCOUNT_FIELDS.forEach((key) => {
		if (req.body[key] !== undefined) data[key] = req.body[key];
	});

	data.creatorRole = "Seller";
	data.creatorId = req.user._id;

	// Default seller priority (lower than admin)
	if (data.priority === undefined) data.priority = 50;

	// Validate seller scope restrictions
	await validateSellerScope(req.user._id, data.scope, data.targetIds);

	// Force seller_all targetIds to seller's own userId
	if (data.scope === "seller_all") {
		data.targetIds = [req.user._id];
	}

	const discount = await DiscountModel.create(data);
	sendResponse(res, 201, discount);
});

/**
 * Seller: Update own discount only.
 * PATCH /api/v1/discounts/seller/:id
 */
export const sellerUpdateDiscount = catchAsync(async (req, res, next) => {
	const updates = {};
	DISCOUNT_FIELDS.forEach((key) => {
		if (req.body[key] !== undefined) updates[key] = req.body[key];
	});

	// Re-validate scope if changed
	if (updates.scope || updates.targetIds) {
		await validateSellerScope(
			req.user._id,
			updates.scope || undefined,
			updates.targetIds
		);
	}

	const discount = await DiscountModel.findOneAndUpdate(
		{ _id: req.params.id, creatorId: req.user._id },
		updates,
		{ new: true, runValidators: true }
	);

	if (!discount)
		return next(
			new appError("Discount not found or you don't have permission", 404)
		);

	sendResponse(res, 200, discount);
});

/**
 * Seller: Delete own discount only.
 * DELETE /api/v1/discounts/seller/:id
 */
export const sellerDeleteDiscount = catchAsync(async (req, res, next) => {
	const discount = await DiscountModel.findOneAndDelete({
		_id: req.params.id,
		creatorId: req.user._id,
	});

	if (!discount)
		return next(
			new appError("Discount not found or you don't have permission", 404)
		);

	sendResponse(res, 200, {});
});

/**
 * Seller: Get own discounts with filtering, sorting, pagination.
 * GET /api/v1/discounts/seller
 */
export const sellerGetAllDiscounts = catchAsync(async (req, res, next) => {
	const filter = { creatorId: req.user._id };

	const features = new APIFeatures(DiscountModel.find(filter), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const discounts = await features.query.lean();

	const countFeatures = new APIFeatures(
		DiscountModel.find(filter),
		req.query
	).filter();
	const total = await countFeatures.query.countDocuments();

	res.status(200).json({
		status: "success",
		results: discounts.length,
		total,
		data: discounts,
	});
});

/**
 * Seller: Get a single own discount by ID.
 * GET /api/v1/discounts/seller/:id
 */
export const sellerGetDiscount = catchAsync(async (req, res, next) => {
	const discount = await DiscountModel.findOne({
		_id: req.params.id,
		creatorId: req.user._id,
	}).lean();

	if (!discount)
		return next(
			new appError("Discount not found or you don't have permission", 404)
		);

	sendResponse(res, 200, discount);
});

/**
 * Seller: Toggle own discount active/inactive.
 * PATCH /api/v1/discounts/seller/:id/toggle
 */
export const sellerToggleDiscount = catchAsync(async (req, res, next) => {
	const discount = await DiscountModel.findOne({
		_id: req.params.id,
		creatorId: req.user._id,
	});

	if (!discount)
		return next(
			new appError("Discount not found or you don't have permission", 404)
		);

	discount.isActive = !discount.isActive;
	await discount.save();

	sendResponse(res, 200, discount);
});

// ===================================================================
// Public Controllers
// ===================================================================

/**
 * Public: Get all currently active discounts (for storefront display).
 * GET /api/v1/discounts/active
 */
export const getActiveDiscounts = catchAsync(async (req, res, next) => {
	const now = new Date();

	const filter = {
		isActive: true,
		startDate: { $lte: now },
		endDate: { $gt: now },
		$or: [
			{ usageLimit: null },
			{ $expr: { $lt: ["$usageCount", "$usageLimit"] } },
		],
	};

	const features = new APIFeatures(DiscountModel.find(filter), req.query)
		.sort()
		.limitFields()
		.paginate();

	const discounts = await features.query
		.select("name description type value scope targetIds startDate endDate maxDiscountAmount minOrderValue")
		.lean();

	const countFeatures = new APIFeatures(
		DiscountModel.find(filter),
		req.query
	);
	const total = await countFeatures.query.countDocuments();

	res.status(200).json({
		status: "success",
		results: discounts.length,
		total,
		data: discounts,
	});
});

/**
 * Public: Get the best discount for a specific product.
 * GET /api/v1/discounts/product/:productId
 */
export const getProductDiscount = catchAsync(async (req, res, next) => {
	const ProductModel = (await import("../models/ProductModel.js")).default;

	const product = await ProductModel.findById(req.params.productId).lean();
	if (!product) return next(new appError("Product not found", 404));

	const result = await resolveBestDiscount(product);

	sendResponse(res, 200, result || { message: "No active discounts for this product" });
});
