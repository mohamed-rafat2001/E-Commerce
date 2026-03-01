import { useState, useEffect, useRef } from 'react';
import mainApi from '../../../../app/api/mainApi.js';

const useImageUpload = ({ product, isOpen }) => {
	const fileInputRef = useRef(null);

	const [coverImagePreview, setCoverImagePreview] = useState(null);
	const [coverImageFile, setCoverImageFile] = useState(null);
	const [additionalImages, setAdditionalImages] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	// Reset images when product changes or modal opens
	useEffect(() => {
		if (isOpen) {
			setCoverImagePreview(product?.coverImage?.secure_url || null);
			setCoverImageFile(null);
			if (product?.images) {
				const existingImages = product.images.map(img => ({
					preview: img.secure_url,
					uploaded: true,
					public_id: img.public_id,
				}));
				setAdditionalImages(existingImages);
			} else {
				setAdditionalImages([]);
			}
			setUploadProgress(0);
		}
	}, [product, isOpen]);

	// Auto-upload additional images when they're added
	useEffect(() => {
		additionalImages.forEach((image, index) => {
			if (!image.uploaded && !image.isUploading && image.file) {
				uploadAdditionalImage(index);
			}
		});
	}, [additionalImages]);

	// --- Cover Image ---
	const handleCoverImageSelect = (e) => {
		const file = e.target.files?.[0];
		if (!file) return null;

		if (!file.type.startsWith('image/')) {
			return { error: 'Please select an image file' };
		}
		if (file.size > 5 * 1024 * 1024) {
			return { error: 'Image must be less than 5MB' };
		}

		setCoverImageFile(file);
		setCoverImagePreview(URL.createObjectURL(file));
		return null;
	};

	const removeCoverImage = () => {
		setCoverImageFile(null);
		setCoverImagePreview(product?.coverImage?.secure_url || null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	// --- Additional Images ---
	const handleAdditionalImagesSelect = (e) => {
		const files = Array.from(e.target.files);
		if (additionalImages.length + files.length > 10) {
			const remainingSlots = 10 - additionalImages.length;
			return { error: `You can only upload ${remainingSlots} more image(s). Maximum 10 images allowed.` };
		}

		let validationError = null;
		const newImages = files.map(file => {
			if (!file.type.startsWith('image/')) {
				validationError = 'Please select only image files';
				return null;
			}
			if (file.size > 5 * 1024 * 1024) {
				validationError = 'Each image must be less than 5MB';
				return null;
			}
			return {
				file,
				preview: URL.createObjectURL(file),
				uploadProgress: 0,
				isUploading: false,
				uploaded: false,
			};
		}).filter(Boolean);

		if (validationError) return { error: validationError };

		if (newImages.length > 0) {
			setAdditionalImages(prev => [...prev, ...newImages]);
		}
		return null;
	};

	const removeAdditionalImage = (index) => {
		setAdditionalImages(prev => {
			const newImages = [...prev];
			const removedImage = newImages.splice(index, 1)[0];
			if (removedImage.preview && !removedImage.uploaded) {
				URL.revokeObjectURL(removedImage.preview);
			}
			return newImages;
		});
	};

	const uploadAdditionalImage = async (index) => {
		const imageToUpload = additionalImages[index];
		if (imageToUpload.uploaded || imageToUpload.isUploading || !imageToUpload.file) return;

		setAdditionalImages(prev => {
			const newImages = [...prev];
			newImages[index] = { ...newImages[index], isUploading: true, uploadProgress: 0 };
			return newImages;
		});

		try {
			const formData = new FormData();
			formData.append('image', imageToUpload.file);

			const response = await mainApi.post('upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: (progressEvent) => {
					const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					setAdditionalImages(prev => {
						const newImages = [...prev];
						newImages[index] = { ...newImages[index], uploadProgress: percent };
						return newImages;
					});
				},
			});

			setAdditionalImages(prev => {
				const newImages = [...prev];
				newImages[index] = {
					...newImages[index],
					isUploading: false,
					uploadProgress: 100,
					uploaded: true,
					public_id: response.data?.data?.public_id,
					preview: response.data?.data?.secure_url,
				};
				return newImages;
			});
		} catch {
			setAdditionalImages(prev => {
				const newImages = [...prev];
				newImages[index] = { ...newImages[index], isUploading: false, uploadProgress: 0 };
				return newImages;
			});
			return { error: 'Failed to upload image. Try again.' };
		}
	};

	// --- Upload cover image on submit ---
	const uploadCoverImage = async () => {
		if (!coverImageFile) return { coverImage: undefined };

		try {
			setIsUploading(true);
			const formData = new FormData();
			formData.append('image', coverImageFile);

			const response = await mainApi.post('upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: (progressEvent) => {
					const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					setUploadProgress(percent);
				},
			});

			setIsUploading(false);
			return { coverImage: response.data?.data };
		} catch {
			setIsUploading(false);
			return { error: 'Failed to upload cover image. Try again.' };
		}
	};

	const getUploadedAdditionalImages = () => {
		return additionalImages
			.filter(img => img.uploaded)
			.map(img => ({
				public_id: img.public_id,
				secure_url: img.preview,
			}));
	};

	return {
		fileInputRef,
		coverImagePreview,
		coverImageFile,
		additionalImages,
		isUploading,
		uploadProgress,

		handleCoverImageSelect,
		removeCoverImage,
		handleAdditionalImagesSelect,
		removeAdditionalImage,
		uploadCoverImage,
		getUploadedAdditionalImages,
	};
};

export default useImageUpload;
