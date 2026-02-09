import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import appError from "../utils/appError.js";

/**
 * Handle individual image upload to Cloudinary (via multer middleware)
 */
export const uploadImage = catchAsync(async (req, res, next) => {
	if (!req.file) {
		return next(new appError("No image file uploaded", 400));
	}

	const result = {
		public_id: req.file.path || req.file.filename, // Multer Cloudinary storage structure
		secure_url: req.file.path,
	};

	sendResponse(res, 200, result);
});
