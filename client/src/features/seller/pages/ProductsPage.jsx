import { motion, AnimatePresence } from 'framer-motion';
import { Button, PageHeader, Pagination, Skeleton, Card, EmptyState, Badge } from '../../../shared/ui/index.js';
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
		isModalOpen,
		editingProduct,
		products,
		total,
		totalPages,
		isLoading,
		handleDeleteProduct,
		handleCreate,
		handleEdit,
		handleCloseModal,
		handleSubmit,
		handleUpdateStock,
		isCreating,
		isUpdating,
		isDeleting
	} = useSellerProductsPage();

	return (
		<div className="space-y-8 pb-10">
			<PageHeader
				title="Inventory Management"
				subtitle={`Managing ${total || 0} items in your catalog.`}
				actions={
					<Button
						onClick={handleCreate}
						icon={<FiPlus className="w-5 h-5" />}
						className="shadow-indigo-200 shadow-xl"
					>
						Add New Product
					</Button>
				}
			/>

			<StockFilterCards
				stockFilter={stockFilter}
				total={total}
				onFilterChange={setStockFilter}
				stockCounts={stockCounts}
			/>

			{isLoading || countsLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					<Skeleton variant="card" count={6} />
				</div>
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
										isDeleting={isDeleting}
									/>
								</motion.div>
							))}
						</AnimatePresence>
					</motion.div>
					<div className="mt-10">
						<Pagination totalPages={totalPages} />
					</div>
				</>
			) : (
				<Card padding="lg">
					<EmptyState
						icon={<FiPackage className="w-12 h-12" />}
						title="No products yet"
						message="Start building your catalog by adding your first product. It only takes a minute!"
						action={{
							label: "Create Your First Product",
							onClick: handleCreate
						}}
					/>
				</Card>
			)}

			<ProductFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={handleSubmit}
				product={editingProduct}
				isLoading={isCreating || isUpdating}
			/>
		</div>
	);
};

export default ProductsPage;
