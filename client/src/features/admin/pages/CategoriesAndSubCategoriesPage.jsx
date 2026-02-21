import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button, LoadingSpinner, Select, Badge } from '../../../shared/ui/index.js';
import { PlusIcon, SearchIcon, CategoryIcon, TagIcon, CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronRightIcon } from '../../../shared/constants/icons.jsx';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/index.js';
import { useAdminSubCategories, useCreateSubCategory, useUpdateSubCategory, useDeleteSubCategory } from '../../subCategory/hooks/index.js';
import useToast from '../../../shared/hooks/useToast.js';
import AdminStatCard from '../components/AdminStatCard.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import CategoryFormModal from '../components/categories/CategoryFormModal.jsx';
import SubCategoryFormModal from '../components/categories/SubCategoryFormModal.jsx';
import CategoryCard from '../components/categories/CategoryCard.jsx';
import SubCategoryCard from '../components/categories/SubCategoryCard.jsx';

const CategoriesAndSubCategoriesPage = () => {
	const [activeTab, setActiveTab] = useState('categories');
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedSubCategory, setSelectedSubCategory] = useState(null);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState(null);
	const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
	const [expandedCategories, setExpandedCategories] = useState(new Set());
	
	const { categories, isLoading: isCategoriesLoading } = useAdminCategories();
	const { subCategories, isLoading: isSubCategoriesLoading } = useAdminSubCategories();
	const { addCategory, isCreating: isCreatingCategory } = useCreateCategory();
	const { editCategory, isUpdating: isUpdatingCategory } = useUpdateCategory();
	const { removeCategory, isDeleting: isDeletingCategory } = useDeleteCategory();
	const { addSubCategory, isCreating: isCreatingSubCategory } = useCreateSubCategory();
	const { editSubCategory, isUpdating: isUpdatingSubCategory } = useUpdateSubCategory();
	const { removeSubCategory, isDeleting: isDeletingSubCategory } = useDeleteSubCategory();
	const { showSuccess, showError } = useToast();
	
	const isLoading = isCategoriesLoading || isSubCategoriesLoading;
	
	// Combine categories with their subcategories
	const categoriesWithSubCategories = useMemo(() => {
		if (!categories || !subCategories) return [];
		
		return categories.map(category => ({
			...category,
			subCategories: subCategories.filter(sub => sub.categoryId?._id === category._id || sub.categoryId === category._id)
		}));
	}, [categories, subCategories]);
	
	// Filtered data based on search and status
	const filteredData = useMemo(() => {
		const data = activeTab === 'categories' ? categories : subCategories;
		if (!data) return [];
		
		return data.filter(item => {
			const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || 
				(statusFilter === 'active' && item.isActive) || 
				(statusFilter === 'inactive' && !item.isActive);
			return matchesSearch && matchesStatus;
		});
	}, [activeTab, categories, subCategories, searchQuery, statusFilter]);
	
	// Stats
	const stats = useMemo(() => ({
		categories: {
			total: categories?.length || 0,
			active: categories?.filter(c => c.isActive).length || 0,
			inactive: categories?.filter(c => !c.isActive).length || 0,
		},
		subCategories: {
			total: subCategories?.length || 0,
			active: subCategories?.filter(s => s.isActive).length || 0,
			inactive: subCategories?.filter(s => !s.isActive).length || 0,
		}
	}), [categories, subCategories]);
	
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
	
	const handleCreateSubCategory = () => {
		setSelectedSubCategory(null);
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
					showSuccess('Category deleted successfully!');
				},
				onError: () => {
					showError('Failed to delete category');
				}
			});
		}
	};
	
	const handleConfirmDeleteSubCategory = () => {
		if (subCategoryToDelete) {
			removeSubCategory(subCategoryToDelete._id, {
				onSuccess: () => {
					setSubCategoryToDelete(null);
					showSuccess('Subcategory deleted successfully!');
				},
				onError: () => {
					showError('Failed to delete subcategory');
				}
			});
		}
	};
	
	const handleSubmitCategory = (data) => {
		if (selectedCategory) {
			editCategory({ id: selectedCategory._id, data }, {
				onSuccess: () => {
					setIsCategoryModalOpen(false);
					showSuccess('Category updated successfully!');
				},
				onError: () => {
					showError('Failed to update category');
				}
			});
		} else {
			addCategory(data, {
				onSuccess: () => {
					setIsCategoryModalOpen(false);
					showSuccess('Category created successfully!');
				},
				onError: () => {
					showError('Failed to create category');
				}
			});
		}
	};
	
	const handleSubmitSubCategory = (data) => {
		if (selectedSubCategory) {
			editSubCategory({ id: selectedSubCategory._id, data }, {
				onSuccess: () => {
					setIsSubCategoryModalOpen(false);
					showSuccess('Subcategory updated successfully!');
				},
				onError: () => {
					showError('Failed to update subcategory');
				}
			});
		} else {
			addSubCategory(data, {
				onSuccess: () => {
					setIsSubCategoryModalOpen(false);
					showSuccess('Subcategory created successfully!');
				},
				onError: () => {
					showError('Failed to create subcategory');
				}
			});
		}
	};
	
	const handleToggleStatus = (item, isCategory = true) => {
		const service = isCategory ? editCategory : editSubCategory;
		const id = item._id;
		const data = { isActive: !item.isActive };
		
		service({ id, data }, {
			onSuccess: () => {
				showSuccess(`Item ${item.isActive ? 'deactivated' : 'activated'} successfully!`);
			},
			onError: () => {
				showError('Failed to update status');
			}
		});
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
	
	if (isLoading) {
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
					{activeTab === 'categories' ? (
						<Button onClick={handleCreateCategory} icon={<PlusIcon />}>
							Add Category
						</Button>
					) : (
						<Button onClick={handleCreateSubCategory} icon={<PlusIcon />}>
							Add Subcategory
						</Button>
					)}
				</div>
			</div>
			
			{/* Tabs */}
			<div className="flex border-b border-gray-200">
				<button
					onClick={() => setActiveTab('categories')}
					className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
						activeTab === 'categories'
							? 'border-indigo-500 text-indigo-600'
							: 'border-transparent text-gray-500 hover:text-gray-700'
					}`}
				>
					<div className="flex items-center gap-2">
						<CategoryIcon className="w-4 h-4" />
						Categories
						<Badge variant="secondary" size="sm">
							{stats.categories.total}
						</Badge>
					</div>
				</button>
				<button
					onClick={() => setActiveTab('subcategories')}
					className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
						activeTab === 'subcategories'
							? 'border-indigo-500 text-indigo-600'
							: 'border-transparent text-gray-500 hover:text-gray-700'
					}`}
				>
					<div className="flex items-center gap-2">
						<TagIcon className="w-4 h-4" />
						Subcategories
						<Badge variant="secondary" size="sm">
							{stats.subCategories.total}
						</Badge>
					</div>
				</button>
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
					label="Active Categories" 
					value={stats.categories.active} 
					icon={CheckCircleIcon} 
					color="bg-emerald-600" 
				/>
				<AdminStatCard 
					label="Total Subcategories" 
					value={stats.subCategories.total} 
					icon={TagIcon} 
					color="bg-indigo-600" 
				/>
				<AdminStatCard 
					label="Active Subcategories" 
					value={stats.subCategories.active} 
					icon={CheckCircleIcon} 
					color="bg-blue-500" 
				/>
			</div>
			
			{/* Filters */}
			<div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
				<div className="relative flex-1 w-full">
					<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder={`Search ${activeTab} by name or description...`}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
					/>
				</div>
				<Select 
					containerClassName="min-w-[170px] w-full md:w-auto"
					label="Status"
					value={statusFilter}
					onChange={setStatusFilter}
					options={[
						{ value: 'all', label: 'All Statuses' },
						{ value: 'active', label: 'Active' },
						{ value: 'inactive', label: 'Inactive' },
					]}
				/>
			</div>
			
			{/* Content */}
			{activeTab === 'categories' ? (
				// Categories View
				filteredData.length > 0 ? (
					<div className="space-y-6">
						<AnimatePresence mode="popLayout">
							{filteredData.map((category) => (
								<div key={category._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
									<CategoryCard
										category={category}
										onToggleStatus={(cat) => handleToggleStatus(cat, true)}
										onEdit={handleEditCategory}
										onDelete={handleDeleteCategory}
										isDeleting={isDeletingCategory}
										showSubCategoriesToggle={true}
										isExpanded={expandedCategories.has(category._id)}
										onToggleExpand={() => handleToggleCategory(category._id)}
										subCategoryCount={category.subCategories?.length || 0}
									/>
									
									{/* Subcategories List */}
									{expandedCategories.has(category._id) && category.subCategories?.length > 0 && (
										<div className="border-t border-gray-100 p-6 bg-gray-50">
											<div className="flex items-center justify-between mb-4">
												<h3 className="font-semibold text-gray-900">Subcategories</h3>
												<Button 
													variant="secondary" 
													size="sm" 
													onClick={() => {
														setSelectedSubCategory(null);
														setIsSubCategoryModalOpen(true);
													}}
												>
													<PlusIcon className="w-4 h-4 mr-1" />
													Add Subcategory
												</Button>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{category.subCategories.map((subCategory) => (
													<SubCategoryCard
														key={subCategory._id}
														subCategory={subCategory}
														onToggleStatus={(sub) => handleToggleStatus(sub, false)}
														onEdit={handleEditSubCategory}
														onDelete={handleDeleteSubCategory}
														isDeleting={isDeletingSubCategory}
													/>
												))}
											</div>
										</div>
									)}
								</div>
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
							{searchQuery ? `No categories match "${searchQuery}"` : "Get started by creating your first category!"}
						</p>
						{searchQuery && (
							<Button variant="ghost" className="mt-4" onClick={() => setSearchQuery('')}>
								Clear Search
							</Button>
						)}
					</div>
				)
			) : (
				// Subcategories View
				filteredData.length > 0 ? (
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
						<AnimatePresence mode="popLayout">
							{filteredData.map((subCategory) => (
								<SubCategoryCard
									key={subCategory._id}
									subCategory={subCategory}
									onToggleStatus={(sub) => handleToggleStatus(sub, false)}
									onEdit={handleEditSubCategory}
									onDelete={handleDeleteSubCategory}
									isDeleting={isDeletingSubCategory}
								/>
							))}
						</AnimatePresence>
					</div>
				) : (
					<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
						<div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
							<SearchIcon className="w-12 h-12 text-gray-300" />
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-2">No subcategories found</h3>
						<p className="text-gray-500 max-w-sm mx-auto">
							{searchQuery ? `No subcategories match "${searchQuery}"` : "Get started by creating your first subcategory!"}
						</p>
						{searchQuery && (
							<Button variant="ghost" className="mt-4" onClick={() => setSearchQuery('')}>
								Clear Search
							</Button>
						)}
					</div>
				)
			)}
			
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