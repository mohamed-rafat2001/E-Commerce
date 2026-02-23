import { useSearchParams } from 'react-router-dom';
import { DataHeader, Pagination } from '../../../shared/ui/index.js';
import { useSellerInventoryPage } from '../hooks/index.js';
import InventoryStats from '../components/inventory/InventoryStats.jsx';
import InventoryTable from '../components/inventory/InventoryTable.jsx';

const InventoryPage = () => {
	const [searchParams] = useSearchParams();
	const searchQuery = searchParams.get('search') || '';
	const stockFilter = searchParams.get('stock') || 'all';

	const {
		filteredProducts,
		total,
		totalPages,
		isLoading,
		handleUpdateStock,
		stats,
	} = useSellerInventoryPage();

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<DataHeader 
				title="Inventory Management 🏭"
				description={`${total || 0} items in inventory`}
				searchPlaceholder="Search inventory..."
				filterOptions={[
					{
						key: 'stock',
						label: 'All Stock',
						options: [
							{ value: 'in_stock', label: 'In Stock (>10)' },
							{ value: 'low_stock', label: 'Low Stock (≤10)' },
							{ value: 'out_of_stock', label: 'Out of Stock (0)' }
						]
					}
				]}
				sortOptions={[
					{ label: 'Newest First', value: '-createdAt' },
					{ label: 'Oldest First', value: 'createdAt' },
					{ label: 'Stock: Low to High', value: 'countInStock' },
					{ label: 'Stock: High to Low', value: '-countInStock' }
				]}
			/>

			{/* Summary Stats */}
			<InventoryStats 
				totalProducts={stats.totalProducts}
				inStockCount={stats.inStockCount}
				lowStockCount={stats.lowStockCount}
				outOfStockCount={stats.outOfStockCount}
			/>

			{/* Inventory Table */}
			<InventoryTable 
				isLoading={isLoading}
				filteredProducts={filteredProducts}
				searchQuery={searchQuery}
				stockFilter={stockFilter}
				handleUpdateStock={handleUpdateStock}
			/>

			<Pagination totalPages={totalPages} />
		</div>
	);
};

export default InventoryPage;
