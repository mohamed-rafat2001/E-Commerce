import { FiSearch, FiFilter } from 'react-icons/fi';
import { Select } from '../../../../shared/ui/index.js';

const InventoryFilter = ({ searchQuery, setSearchQuery, stockFilter, setStockFilter }) => {
	return (
		<div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
			<div className="relative flex-1">
				<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
				<input
					type="text"
					placeholder="Search products..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-medium"
				/>
			</div>
			<div className="flex items-center gap-2">
				<FiFilter className="text-gray-400 w-5 h-5 shrink-0" />
				<Select
					containerClassName="min-w-[180px]"
					value={stockFilter}
					onChange={setStockFilter}
					options={[
						{ value: 'all', label: 'All Products' },
						{ value: 'in_stock', label: 'In Stock' },
						{ value: 'low_stock', label: 'Low Stock' },
						{ value: 'out_of_stock', label: 'Out of Stock' },
					]}
				/>
			</div>
		</div>
	);
};

export default InventoryFilter;
