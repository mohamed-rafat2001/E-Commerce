import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const getCloudinary = () => {
	cloudinary.config({
		cloud_name: process.env.cloud_name,
		api_key: process.env.api_key,
		api_secret: process.env.api_secret,
	});
	return cloudinary;
};

export const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: async (req, file) => {
		getCloudinary();
		const folder = req.uploadFolder || 'e-commerce';
		return {
			folder: folder,
			allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
			public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
		};
	},
});

export const upload = multer({ storage: storage });

export default cloudinary;
