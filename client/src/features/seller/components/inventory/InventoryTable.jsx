import { AnimatePresence } from 'framer-motion';
import { FiArchive } from 'react-icons/fi';
import { LoadingSpinner } from '../../../../shared/ui/index.js';
import InventoryRow from './InventoryRow.jsx';

const InventoryTable = ({ 
	isLoading, 
	filteredProducts, 
	searchQuery, 
	stockFilter, 
	handleUpdateStock 
}) => {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
				<LoadingSpinner size="lg" color="indigo" />
				<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Inventory...</p>
			</div>
		);
	}

	if (!filteredProducts || filteredProducts.length === 0) {
		return (
			<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
				<div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<FiArchive className="w-10 h-10 text-indigo-500" />
				</div>
				<h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
				<p className="text-gray-500 max-w-sm mx-auto">
					{searchQuery || stockFilter !== 'all'
						? 'Try adjusting your search or filters'
						: 'Add products to start tracking inventory'}
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-100 bg-gray-50/50">
							<th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
							<th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
							<th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
							<th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
							<th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-50">
						<AnimatePresence>
							{filteredProducts.map(product => (
								<InventoryRow
									key={product._id}
									product={product}
									onUpdateStock={handleUpdateStock}
								/>
							))}
						</AnimatePresence>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default InventoryTable;
