import { useState, useEffect, useMemo } from 'react';
import useAdminCategories from './useAdminCategories.js';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategoryMutations.js';
import { useAdminSubCategories, useCreateSubCategory, useUpdateSubCategory, useDeleteSubCategory } from '../../../subCategory/hooks/index.js';

const useCategoriesPage = () => {
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

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    limit,
    setLimit,
    selectedCategory,
    selectedSubCategory,
    isCategoryModalOpen,
    isSubCategoryModalOpen,
    categoryToDelete,
    subCategoryToDelete,
    categories,
    allCategories,
    total,
    totalPages,
    isLoading,
    isCreatingCategory,
    isUpdatingCategory,
    isDeletingCategory,
    isCreatingSubCategory,
    isUpdatingSubCategory,
    isDeletingSubCategory,
    createProgress,
    updateProgress,
    stats,
    handleCreateCategory,
    handleCreateSubCategory,
    handleEditCategory,
    handleEditSubCategory,
    handleDeleteCategory,
    handleDeleteSubCategory,
    handleConfirmDeleteCategory,
    handleConfirmDeleteSubCategory,
    handleSubmitCategory,
    handleSubmitSubCategory,
    closeModal,
    closeDeleteModal
  };
};

export default useCategoriesPage;
