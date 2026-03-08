import BrandModel from "../models/BrandModel.js";
import SellerModel from "../models/SellerModel.js";
import ProductModel from "../models/ProductModel.js";
import { uploadSingleImage, uploadBrandImages, setCloudinaryBody } from "../middlewares/uploadImagesMiddleware.js";
import cloudinary from "../utils/cloudinary.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import appError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "../utils/cache.js";

// Helper to build cache key for brands
const buildBrandCacheKey = (identifier, req) => {
	let key = `brands:${identifier}`;
	if (Object.keys(req.query).length > 0) {
		const sorted = Object.keys(req.query).sort().reduce((acc, k) => {
			acc[k] = req.query[k];
			return acc;
		}, {});
		key += `:${JSON.stringify(sorted)}`;
	}
	return key;
};

const invalidateBrandCache = async (brandId) => {
	await deleteCacheByPattern("brands:all*");
	if (brandId) await deleteCache(`brands:id:${brandId}`);
};

// @desc    Get all active brands (public endpoint for landing page)
// @route   GET /api/v1/brands/public
// @access  Public
export const getAllActiveBrands = catchAsync(async (req, res, next) => {
	const query = BrandModel.find({ isActive: true });

	// Apply API features (filtering, sorting, pagination, etc.)
	const features = new APIFeatures(query, req.query)
		.filter()
		.sort()
		.limitFields()
		.search(BrandModel.schema)
		.paginate();

	const brands = await features.query;

	// Send response
	return sendResponse(res, 200, "Brands retrieved successfully", brands);
});

// @desc    Get all brands for current seller
// @route   GET /api/v1/brands
// @access  Private/Seller
export const getMyBrands = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) {
		return next(new appError("Seller profile not found", 404));
	}

	const cacheKey = buildBrandCacheKey(`owner:${seller._id}`, req);
	const cached = await getCache(cacheKey);
	if (cached) return res.status(200).json(cached);

	// Initialize query with seller filter
	const query = BrandModel.find({ sellerId: seller._id });

	// Apply API features
	const features = new APIFeatures(query, req.query)
		.filter()
		.sort()
		.limitFields()
		.search(BrandModel.schema)
		.paginate();

	const brands = await features.query.populate({
		path: "products",
		select: "_id"
	});

	// Get total count for pagination
	const totalFeatures = new APIFeatures(BrandModel.find({ sellerId: seller._id }), req.query)
		.filter()
		.search(BrandModel.schema);
	const total = await totalFeatures.query.countDocuments();

	const responseData = {
		status: "success",
		results: brands.length,
		total,
		data: brands
	};

	await setCache(cacheKey, responseData, 7200); // 2 hours TTL
	res.status(200).json(responseData);
});

// @desc    Get single brand by ID
// @route   GET /api/v1/brands/:id
// @access  Private/Seller
export const getBrand = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) {
		return next(new appError("Seller profile not found", 404));
	}

	const cacheKey = `brands:id:${req.params.id}`;
	const cached = await getCache(cacheKey);
	if (cached) return sendResponse(res, 200, cached);

	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: seller._id
	}).populate({
		path: "products",
		select: "_id"
	});

	if (!brand) {
		return next(new appError("Brand not found", 404));
	}

	await setCache(cacheKey, brand, 7200); // 2 hours TTL
	sendResponse(res, 200, brand);
});

// @desc    Create new brand
// @route   POST /api/v1/brands
// @access  Private/Seller
export const createBrand = catchAsync(async (req, res, next) => {
	// Verify seller exists
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) {
		return next(new appError("Seller profile not found", 404));
	}

	// Add sellerId to request body
	req.body.sellerId = seller._id;

	const brand = await BrandModel.create(req.body);
	await brand.populate([
		{ path: "primaryCategory", select: "name description" },
		{ path: "subCategories", select: "name description" }
	]);

	await invalidateBrandCache(brand._id);

	sendResponse(res, 201, brand);
});

// @desc    Update brand
// @route   PATCH /api/v1/brands/:id
// @access  Private/Seller
export const updateBrand = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) {
		return next(new appError("Seller profile not found", 404));
	}
	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: seller._id
	});

	if (!brand) {
		return next(new appError("Brand not found", 404));
	}

	// Delete old logo if new one provided
	if (req.body.logo && brand.logo?.public_id) {
		try {
			await cloudinary.uploader.destroy(brand.logo.public_id);
		} catch (error) {
			console.log("Error deleting old logo:", error);
		}
	}

	// Delete old cover image if new one provided
	if (req.body.coverImage && brand.coverImage?.public_id) {
		try {
			await cloudinary.uploader.destroy(brand.coverImage.public_id);
		} catch (error) {
			console.log("Error deleting old cover image:", error);
		}
	}

	Object.assign(brand, req.body);
	await brand.save();

	await brand.populate([
		{ path: "primaryCategory", select: "name description" },
		{ path: "subCategories", select: "name description" },
		{ path: "products", select: "_id" }
	]);

	await invalidateBrandCache(brand._id);

	sendResponse(res, 200, brand);
});

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Private/Seller
export const deleteBrand = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) {
		return next(new appError("Seller profile not found", 404));
	}
	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: seller._id
	});

	if (!brand) {
		return next(new appError("Brand not found", 404));
	}

	// Delete logo from Cloudinary if exists
	if (brand.logo?.public_id) {
		try {
			await cloudinary.uploader.destroy(brand.logo.public_id);
		} catch (error) {
			console.log("Error deleting logo:", error);
		}
	}

	await BrandModel.deleteOne({ _id: brand._id });

	await invalidateBrandCache(brand._id);

	sendResponse(res, 204, null);
});

// @desc    Update brand logo
// @route   PATCH /api/v1/brands/:id/logo
// @access  Private/Seller
export const updateBrandLogo = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) {
		return next(new appError("Seller profile not found", 404));
	}
	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: seller._id
	});

	if (!brand) {
		return next(new appError("Brand not found", 404));
	}

	// Delete old logo if exists
	if (brand.logo?.public_id) {
		try {
			await cloudinary.uploader.destroy(brand.logo.public_id);
		} catch (error) {
			console.log("Error deleting old logo:", error);
		}
	}

	brand.logo = req.body.logo;
	await brand.save();

	await invalidateBrandCache(brand._id);

	sendResponse(res, 200, {
		message: "Logo updated successfully",
		logo: brand.logo
	});
});

// @desc    Delete brand logo
// @route   DELETE /api/v1/brands/:id/logo
// @access  Private/Seller
export const deleteBrandLogo = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });
	if (!seller) {
		return next(new appError("Seller profile not found", 404));
	}
	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: seller._id
	});

	if (!brand) {
		return next(new appError("Brand not found", 404));
	}

	if (brand.logo?.public_id) {
		try {
			await cloudinary.uploader.destroy(brand.logo.public_id);
		} catch (error) {
			console.log("Error deleting logo:", error);
		}
	}

	brand.logo = undefined;
	await brand.save();

	await invalidateBrandCache(brand._id);

	sendResponse(res, 200, {
		message: "Logo deleted successfully"
	});
});