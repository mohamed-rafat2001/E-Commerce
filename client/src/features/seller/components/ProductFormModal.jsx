import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Modal, Input, Select } from '../../../shared/ui/index.js';
import { FiImage, FiUpload, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import useCategories from '../../category/hooks/useCategories.js';
import mainApi from '../../../api/mainApi.js';

const statusOptions = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'archived', label: 'Archived' },
];

const ProductFormModal = ({ isOpen, onClose, product = null, onSubmit, isLoading }) => {
	const isEditing = !!product;
	const { categories, isLoading: categoriesLoading } = useCategories();
	const fileInputRef = useRef(null);
	
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		brand: '',
		category: '',
		countInStock: 0,
		status: 'draft',
	});

	const [coverImagePreview, setCoverImagePreview] = useState(null);
	const [coverImageFile, setCoverImageFile] = useState(null);
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
				brand: product?.brand || '',
				category: product?.category?._id || '',
				countInStock: product?.countInStock || 0,
				status: product?.status || 'draft',
			});
			setCoverImagePreview(product?.coverImage?.secure_url || null);
			setCoverImageFile(null);
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
		if (!formData.brand.trim()) errors.brand = 'Brand is required';
		if (!formData.category) errors.category = 'Category is required';
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		let coverImage = undefined;

		// Upload image if new file selected
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
			} catch (err) {
				setIsUploading(false);
				setFormErrors(prev => ({ ...prev, image: 'Failed to upload image. Try again.' }));
				return;
			}
		}

		const submitData = {
			...formData,
			price: { amount: parseFloat(formData.price), currency: 'USD' },
		};

		if (coverImage) {
			submitData.coverImage = coverImage;
		}

		onSubmit(submitData);
	};

	const categoryOptions = (categories || []).map(c => ({
		value: c._id,
		label: c.name,
	}));

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title={isEditing ? 'Edit Product' : 'Add New Product'}
			size="lg"
		>
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Cover Image Upload */}
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
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
								Drag and drop or click to upload. JPG, PNG, WebP supported. Max 5MB.
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
											className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
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

				{/* Brand & Category */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-1">Brand *</label>
						<Input
							name="brand"
							value={formData.brand}
							onChange={handleChange}
							placeholder="Brand name"
							required
						/>
						{formErrors.brand && <p className="text-xs text-rose-500 mt-1">{formErrors.brand}</p>}
					</div>
					<div>
						<Select
							label="Category *"
							value={formData.category}
							onChange={(val) => handleSelectChange('category', val)}
							options={[
								{ value: '', label: 'Select category...' },
								...categoryOptions
							]}
						/>
						{formErrors.category && <p className="text-xs text-rose-500 mt-1">{formErrors.category}</p>}
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
