import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Modal, Input, Select } from '../../../../shared/ui/index.js';
import { FiImage, FiUpload, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import useCategories from '../../../admin/hooks/categories/useCategories.js';
import { useSellerBrands } from '../../hooks/index.js';
import mainApi from '../../../../app/api/mainApi.js';

const statusOptions = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'archived', label: 'Archived' },
];

const ProductFormModal = ({ isOpen, onClose, product = null, onSubmit, isLoading }) => {
	const isEditing = !!product;
	const { categories, isLoading: categoriesLoading } = useCategories();
	const { brands, isLoading: brandsLoading } = useSellerBrands();
	const fileInputRef = useRef(null);
	
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		brandId: '',
		primaryCategory: '',
		subCategory: '',
		countInStock: 0,
		status: 'draft',
	});

	const [coverImagePreview, setCoverImagePreview] = useState(null);
	const [coverImageFile, setCoverImageFile] = useState(null);
	const [additionalImages, setAdditionalImages] = useState([]); // Array of {file, preview, uploadProgress, isUploading}
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [formErrors, setFormErrors] = useState({});

	// Reset form when product changes or modal opens
	useEffect(() => {
		if (isOpen) {
			setFormData({
				name: product?.name || '',
				description: product?.description || '',
				price: product?.price?.amount || '',
				brandId: product?.brandId?._id || product?.brandId || '',
				primaryCategory: product?.primaryCategory?._id || product?.primaryCategory || '',
				subCategory: product?.subCategory?._id || product?.subCategory || '',
				countInStock: product?.countInStock || 0,
				status: product?.status || 'draft',
			});
			setCoverImagePreview(product?.coverImage?.secure_url || null);
			setCoverImageFile(null);
			// Initialize additional images from product data
			if (product?.images) {
				const existingImages = product.images.map(img => ({
					preview: img.secure_url,
					uploaded: true,
					public_id: img.public_id
				}));
				setAdditionalImages(existingImages);
			} else {
				setAdditionalImages([]);
			}
			setFormErrors({});
			setUploadProgress(0);
		}
	}, [product, isOpen]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		// Clear error for this field
		if (formErrors[name]) {
			setFormErrors(prev => ({ ...prev, [name]: null }));
		}
	};

	const handleSelectChange = (name, value) => {
		setFormData(prev => ({ ...prev, [name]: value }));
		if (formErrors[name]) {
			setFormErrors(prev => ({ ...prev, [name]: null }));
		}
	};

	const handleImageSelect = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			setFormErrors(prev => ({ ...prev, image: 'Please select an image file' }));
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			setFormErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
			return;
		}

		setCoverImageFile(file);
		setCoverImagePreview(URL.createObjectURL(file));
		setFormErrors(prev => ({ ...prev, image: null }));
	};

	const handleAdditionalImagesSelect = (e) => {
		const files = Array.from(e.target.files);
		
		// Check if we exceed the limit
		if (additionalImages.length + files.length > 10) {
			const remainingSlots = 10 - additionalImages.length;
			setFormErrors(prev => ({ 
				...prev, 
				additionalImages: `You can only upload ${remainingSlots} more image(s). Maximum 10 images allowed.` 
			}));
			return;
		}

		const newImages = files.map(file => {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				setFormErrors(prev => ({ ...prev, additionalImages: 'Please select only image files' }));
				return null;
			}

			// Validate file size (max 5MB each)
			if (file.size > 5 * 1024 * 1024) {
				setFormErrors(prev => ({ ...prev, additionalImages: 'Each image must be less than 5MB' }));
				return null;
			}

			return {
				file,
				preview: URL.createObjectURL(file),
				uploadProgress: 0,
				isUploading: false,
				uploaded: false
			};
		}).filter(Boolean);

		if (newImages.length > 0) {
			setAdditionalImages(prev => [...prev, ...newImages]);
			setFormErrors(prev => ({ ...prev, additionalImages: null }));
		}
	};

	const removeAdditionalImage = (index) => {
		setAdditionalImages(prev => {
			const newImages = [...prev];
			const removedImage = newImages.splice(index, 1)[0];
			
			// Revoke object URL to prevent memory leaks
			if (removedImage.preview && !removedImage.uploaded) {
				URL.revokeObjectURL(removedImage.preview);
			}
			
			return newImages;
		});
	};

	const uploadAdditionalImage = async (index) => {
		setAdditionalImages(prev => {
			const newImages = [...prev];
			newImages[index] = { ...newImages[index], isUploading: true, uploadProgress: 0 };
			return newImages;
		});

		const imageToUpload = additionalImages[index];
		
		try {
			const formDataUpload = new FormData();
			formDataUpload.append('image', imageToUpload.file);
			
			const response = await mainApi.post('upload', formDataUpload, {
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
			
			// Update image with uploaded data
			setAdditionalImages(prev => {
				const newImages = [...prev];
				newImages[index] = { 
					...newImages[index], 
					isUploading: false,
					uploadProgress: 100,
					uploaded: true,
					public_id: response.data?.data?.public_id,
					preview: response.data?.data?.secure_url
				};
				return newImages;
			});
		} catch {
			setAdditionalImages(prev => {
				const newImages = [...prev];
				newImages[index] = { ...newImages[index], isUploading: false, uploadProgress: 0 };
				return newImages;
			});
			setFormErrors(prev => ({ ...prev, additionalImages: 'Failed to upload image. Try again.' }));
		}
	};

	const removeImage = () => {
		setCoverImageFile(null);
		setCoverImagePreview(isEditing ? product?.coverImage?.secure_url : null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const validateForm = () => {
		const errors = {};
		if (!formData.name.trim()) errors.name = 'Product name is required';
		if (!formData.description.trim()) errors.description = 'Description is required';
		if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required';
		if (!formData.brandId) errors.brandId = 'Brand is required';
		if (!formData.primaryCategory) errors.primaryCategory = 'Primary category is required';
		
		// Check if all additional images are uploaded
		const uploadingImages = additionalImages.filter(img => img.isUploading);
		const unuploadedImages = additionalImages.filter(img => !img.uploaded && !img.isUploading);
		
		if (uploadingImages.length > 0) {
			errors.additionalImages = 'Please wait for all images to finish uploading';
		} else if (unuploadedImages.length > 0) {
			errors.additionalImages = 'Please upload all selected images or remove them';
		}
		
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		let coverImage = undefined;
		let additionalImageUrls = [];

		// Upload cover image if new file selected
		if (coverImageFile) {
			try {
				setIsUploading(true);
				const formDataUpload = new FormData();
				formDataUpload.append('image', coverImageFile);
				
				const response = await mainApi.post('upload', formDataUpload, {
					headers: { 'Content-Type': 'multipart/form-data' },
					onUploadProgress: (progressEvent) => {
						const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						setUploadProgress(percent);
					},
				});
				
				coverImage = response.data?.data;
				setIsUploading(false);
			} catch {
				setIsUploading(false);
				setFormErrors(prev => ({ ...prev, image: 'Failed to upload cover image. Try again.' }));
				return;
			}
		}

		// Get uploaded additional images
		additionalImageUrls = additionalImages
			.filter(img => img.uploaded)
			.map(img => ({
				public_id: img.public_id,
				secure_url: img.preview
			}));

		const submitData = {
			...formData,
			price: { amount: parseFloat(formData.price), currency: 'USD' },
		};

		if (coverImage) {
			submitData.coverImage = coverImage;
		}
		
		if (additionalImageUrls.length > 0) {
			submitData.images = additionalImageUrls;
		}

		onSubmit(submitData);
	};

	const categoryOptions = (categories || []).map(c => ({
		value: c._id,
		label: c.name,
	}));
	
	const brandOptions = (brands || []).map(b => ({
		value: b._id,
		label: b.name,
	}));
	
	// Filter subcategories to exclude the primary category
	const subCategoryOptions = (categories || [])
		.filter(c => c._id !== formData.primaryCategory)
		.map(c => ({
			value: c._id,
			label: c.name,
		}));

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title={isEditing ? 'Edit Product' : 'Add New Product'}
			size="lg"
			footer={
				<>
					<Button variant="secondary" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button 
						type="submit" 
						form="product-form"
						loading={isLoading || isUploading} 
						icon={isEditing ? <FiCheck className="w-4 h-4" /> : <FiImage className="w-4 h-4" />}
					>
						{isEditing ? 'Update Product' : 'Add Product'}
					</Button>
				</>
			}
		>
			<form id="product-form" onSubmit={handleSubmit} className="space-y-5">
				{/* Cover Image Upload */}
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
					<div className="flex items-start gap-4">
						<div 
							onClick={() => fileInputRef.current?.click()}
							className={`w-32 h-32 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-indigo-400 hover:bg-indigo-50/50 group ${
								formErrors.image ? 'border-rose-300 bg-rose-50' : 
								coverImagePreview ? 'border-indigo-200' : 'border-gray-200 bg-gray-50'
							}`}
						>
							{coverImagePreview ? (
								<img src={coverImagePreview} alt="Preview" className="w-full h-full object-cover" crossOrigin="anonymous" />
							) : (
								<div className="flex flex-col items-center gap-1.5 text-gray-400 group-hover:text-indigo-500 transition-colors">
									<FiUpload className="w-6 h-6" />
									<span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
								</div>
							)}
						</div>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageSelect}
							className="hidden"
						/>
						<div className="flex-1 space-y-2">
							<p className="text-xs text-gray-500">
								Main product image. JPG, PNG, WebP supported. Max 5MB.
							</p>
							{coverImagePreview && (
								<Button variant="secondary" size="sm" type="button" onClick={removeImage} icon={<FiX className="w-3.5 h-3.5" />}>
									Remove Image
								</Button>
							)}
							{isUploading && (
								<div className="space-y-1">
									<div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
										<motion.div 
											className="bg-linear-to-r from-indigo-500 to-purple-500 h-full rounded-full"
											initial={{ width: 0 }}
											animate={{ width: `${uploadProgress}%` }}
										/>
									</div>
									<p className="text-xs text-gray-500">{uploadProgress}% uploaded</p>
								</div>
							)}
							{formErrors.image && (
								<p className="text-xs text-rose-500 flex items-center gap-1">
									<FiAlertCircle className="w-3.5 h-3.5" /> {formErrors.image}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Additional Images Upload */}
				<div>
					<div className="flex items-center justify-between mb-2">
						<label className="block text-sm font-semibold text-gray-700">Additional Images</label>
						<span className="text-xs text-gray-500">
							{additionalImages.length}/10 images
						</span>
					</div>
					<div className="space-y-3">
						{/* Image Grid */}
						{additionalImages.length > 0 && (
							<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
								{additionalImages.map((image, index) => (
									<div key={index} className="relative group">
										<div className={`w-full aspect-square rounded-xl border-2 overflow-hidden transition-all ${
											image.isUploading ? 'border-amber-300 bg-amber-50' :
											image.uploaded ? 'border-emerald-300 bg-emerald-50' :
											'border-gray-200 bg-gray-50 hover:border-indigo-300'
										}`}>
											{image.preview && (
												<img 
													src={image.preview} 
													alt={`Additional ${index + 1}`}
													className="w-full h-full object-cover"
													crossOrigin="anonymous"
												/>
											)}
											
											{/* Upload Progress Overlay */}
											{image.isUploading && (
												<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
													<div className="text-center">
														<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
														<span className="text-white text-xs font-medium">{image.uploadProgress}%</span>
													</div>
												</div>
											)}
											
											{/* Upload Button Overlay */}
											{!image.isUploading && !image.uploaded && (
												<div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
													<Button 
														size="sm" 
														variant="secondary"
														onClick={() => uploadAdditionalImage(index)}
														className="text-xs px-2 py-1"
													>
														Upload
													</Button>
												</div>
											)}
											
											{/* Success Checkmark */}
											{image.uploaded && (
												<div className="absolute top-1 right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
													<FiCheck className="w-3 h-3 text-white" />
												</div>
											)}
										</div>
										
										{/* Remove Button */}
										<button
											onClick={() => removeAdditionalImage(index)}
											className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors shadow-lg"
										>
											<FiX className="w-3 h-3" />
										</button>
									</div>
								))}
							</div>
						)}
						
						{/* Add Images Button */}
						{additionalImages.length < 10 && (
							<div>
								<input
									type="file"
									accept="image/*"
									onChange={handleAdditionalImagesSelect}
									multiple
									className="hidden"
									id="additional-images-input"
								/>
								<label 
									htmlFor="additional-images-input"
									className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
								>
									<FiUpload className="w-5 h-5 text-gray-400" />
									<span className="text-gray-600 font-medium">
										Add Images ({10 - additionalImages.length} slots remaining)
									</span>
								</label>
								<p className="text-xs text-gray-500 mt-1 text-center">
									Select multiple images. JPG, PNG, WebP supported. Max 5MB each.
								</p>
							</div>
						)}
						
						{/* Error Message */}
						{formErrors.additionalImages && (
							<p className="text-xs text-rose-500 flex items-center gap-1">
								<FiAlertCircle className="w-3.5 h-3.5" /> {formErrors.additionalImages}
							</p>
						)}
					</div>
				</div>

				{/* Product Name */}
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
					<Input
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Enter product name"
						required
					/>
					{formErrors.name && <p className="text-xs text-rose-500 mt-1">{formErrors.name}</p>}
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Describe your product in detail..."
						rows={3}
						className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
						required
					/>
					{formErrors.description && <p className="text-xs text-rose-500 mt-1">{formErrors.description}</p>}
				</div>

				{/* Price & Stock */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-1">Price ($) *</label>
						<Input
							type="number"
							name="price"
							value={formData.price}
							onChange={handleChange}
							placeholder="0.00"
							min="0"
							step="0.01"
							required
						/>
						{formErrors.price && <p className="text-xs text-rose-500 mt-1">{formErrors.price}</p>}
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity *</label>
						<Input
							type="number"
							name="countInStock"
							value={formData.countInStock}
							onChange={handleChange}
							placeholder="0"
							min="0"
							required
						/>
					</div>
				</div>

				{/* Brand Selection */}
				<div>
					<Select
						label="Brand *"
						value={formData.brandId}
						onChange={(val) => handleSelectChange('brandId', val)}
						options={[
							{ value: '', label: 'Select brand...' },
							...brandOptions
						]}
						loading={brandsLoading}
					/>
					{formErrors.brandId && <p className="text-xs text-rose-500 mt-1">{formErrors.brandId}</p>}
				</div>

				{/* Category Selection */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Select
							label="Primary Category *"
							value={formData.primaryCategory}
							onChange={(val) => handleSelectChange('primaryCategory', val)}
							options={[
								{ value: '', label: 'Select primary category...' },
								...categoryOptions
							]}
							loading={categoriesLoading}
						/>
						{formErrors.primaryCategory && <p className="text-xs text-rose-500 mt-1">{formErrors.primaryCategory}</p>}
					</div>
					<div>
						<Select
							label="Sub Category"
							value={formData.subCategory}
							onChange={(val) => handleSelectChange('subCategory', val)}
							options={[
								{ value: '', label: 'Select sub category (optional)...' },
								...subCategoryOptions
							]}
							disabled={!formData.primaryCategory}
							loading={categoriesLoading}
						/>
					</div>
				</div>

				{/* Status */}
				<Select
					label="Product Status"
					value={formData.status}
					onChange={(val) => handleSelectChange('status', val)}
					options={statusOptions}
				/>

				{/* Actions */}
				<div className="flex gap-3 pt-4 border-t border-gray-100">
					<Button variant="secondary" type="button" onClick={onClose} fullWidth>
						Cancel
					</Button>
					<Button 
						type="submit" 
						loading={isLoading || isUploading} 
						fullWidth
						icon={isEditing ? <FiCheck className="w-4 h-4" /> : <FiImage className="w-4 h-4" />}
					>
						{isEditing ? 'Update Product' : 'Add Product'}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default ProductFormModal;
