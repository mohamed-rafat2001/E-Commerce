import { motion, AnimatePresence } from 'framer-motion';
import { Button, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { FiSearch, FiFilter, FiPlus, FiPackage } from 'react-icons/fi';
import ProductFormModal from '../components/ProductFormModal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useSellerProductsPage } from '../hooks/index.js';

const ProductsPage = () => {
	const {
		// Modal state
		isModalOpen,
		setIsModalOpen,
		editingProduct,
		setEditingProduct,

		// Search & Filter
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,

		// Data
		products,
		filteredProducts,
		isLoading,

		// Handlers
		handleCreateProduct,
		handleUpdateProduct,
		handleDeleteProduct,
		isCreating,
		isUpdating,
		isDeleting,
	} = useSellerProductsPage();

	const openAddModal = () => {
		setEditingProduct(null);
		setIsModalOpen(true);
	};

	const openEditModal = (product) => {
		setEditingProduct(product);
		setIsModalOpen(true);
	};

	const handleSubmit = (data) => {
		if (editingProduct) {
			handleUpdateProduct(data);
		} else {
			handleCreateProduct(data);
		}
	};

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
			>
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Catalog 📦</h1>
					<p className="text-gray-500 font-medium mt-1">
						{products?.length || 0} total products
					</p>
				</div>
				<Button 
					onClick={openAddModal}
					icon={<FiPlus className="w-5 h-5" />}
					className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200 transition-all"
				>
					Add Product
				</Button>
			</motion.div>

			{/* Search & Filter */}
			<div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
				<div className="relative flex-1">
					<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search products by name, brand, or description..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-medium"
					/>
				</div>
				<div className="flex items-center gap-2">
					<FiFilter className="text-gray-400 w-5 h-5 flex-shrink-0" />
					<Select
						containerClassName="min-w-[160px]"
						value={statusFilter}
						onChange={setStatusFilter}
						options={[
							{ value: 'all', label: 'All Status' },
							{ value: 'active', label: 'Active' },
							{ value: 'draft', label: 'Draft' },
							{ value: 'inactive', label: 'Inactive' },
							{ value: 'archived', label: 'Archived' },
						]}
					/>
				</div>
			</div>

			{/* Product Grid */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
					<LoadingSpinner size="lg" color="indigo" />
					<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Products...</p>
				</div>
			) : filteredProducts && filteredProducts.length > 0 ? (
				<motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					<AnimatePresence mode="popLayout">
						{filteredProducts.map(product => (
							<ProductCard
								key={product._id}
								product={product}
								onEdit={() => openEditModal(product)}
								onDelete={() => handleDeleteProduct(product._id)}
							/>
						))}
					</AnimatePresence>
				</motion.div>
			) : (
				<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
					<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<FiPackage className="w-10 h-10 text-indigo-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">
						{searchQuery || statusFilter !== 'all' ? 'No products found' : 'No products yet'}
					</h3>
					<p className="text-gray-500 mb-6 max-w-sm mx-auto">
						{searchQuery || statusFilter !== 'all'
							? 'Try adjusting your search or filters'
							: 'Start building your catalog by adding your first product'}
					</p>
					{!searchQuery && statusFilter === 'all' && (
						<Button onClick={openAddModal} icon={<FiPlus className="w-4 h-4" />}>
							Add Your First Product
						</Button>
					)}
				</div>
			)}

			{/* Product Form Modal */}
			<ProductFormModal
				isOpen={isModalOpen}
				onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
				product={editingProduct}
				onSubmit={handleSubmit}
				isLoading={isCreating || isUpdating}
			/>
		</div>
	);
};

export default ProductsPage;