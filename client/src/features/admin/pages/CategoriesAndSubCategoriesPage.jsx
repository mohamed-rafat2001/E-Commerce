import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, LoadingSpinner, Select, Badge } from '../../../shared/ui/index.js';
import { PlusIcon, SearchIcon, CategoryIcon, TagIcon, CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronRightIcon, EditIcon, TrashIcon } from '../../../shared/constants/icons.jsx';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/index.js';
import { useAdminSubCategories, useCreateSubCategory, useUpdateSubCategory, useDeleteSubCategory } from '../../subCategory/hooks/index.js';
import AdminStatCard from '../components/AdminStatCard.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import CategoryFormModal from '../components/categories/CategoryFormModal.jsx';
import SubCategoryFormModal from '../components/categories/SubCategoryFormModal.jsx';

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
	const [expandedCategories, setExpandedCategories] = useState(new Set());
	
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
		sort: '-createdAt' // Default sort
	});

	const { subCategories, isLoading: isSubCategoriesLoading } = useAdminSubCategories();
	
	const { addCategory, isCreating: isCreatingCategory } = useCreateCategory();
	const { editCategory, isUpdating: isUpdatingCategory } = useUpdateCategory();
	const { removeCategory, isDeleting: isDeletingCategory } = useDeleteCategory();
	
	const { addSubCategory, isLoading: isCreatingSubCategory, uploadProgress: createProgress } = useCreateSubCategory();
	const { editSubCategory, isLoading: isUpdatingSubCategory, uploadProgress: updateProgress } = useUpdateSubCategory();
	const { removeSubCategory, isDeleting: isDeletingSubCategory } = useDeleteSubCategory();
	
	const isLoading = isCategoriesLoading || isSubCategoriesLoading;
	const totalPages = Math.ceil(total / limit);
	
	// Handlers
	const handleToggleCategory = (categoryId) => {
		const newExpanded = new Set(expandedCategories);
		if (newExpanded.has(categoryId)) {
			newExpanded.delete(categoryId);
		} else {
			newExpanded.add(categoryId);
		}
		setExpandedCategories(newExpanded);
	};
	
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
	
	// Stats (using total from API for categories, and client-side for subcategories)
	const stats = useMemo(() => ({
		categories: {
			total: total || 0,
			active: categories?.filter(c => c.isActive).length || 0, // This is only for current page, ideally should come from API stats endpoint
			inactive: categories?.filter(c => !c.isActive).length || 0,
		},
		subCategories: {
			total: subCategories?.length || 0,
			active: subCategories?.filter(s => s.isActive).length || 0,
			inactive: subCategories?.filter(s => !s.isActive).length || 0,
		}
	}), [categories, subCategories, total]);

	// Get subcategories for a specific category
	const getCategorySubCategories = (categoryId) => {
		return subCategories.filter(sub => sub.categoryId?._id === categoryId || sub.categoryId === categoryId);
	};

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
								<th className="px-6 py-4 text-center">Status</th>
								<th className="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{categories.length > 0 ? (
								categories.map((category) => {
									const isExpanded = expandedCategories.has(category._id);
									const categorySubCategories = getCategorySubCategories(category._id);
									
									return (
										<div key={category._id} style={{ display: 'contents' }}>
											<tr 
												className={`hover:bg-gray-50 transition-colors cursor-pointer ${isExpanded ? 'bg-gray-50' : ''}`}
												onClick={() => handleToggleCategory(category._id)}
											>
												<td className="px-6 py-4">
													<button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
														{isExpanded ? (
															<ChevronDownIcon className="w-4 h-4 text-gray-500" />
														) : (
															<ChevronRightIcon className="w-4 h-4 text-gray-500" />
														)}
													</button>
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
															{category.image?.secure_url ? (
																<img 
																	src={category.image.secure_url} 
																	alt={category.name} 
																	className="w-full h-full object-cover"
																/>
															) : (
																<div className="w-full h-full flex items-center justify-center">
																	<CategoryIcon className="w-5 h-5 text-gray-400" />
																</div>
															)}
														</div>
														<div>
															<div className="font-semibold text-gray-900">{category.name}</div>
															<div className="text-xs text-gray-500">{category._id}</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 max-w-xs truncate">
													{category.description || <span className="text-gray-400 italic">No description</span>}
												</td>
												<td className="px-6 py-4">
													<Badge variant="secondary" size="sm">
														{categorySubCategories.length} items
													</Badge>
												</td>
												<td className="px-6 py-4 text-center">
													<Badge 
														variant={category.isActive ? 'success' : 'neutral'} 
														size="sm"
													>
														{category.isActive ? 'Active' : 'Inactive'}
													</Badge>
												</td>
												<td className="px-6 py-4 text-right">
													<div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
														<Button 
															variant="ghost" 
															size="sm" 
															onClick={() => handleEditCategory(category)}
														>
															<EditIcon className="w-4 h-4 text-gray-500" />
														</Button>
														<Button 
															variant="ghost" 
															size="sm" 
															onClick={() => handleDeleteCategory(category)}
														>
															<TrashIcon className="w-4 h-4 text-rose-500" />
														</Button>
													</div>
												</td>
											</tr>
											
											{/* Expanded Subcategories Row */}
											<AnimatePresence>
												{isExpanded && (
													<tr className="bg-gray-50/50">
														<td colSpan="6" className="px-6 py-0 border-none">
															<motion.div
																initial={{ height: 0, opacity: 0 }}
																animate={{ height: 'auto', opacity: 1 }}
																exit={{ height: 0, opacity: 0 }}
																transition={{ duration: 0.2 }}
																className="overflow-hidden"
															>
																<div className="py-4 pl-14 pr-4">
																	<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
																		<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
																			<h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
																				<TagIcon className="w-4 h-4 text-indigo-500" />
																				Subcategories for {category.name}
																			</h4>
																			<Button 
																				size="sm" 
																				variant="secondary"
																				onClick={() => handleCreateSubCategory(category._id)}
																			>
																				<PlusIcon className="w-3 h-3 mr-1" />
																				Add Subcategory
																			</Button>
																		</div>
																		
																		{categorySubCategories.length > 0 ? (
																			<table className="w-full text-sm text-left">
																				<thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
																					<tr>
																						<th className="px-4 py-2">Name</th>
																						<th className="px-4 py-2">Description</th>
																						<th className="px-4 py-2 text-center">Status</th>
																						<th className="px-4 py-2 text-right">Actions</th>
																					</tr>
																				</thead>
																				<tbody className="divide-y divide-gray-100">
																					{categorySubCategories.map(sub => (
																						<tr key={sub._id} className="hover:bg-gray-50">
																							<td className="px-4 py-3 font-medium text-gray-900">
																								{sub.name}
																							</td>
																							<td className="px-4 py-3 text-gray-500 max-w-xs truncate">
																								{sub.description || '-'}
																							</td>
																							<td className="px-4 py-3 text-center">
																								<Badge 
																									variant={sub.isActive ? 'success' : 'neutral'} 
																									size="xs"
																								>
																									{sub.isActive ? 'Active' : 'Inactive'}
																								</Badge>
																							</td>
																							<td className="px-4 py-3 text-right">
																								<div className="flex justify-end gap-1">
																									<button 
																										onClick={() => handleEditSubCategory(sub)}
																										className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-indigo-600 transition-colors"
																									>
																										<EditIcon className="w-3 h-3" />
																									</button>
																									<button 
																										onClick={() => handleDeleteSubCategory(sub)}
																										className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-rose-600 transition-colors"
																									>
																										<TrashIcon className="w-3 h-3" />
																									</button>
																								</div>
																							</td>
																						</tr>
																					))}
																				</tbody>
																			</table>
																		) : (
																			<div className="p-8 text-center text-gray-500">
																				<TagIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
																				<p>No subcategories found</p>
																				<Button 
																					variant="link" 
																					size="sm"
																					onClick={() => handleCreateSubCategory(category._id)}
																				>
																					Create the first one
																				</Button>
																			</div>
																		)}
																	</div>
																</div>
															</motion.div>
														</td>
													</tr>
												)}
											</AnimatePresence>
										</div>
									);
								})
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
									// Logic to show pages around current page could be complex
									// For simplicity, show first 5 or current window
									// Let's implement a simple version
									let p = i + 1;
									if (totalPages > 5 && page > 3) {
										p = page - 2 + i;
										if (p > totalPages) p = i + 1 + (totalPages - 5); // Shift back if near end
									}
									if (p <= 0) p = i + 1; // Safety
									
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
				categories={categories}
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