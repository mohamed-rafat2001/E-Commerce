import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { PlusIcon, SearchIcon } from '../../../shared/constants/icons.jsx';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useCategoriesPage } from '../hooks/index.js';
import { FiLayers, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AdminStatCard from '../components/AdminStatCard.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import CategoryFormModal from '../components/categories/CategoryFormModal.jsx';
import CategoryCard from '../components/categories/CategoryCard.jsx';

const CategoriesPage = () => {
	const { 
		searchQuery, 
		setSearchQuery, 
		selectedCategory, 
		isModalOpen, 
		categoryToDelete,
		categories,
		allCategories,
		isLoading,
		filteredCategories,
		handleEdit,
		handleDelete,
		handleCreate,
		closeModal,
		closeDeleteModal,
		statusFilter,
		setStatusFilter,
		stats
	} = useCategoriesPage();
	
	const { addCategory, isCreating } = useCreateCategory();
	const { editCategory, isUpdating } = useUpdateCategory();
	const { removeCategory, isDeleting } = useDeleteCategory();

	const handleConfirmDelete = () => {
		if (categoryToDelete) {
			removeCategory(categoryToDelete._id, {
				onSuccess: () => {
					closeDeleteModal();
				}
			});
		}
	};

	const handleSubmit = (data) => {
		if (selectedCategory) {
			editCategory({ id: selectedCategory._id, data }, {
				onSuccess: () => closeModal()
			});
		} else {
			addCategory(data, {
				onSuccess: () => closeModal()
			});
		}
	};

	const handleToggleStatus = (category) => {
		editCategory({ 
			id: category._id, 
			data: { isActive: !category.isActive } 
		});
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<LoadingSpinner size="lg" message="Loading categories..." />
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Categories</h1>
					<p className="text-gray-500 mt-1">Manage product classification and hierarchy</p>
				</div>
				<Button onClick={handleCreate} icon={<PlusIcon />}>
					Add New Category
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<AdminStatCard label="Total Categories" value={stats.total} icon={FiLayers} color="bg-gray-900" />
				<AdminStatCard label="Active" value={stats.active} icon={FiCheckCircle} color="bg-emerald-600" />
				<AdminStatCard label="Inactive" value={stats.inactive} icon={FiXCircle} color="bg-slate-500" />
			</div>

			<div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
				<div className="relative flex-1 w-full">
					<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search categories by name or description..."
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

			{filteredCategories.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
					<AnimatePresence mode="popLayout">
						{filteredCategories.map((category) => (
							<CategoryCard
								key={category._id}
								category={category}
								onToggleStatus={handleToggleStatus}
								onEdit={handleEdit}
								onDelete={handleDelete}
								isDeleting={isDeleting}
							/>
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
						{searchQuery ? `No categories match "${searchQuery}"` : "Get started by creating your first product category!"}
					</p>
					{searchQuery && (
						<Button variant="ghost" className="mt-4" onClick={() => setSearchQuery('')}>
							Clear Search
						</Button>
					)}
				</div>
			)}

			<CategoryFormModal
				isOpen={isModalOpen}
				onClose={closeModal}
				category={selectedCategory}
				onSubmit={handleSubmit}
				isLoading={selectedCategory ? isUpdating : isCreating}
			/>

			<DeleteConfirmModal
				isOpen={!!categoryToDelete}
				onClose={closeDeleteModal}
				title="Delete Category"
				entityName={categoryToDelete?.name}
				description={` This action cannot be undone and may affect associated products.`}
				onConfirm={handleConfirmDelete}
				isLoading={isDeleting}
			/>
		</div>
	);
};

export default CategoriesPage;