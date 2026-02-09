import { useState, useMemo } from 'react';
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
import { FiImage, FiSettings, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const CategoryModal = ({ isOpen, onClose, category, onSubmit, isLoading }) => {
	const [formData, setFormData] = useState({
		name: category?.name || '',
		description: category?.description || '',
		isActive: category?.isActive !== undefined ? category.isActive : true,
		coverImage: {
			secure_url: category?.coverImage?.secure_url || ''
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
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

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
					<Input
						value={formData.coverImage.secure_url}
						onChange={(e) => setFormData({ 
							...formData, 
							coverImage: { ...formData.coverImage, secure_url: e.target.value } 
						})}
						placeholder="https://example.com/image.jpg"
						icon={<FiImage />}
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
					<Button type="submit" loading={isLoading}>
						{category ? "Update Category" : "Create Category"}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

const CategoriesPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);

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

	const handleDelete = (id) => {
		if(window.confirm('Delete this category? All products in this category might become uncategorized.')) {
			removeCategory(id);
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
				<div className="flex gap-2">
					<div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold border border-indigo-100">
						{categories.length} Total
					</div>
					<div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-100">
						{categories.filter(c => c.isActive).length} Active
					</div>
				</div>
			</div>

			{/* Grid */}
			{filteredCategories.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					<AnimatePresence mode="popLayout">
						{filteredCategories.map((category) => (
							<motion.div
								key={category._id}
								layout
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all group relative overflow-hidden"
							>
								{/* Card Actions Overlay */}
								<div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
									<button 
										onClick={() => handleEdit(category)}
										className="p-2 bg-white/90 backdrop-blur shadow-md hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 rounded-xl transition-all transform hover:scale-110"
										title="Edit Category"
									>
										<EditIcon className="w-4 h-4" />
									</button>
									<button 
										onClick={() => handleDelete(category._id)}
										className="p-2 bg-white/90 backdrop-blur shadow-md hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-xl transition-all transform hover:scale-110"
										title="Delete Category"
										disabled={isDeleting}
									>
										<TrashIcon className="w-4 h-4" />
									</button>
								</div>

								{/* Category Image/Icon */}
								<div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
									{category.coverImage?.secure_url ? (
										<img 
											src={category.coverImage.secure_url} 
											alt={category.name}
											className="w-full h-full object-cover transition-transform group-hover:scale-110"
										/>
									) : (
										<span className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
											{category.name[0]}
										</span>
									)}
								</div>
								
								<h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
									{category.name}
								</h3>
								<p className="text-gray-500 text-sm line-clamp-2 min-h-[40px] mb-4">
									{category.description || "No description provided for this category."}
								</p>
								
								<div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
									<button 
										onClick={() => handleToggleStatus(category)}
										className="cursor-pointer transition-transform hover:scale-105"
									>
										<Badge 
											variant={category.isActive ? 'success' : 'secondary'}
											dot={true}
											icon={category.isActive ? <FiCheckCircle /> : <FiXCircle />}
										>
											{category.isActive ? 'Active' : 'Inactive'}
										</Badge>
									</button>
									<span className="text-xs font-mono text-gray-400">ID: {category._id.substring(0, 8)}...</span>
								</div>

								{/* Hover Background Pattern */}
								<div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-20 transition-all blur-2xl" />
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
		</div>
	);
};

export default CategoriesPage;
