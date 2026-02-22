import { useState, useRef, useEffect } from 'react';
import { Button, Input, Textarea, Select, LoadingSpinner, Modal } from '../../../../shared/ui/index.js';
import { PlusIcon, ImageIcon, XIcon } from '../../../../shared/constants/icons.jsx';

const SubCategoryFormModal = ({ isOpen, onClose, subCategory, onSubmit, isLoading, categories, uploadProgress }) => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		categoryId: ''
	});
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const fileInputRef = useRef(null);

	useEffect(() => {
		if (subCategory) {
			setFormData({
				name: subCategory.name || '',
				description: subCategory.description || '',
				categoryId: subCategory.categoryId?._id || subCategory.categoryId || '',
			});
			setImagePreview(subCategory.image?.secure_url || null);
		} else {
			setFormData({
				name: '',
				description: '',
				categoryId: '',
			});
			setImagePreview(null);
			setSelectedImage(null);
		}
	}, [subCategory, isOpen]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			alert('Image size must be less than 5MB');
			return;
		}

		setSelectedImage(file);
		
		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveImage = () => {
		setImagePreview(null);
		setSelectedImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		const submitData = new FormData();
		submitData.append('name', formData.name);
		submitData.append('description', formData.description);
		submitData.append('categoryId', formData.categoryId);
		
		if (selectedImage) {
			submitData.append('image', selectedImage);
		}

		onSubmit(submitData, subCategory?._id);
	};

	const isValid = formData.name.trim() && formData.categoryId;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={subCategory ? 'Edit Subcategory' : 'Create New Subcategory'}
			size="sm"
			footer={
				<div className="flex w-full items-center justify-between">
					{uploadProgress > 0 && uploadProgress < 100 && (
						<div className="flex-1 mr-4">
							<div className="flex justify-between text-xs text-gray-500 mb-1">
								<span>Uploading image...</span>
								<span>{uploadProgress}%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-1.5">
								<div 
									className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
									style={{ width: `${uploadProgress}%` }}
								/>
							</div>
						</div>
					)}
					<div className="flex items-center gap-3 ml-auto">
						<Button variant="secondary" onClick={onClose} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" form="subcategory-form" disabled={!isValid || isLoading}>
							{isLoading ? (
								<div className="flex items-center gap-2">
									<LoadingSpinner size="sm" />
									<span>{subCategory ? 'Updating...' : 'Creating...'}</span>
								</div>
							) : (
								subCategory ? 'Update' : 'Create'
							)}
						</Button>
					</div>
				</div>
			}
		>
			<form id="subcategory-form" onSubmit={handleSubmit} className="space-y-6">
				{/* Image Upload */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-3">
						Subcategory Image
					</label>
					<div className="flex items-start gap-6">
						{/* Image Preview */}
						<div className="shrink-0">
							{imagePreview ? (
								<div className="relative">
									<img 
										src={imagePreview} 
										alt="Preview" 
										className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
									/>
									<button
										type="button"
										onClick={handleRemoveImage}
										className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
									>
										<XIcon className="w-3 h-3" />
									</button>
								</div>
							) : (
								<div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
									<ImageIcon className="w-8 h-8 text-gray-400" />
								</div>
							)}
						</div>
						
						{/* Upload Button */}
						<div className="flex-1">
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleImageChange}
								accept="image/*"
								className="hidden"
							/>
							<Button
								type="button"
								variant="secondary"
								onClick={() => fileInputRef.current?.click()}
								icon={<PlusIcon className="w-4 h-4" />}
							>
								{imagePreview ? 'Change Image' : 'Upload Image'}
							</Button>
							<p className="text-xs text-gray-500 mt-2">
								Recommended: 400x400px, Max 5MB. JPG, PNG, or WebP
							</p>
						</div>
					</div>
				</div>

				{/* Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Subcategory Name *
					</label>
					<Input
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Enter subcategory name"
						required
					/>
				</div>

				{/* Category */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Parent Category *
					</label>
					<Select
						value={formData.categoryId}
						onChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
						options={categories.map(cat => ({ 
							value: cat._id, 
							label: cat.name 
						}))}
						placeholder="Select parent category"
						required
					/>
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<Textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Describe this subcategory..."
						rows={3}
					/>
				</div>
			</form>
		</Modal>
	);
};

export default SubCategoryFormModal;