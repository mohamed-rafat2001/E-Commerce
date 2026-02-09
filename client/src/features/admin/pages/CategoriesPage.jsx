import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	PlusIcon, 
	SearchIcon, 
	EditIcon, 
	TrashIcon 
} from '../../../shared/constants/icons.jsx';
import { Button, Modal, Input, LoadingSpinner, Badge } from '../../../shared/ui/index.js';
import { 
	useAdminCategories, 
	useCreateCategory, 
	useUpdateCategory, 
	useDeleteCategory 
} from '../hooks/index.js';
import { FiImage, FiSettings, FiCheckCircle, FiXCircle, FiUploadCloud, FiX, FiCheck } from 'react-icons/fi';
import { uploadSingleImage } from '../../../shared/services/uploadService.js';
import { toast } from 'react-hot-toast';

const CategoryModal = ({ isOpen, onClose, category, onSubmit, isLoading }) => {
	const [formData, setFormData] = useState({
		name: category?.name || '',
		description: category?.description || '',
		isActive: category?.isActive !== undefined ? category.isActive : true,
		coverImage: category?.coverImage || { public_id: '', secure_url: '' }
	});

	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const fileInputRef = useRef(null);

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Basic validation
		if (!file.type.startsWith('image/')) {
			return toast.error("Please select a valid image file");
		}

		try {
			setUploading(true);
			setUploadProgress(0);
			
			const response = await uploadSingleImage(file, (progress) => {
				setUploadProgress(progress);
			});

			if (response.status === 'success') {
				setFormData(prev => ({
					...prev,
					coverImage: {
						public_id: response.data.public_id,
						secure_url: response.data.secure_url
					}
				}));
				toast.success("Image uploaded successfully!");
			}
		} catch (error) {
			toast.error("Failed to upload image. Please try again.");
			console.error("Upload error:", error);
		} finally {
			setUploading(false);
			setUploadProgress(0);
		}
	};

	const removeImage = () => {
		setFormData(prev => ({
			...prev,
			coverImage: { public_id: '', secure_url: '' }
		}));
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (uploading) return toast.error("Please wait for the image to finish uploading");
		onSubmit(formData);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={category ? "Edit Category" : "Add Category"}
			size="md"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 group hover:border-indigo-300 transition-colors relative transition-all duration-300 min-h-[160px]">
					{formData.coverImage.secure_url ? (
						<div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
							<img 
								src={formData.coverImage.secure_url} 
								alt="Preview" 
								className="w-full h-full object-cover"
							/>
							<button
								type="button"
								onClick={removeImage}
								className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-colors z-10"
							>
								<FiX className="w-4 h-4" />
							</button>
						</div>
					) : (
						<div 
							onClick={() => fileInputRef.current?.click()}
							className="flex flex-col items-center cursor-pointer text-gray-500 group-hover:text-indigo-600 transition-colors"
						>
							<div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:shadow-indigo-100 transition-all">
								<FiUploadCloud className="w-6 h-6" />
							</div>
							<p className="text-sm font-semibold">Click to upload image</p>
							<p className="text-xs text-gray-400 mt-1">PNG, JPG or WebP up to 5MB</p>
						</div>
					)}

					<input 
						ref={fileInputRef}
						type="file" 
						className="hidden" 
						accept="image/*"
						onChange={handleFileChange}
						disabled={uploading}
					/>

					{/* Upload Progress Overlay */}
					{uploading && (
						<div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20 transition-all">
							<div className="w-2/3 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
								<motion.div 
									className="h-full bg-indigo-500"
									initial={{ width: 0 }}
									animate={{ width: `${uploadProgress}%` }}
								/>
							</div>
							<p className="text-sm font-bold text-indigo-600">Uploading {uploadProgress}%</p>
						</div>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
					<Input
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="e.g. Electronics"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
					<textarea
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						placeholder="Briefly describe this category..."
						className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white min-h-[100px]"
					/>
				</div>

				<div className="flex items-center gap-2 pt-2">
					<input
						type="checkbox"
						id="isActive"
						checked={formData.isActive}
						onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
						className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
					/>
					<label htmlFor="isActive" className="text-sm font-medium text-gray-700">
						Mark as active category
					</label>
				</div>
				
				<div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
					<Button variant="secondary" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" loading={isLoading || uploading}>
						{category ? "Update Category" : "Create Category"}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

const DeleteConfirmModal = ({ isOpen, onClose, category, onConfirm, isLoading }) => {
	if (!category) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Confirm Deletion"
			size="sm"
		>
			<div className="text-center space-y-6">
				<div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
					<TrashIcon className="w-10 h-10" />
				</div>
				
				<div className="space-y-2">
					<h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
					<p className="text-gray-500 text-sm leading-relaxed px-4">
						You are about to delete <span className="font-bold text-gray-900">"{category.name}"</span>. 
						This action cannot be undone and may affect associated products.
					</p>
				</div>

				<div className="flex gap-3 pt-4">
					<Button 
						variant="secondary" 
						onClick={onClose} 
						fullWidth
						disabled={isLoading}
					>
						No, Keep it
					</Button>
					<Button 
						variant="primary" 
						className="bg-rose-500 hover:bg-rose-600 border-rose-600 shadow-rose-200"
						onClick={onConfirm} 
						fullWidth
						loading={isLoading}
					>
						Yes, Delete
					</Button>
				</div>
			</div>
		</Modal>
	);
};

const CategoriesPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const [categoryToDelete, setCategoryToDelete] = useState(null);

	// Real Hooks
	const { categories, isLoading: isFetching } = useAdminCategories();
	const { addCategory, isCreating } = useCreateCategory();
	const { editCategory, isUpdating } = useUpdateCategory();
	const { removeCategory, isDeleting } = useDeleteCategory();

	const filteredCategories = useMemo(() => {
		return categories.filter(cat => 
			cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [categories, searchQuery]);

	const handleAdd = () => {
		setEditingCategory(null);
		setIsModalOpen(true);
	};

	const handleEdit = (category) => {
		setEditingCategory(category);
		setIsModalOpen(true);
	};

	const handleDeletePrompt = (category) => {
		setCategoryToDelete(category);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = () => {
		if (categoryToDelete) {
			removeCategory(categoryToDelete._id, {
				onSuccess: () => {
					setIsDeleteModalOpen(false);
					setCategoryToDelete(null);
				}
			});
		}
	};

	const handleSubmit = (data) => {
		if(editingCategory) {
			editCategory({ id: editingCategory._id, data }, {
				onSuccess: () => setIsModalOpen(false)
			});
		} else {
			addCategory(data, {
				onSuccess: () => setIsModalOpen(false)
			});
		}
	};

	const handleToggleStatus = (category) => {
		editCategory({ 
			id: category._id, 
			data: { isActive: !category.isActive } 
		});
	};

	if (isFetching) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<LoadingSpinner size="lg" message="Loading categories..." />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Categories 📂</h1>
					<p className="text-gray-500 mt-1">Manage product classification and hierarchy</p>
				</div>
				<Button onClick={handleAdd} icon={<PlusIcon />}>
					Add New Category
				</Button>
			</div>

			{/* Filters & Actions */}
			<div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
				<div className="relative flex-1 w-full">
					<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search categories by name or description..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
					/>
				</div>
				<div className="flex gap-2 text-nowrap">
					<div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold border border-indigo-100">
						{categories.length} Total
					</div>
					<div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-100 text-nowrap">
						{categories.filter(c => c.isActive).length} Active
					</div>
				</div>
			</div>

			{/* Grid */}
			{filteredCategories.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
					<AnimatePresence mode="popLayout">
						{filteredCategories.map((category) => (
							<motion.div
								key={category._id}
								layout
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								whileHover={{ y: -8 }}
								className="group relative h-[380px] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-700 cursor-pointer"
							>
								{/* Background Image/Gradient */}
								{category.coverImage?.secure_url ? (
									<>
										<img 
											src={category.coverImage.secure_url} 
											alt="" 
											className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
									</>
								) : (
									<div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">
										<div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
										<div className="absolute inset-0 flex items-center justify-center opacity-10">
											<span className="text-[12rem] font-black text-white select-none">
												{category.name[0]}
											</span>
										</div>
									</div>
								)}

								{/* Header: Status & Actions (Top aligned) */}
								<div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
									<button 
										onClick={() => handleToggleStatus(category)}
										className="cursor-pointer"
									>
										<Badge 
											variant={category.isActive ? 'success' : 'secondary'}
											className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-black ${
												category.isActive 
												? 'bg-emerald-500/90 text-white border-none backdrop-blur-md' 
												: 'bg-white/20 text-white border-white/20 backdrop-blur-md'
											}`}
										>
											{category.isActive ? 'Active' : 'Draft'}
										</Badge>
									</button>
									
									<div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-out">
										<button 
											onClick={() => handleEdit(category)}
											className="w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
											title="Edit"
										>
											<EditIcon className="w-5 h-5" />
										</button>
										<button 
											onClick={() => handleDeletePrompt(category)}
											className="w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-rose-500 hover:border-rose-500 transition-all duration-300"
											title="Delete"
											disabled={isDeleting}
										>
											<TrashIcon className="w-5 h-5" />
										</button>
									</div>
								</div>

								{/* Main Content (Bottom aligned) */}
								<div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
									<div className="space-y-4">
										<div>
											<h3 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-indigo-300 transition-colors drop-shadow-lg">
												{category.name}
											</h3>
											<p className="text-sm text-gray-300 font-medium leading-relaxed line-clamp-2 mt-2 drop-shadow-md">
												{category.description || "Explore our premium collection of products curated just for your lifestyle."}
											</p>
										</div>

										<div className="pt-6 border-t border-white/10 flex items-center gap-8">
											<div className="space-y-1">
												<p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Inventory</p>
												<div className="flex items-center gap-2">
													<div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
													<p className="text-lg font-black text-white">240</p>
												</div>
											</div>
											<div className="space-y-1">
												<p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Engage</p>
												<div className="flex items-center gap-2">
													<div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
													<p className="text-lg font-black text-white">1.2k</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Glass Lens Flare Effect */}
								<div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			) : (
				<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
					<div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
						<SearchIcon className="w-12 h-12 text-gray-300" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No categories found</h3>
					<p className="text-gray-500 max-w-sm mx-auto">
						{searchQuery ? `We couldn't find anything matching "${searchQuery}"` : "Get started by creating your first product category!"}
					</p>
					{searchQuery && (
						<Button variant="ghost" className="mt-4" onClick={() => setSearchQuery('')}>
							Clear Search
						</Button>
					)}
				</div>
			)}

			{isModalOpen && (
				<CategoryModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					category={editingCategory}
					onSubmit={handleSubmit}
					isLoading={editingCategory ? isUpdating : isCreating}
				/>
			)}

			{isDeleteModalOpen && (
				<DeleteConfirmModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					category={categoryToDelete}
					onConfirm={handleConfirmDelete}
					isLoading={isDeleting}
				/>
			)}
		</div>
	);
};

export default CategoriesPage;
