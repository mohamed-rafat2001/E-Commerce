import BrandFollowerModel from "../models/BrandFollowerModel.js";
import BrandModel from "../models/BrandModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import appError from "../utils/appError.js";

// @desc    Follow a brand (toggle follow/unfollow)
// @route   POST /api/v1/brands/:brandId/follow
// @access  Private (any authenticated user)
export const toggleFollowBrand = catchAsync(async (req, res, next) => {
    const { brandId } = req.params;
    const userId = req.user._id;

    // Verify brand exists and is active
    const brand = await BrandModel.findOne({ _id: brandId, isActive: true });
    if (!brand) {
        return next(new appError("Brand not found", 404));
    }

    // Check if already following
    const existingFollow = await BrandFollowerModel.findOne({ brandId, userId });

    if (existingFollow) {
        // Unfollow
        await BrandFollowerModel.deleteOne({ _id: existingFollow._id });
        const followersCount = await BrandFollowerModel.countDocuments({ brandId });

        return sendResponse(res, 200, {
            isFollowing: false,
            followersCount,
            message: "Brand unfollowed successfully",
        });
    }

    // Follow
    await BrandFollowerModel.create({ brandId, userId });
    const followersCount = await BrandFollowerModel.countDocuments({ brandId });

    sendResponse(res, 201, {
        isFollowing: true,
        followersCount,
        message: "Brand followed successfully",
    });
});

// @desc    Check if user follows a brand
// @route   GET /api/v1/brands/:brandId/follow/status
// @access  Private (any authenticated user)
export const getFollowStatus = catchAsync(async (req, res, next) => {
    const { brandId } = req.params;
    const userId = req.user._id;

    const existingFollow = await BrandFollowerModel.findOne({ brandId, userId });
    const followersCount = await BrandFollowerModel.countDocuments({ brandId });

    sendResponse(res, 200, {
        isFollowing: Boolean(existingFollow),
        followersCount,
    });
});

// @desc    Get followers count for a brand (public)
// @route   GET /api/v1/brands/:brandId/followers/count
// @access  Public
export const getFollowersCount = catchAsync(async (req, res, next) => {
    const { brandId } = req.params;

    const followersCount = await BrandFollowerModel.countDocuments({ brandId });

    sendResponse(res, 200, {
        followersCount,
    });
});

// @desc    Get all brands followed by a user
// @route   GET /api/v1/brands/following
// @access  Private (any authenticated user)
export const getFollowedBrands = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const follows = await BrandFollowerModel.find({ userId })
        .populate({
            path: "brandId",
            match: { isActive: true },
            select: "name logo description primaryCategory ratingAverage",
        })
        .sort({ createdAt: -1 });

    // Filter out null brands (inactive/deleted)
    const brands = follows
        .filter((f) => f.brandId)
        .map((f) => f.brandId);

    sendResponse(res, 200, brands);
});
