import { motion, AnimatePresence } from 'framer-motion';
import { Button, LoadingSpinner, DataHeader, Pagination } from '../../../shared/ui/index.js';
import { FiPlus, FiPackage, FiArrowRight } from 'react-icons/fi';
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
						className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200/50 transition-all !rounded-xl"
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
				<motion.div
					initial={{ opacity: 0 }} 
					animate={{ opacity: 1 }}
					className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100"
					style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
				>
					<div className="relative">
						<LoadingSpinner size="lg" color="indigo" />
						<div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl opacity-30 animate-pulse" />
					</div>
					<p className="mt-6 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">Loading Products...</p>
				</motion.div>
			) : products && products.length > 0 ? (
				<>
					<motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						<AnimatePresence mode="popLayout">
							{products.map((product, i) => (
								<motion.div
									key={product._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: i * 0.05 }}
								>
									<ProductCard
										product={product}
										basePath="/seller/inventory"
										onUpdateStock={(id, stock) => handleUpdateStock(id, stock)}
										isUpdating={isUpdating}
										onEdit={() => handleEdit(product)}
										onDelete={() => handleDeleteProduct(product._id)}
									/>
								</motion.div>
							))}
						</AnimatePresence>
					</motion.div>
					<Pagination totalPages={totalPages} />
				</>
			) : (
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, type: 'spring' }}
					className="text-center py-24 bg-white rounded-3xl border border-gray-100 relative overflow-hidden"
					style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
				>
					{/* Background decoration */}
					<div className="absolute inset-0 opacity-[0.03]">
						<div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl" />
						<div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
					</div>

					<div className="relative space-y-6">
						<motion.div 
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ type: 'spring', bounce: 0.4, delay: 0.2 }}
							className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"
						>
							<FiPackage className="w-10 h-10 text-indigo-400" />
						</motion.div>
						
						<div className="space-y-2">
							<h3 className="text-xl font-bold text-gray-900">No products yet</h3>
							<p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
								Start building your catalog by adding your first product. It only takes a minute!
							</p>
						</div>

						<Button 
							onClick={handleCreate}
							icon={<FiPlus className="w-5 h-5" />}
							className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200/50 transition-all !rounded-xl"
						>
							Create Your First Product
							<FiArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
				</motion.div>
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
