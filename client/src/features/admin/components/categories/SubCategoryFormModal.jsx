import { useState, useRef, useEffect } from 'react';
import { Button, Input, Textarea, Select, LoadingSpinner } from '../../../../shared/ui/index.js';
import { PlusIcon, ImageIcon, XIcon } from '../../../../shared/constants/icons.jsx';

const SubCategoryFormModal = ({ isOpen, onClose, onSubmit, subCategory, isLoading, categories = [] }) => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		categoryId: '',
	});
	const [imagePreview, setImagePreview] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);
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
		<div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
			{/* Backdrop */}
			<div 
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			
			{/* Modal */}
			<div className="absolute inset-0 flex items-center justify-center p-4">
				<div 
					className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-100">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								{subCategory ? 'Edit Subcategory' : 'Create New Subcategory'}
							</h2>
							<p className="text-gray-500 mt-1">
								{subCategory ? 'Update subcategory details' : 'Add a new subcategory to organize products'}
							</p>
						</div>
						<button
							onClick={onClose}
							className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
						>
							<XIcon className="w-5 h-5 text-gray-500" />
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
						<div className="space-y-6">
							{/* Image Upload */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Subcategory Image
								</label>
								<div className="flex items-start gap-6">
									{/* Image Preview */}
									<div className="flex-shrink-0">
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
						</div>
					</form>

					{/* Footer */}
					<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
						<Button
							type="button"
							variant="secondary"
							onClick={onClose}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							onClick={handleSubmit}
							disabled={!isValid || isLoading}
							loading={isLoading}
						>
							{isLoading ? 'Saving...' : (subCategory ? 'Update Subcategory' : 'Create Subcategory')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubCategoryFormModal;