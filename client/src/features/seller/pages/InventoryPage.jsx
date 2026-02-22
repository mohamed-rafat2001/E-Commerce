import { useSellerInventoryPage } from '../hooks/index.js';
import InventoryHeader from '../components/inventory/InventoryHeader.jsx';
import InventoryStats from '../components/inventory/InventoryStats.jsx';
import InventoryFilter from '../components/inventory/InventoryFilter.jsx';
import InventoryTable from '../components/inventory/InventoryTable.jsx';

const InventoryPage = () => {
	const {
		searchQuery,
		setSearchQuery,
		stockFilter,
		setStockFilter,
		filteredProducts,
		isLoading,
		handleUpdateStock,
	} = useSellerInventoryPage();

	// Calculate summary stats
	const totalProducts = filteredProducts?.length || 0;
	const lowStockCount = filteredProducts?.filter(p => p.countInStock > 0 && p.countInStock <= 10).length || 0;
	const outOfStockCount = filteredProducts?.filter(p => p.countInStock === 0).length || 0;
	const inStockCount = filteredProducts?.filter(p => p.countInStock > 10).length || 0;

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<InventoryHeader />

			{/* Summary Stats */}
			<InventoryStats 
				totalProducts={totalProducts}
				inStockCount={inStockCount}
				lowStockCount={lowStockCount}
				outOfStockCount={outOfStockCount}
			/>

			{/* Search & Filter */}
			<InventoryFilter 
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				stockFilter={stockFilter}
				setStockFilter={setStockFilter}
			/>

			{/* Inventory Table */}
			<InventoryTable 
				isLoading={isLoading}
				filteredProducts={filteredProducts}
				searchQuery={searchQuery}
				stockFilter={stockFilter}
				handleUpdateStock={handleUpdateStock}
			/>
		</div>
	);
};

export default InventoryPage;
