import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Modal } from '../../../../shared/ui/index.js';
import { FiSave } from 'react-icons/fi';

const BrandFormModal = ({ isOpen, onClose, onSubmit, brand, categories, isSubmitting }) => {
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
		}
	}, [brand, isOpen]);
	
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
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
		onSubmit(formData, brand?._id);
	};
	
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={brand ? "Edit Brand" : "Create New Brand"} size="md">
			<form onSubmit={handleSubmit} className="space-y-4">
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
