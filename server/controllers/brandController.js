import BrandModel from "../models/BrandModel.js";
import SellerModel from "../models/SellerModel.js";
import { uploadSingleImage, setCloudinaryBody } from "../middlewares/uploadImagesMiddleware.js";
import cloudinary from "../utils/cloudinary.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import appError from "../utils/appError.js";

// @desc    Get all brands for current seller
// @route   GET /api/v1/brands
// @access  Private/Seller
export const getMyBrands = catchAsync(async (req, res, next) => {
	const brands = await BrandModel.find({ sellerId: req.user._id });
	sendResponse(res, 200, brands);
});

// @desc    Get single brand by ID
// @route   GET /api/v1/brands/:id
// @access  Private/Seller
export const getBrand = catchAsync(async (req, res, next) => {
	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: req.user._id
	});
	
	if (!brand) {
		return next(new appError("Brand not found", 404));
	}
	
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
	
	// Handle file upload for logo
	uploadSingleImage("logo")(req, res, async (err) => {
		if (err) {
			return next(new appError("Error uploading logo", 400));
		}
		
		setCloudinaryBody(req, res, async () => {
			const brand = await BrandModel.create(req.body);
			await brand.populate([
				{ path: "primaryCategory", select: "name description" },
				{ path: "subCategories", select: "name description" }
			]);
			
			sendResponse(res, 201, brand);
		});
	});
});

// @desc    Update brand
// @route   PATCH /api/v1/brands/:id
// @access  Private/Seller
export const updateBrand = catchAsync(async (req, res, next) => {
	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: req.user._id
	});
	
	if (!brand) {
		return next(new appError("Brand not found", 404));
	}
	
	// Handle logo update if provided
	if (req.files && req.files.logo) {
		// Delete old logo if exists
		if (brand.logo?.public_id) {
			try {
				await cloudinary.uploader.destroy(brand.logo.public_id);
			} catch (error) {
				console.log("Error deleting old logo:", error);
			}
		}
		
		uploadSingleImage("logo")(req, res, async (err) => {
			if (err) {
				return next(new appError("Error uploading logo", 400));
			}
			
			setCloudinaryBody(req, res, async () => {
				Object.assign(brand, req.body);
				brand.logo = req.body.logo;
				await brand.save();
				
				await brand.populate([
					{ path: "primaryCategory", select: "name description" },
					{ path: "subCategories", select: "name description" }
				]);
				
				sendResponse(res, 200, brand);
			});
		});
	} else {
		// Update without logo
		Object.assign(brand, req.body);
		await brand.save();
		
		await brand.populate([
			{ path: "primaryCategory", select: "name description" },
			{ path: "subCategories", select: "name description" }
		]);
		
		sendResponse(res, 200, brand);
	}
});

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Private/Seller
export const deleteBrand = catchAsync(async (req, res, next) => {
	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: req.user._id
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
	
	await brand.remove();
	sendResponse(res, 204, null);
});

// @desc    Update brand logo
// @route   PATCH /api/v1/brands/:id/logo
// @access  Private/Seller
export const updateBrandLogo = catchAsync(async (req, res, next) => {
	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: req.user._id
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
	
	// Handle file upload
	uploadSingleImage("logo")(req, res, async (err) => {
		if (err) {
			return next(new appError("Error uploading logo", 400));
		}
		
		setCloudinaryBody(req, res, async () => {
			brand.logo = req.body.logo;
			await brand.save();
			
			sendResponse(res, 200, {
				message: "Logo updated successfully",
				logo: brand.logo
			});
		});
	});
});

// @desc    Delete brand logo
// @route   DELETE /api/v1/brands/:id/logo
// @access  Private/Seller
export const deleteBrandLogo = catchAsync(async (req, res, next) => {
	const brand = await BrandModel.findOne({
		_id: req.params.id,
		sellerId: req.user._id
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
	
	sendResponse(res, 200, {
		message: "Logo deleted successfully"
	});
});