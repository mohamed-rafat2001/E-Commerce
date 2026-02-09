import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	InventoryIcon, 
	ProductIcon 
} from '../../../shared/constants/icons.jsx';
import { Button, Badge, LoadingSpinner, Input, Select } from '../../../shared/ui/index.js';
import { FiSearch, FiFilter, FiAlertTriangle, FiTrendingUp, FiTrendingDown, FiPackage, FiEdit2, FiSave } from 'react-icons/fi';
import { useSellerInventoryPage } from '../hooks/index.js';

// Inventory Row Component
const InventoryRow = ({ product, onUpdateStock, isUpdating }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newStock, setNewStock] = useState(product.countInStock);

	const stockStatus = product.countInStock === 0 ? 'out' : product.countInStock <= 10 ? 'low' : 'good';
	const statusConfig = {
		out: { color: 'danger', label: 'Depleted', icon: FiAlertTriangle },
		low: { color: 'warning', label: 'Critical', icon: FiAlertTriangle },
		good: { color: 'success', label: 'Optimal', icon: FiPackage },
	};

	const handleSave = () => {
		onUpdateStock(product._id, parseInt(newStock));
		setIsEditing(false);
	};

	return (
		<motion.tr
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="border-b border-slate-50 hover:bg-slate-50 transition-all group/row"
		>
			<td className="py-3 px-4 whitespace-nowrap">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 flex-shrink-0 shadow-xs">
						{product.coverImage?.secure_url ? (
							<img src={product.coverImage.secure_url} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
						) : (
							<ProductIcon className="w-5 h-5 text-slate-300" />
						)}
					</div>
					<div>
						<h4 className="font-black text-gray-900 text-[11px] tracking-tight truncate max-w-[150px] uppercase leading-none mb-0.5">{product.name}</h4>
						<p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">{product.brand}</p>
					</div>
				</div>
			</td>
			<td className="py-3 px-3 whitespace-nowrap">
				<span className="text-gray-500 font-black text-[8px] uppercase tracking-[0.2em] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
					{product.category?.name || 'N/A'}
				</span>
			</td>
			<td className="py-3 px-3 whitespace-nowrap">
				<span className="font-black text-indigo-600 text-xs tabular-nums tracking-tight">${product.price?.amount?.toFixed(2)}</span>
			</td>
			<td className="py-3 px-3 whitespace-nowrap">
				{isEditing ? (
					<div className="flex items-center gap-2">
						<input
							type="number"
							value={newStock}
							onChange={(e) => setNewStock(e.target.value)}
							min="0"
							autoFocus
							className="w-20 px-3 py-1.5 rounded-lg border-2 border-indigo-200 bg-white outline-none font-black text-xs shadow-inner"
						/>
						<button onClick={handleSave} title="Save Stock" className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-black transition-colors shadow-lg shadow-indigo-100"><FiSave className="w-3.5 h-3.5" /></button>
					</div>
				) : (
					<div className="flex items-center gap-4">
						<span className={`font-black text-base tabular-nums ${stockStatus === 'out' ? 'text-rose-600' : stockStatus === 'low' ? 'text-amber-600' : 'text-gray-900'}`}>
							{product.countInStock}
						</span>
						<button onClick={() => setIsEditing(true)} title="Edit Stock" className="p-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg border border-indigo-100 transition-all shadow-xs">
							<FiEdit2 className="w-3.5 h-3.5" />
						</button>
					</div>
				)}
			</td>
			<td className="py-3 px-4 whitespace-nowrap">
				<Badge variant={statusConfig[stockStatus].color} size="sm" dot className="text-[9px] py-0.5 px-2 font-black uppercase tracking-widest">
					{statusConfig[stockStatus].label}
				</Badge>
			</td>
		</motion.tr>
	);
};

const InventoryPage = () => {
	const {
		searchQuery,
		setSearchQuery,
		stockFilter,
		setStockFilter,
		products,
		isLoading,
		handleUpdateStock,
		refetch
	} = useSellerInventoryPage();

	return (
		<div className="space-y-8 pb-10">
			<div>
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
						<InventoryIcon className="w-6 h-6" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
				</div>
				<p className="text-sm text-gray-500 mt-1">Track and manage your product stock levels</p>
			</div>

			<div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/50 space-y-5">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="relative flex-1 group">
						<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 w-4 h-4 transition-colors" />
						<input
							type="text"
							placeholder="Search by product name or brand..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-slate-50 focus:bg-white focus:ring-[4px] focus:ring-indigo-50 transition-all outline-none font-bold text-xs shadow-inner"
						/>
					</div>
					<Select
						containerClassName="md:w-[250px]"
						label="Stock Level"
						value={stockFilter}
						onChange={setStockFilter}
						options={[{ value: 'all', label: 'All Products' }, { value: 'good', label: 'Well Stocked' }, { value: 'low', label: 'Low Stock' }, { value: 'out', label: 'Out of Stock' }]}
					/>
				</div>

				<div className="overflow-x-auto rounded-3xl border border-slate-100 custom-scrollbar">
					<table className="w-full text-left">
						<thead>
							<tr className="bg-slate-50 border-b border-slate-100">
								<th className="py-5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Product</th>
								<th className="py-5 px-3 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Category</th>
								<th className="py-5 px-3 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Price</th>
								<th className="py-5 px-3 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Stock</th>
								<th className="py-5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-50">
							{isLoading ? (
								<tr><td colSpan={5} className="py-20 text-center"><LoadingSpinner size="sm" color="indigo" /></td></tr>
							) : products.map(p => (
								<InventoryRow key={p._id} product={p} onUpdateStock={handleUpdateStock} isUpdating={false} />
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default InventoryPage;