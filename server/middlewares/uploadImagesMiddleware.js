import { upload, uploadParsedFilesToCloudinary } from "../utils/cloudinary.js";

const composeMiddlewares = (...middlewares) => (req, res, next) => {
	let currentIndex = 0;

	const run = (error) => {
		if (error) {
			next(error);

			return;
		}

		const middleware = middlewares[currentIndex];
		currentIndex += 1;

		if (!middleware) {
			next();

			return;
		}

		try {
			const maybePromise = middleware(req, res, run);

			if (maybePromise?.catch) {
				maybePromise.catch(run);
			}
		} catch (err) {
			run(err);
		}
	};

	run();
};

export const uploadProductImages = composeMiddlewares(upload.fields([
	{ name: "coverImage", maxCount: 1 },
	{ name: "images", maxCount: 8 },
]), uploadParsedFilesToCloudinary);

export const uploadBrandImages = composeMiddlewares(upload.fields([
	{ name: "logo", maxCount: 1 },
	{ name: "coverImage", maxCount: 1 },
]), uploadParsedFilesToCloudinary);

// For single image upload like profileImg or category coverImage
export const uploadSingleImage = (fieldName) => composeMiddlewares(upload.single(fieldName), uploadParsedFilesToCloudinary);

export const setCloudinaryBody = (req, _res, next) => {
	if (req.files) {
		if (req.files.coverImage) {
			req.body.coverImage = {
				public_id: req.files.coverImage[0].filename,
				secure_url: req.files.coverImage[0].path,
			};
		}
		if (req.files.logo) {
			req.body.logo = {
				public_id: req.files.logo[0].filename,
				secure_url: req.files.logo[0].path,
			};
		}
		if (req.files.images) {
			req.body.images = req.files.images.map((file) => ({
				public_id: file.filename,
				secure_url: file.path,
			}));
		}
		// Generic handling for other fields if needed
		Object.keys(req.files).forEach((key) => {
			if (key !== "coverImage" && key !== "images" && key !== "logo") {
				req.body[key] = req.files[key].map((file) => ({
					public_id: file.filename,
					secure_url: file.path,
				}));
			}
		});
	}

	if (req.file) {
		const fieldName = req.file.fieldname;

		req.body[fieldName] = {
			public_id: req.file.filename,
			secure_url: req.file.path,
		};
	}

	next();
};
