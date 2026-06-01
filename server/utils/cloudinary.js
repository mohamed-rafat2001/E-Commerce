import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const getCloudinary = () => {
	cloudinary.config({
		cloud_name: process.env.cloud_name,
		api_key: process.env.api_key,
		api_secret: process.env.api_secret,
	});

	return cloudinary;
};

const sanitizePublicId = (value) => {
	const normalized = value
		.toLowerCase()
		.replace(/[^a-z0-9-_]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 60);

	return normalized || "image";
};

const buildPublicId = (originalname) => {
	const basename = originalname.split(".").slice(0, -1).join(".") || originalname;

	return `${Date.now()}-${sanitizePublicId(basename)}`;
};

const uploadBufferToCloudinary = (file, folder) => new Promise((resolve, reject) => {
	getCloudinary();

	const uploadStream = cloudinary.uploader.upload_stream(
		{
			folder,
			public_id: buildPublicId(file.originalname),
			resource_type: "image",
			transformation: [
				{ quality: "auto", fetch_format: "auto" },
				{ format: "webp" },
			],
		},
		(error, result) => {
			if (error) {
				reject(error);

				return;
			}

			resolve({
				...file,
				filename: result.public_id,
				path: result.secure_url,
			});
		},
	);

	uploadStream.end(file.buffer);
});

export const uploadParsedFilesToCloudinary = async (req, _res, next) => {
	try {
		const folder = req.uploadFolder || "e-commerce";

		if (req.file) {
			req.file = await uploadBufferToCloudinary(req.file, folder);
		}

		if (req.files) {
			if (Array.isArray(req.files)) {
				req.files = await Promise.all(req.files.map((file) => uploadBufferToCloudinary(file, folder)));
			} else {
				const entries = await Promise.all(
					Object.entries(req.files).map(async ([fieldName, files]) => [
						fieldName,
						await Promise.all(files.map((file) => uploadBufferToCloudinary(file, folder))),
					]),
				);

				req.files = Object.fromEntries(entries);
			}
		}

		next();
	} catch (error) {
		next(error);
	}
};

const imageFileFilter = (_req, file, callback) => {
	if (file.mimetype?.startsWith("image/")) {
		callback(null, true);

		return;
	}

	callback(new Error("Only image uploads are allowed."));
};

export const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: imageFileFilter,
});

export default cloudinary;
