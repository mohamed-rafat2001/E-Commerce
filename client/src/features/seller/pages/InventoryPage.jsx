import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner, Badge, Select } from '../../../shared/ui/index.js';
import { 
	FiSearch, FiFilter, FiArchive, FiAlertTriangle, 
	FiCheck, FiX, FiEdit2, FiSave, FiPackage 
} from 'react-icons/fi';
import { useSellerInventoryPage } from '../hooks/index.js';
import toast from 'react-hot-toast';

const InventoryRow = ({ product, onUpdateStock }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [stockValue, setStockValue] = useState(product.countInStock);

	const getStockBadge = (count) => {
		if (count === 0) return { variant: 'danger', label: 'Out of Stock' };
		if (count <= 10) return { variant: 'warning', label: 'Low Stock' };
		return { variant: 'success', label: 'In Stock' };
	};

	const badge = getStockBadge(product.countInStock);

	const handleSave = () => {
		if (stockValue < 0) {
			toast.error('Stock cannot be negative');
			return;
		}
		onUpdateStock(product._id, Number(stockValue));
		setIsEditing(false);
	};

	const handleCancel = () => {
		setStockValue(product.countInStock);
		setIsEditing(false);
	};

	return (
		<motion.tr
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="hover:bg-gray-50/50 transition-colors"
		>
			{/* Product Info */}
			<td className="py-4 px-4">
				<div className="flex items-center gap-3">
					{product.coverImage?.secure_url ? (
						<img 
							src={product.coverImage.secure_url} 
							alt={product.name} 
							className="w-12 h-12 rounded-xl object-cover border border-gray-100" 
							crossOrigin="anonymous"
						/>
					) : (
						<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
							<FiPackage className="w-5 h-5 text-indigo-500" />
						</div>
					)}
					<div>
						<h4 className="font-bold text-gray-900 text-sm">{product.name}</h4>
						<p className="text-xs text-gray-500">{product.brand}</p>
					</div>
				</div>
			</td>

			{/* Category */}
			<td className="py-4 px-4">
				<span className="text-sm text-gray-600">
					{product.category?.name || 'Uncategorized'}
				</span>
			</td>

			{/* Price */}
			<td className="py-4 px-4">
				<span className="font-bold text-gray-900">
					${product.price?.amount?.toFixed(2) || '0.00'}
				</span>
			</td>

			{/* Stock */}
			<td className="py-4 px-4">
				{isEditing ? (
					<div className="flex items-center gap-2">
						<input
							type="number"
							value={stockValue}
							onChange={(e) => setStockValue(e.target.value)}
							className="w-20 px-3 py-2 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-bold outline-none"
							min="0"
							autoFocus
						/>
						<button 
							onClick={handleSave}
							className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
						>
							<FiSave className="w-4 h-4" />
						</button>
						<button 
							onClick={handleCancel}
							className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
						>
							<FiX className="w-4 h-4" />
						</button>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<span className={`font-bold text-sm ${
							product.countInStock === 0 ? 'text-rose-600' :
							product.countInStock <= 10 ? 'text-amber-600' :
							'text-gray-900'
						}`}>
							{product.countInStock}
						</span>
						<button 
							onClick={() => setIsEditing(true)}
							className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
						>
							<FiEdit2 className="w-3.5 h-3.5" />
						</button>
					</div>
				)}
			</td>

			{/* Status */}
			<td className="py-4 px-4">
				<Badge variant={badge.variant} size="sm">{badge.label}</Badge>
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
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
			>
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Inventory Manager 📊</h1>
					<p className="text-gray-500 font-medium mt-1">Track and manage your product stock levels</p>
				</div>
			</motion.div>

			{/* Summary Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{ label: 'Total Products', value: totalProducts, gradient: 'from-indigo-500 to-purple-600', icon: FiPackage },
					{ label: 'In Stock', value: inStockCount, gradient: 'from-emerald-500 to-teal-600', icon: FiCheck },
					{ label: 'Low Stock', value: lowStockCount, gradient: 'from-amber-500 to-orange-500', icon: FiAlertTriangle },
					{ label: 'Out of Stock', value: outOfStockCount, gradient: 'from-rose-500 to-red-500', icon: FiX },
				].map((stat, index) => (
					<motion.div
						key={stat.label}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500 font-medium">{stat.label}</p>
								<h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
							</div>
							<div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
								<stat.icon className="w-5 h-5 text-white" />
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Search & Filter */}
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
					<FiFilter className="text-gray-400 w-5 h-5 flex-shrink-0" />
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

			{/* Inventory Table */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
					<LoadingSpinner size="lg" color="indigo" />
					<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Inventory...</p>
				</div>
			) : filteredProducts && filteredProducts.length > 0 ? (
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
			) : (
				<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
					<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<FiArchive className="w-10 h-10 text-indigo-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
					<p className="text-gray-500 max-w-sm mx-auto">
						{searchQuery || stockFilter !== 'all'
							? 'Try adjusting your search or filters'
							: 'Add products to start tracking inventory'}
					</p>
				</div>
			)}
		</div>
	);
};

export default InventoryPage;