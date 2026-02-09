import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductIcon } from '../../../shared/constants/icons.jsx';
import { Button, Modal, Badge, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { 
	FiSearch, 
	FiFilter, 
	FiEdit2, 
	FiTrash2, 
	FiEye, 
	FiEyeOff,
	FiImage,
	FiPackage,
	FiDollarSign,
	FiUser,
	FiChevronDown,
	FiActivity,
	FiTag,
	FiBox,
	FiLayers,
	FiPlus,
	FiArchive,
	FiAlertCircle,
	FiTrendingUp
} from 'react-icons/fi';
import { useAdminProducts } from '../hooks/index.js';

const statusConfig = {
	active: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Active', icon: FiActivity },
	draft: { color: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Draft', icon: FiEdit2 },
	inactive: { color: 'bg-slate-50 text-slate-600 border-slate-100', label: 'Inactive', icon: FiEyeOff },
	archived: { color: 'bg-indigo-50 text-indigo-600 border-indigo-100', label: 'Archived', icon: FiPackage },
};

const statusOptions = [
	{ value: 'active', label: 'Active Node' },
	{ value: 'draft', label: 'Provisional' },
	{ value: 'inactive', label: 'Terminated' },
	{ value: 'archived', label: 'Archived' },
];

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
	<motion.div 
		whileHover={{ y: -5, scale: 1.02 }}
		className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/50 flex items-center justify-between"
	>
		<div className="space-y-1">
			<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
			<h3 className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{value}</h3>
			{trend && <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">+{trend}% Flow</p>}
		</div>
		<div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl shadow-${color.split('-')[1]}-100 transition-transform`}>
			<Icon className="w-7 h-7" />
		</div>
	</motion.div>
);

// Quick Status Selector
const StatusSelector = ({ value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	
	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-wider transition-all ${statusConfig[value]?.color} hover:shadow-md`}
			>
				<div className={`w-1.5 h-1.5 rounded-full ${value === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
				{statusConfig[value]?.label}
				<FiChevronDown className={`w-2 h-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			
			<AnimatePresence>
				{isOpen && (
					<>
						<div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
						<motion.div
							initial={{ opacity: 0, y: 5, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 5, scale: 0.95 }}
							className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-slate-100 p-1 z-40"
						>
							{statusOptions.map((opt) => (
								<button
									key={opt.value}
									onClick={() => { onChange(opt.value); setIsOpen(false); }}
									className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}
								>
									<div className={`w-1 h-1 rounded-full ${opt.value === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
									<span className="text-[9px] font-black uppercase tracking-tight">{opt.label}</span>
								</button>
							))}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

// Product Row Component
const ProductRow = ({ product, onView, onDelete, onUpdateField, isDeleting }) => {
	const [isEditingStock, setIsEditingStock] = useState(false);
	const [stockVal, setStockVal] = useState(product.countInStock);

	return (
		<motion.tr
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="border-b border-slate-50 hover:bg-slate-50/80 transition-all group/row"
		>
			<td className="py-3 px-4 whitespace-nowrap">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 flex-shrink-0 shadow-xs">
						{product.coverImage?.secure_url ? (
							<img src={product.coverImage.secure_url} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
						) : (
							<FiImage className="w-4 h-4 text-slate-300" />
						)}
					</div>
					<span className="font-black text-gray-900 text-[10px] tracking-tight truncate max-w-[120px] uppercase">{product.name}</span>
				</div>
			</td>
			<td className="py-3 px-4 whitespace-nowrap">
				<div className="flex items-center gap-1.5 text-gray-400">
					<FiTag className="w-3 h-3" />
					<span className="text-[9px] font-extrabold uppercase tracking-widest">{product.brand}</span>
				</div>
			</td>
			<td className="py-3 px-3 whitespace-nowrap">
				<span className="font-black text-indigo-600 text-[11px] tabular-nums tracking-tighter">${product.price?.amount?.toFixed(2)}</span>
			</td>
			<td className="py-3 px-3 whitespace-nowrap">
				{isEditingStock ? (
					<div className="flex items-center gap-1">
						<input
							type="number"
							value={stockVal}
							onChange={(e) => setStockVal(e.target.value)}
							className="w-14 px-2 py-1 rounded bg-white border border-indigo-200 text-[10px] font-black outline-none"
							autoFocus
						/>
						<button 
							onClick={() => { onUpdateField(product._id, { countInStock: parseInt(stockVal) }); setIsEditingStock(false); }}
							className="p-1.5 bg-indigo-600 text-white rounded hover:bg-black transition-colors"
						>
							<FiActivity className="w-3 h-3" />
						</button>
					</div>
				) : (
					<button 
						onClick={() => setIsEditingStock(true)}
						className={`flex items-center gap-1.5 text-[10px] font-black tabular-nums px-2.5 py-1 rounded-xl border transition-all ${product.countInStock > 10 ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' : product.countInStock > 0 ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white' : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white'}`}
					>
						<FiBox className="w-3 h-3" />
						{product.countInStock}
					</button>
				)}
			</td>
			<td className="py-3 px-3 whitespace-nowrap">
				<div className="flex items-center gap-1.5 text-slate-500">
					<FiLayers className="w-3 h-3" />
					<span className="font-black text-[8px] uppercase tracking-[0.15em] italic">{product.category?.name || '---'}</span>
				</div>
			</td>
			<td className="py-3 px-3 whitespace-nowrap">
				<StatusSelector 
					value={product.status} 
					onChange={(newStatus) => onUpdateField(product._id, { status: newStatus })} 
				/>
			</td>
			<td className="py-3 px-4 whitespace-nowrap text-right">
				<div className="flex items-center justify-end gap-1">
					<button onClick={() => onView(product)} className="p-1.5 bg-white hover:bg-slate-50 text-indigo-500 rounded-lg shadow-xs border border-slate-100"><FiEye className="w-3 h-3" /></button>
					<button onClick={() => onDelete(product._id)} className="p-1.5 bg-white hover:bg-rose-50 text-rose-500 rounded-lg shadow-xs border border-slate-100" disabled={isDeleting}><FiTrash2 className="w-3 h-3" /></button>
				</div>
			</td>
		</motion.tr>
	);
};

const ProductsPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [viewingProduct, setViewingProduct] = useState(null);
	
	const { products: fetchedProducts, isLoading, updateProduct } = useAdminProducts();
	const products = fetchedProducts || [];

	const categories = useMemo(() => {
		const cats = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
		return cats;
	}, [products]);

	const filteredProducts = useMemo(() => {
		return products.filter(p => {
			const name = (p.name || '').toLowerCase();
			const brand = (p.brand || '').toLowerCase();
			const matchesSearch = name.includes(searchQuery.toLowerCase()) || brand.includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
			const matchesCategory = categoryFilter === 'all' || p.category?.name === categoryFilter;
			return matchesSearch && matchesStatus && matchesCategory;
		});
	}, [products, searchQuery, statusFilter, categoryFilter]);

	const stats = useMemo(() => {
		return {
			total: products.length,
			active: products.filter(p => p.status === 'active').length,
			draft: products.filter(p => p.status === 'draft').length,
			lowStock: products.filter(p => p.countInStock <= 10 && p.countInStock > 0).length
		};
	}, [products]);

	const handleUpdateField = (id, data) => {
		updateProduct({ id, data });
	};

	return (
		<div className="space-y-8 pb-10">
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
							<FiPackage className="w-7 h-7 font-black" />
						</div>
						<div>
							<h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Asset Manifold</h1>
							<p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Real-Time Inventory Synchronization</p>
						</div>
					</div>
				</div>
				<motion.button 
					whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
					whileTap={{ scale: 0.95 }}
					className="h-14 px-8 rounded-[1.5rem] bg-indigo-600 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-indigo-100"
				>
					<div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
						<FiPlus className="w-4 h-4" />
					</div>
					Release Asset
				</motion.button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard label="Total Inventory" value={stats.total} icon={FiPackage} color="bg-gray-900" trend="5" />
				<StatCard label="Active Nodes" value={stats.active} icon={FiActivity} color="bg-emerald-600" trend="12" />
				<StatCard label="Provisional" value={stats.draft} icon={FiEdit2} color="bg-amber-600" trend="3" />
				<StatCard label="Critical Reserves" value={stats.lowStock} icon={FiAlertCircle} color="bg-rose-600" trend="Low" />
			</div>

			<div className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-slate-200/50 space-y-5">
				<div className="flex flex-col lg:flex-row gap-4 px-2 items-end">
					<div className="relative flex-1 group w-full">
						<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 opacity-0 pointer-events-none">Search Label Placeholder</p>
						<FiSearch className="absolute left-4 top-[calc(50%+10px)] transform -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 w-4 h-4 transition-colors" />
						<input
							type="text"
							placeholder="Scan Resource Registers (Global Search)..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-none bg-slate-50 focus:bg-white focus:ring-[4px] focus:ring-indigo-50 transition-all outline-none font-bold text-xs shadow-inner"
						/>
					</div>
					<div className="flex gap-3 w-full lg:w-auto">
						<Select containerClassName="min-w-[180px] flex-1 lg:flex-none" label="Sector Scan" value={categoryFilter} onChange={setCategoryFilter} options={[{ value: 'all', label: 'All Managed Segments' }, ...categories.map(cat => ({ value: cat, label: cat }))]} />
						<Select containerClassName="min-w-[180px] flex-1 lg:flex-none" label="Lifecycle" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All Lifecycle States' }, ...statusOptions]} />
					</div>
				</div>

				<div className="overflow-x-auto rounded-3xl border border-slate-100 custom-scrollbar">
					<table className="w-full text-left">
						<thead>
							<tr className="bg-slate-50 border-b border-slate-100 italic">
								<th className="py-5 px-4 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Asset (Mapping)</th>
								<th className="py-5 px-4 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Source</th>
								<th className="py-5 px-3 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Valuation</th>
								<th className="py-5 px-3 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Reserve Vol.</th>
								<th className="py-5 px-3 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Segment</th>
								<th className="py-5 px-3 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Lifecycle</th>
								<th className="py-5 px-4 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap text-right">Resource Cmds</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-50">
							{isLoading ? (
								<tr><td colSpan={7} className="py-20 text-center"><LoadingSpinner size="sm" color="indigo" /></td></tr>
							) : filteredProducts.map(p => (
								<ProductRow key={p._id} product={p} onView={setViewingProduct} onUpdateField={handleUpdateField} onDelete={() => {}} isDeleting={false} />
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProductsPage;
