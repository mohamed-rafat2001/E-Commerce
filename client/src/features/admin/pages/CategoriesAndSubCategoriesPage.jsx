import { useMemo, useState, useEffect } from 'react';
import { Button, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { PlusIcon, SearchIcon, CategoryIcon, TagIcon } from '../../../shared/constants/icons.jsx';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/index.js';
import { useAdminSubCategories, useCreateSubCategory, useUpdateSubCategory, useDeleteSubCategory } from '../../subCategory/hooks/index.js';
import AdminStatCard from '../components/AdminStatCard.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import CategoryFormModal from '../components/categories/CategoryFormModal.jsx';
import SubCategoryFormModal from '../components/categories/SubCategoryFormModal.jsx';
import CategoryRow from '../components/categories/CategoryRow.jsx';

const CategoriesAndSubCategoriesPage = () => {
	// State for filters and pagination
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	
	// Modal and selection state
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedSubCategory, setSelectedSubCategory] = useState(null);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState(null);
	const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
	
	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
			setPage(1); // Reset to page 1 on search
		}, 500);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Fetch Data
	const { categories, total, isLoading: isCategoriesLoading } = useAdminCategories({
		page,
		limit,
		search: debouncedSearch,
		sort: '-createdAt', // Default sort
		populate: 'productCount'
	});

	// Fetch all categories for the dropdown in subcategory modal
	const { categories: allCategories } = useAdminCategories({
		limit: 1000,
		sort: 'name'
	});

	// Fetch total subcategories count for stats
	const { total: totalSubCategories, isLoading: isSubCategoriesLoading } = useAdminSubCategories({ limit: 1 });
	
	const { addCategory, isCreating: isCreatingCategory } = useCreateCategory();
	const { editCategory, isUpdating: isUpdatingCategory } = useUpdateCategory();
	const { removeCategory, isDeleting: isDeletingCategory } = useDeleteCategory();
	
	const { addSubCategory, isLoading: isCreatingSubCategory, uploadProgress: createProgress } = useCreateSubCategory();
	const { editSubCategory, isLoading: isUpdatingSubCategory, uploadProgress: updateProgress } = useUpdateSubCategory();
	const { removeSubCategory, isDeleting: isDeletingSubCategory } = useDeleteSubCategory();
	
	const isLoading = isCategoriesLoading || isSubCategoriesLoading;
	const totalPages = Math.ceil(total / limit);
	
	// Handlers
	const handleCreateCategory = () => {
		setSelectedCategory(null);
		setIsCategoryModalOpen(true);
	};
	
	const handleCreateSubCategory = (categoryId = null) => {
		setSelectedSubCategory(categoryId ? { categoryId } : null);
		setIsSubCategoryModalOpen(true);
	};
	
	const handleEditCategory = (category) => {
		setSelectedCategory(category);
		setIsCategoryModalOpen(true);
	};
	
	const handleEditSubCategory = (subCategory) => {
		setSelectedSubCategory(subCategory);
		setIsSubCategoryModalOpen(true);
	};
	
	const handleDeleteCategory = (category) => {
		setCategoryToDelete(category);
	};
	
	const handleDeleteSubCategory = (subCategory) => {
		setSubCategoryToDelete(subCategory);
	};
	
	const handleConfirmDeleteCategory = () => {
		if (categoryToDelete) {
			removeCategory(categoryToDelete._id, {
				onSuccess: () => {
					setCategoryToDelete(null);
				},
			});
		}
	};
	
	const handleConfirmDeleteSubCategory = () => {
		if (subCategoryToDelete) {
			removeSubCategory(subCategoryToDelete._id, {
				onSuccess: () => {
					setSubCategoryToDelete(null);
				},
			});
		}
	};
	
	const handleSubmitCategory = (data) => {
		if (selectedCategory) {
			editCategory({ id: selectedCategory._id, data }, {
				onSuccess: () => {
					setIsCategoryModalOpen(false);
				},
			});
		} else {
			addCategory(data, {
				onSuccess: () => {
					setIsCategoryModalOpen(false);
				},
			});
		}
	};
	
	const handleSubmitSubCategory = (data) => {
		if (selectedSubCategory && selectedSubCategory._id) {
			editSubCategory({ id: selectedSubCategory._id, data }, {
				onSuccess: () => {
					setIsSubCategoryModalOpen(false);
				},
			});
		} else {
			addSubCategory(data, {
				onSuccess: () => {
					setIsSubCategoryModalOpen(false);
				},
			});
		}
	};

	const closeModal = () => {
		setIsCategoryModalOpen(false);
		setIsSubCategoryModalOpen(false);
		setSelectedCategory(null);
		setSelectedSubCategory(null);
	};
	
	const closeDeleteModal = () => {
		setCategoryToDelete(null);
		setSubCategoryToDelete(null);
	};
	
	// Stats
	const stats = useMemo(() => ({
		categories: {
			total: total || 0,
		},
		subCategories: {
			total: totalSubCategories || 0,
		}
	}), [total, totalSubCategories]);

	if (isLoading && page === 1 && !searchQuery) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<LoadingSpinner size="lg" message="Loading categories and subcategories..." />
			</div>
		);
	}
	
	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Categories & Subcategories</h1>
					<p className="text-gray-500 mt-1">Manage product classification hierarchy</p>
				</div>
				<div className="flex gap-3">
					<Button onClick={handleCreateCategory} icon={<PlusIcon />}>
						Add Category
					</Button>
				</div>
			</div>
			
			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
				<AdminStatCard 
					label="Total Categories" 
					value={stats.categories.total} 
					icon={CategoryIcon} 
					color="bg-gray-900" 
				/>
				<AdminStatCard 
					label="Total Subcategories" 
					value={stats.subCategories.total} 
					icon={TagIcon} 
					color="bg-indigo-600" 
				/>
			</div>
			
			{/* Filters */}
			<div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
				<div className="relative flex-1 w-full">
					<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search categories..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
					/>
				</div>
				<Select 
					containerClassName="min-w-[170px] w-full md:w-auto"
					label="Items per page"
					value={limit}
					onChange={setLimit}
					options={[
						{ value: 5, label: '5 items' },
						{ value: 10, label: '10 items' },
						{ value: 20, label: '20 items' },
						{ value: 50, label: '50 items' },
					]}
				/>
			</div>
			
			{/* Categories Table */}
			<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm text-gray-500">
						<thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold">
							<tr>
								<th className="px-6 py-4 w-12"></th>
								<th className="px-6 py-4">Category</th>
								<th className="px-6 py-4">Description</th>
								<th className="px-6 py-4">Subcategories</th>
								<th className="px-6 py-4">Products</th>
								<th className="px-6 py-4 text-center">Status</th>
								<th className="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{categories.length > 0 ? (
								categories.map((category) => (
									<CategoryRow 
										key={category._id} 
										category={category}
										onEditCategory={handleEditCategory}
										onDeleteCategory={handleDeleteCategory}
										onCreateSubCategory={handleCreateSubCategory}
										onEditSubCategory={handleEditSubCategory}
										onDeleteSubCategory={handleDeleteSubCategory}
									/>
								))
							) : (
								<tr>
									<td colSpan="6" className="px-6 py-12 text-center text-gray-500">
										<div className="flex flex-col items-center justify-center">
											<CategoryIcon className="w-12 h-12 text-gray-300 mb-3" />
											<h3 className="text-lg font-medium text-gray-900">No categories found</h3>
											<p className="max-w-sm mt-1 mb-4">
												{searchQuery ? `No results for "${searchQuery}"` : "Get started by creating your first category"}
											</p>
											{searchQuery && (
												<Button variant="secondary" onClick={() => setSearchQuery('')}>
													Clear Search
												</Button>
											)}
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				
				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
						<div className="text-sm text-gray-500">
							Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
							<span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
							<span className="font-medium">{total}</span> results
						</div>
						<div className="flex gap-2">
							<Button 
								variant="secondary" 
								size="sm" 
								onClick={() => setPage(p => Math.max(1, p - 1))}
								disabled={page === 1}
							>
								Previous
							</Button>
							<div className="flex items-center gap-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									let p = i + 1;
									if (totalPages > 5 && page > 3) {
										p = page - 2 + i;
										if (p > totalPages) p = i + 1 + (totalPages - 5); 
									}
									if (p <= 0) p = i + 1; 
									
									return (
										<button
											key={p}
											onClick={() => setPage(p)}
											className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
												page === p 
													? 'bg-indigo-600 text-white shadow-sm' 
													: 'text-gray-600 hover:bg-gray-200'
											}`}
										>
											{p}
										</button>
									);
								})}
							</div>
							<Button 
								variant="secondary" 
								size="sm" 
								onClick={() => setPage(p => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>
			
			{/* Modals */}
			<CategoryFormModal
				isOpen={isCategoryModalOpen}
				onClose={closeModal}
				category={selectedCategory}
				onSubmit={handleSubmitCategory}
				isLoading={selectedCategory ? isUpdatingCategory : isCreatingCategory}
			/>
			
			<SubCategoryFormModal
				isOpen={isSubCategoryModalOpen}
				onClose={closeModal}
				subCategory={selectedSubCategory}
				onSubmit={handleSubmitSubCategory}
				isLoading={selectedSubCategory ? isUpdatingSubCategory : isCreatingSubCategory}
				uploadProgress={selectedSubCategory ? updateProgress : createProgress}
				categories={allCategories || []}
			/>
			
			<DeleteConfirmModal
				isOpen={!!categoryToDelete}
				onClose={closeDeleteModal}
				title="Delete Category"
				entityName={categoryToDelete?.name}
				description="This action cannot be undone and may affect associated subcategories and products."
				onConfirm={handleConfirmDeleteCategory}
				isLoading={isDeletingCategory}
			/>
			
			<DeleteConfirmModal
				isOpen={!!subCategoryToDelete}
				onClose={closeDeleteModal}
				title="Delete Subcategory"
				entityName={subCategoryToDelete?.name}
				description="This action cannot be undone and may affect associated products."
				onConfirm={handleConfirmDeleteSubCategory}
				isLoading={isDeletingSubCategory}
			/>
		</div>
	);
};

export default CategoriesAndSubCategoriesPage;