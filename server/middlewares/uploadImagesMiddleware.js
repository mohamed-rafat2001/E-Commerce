import { upload } from '../utils/cloudinary.js';

export const uploadProductImages = upload.fields([
	{ name: 'coverImage', maxCount: 1 },
	{ name: 'images', maxCount: 8 },
]);

export const uploadBrandImages = upload.fields([
	{ name: 'logo', maxCount: 1 },
	{ name: 'coverImage', maxCount: 1 },
]);

// For single image upload like profileImg or category coverImage
export const uploadSingleImage = (fieldName) => upload.single(fieldName);

export const setCloudinaryBody = (req, res, next) => {
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
			if (key !== 'coverImage' && key !== 'images' && key !== 'logo') {
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
