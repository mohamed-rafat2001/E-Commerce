import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductIcon } from '../../../shared/constants/icons.jsx';
import { Button, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useSellerProductsPage } from '../hooks/index.js';
import ProductFormModal from '../components/ProductFormModal.jsx';
import ProductCard from '../components/ProductCard.jsx';

const ProductsPage = () => {
	const {
		isModalOpen,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		deletingId,
		editingProduct,
		products,
		allProducts,
		isLoading,
		error,
		statusOptions,
		handleAddProduct,
		handleUpdateProduct,
		handleDeleteProduct,
		handleEdit,
		handleCloseModal,
		handleCreate
	} = useSellerProductsPage();

	if (error) {
		return (
			<div className="text-center py-20">
				<p className="text-rose-600 font-bold">Error loading products. Please try again.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Catalog 📦</h1>
					<p className="text-gray-500 font-medium mt-1">Manage and monitor your digital storefront.</p>
				</div>
				<Button 
					onClick={handleCreate}
					icon={<FiPlus className="w-5 h-5" />}
					className="h-12 px-6 rounded-xl shadow-lg shadow-indigo-100"
				>
					Add New Product
				</Button>
			</div>

			<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
				<div className="relative flex-1">
					<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Scan inventory by name or description..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-medium"
					/>
				</div>
				<Select
					containerClassName="md:w-64"
					value={statusFilter}
					onChange={setStatusFilter}
					options={[
						{ value: 'all', label: 'All Managed States' },
						...statusOptions
					]}
				/>
			</div>

			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
					<LoadingSpinner size="lg" color="indigo" />
					<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Accessing Inventory Records...</p>
				</div>
			) : products.length > 0 ? (
				<motion.div 
					layout
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
				>
					<AnimatePresence mode="popLayout">
						{products.map(product => (
							<ProductCard 
								key={product._id}
								product={product}
								onEdit={handleEdit}
								onDelete={handleDeleteProduct}
								isDeleting={deletingId === product._id}
							/>
						))}
					</AnimatePresence>
				</motion.div>
			) : (
				<div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
					<div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
						<ProductIcon className="w-12 h-12 text-indigo-300" />
					</div>
					<h3 className="text-2xl font-black text-gray-900 mb-2">No items discovered</h3>
					<p className="text-gray-500 font-medium max-w-xs mx-auto mb-8 leading-relaxed">
						{searchQuery || statusFilter !== 'all' 
							? 'No records match your active search filters. Try refining your query.'
							: 'Your storefront is currently empty. Start your journey by adding your first product.'}
					</p>
					{!searchQuery && statusFilter === 'all' && (
						<Button onClick={handleCreate} icon={<FiPlus className="w-5 h-5" />}>
							Initialize First Product
						</Button>
					)}
				</div>
			)}

			<ProductFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				product={editingProduct}
				onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
				isLoading={editingProduct ? false : false} // We need to fix this logic
			/>
		</div>
	);
};

export default ProductsPage;