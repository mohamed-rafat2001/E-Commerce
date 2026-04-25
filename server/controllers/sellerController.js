import SellerModel from "../models/SellerModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";
import OrderModel from "../models/OrderModel.js";
import { updateByOwner } from "./handlerFactory.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import appError from "../utils/appError.js";
import { uploadSingleImage, setCloudinaryBody } from "../middlewares/uploadImagesMiddleware.js";
import cloudinary from "../utils/cloudinary.js";
import { getCache, setCache, deleteCache } from "../utils/cache.js";
import { fetchSellerDashboardStats, fetchSellerAnalyticsData } from "../services/sellerAnalyticsService.js";

//  @desc  Get seller's own profile
// @Route  GET /api/v1/sellers/profile
// @access Private/Seller
export const getSellerProfile = catchAsync(async (req, res, next) => {
	const cacheKey = `sellers:id:${req.user._id}`;
	const cached = await getCache(cacheKey);

	if (cached) return sendResponse(res, 200, cached);

	const seller = await SellerModel.findOne({ userId: req.user._id });

	if (!seller) return next(new appError("Seller profile not found", 404));

	await setCache(cacheKey, seller, 900); // 15 minutes TTL
	sendResponse(res, 200, seller);
});

//  @desc  complete seller's doc
// @Route  PATCH /api/v1/seller/
// @access Private/Seller
export const completeSellerDoc = updateByOwner(SellerModel, [
	"brand",
	"brandImg",
	"description",
	"businessEmail",
	"businessPhone",
	"primaryCategory",
	"subCategories",
]);

//  @desc  add addresses to seller
// @Route  PATCH /api/v1/seller/addresses
// @access Private/Seller
export const addAddressestoSeller = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });

	if (!seller) return next(new appError("Seller not found", 404));

	if (!req.body.addresses) {
		return next(new appError("Please provide address data", 400));
	}

	seller.addresses.push(req.body.addresses);
	await seller.save();

	await deleteCache(`sellers:id:${req.user._id}`);
	sendResponse(res, 201, seller);
});

//  @desc  add PayoutMethod to seller
// @Route  PATCH /api/v1/seller/PayoutMethod
// @access Private/Seller
export const addPayoutMethodtoSeller = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });

	if (!seller) return next(new appError("Seller not found", 404));

	if (!req.body.payoutMethods) {
		return next(new appError("Please provide payout method data", 400));
	}

	seller.payoutMethods.push(req.body.payoutMethods);
	await seller.save();

	await deleteCache(`sellers:id:${req.user._id}`);
	sendResponse(res, 201, seller);
});

// @desc    Get seller dashboard statistics
// @route   GET /api/v1/sellers/dashboard-stats
// @access  Private/Seller
// @desc    Get seller dashboard statistics
// @route   GET /api/v1/sellers/dashboard-stats
// @access  Private/Seller
export const getSellerDashboardStats = catchAsync(async (req, res, next) => {
	try {
		const data = await fetchSellerDashboardStats(req.user);

		sendResponse(res, 200, data);
	} catch (error) {
		return next(new appError(error.message, 404));
	}
});

// @desc    Get seller analytics
// @route   GET /api/v1/sellers/analytics
// @access  Private/Seller
// @desc    Get seller analytics
// @route   GET /api/v1/sellers/analytics
// @access  Private/Seller
export const getSellerAnalytics = catchAsync(async (req, res, next) => {
	try {
		const data = await fetchSellerAnalyticsData(req.user);

		sendResponse(res, 200, data);
	} catch (error) {
		return next(new appError(error.message, 404));
	}
});

// @desc    Update order status by seller (Processing → Shipped)
// @route   PATCH /api/v1/sellers/orders/:orderId/status
// @access  Private/Seller
export const updateSellerOrderStatus = catchAsync(async (req, res, next) => {
	const { status } = req.body;
	const { orderId } = req.params;

	const seller = await SellerModel.findOne({ userId: req.user._id });

	if (!seller) return next(new appError("Seller profile not found", 404));

	// Verify the seller owns items in this order
	const orderItem = await OrderItemsModel.findOne({
		orderId,
		sellerId: seller._id,
	});

	if (!orderItem) {
		return next(new appError("Order not found or not associated with your store", 404));
	}

	const order = await OrderModel.findById(orderId);

	if (!order) return next(new appError("Order not found", 404));

	// Sellers can only transition: Pending→Processing, Processing→Shipped
	const allowedTransitions = {
		Pending: ["Processing"],
		Processing: ["Shipped"],
	};

	const allowed = allowedTransitions[order.status];

	if (!allowed || !allowed.includes(status)) {
		return next(new appError(
			`Cannot transition from ${order.status} to ${status}. Allowed: ${allowed?.join(", ") || "none"}`,
			400,
		));
	}

	order.status = status;
	if (status === "Processing") {
		order.isPaid = true;
		order.paidAt = Date.now();
	}

	const updatedOrder = await order.save();

	sendResponse(res, 200, updatedOrder);
});

// @desc    Update seller's brand image
// @route   PATCH /api/v1/sellers/brand-image
// @access  Private/Seller
export const updateSellerBrandImage = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });

	if (!seller) return next(new appError("Seller profile not found", 404));

	// Handle file upload
	uploadSingleImage("brandImg")(req, res, async (err) => {
		if (err) {
			return next(new appError("Error uploading image", 400));
		}

		setCloudinaryBody(req, res, async () => {
			// Delete old image if exists
			if (seller.brandImg?.public_id) {
				try {
					await cloudinary.uploader.destroy(seller.brandImg.public_id);
				} catch (error) {
					console.error("Error deleting old image:", error);
				}
			}

			// Update seller with new image
			seller.brandImg = req.body.brandImg;
			await seller.save();

			await deleteCache(`sellers:id:${req.user._id}`);
			sendResponse(res, 200, {
				message: "Brand image updated successfully",
				brandImg: seller.brandImg,
			});
		});
	});
});

// @desc    Delete seller's brand image
// @route   DELETE /api/v1/sellers/brand-image
// @access  Private/Seller
export const deleteSellerBrandImage = catchAsync(async (req, res, next) => {
	const seller = await SellerModel.findOne({ userId: req.user._id });

	if (!seller) return next(new appError("Seller profile not found", 404));

	if (seller.brandImg?.public_id) {
		try {
			await cloudinary.uploader.destroy(seller.brandImg.public_id);
		} catch (error) {
			console.error("Error deleting image:", error);
		}
	}

	seller.brandImg = undefined;
	await seller.save();

	await deleteCache(`sellers:id:${req.user._id}`);
	sendResponse(res, 200, {
		message: "Brand image deleted successfully",
	});
});

// @desc    Update seller categories (primary and multiple subcategories)
// @route   PATCH /api/v1/sellers/categories
// @access  Private/Seller
export const updateSellerCategories = catchAsync(async (req, res, next) => {
	const { primaryCategory, subCategories } = req.body;
	const seller = await SellerModel.findOne({ userId: req.user._id });

	if (!seller) return next(new appError("Seller profile not found", 404));

	// Validate that subCategories don't contain the primary category
	if (primaryCategory && subCategories && Array.isArray(subCategories)) {
		if (subCategories.includes(primaryCategory)) {
			return next(new appError("Primary category cannot be selected as a subcategory", 400));
		}

		// Remove duplicates from subCategories
		const uniqueSubCategories = [...new Set(subCategories)];

		seller.subCategories = uniqueSubCategories;
	} else if (subCategories === null || subCategories === undefined) {
		// Clear subCategories if explicitly set to null/undefined
		seller.subCategories = [];
	}

	seller.primaryCategory = primaryCategory || undefined;

	await seller.save();

	// Populate the categories for response
	await seller.populate([
		{ path: "primaryCategory", select: "name description" },
		{ path: "subCategories", select: "name description" },
	]);

	await deleteCache(`sellers:id:${req.user._id}`);
	sendResponse(res, 200, {
		message: "Categories updated successfully",
		seller: {
			primaryCategory: seller.primaryCategory,
			subCategories: seller.subCategories,
		},
	});
});

// add review to seller
