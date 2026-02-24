import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Select, Modal } from '../../../../shared/ui/index.js';
import { FiSave, FiImage, FiX } from 'react-icons/fi';

const BrandFormModal = ({ isOpen, onClose, onSubmit, brand, categories, isSubmitting }) => {
	const fileInputRef = useRef(null);
	const coverInputRef = useRef(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [coverPreview, setCoverPreview] = useState(null);
	const [logoFile, setLogoFile] = useState(null);
	const [coverFile, setCoverFile] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		website: '',
		businessEmail: '',
		businessPhone: '',
		primaryCategory: '',
		subCategories: []
	});
	
	useEffect(() => {
		if (brand) {
			setFormData({
				name: brand.name || '',
				description: brand.description || '',
				website: brand.website || '',
				businessEmail: brand.businessEmail || '',
				businessPhone: brand.businessPhone || '',
				primaryCategory: brand.primaryCategory?._id || '',
				subCategories: brand.subCategories?.map(cat => cat._id) || []
			});
			setImagePreview(brand.logo?.secure_url || null);
			setCoverPreview(brand.coverImage?.secure_url || null);
			setLogoFile(null);
			setCoverFile(null);
		} else {
			setFormData({
				name: '',
				description: '',
				website: '',
				businessEmail: '',
				businessPhone: '',
				primaryCategory: '',
				subCategories: []
			});
			setImagePreview(null);
			setCoverPreview(null);
			setLogoFile(null);
			setCoverFile(null);
		}
	}, [brand, isOpen]);
	
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setLogoFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setLogoFile(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};
	
	const handleCoverImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setCoverFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setCoverPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveCoverImage = () => {
		setCoverFile(null);
		setCoverPreview(null);
		if (coverInputRef.current) {
			coverInputRef.current.value = '';
		}
	};
	
	const handleSubCategoryToggle = (categoryId) => {
		setFormData(prev => ({
			...prev,
			subCategories: prev.subCategories.includes(categoryId)
				? prev.subCategories.filter(id => id !== categoryId)
				: [...prev.subCategories, categoryId]
		}));
	};
	
	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Create FormData for file upload
		const data = new FormData();
		data.append('name', formData.name);
		data.append('description', formData.description);
		data.append('website', formData.website);
		data.append('businessEmail', formData.businessEmail);
		data.append('businessPhone', formData.businessPhone);
		data.append('primaryCategory', formData.primaryCategory);
		
		formData.subCategories.forEach(cat => {
			data.append('subCategories', cat);
		});

		if (logoFile) {
			data.append('logo', logoFile);
		}

		if (coverFile) {
			data.append('coverImage', coverFile);
		}

		onSubmit(data, brand?._id);
	};
	
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={brand ? "Edit Brand" : "Create New Brand"} size="md">
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Image Upload Section */}
				<div className="flex gap-4 mb-6">
					{/* Logo Upload */}
					<div className="flex flex-col items-center flex-1">
						<label className="text-sm font-medium text-gray-700 mb-2">Brand Logo</label>
						<div className="relative w-32 h-32 mb-2">
							{imagePreview ? (
								<div className="relative w-full h-full">
									<img 
										src={imagePreview} 
										alt="Preview" 
										className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
									/>
									<button
										type="button"
										onClick={handleRemoveImage}
										className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
									>
										<FiX className="w-4 h-4" />
									</button>
								</div>
							) : (
								<div 
									onClick={() => fileInputRef.current?.click()}
									className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
								>
									<FiImage className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 mb-2 transition-colors" />
									<span className="text-xs text-gray-500 group-hover:text-indigo-600 font-medium">Upload Logo</span>
								</div>
							)}
							<input 
								type="file" 
								ref={fileInputRef}
								onChange={handleImageChange}
								accept="image/*"
								className="hidden"
							/>
						</div>
						<p className="text-xs text-gray-400">500x500px, Max 5MB</p>
					</div>

					{/* Cover Image Upload */}
					<div className="flex flex-col items-center flex-1">
						<label className="text-sm font-medium text-gray-700 mb-2">Cover Image (Optional)</label>
						<div className="relative w-full h-32 mb-2">
							{coverPreview ? (
								<div className="relative w-full h-full">
									<img 
										src={coverPreview} 
										alt="Cover Preview" 
										className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
									/>
									<button
										type="button"
										onClick={handleRemoveCoverImage}
										className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
									>
										<FiX className="w-4 h-4" />
									</button>
								</div>
							) : (
								<div 
									onClick={() => coverInputRef.current?.click()}
									className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
								>
									<FiImage className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 mb-2 transition-colors" />
									<span className="text-xs text-gray-500 group-hover:text-indigo-600 font-medium">Upload Cover</span>
								</div>
							)}
							<input 
								type="file" 
								ref={coverInputRef}
								onChange={handleCoverImageChange}
								accept="image/*"
								className="hidden"
							/>
						</div>
						<p className="text-xs text-gray-400">1200x400px, Max 5MB</p>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
					<Input 
						name="name" 
						value={formData.name} 
						onChange={handleChange} 
						placeholder="Enter brand name" 
						required 
					/>
				</div>
				
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Describe your brand..."
						rows={3}
						className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
						required
					/>
				</div>
				
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Business Email *</label>
					<Input 
						name="businessEmail" 
						value={formData.businessEmail} 
						onChange={handleChange} 
						placeholder="contact@brand.com" 
						type="email"
						required 
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Business Phone *</label>
					<Input 
						name="businessPhone" 
						value={formData.businessPhone} 
						onChange={handleChange} 
						placeholder="+1 (555) 000-0000" 
						type="tel"
						required 
					/>
				</div>
				
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
					<Input 
						name="website" 
						value={formData.website} 
						onChange={handleChange} 
						placeholder="https://yourbrand.com" 
						type="url"
					/>
				</div>
				
				{categories && (
					<Select
						label="Primary Category"
						value={formData.primaryCategory}
						onChange={(val) => setFormData(prev => ({ ...prev, primaryCategory: val }))}
						options={categories.map(c => ({ value: c._id, label: c.name }))}
					/>
				)}
				
				{categories && (
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Sub Categories <span className="text-gray-400 font-normal">(Select multiple)</span>
						</label>
						<div className="border border-gray-300 rounded-xl p-3 bg-white">
							<div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
								{categories
									.filter(cat => cat._id !== formData.primaryCategory)
									.map(category => (
										<label 
											key={category._id} 
											className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
										>
											<input
												type="checkbox"
												checked={formData.subCategories.includes(category._id)}
												onChange={() => handleSubCategoryToggle(category._id)}
												className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
											/>
											<span className="text-sm text-gray-700">{category.name}</span>
										</label>
									))
								}
							</div>
							{formData.subCategories.length === 0 && (
								<p className="text-sm text-gray-400 text-center py-2">
									No subcategories selected
								</p>
							)}
						</div>
					</div>
				)}
				
				<div className="flex gap-3 pt-4">
					<Button variant="secondary" type="button" onClick={onClose} fullWidth>Cancel</Button>
					<Button type="submit" loading={isSubmitting} fullWidth icon={<FiSave className="w-4 h-4" />}>
						{brand ? "Update Brand" : "Create Brand"}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default BrandFormModal;
