import { LoadingSpinner } from '../../../shared/ui/index.js';
import { useCategoriesPage } from '../hooks/index.js';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import CategoryFormModal from '../components/categories/CategoryFormModal.jsx';
import SubCategoryFormModal from '../components/categories/SubCategoryFormModal.jsx';
import CategoriesHeader from '../components/categories/CategoriesHeader.jsx';
import CategoriesStats from '../components/categories/CategoriesStats.jsx';
import CategoriesFilter from '../components/categories/CategoriesFilter.jsx';
import CategoriesTable from '../components/categories/CategoriesTable.jsx';

const CategoriesAndSubCategoriesPage = () => {
	const {
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
	} = useCategoriesPage();

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
			<CategoriesHeader handleCreateCategory={handleCreateCategory} />
			
			{/* Stats */}
			<CategoriesStats stats={stats} />
			
			{/* Filters */}
			<CategoriesFilter 
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				limit={limit}
				setLimit={setLimit}
			/>
			
			{/* Categories Table */}
			<CategoriesTable 
				categories={categories}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				page={page}
				limit={limit}
				total={total}
				totalPages={totalPages}
				setPage={setPage}
				handleEditCategory={handleEditCategory}
				handleDeleteCategory={handleDeleteCategory}
				handleCreateSubCategory={handleCreateSubCategory}
				handleEditSubCategory={handleEditSubCategory}
				handleDeleteSubCategory={handleDeleteSubCategory}
			/>
			
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
