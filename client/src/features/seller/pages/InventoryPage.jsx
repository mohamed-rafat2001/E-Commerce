import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	InventoryIcon, 
	ProductIcon 
} from '../../../shared/constants/icons.jsx';
import { Button, Badge, LoadingSpinner, Input } from '../../../shared/ui/index.js';
import { FiSearch, FiFilter, FiAlertTriangle, FiTrendingUp, FiTrendingDown, FiPackage, FiEdit2, FiSave } from 'react-icons/fi';
import useSellerProducts from '../hooks/useSellerProducts.js';
import useUpdateProduct from '../hooks/useUpdateProduct.js';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, gradient, trend }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
	>
		<div className="flex items-center justify-between">
			<div>
				<p className="text-gray-500 text-sm font-medium">{title}</p>
				<h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
				{trend && (
					<div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
						{trend > 0 ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
						<span>{Math.abs(trend)}% from last month</span>
					</div>
				)}
			</div>
			<div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient}`}>
				<Icon className="w-7 h-7 text-white" />
			</div>
		</div>
	</motion.div>
);

// Inventory Row Component
const InventoryRow = ({ product, onUpdateStock, isUpdating }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newStock, setNewStock] = useState(product.countInStock);

	const stockStatus = product.countInStock === 0 ? 'out' : product.countInStock <= 10 ? 'low' : 'good';
	const statusConfig = {
		out: { color: 'bg-rose-100 text-rose-700', label: 'Out of Stock', icon: FiAlertTriangle },
		low: { color: 'bg-amber-100 text-amber-700', label: 'Low Stock', icon: FiAlertTriangle },
		good: { color: 'bg-emerald-100 text-emerald-700', label: 'In Stock', icon: FiPackage },
	};

	const StatusIcon = statusConfig[stockStatus].icon;

	const handleSave = () => {
		onUpdateStock(product._id, parseInt(newStock));
		setIsEditing(false);
	};

	return (
		<motion.tr
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
		>
			<td className="py-4 px-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
						{product.coverImage?.secure_url ? (
							<img 
								src={product.coverImage.secure_url} 
								alt={product.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<ProductIcon className="w-6 h-6 text-gray-400" />
						)}
					</div>
					<div>
						<h4 className="font-semibold text-gray-900">{product.name}</h4>
						<p className="text-sm text-gray-500">{product.brand}</p>
					</div>
				</div>
			</td>
			<td className="py-4 px-6">
				<span className="text-gray-600">{product.category?.name || 'Uncategorized'}</span>
			</td>
			<td className="py-4 px-6">
				<span className="font-semibold text-gray-900">${product.price?.amount?.toFixed(2) || '0.00'}</span>
			</td>
			<td className="py-4 px-6">
				{isEditing ? (
					<div className="flex items-center gap-2">
						<input
							type="number"
							value={newStock}
							onChange={(e) => setNewStock(e.target.value)}
							min="0"
							className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
						<Button 
							size="sm" 
							onClick={handleSave} 
							loading={isUpdating}
							icon={<FiSave className="w-4 h-4" />}
						>
							Save
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<span className={`font-bold text-xl ${stockStatus === 'out' ? 'text-rose-600' : stockStatus === 'low' ? 'text-amber-600' : 'text-gray-900'}`}>
							{product.countInStock}
						</span>
						<button
							onClick={() => setIsEditing(true)}
							className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<FiEdit2 className="w-4 h-4 text-gray-400" />
						</button>
					</div>
				)}
			</td>
			<td className="py-4 px-6">
				<span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[stockStatus].color}`}>
					{StatusIcon && <StatusIcon className="w-4 h-4" />}
					{statusConfig[stockStatus].label}
				</span>
			</td>
		</motion.tr>
	);
};

// Main Inventory Page
const InventoryPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [stockFilter, setStockFilter] = useState('all');
	const [updatingId, setUpdatingId] = useState(null);

	const { products, isLoading, refetch } = useSellerProducts();
	const { updateProduct, isUpdating } = useUpdateProduct();

	// Calculate inventory stats
	const inventoryStats = useMemo(() => {
		const totalProducts = products.length;
		const totalStock = products.reduce((sum, p) => sum + (p.countInStock || 0), 0);
		const outOfStock = products.filter(p => p.countInStock === 0).length;
		const lowStock = products.filter(p => p.countInStock > 0 && p.countInStock <= 10).length;
		
		return { totalProducts, totalStock, outOfStock, lowStock };
	}, [products]);

	// Filter products
	const filteredProducts = useMemo(() => {
		return products.filter(product => {
			const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
			
			let matchesStock = true;
			if (stockFilter === 'out') matchesStock = product.countInStock === 0;
			else if (stockFilter === 'low') matchesStock = product.countInStock > 0 && product.countInStock <= 10;
			else if (stockFilter === 'good') matchesStock = product.countInStock > 10;
			
			return matchesSearch && matchesStock;
		});
	}, [products, searchQuery, stockFilter]);

	const handleUpdateStock = (productId, newStock) => {
		setUpdatingId(productId);
		updateProduct({ id: productId, product: { countInStock: newStock } }, {
			onSuccess: () => {
				setUpdatingId(null);
				refetch();
			},
			onError: () => {
				setUpdatingId(null);
			}
		});
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Inventory Management 📊</h1>
				<p className="text-gray-500 mt-1">Monitor and manage your stock levels</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Total Products"
					value={inventoryStats.totalProducts}
					icon={ProductIcon}
					gradient="from-indigo-500 to-purple-600"
				/>
				<StatCard
					title="Total Stock"
					value={inventoryStats.totalStock.toLocaleString()}
					icon={FiPackage}
					gradient="from-emerald-500 to-teal-600"
				/>
				<StatCard
					title="Low Stock"
					value={inventoryStats.lowStock}
					icon={FiAlertTriangle}
					gradient="from-amber-500 to-orange-600"
				/>
				<StatCard
					title="Out of Stock"
					value={inventoryStats.outOfStock}
					icon={FiAlertTriangle}
					gradient="from-rose-500 to-red-600"
				/>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100">
				<div className="relative flex-1">
					<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search by name or brand..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					/>
				</div>
				<div className="flex items-center gap-2">
					<FiFilter className="text-gray-400 w-5 h-5" />
					<select
						value={stockFilter}
						onChange={(e) => setStockFilter(e.target.value)}
						className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					>
						<option value="all">All Stock Levels</option>
						<option value="good">In Stock (10+)</option>
						<option value="low">Low Stock (1-10)</option>
						<option value="out">Out of Stock</option>
					</select>
				</div>
			</div>

			{/* Inventory Table */}
			{isLoading ? (
				<div className="flex justify-center py-20">
					<LoadingSpinner />
				</div>
			) : filteredProducts.length > 0 ? (
				<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Product</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Category</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Price</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Stock</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
								</tr>
							</thead>
							<tbody>
								<AnimatePresence mode="popLayout">
									{filteredProducts.map(product => (
										<InventoryRow 
											key={product._id}
											product={product}
											onUpdateStock={handleUpdateStock}
											isUpdating={isUpdating && updatingId === product._id}
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
						<InventoryIcon className="w-10 h-10 text-indigo-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
					<p className="text-gray-500">
						{searchQuery || stockFilter !== 'all' 
							? 'Try adjusting your filters'
							: 'Add products to start managing inventory'}
					</p>
				</div>
			)}
		</div>
	);
};

export default InventoryPage;
