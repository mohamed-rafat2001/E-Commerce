import { FiPackage, FiCheck, FiAlertTriangle, FiX } from 'react-icons/fi';

const StockFilterCards = ({ stockFilter, total, onFilterChange }) => {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<button
				onClick={() => onFilterChange('all')}
				className={`rounded-2xl p-5 border transition-all duration-300 ${
					stockFilter === 'all' 
						? 'border-indigo-500 ring-2 ring-indigo-200 bg-white shadow' 
						: 'border-gray-100 bg-white hover:shadow'
				}`}
			>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-500 font-medium">All Products</p>
						<h3 className="text-2xl font-black text-gray-900 mt-1">{total || 0}</h3>
					</div>
					<div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
						<FiPackage className="w-5 h-5 text-white" />
					</div>
				</div>
			</button>
			<button
				onClick={() => onFilterChange('in_stock')}
				className={`rounded-2xl p-5 border transition-all duration-300 ${
					stockFilter === 'in_stock' 
						? 'border-emerald-500 ring-2 ring-emerald-200 bg-white shadow' 
						: 'border-gray-100 bg-white hover:shadow'
				}`}
			>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-500 font-medium">In Stock</p>
						<h3 className="text-2xl font-black text-gray-900 mt-1">—</h3>
					</div>
					<div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
						<FiCheck className="w-5 h-5 text-white" />
					</div>
				</div>
			</button>
			<button
				onClick={() => onFilterChange('low_stock')}
				className={`rounded-2xl p-5 border transition-all duration-300 ${
					stockFilter === 'low_stock' 
						? 'border-amber-500 ring-2 ring-amber-200 bg-white shadow' 
						: 'border-gray-100 bg-white hover:shadow'
				}`}
			>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-500 font-medium">Low Stock</p>
						<h3 className="text-2xl font-black text-gray-900 mt-1">—</h3>
					</div>
					<div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center">
						<FiAlertTriangle className="w-5 h-5 text-white" />
					</div>
				</div>
			</button>
			<button
				onClick={() => onFilterChange('out_of_stock')}
				className={`rounded-2xl p-5 border transition-all duration-300 ${
					stockFilter === 'out_of_stock' 
						? 'border-rose-500 ring-2 ring-rose-200 bg-white shadow' 
						: 'border-gray-100 bg-white hover:shadow'
				}`}
			>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-500 font-medium">Out of Stock</p>
						<h3 className="text-2xl font-black text-gray-900 mt-1">—</h3>
					</div>
					<div className="w-10 h-10 rounded-xl bg-linear-to-br from-rose-500 to-red-500 flex items-center justify-center">
						<FiX className="w-5 h-5 text-white" />
					</div>
				</div>
			</button>
		</div>
	);
};

export default StockFilterCards;

