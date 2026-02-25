import { motion, AnimatePresence } from 'framer-motion';
import { Button, LoadingSpinner, DataHeader, Pagination } from '../../../shared/ui/index.js';
import { FiPlus } from 'react-icons/fi';
import ProductFormModal from '../components/products/ProductFormModal.jsx';
import ProductCard from '../../product/components/ProductCard.jsx';
import { useSellerProductsPage } from '../hooks/index.js';
import StockFilterCards from '../components/products/StockFilterCards.jsx';
import useStockFilter from '../hooks/products/useStockFilter.js';
import { useStockCounts } from '../hooks/products/useStockCounts.js';

const ProductsPage = () => {
	const { stockFilter, setStockFilter } = useStockFilter(6);
	const { stockCounts, isLoading: countsLoading } = useStockCounts();
	const {
		// Modal state
		isModalOpen,
		editingProduct,

		// Data
		products,
		total,
		totalPages,
		isLoading,

		// Handlers
		handleDeleteProduct,
		handleCreate,
		handleEdit,
		handleCloseModal,
		handleSubmit,
		handleUpdateStock,
		isCreating,
		isUpdating,
	} = useSellerProductsPage();

	return (
		<div className="space-y-6 pb-10">
			<DataHeader 
				title="Inventory 📦"
				description={`${total || 0} total products`}
				searchPlaceholder="Search products by name..."
				sortOptions={[
					{ label: 'Newest First', value: '-createdAt' },
					{ label: 'Oldest First', value: 'createdAt' },
					{ label: 'Price: Low to High', value: 'price.amount' },
					{ label: 'Price: High to Low', value: '-price.amount' },
					{ label: 'Name (A-Z)', value: 'name' },
					{ label: 'Name (Z-A)', value: '-name' }
				]}
				actions={
					<Button 
						onClick={handleCreate}
						icon={<FiPlus className="w-5 h-5" />}
						className="bg-linear-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200 transition-all"
					>
						Add Product
					</Button>
				}
			/>

			<StockFilterCards 
				stockFilter={stockFilter} 
				total={total} 
				onFilterChange={setStockFilter} 
				stockCounts={stockCounts}
			/>

			{/* Product Grid */}
			{isLoading || countsLoading ? (
				<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
					<LoadingSpinner size="lg" color="indigo" />
					<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Products...</p>
				</div>
			) : products && products.length > 0 ? (
				<>
					<motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						<AnimatePresence mode="popLayout">
							{products.map(product => (
								<ProductCard
									key={product._id}
									product={product}
									basePath="/seller/inventory"
									onUpdateStock={(id, stock) => handleUpdateStock(id, stock)}
									isUpdating={isUpdating}
									onEdit={() => handleEdit(product)}
									onDelete={() => handleDeleteProduct(product._id)}
								/>
							))}
						</AnimatePresence>
					</motion.div>
					<Pagination totalPages={totalPages} />
				</>
			) : (
				<div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
					<p className="text-gray-500 text-lg">No products found.</p>
					<Button 
						variant="ghost" 
						onClick={handleCreate}
						className="mt-4 text-indigo-600 hover:text-indigo-700"
					>
						Create your first product
					</Button>
				</div>
			)}

			<ProductFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={handleSubmit}
				product={editingProduct}
				isSubmitting={isCreating || isUpdating}
			/>
		</div>
	);
};

export default ProductsPage;
