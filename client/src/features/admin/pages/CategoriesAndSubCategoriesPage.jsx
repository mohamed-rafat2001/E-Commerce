import { PageHeader, Skeleton, Card, Button } from '../../../shared/ui/index.js';
import { FiPlus } from 'react-icons/fi';
import { useCategoriesPage } from '../hooks/index.js';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import CategoryFormModal from '../components/categories/CategoryFormModal.jsx';
import SubCategoryFormModal from '../components/categories/SubCategoryFormModal.jsx';
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
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/4 h-10" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Skeleton variant="card" count={4} />
				</div>
				<Skeleton variant="card" className="h-96" />
			</div>
		);
	}

	return (
		<div className="space-y-8 pb-10">
			<PageHeader
				title="Taxonomy Management"
				subtitle="Organize your marketplace hierarchy with categories and subcategories."
				actions={
					<Button
						onClick={handleCreateCategory}
						icon={<FiPlus className="w-5 h-5" />}
						className="shadow-xl"
					>
						New Category
					</Button>
				}
			/>

			<CategoriesStats stats={stats} />

			<Card padding="none" className="overflow-hidden">
				<div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
					<h3 className="text-lg font-bold text-gray-900 font-display">Structure Overview</h3>
				</div>
				<CategoriesFilter
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					limit={limit}
					setLimit={setLimit}
				/>

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
			</Card>

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
