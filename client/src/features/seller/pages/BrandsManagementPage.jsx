import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Select, LoadingSpinner, Badge, Modal } from '../../../shared/ui/index.js';
import { 
	FiPlus, FiEdit2, FiTrash2, FiImage, FiGlobe, FiHash, FiCamera, FiSave, FiX, FiCheck
} from 'react-icons/fi';
import useCategories from '../../category/hooks/useCategories.js';

// Brand Card Component
const BrandCard = ({ brand, onEdit, onDelete, onLogoEdit }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
	>
		<div className="flex items-start gap-5">
			<div className="relative group">
				{brand.logo?.secure_url ? (
					<img 
						src={brand.logo.secure_url} 
						alt={brand.name} 
						className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 shadow-sm"
						crossOrigin="anonymous"
					/>
				) : (
					<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
						{brand.name?.[0]?.toUpperCase() || 'B'}
					</div>
				)}
				<button
					onClick={() => onLogoEdit(brand)}
					className="absolute inset-0 w-full h-full rounded-xl bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
				>
					<FiCamera className="w-5 h-5 text-white" />
				</button>
			</div>
			
			<div className="flex-1">
				<div className="flex items-start justify-between">
					<div>
						<h4 className="text-lg font-bold text-gray-900">{brand.name}</h4>
						<p className="text-gray-500 mt-1 text-sm leading-relaxed">{brand.description}</p>
					</div>
					<Badge variant={brand.isActive ? "success" : "secondary"} size="sm">
						{brand.isActive ? "Active" : "Inactive"}
					</Badge>
				</div>
				
				<div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600">
					{brand.website && (
						<span className="flex items-center gap-1.5">
							<FiGlobe className="w-4 h-4 text-gray-400" />
							<a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
								{brand.website}
							</a>
						</span>
					)}
					{brand.primaryCategory && (
						<span className="flex items-center gap-1.5">
							<FiHash className="w-4 h-4 text-gray-400" />
							{brand.primaryCategory.name}
						</span>
					)}
				</div>
				
				{brand.subCategories && brand.subCategories.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-3">
						{brand.subCategories.map((subCat, index) => (
							<span 
								key={subCat._id || index} 
								className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
							>
								{subCat.name}
							</span>
						))}
					</div>
				)}
			</div>
			
			<div className="flex flex-col gap-2">
				<Button 
					variant="secondary" 
					size="sm" 
					onClick={() => onEdit(brand)}
					icon={<FiEdit2 className="w-4 h-4" />}
				>
					Edit
				</Button>
				<Button 
					variant="danger" 
					size="sm" 
					onClick={() => onDelete(brand._id)}
					icon={<FiTrash2 className="w-4 h-4" />}
				>
					Delete
				</Button>
			</div>
		</div>
	</motion.div>
);

// Brand Form Modal
const BrandFormModal = ({ isOpen, onClose, onSubmit, brand, categories, isSubmitting }) => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		website: '',
		primaryCategory: '',
		subCategories: []
	});
	const fileInputRef = useRef(null);
	
	useEffect(() => {
		if (brand) {
			setFormData({
				name: brand.name || '',
				description: brand.description || '',
				website: brand.website || '',
				primaryCategory: brand.primaryCategory?._id || '',
				subCategories: brand.subCategories?.map(cat => cat._id) || []
			});
		} else {
			setFormData({
				name: '',
				description: '',
				website: '',
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

// Logo Edit Modal
const LogoEditModal = ({ isOpen, onClose, onUpload, brand, isUploading }) => {
	const fileInputRef = useRef(null);
	
	const handleFileChange = (e) => {
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
		
		onUpload(file, brand._id);
	};
	
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Update Brand Logo" size="sm">
			<div className="space-y-4">
				<div className="text-center">
					{brand?.logo?.secure_url ? (
						<img 
							src={brand.logo.secure_url} 
							alt={brand.name} 
							className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 mx-auto mb-4"
							crossOrigin="anonymous"
						/>
					) : (
						<div className="w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
							{brand?.name?.[0]?.toUpperCase() || 'B'}
						</div>
					)}
					<p className="text-sm text-gray-600">Current logo</p>
				</div>
				
				<div className="flex gap-3">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						accept="image/*"
						className="hidden"
					/>
					<Button 
						variant="secondary" 
						fullWidth
						onClick={() => fileInputRef.current?.click()}
					>
						Choose New Logo
					</Button>
					<Button 
						variant="secondary" 
						fullWidth
						onClick={onClose}
					>
						Cancel
					</Button>
				</div>
				<p className="text-xs text-gray-500 text-center">Maximum file size: 5MB. Supported formats: JPG, PNG, WebP</p>
			</div>
		</Modal>
	);
};

const BrandsManagementPage = () => {
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const { categories } = useCategories();
	
	// Fetch brands
	useEffect(() => {
		fetchBrands();
	}, []);
	
	const fetchBrands = async () => {
		try {
			const response = await fetch('/api/v1/brands', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			
			if (response.ok) {
				const data = await response.json();
				setBrands(data.data || []);
			}
		} catch (error) {
			console.error('Error fetching brands:', error);
		} finally {
			setLoading(false);
		}
	};
	
	const handleCreateBrand = () => {
		setSelectedBrand(null);
		setIsFormModalOpen(true);
	};
	
	const handleEditBrand = (brand) => {
		setSelectedBrand(brand);
		setIsFormModalOpen(true);
	};
	
	const handleDeleteBrand = async (brandId) => {
		if (!window.confirm('Are you sure you want to delete this brand?')) return;
		
		try {
			const response = await fetch(`/api/v1/brands/${brandId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			
			if (response.ok) {
				fetchBrands();
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to delete brand');
			}
		} catch (error) {
			console.error('Error deleting brand:', error);
			alert('Failed to delete brand');
		}
	};
	
	const handleSubmitBrand = async (formData, brandId) => {
		setIsSubmitting(true);
		
		try {
			const method = brandId ? 'PATCH' : 'POST';
			const url = brandId ? `/api/v1/brands/${brandId}` : '/api/v1/brands';
			
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify(formData)
			});
			
			if (response.ok) {
				setIsFormModalOpen(false);
				fetchBrands();
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to save brand');
			}
		} catch (error) {
			console.error('Error saving brand:', error);
			alert('Failed to save brand');
		} finally {
			setIsSubmitting(false);
		}
	};
	
	const handleLogoEdit = (brand) => {
		setSelectedBrand(brand);
		setIsLogoModalOpen(true);
	};
	
	const handleUploadLogo = async (file, brandId) => {
		setIsUploading(true);
		
		const formData = new FormData();
		formData.append('logo', file);
		
		try {
			const response = await fetch(`/api/v1/brands/${brandId}/logo`, {
				method: 'PATCH',
				body: formData,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			
			if (response.ok) {
				setIsLogoModalOpen(false);
				fetchBrands();
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to update logo');
			}
		} catch (error) {
			console.error('Error updating logo:', error);
			alert('Failed to update logo');
		} finally {
			setIsUploading(false);
		}
	};
	
	if (loading) {
		return (
			<div className="flex justify-center items-center py-20">
				<LoadingSpinner />
			</div>
		);
	}
	
	return (
		<div className="space-y-6 pb-10">
			{/* Page Header */}
			<motion.div 
				initial={{ opacity: 0, y: -20 }} 
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
			>
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Brand Management 🏷️</h1>
					<p className="text-gray-500 font-medium mt-1">Manage your brand portfolio and settings.</p>
				</div>
				<Button 
					onClick={handleCreateBrand}
					icon={<FiPlus className="w-4 h-4" />}
				>
					Add New Brand
				</Button>
			</motion.div>
			
			{/* Brands Grid */}
			{brands.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{brands.map((brand) => (
						<BrandCard
							key={brand._id}
							brand={brand}
							onEdit={handleEditBrand}
							onDelete={handleDeleteBrand}
							onLogoEdit={handleLogoEdit}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
					<FiImage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
					<h3 className="text-xl font-bold text-gray-900 mb-2">No brands yet</h3>
					<p className="text-gray-500 mb-6">Create your first brand to get started</p>
					<Button 
						onClick={handleCreateBrand}
						icon={<FiPlus className="w-4 h-4" />}
					>
						Create Your First Brand
					</Button>
				</div>
			)}
			
			{/* Modals */}
			<BrandFormModal
				isOpen={isFormModalOpen}
				onClose={() => setIsFormModalOpen(false)}
				onSubmit={handleSubmitBrand}
				brand={selectedBrand}
				categories={categories}
				isSubmitting={isSubmitting}
			/>
			
			<LogoEditModal
				isOpen={isLogoModalOpen}
				onClose={() => setIsLogoModalOpen(false)}
				onUpload={handleUploadLogo}
				brand={selectedBrand}
				isUploading={isUploading}
			/>
		</div>
	);
};

export default BrandsManagementPage;