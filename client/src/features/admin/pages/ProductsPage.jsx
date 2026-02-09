import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductIcon } from '../../../shared/constants/icons.jsx';
import { Button, Modal, Badge, LoadingSpinner } from '../../../shared/ui/index.js';
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
	FiUser
} from 'react-icons/fi';
import { useAdminProducts } from '../hooks/index.js';

// Mock data for products
const mockProducts = [
	{
		_id: '1',
		name: 'Wireless Bluetooth Headphones',
		description: 'Premium noise-cancelling headphones with 30-hour battery life',
		price: { amount: 299.99, currency: 'USD' },
		countInStock: 45,
		category: { name: 'Electronics' },
		brand: 'AudioTech',
		status: 'active',
		userId: { firstName: 'John', lastName: 'Seller' },
		coverImage: null,
		createdAt: '2026-02-01',
	},
	{
		_id: '2',
		name: 'Smart Watch Pro',
		description: 'Advanced fitness tracking with GPS and heart rate monitor',
		price: { amount: 399.99, currency: 'USD' },
		countInStock: 0,
		category: { name: 'Electronics' },
		brand: 'TechWear',
		status: 'active',
		userId: { firstName: 'Sarah', lastName: 'Tech' },
		coverImage: null,
		createdAt: '2026-01-28',
	},
	{
		_id: '3',
		name: 'Organic Cotton T-Shirt',
		description: 'Eco-friendly, comfortable cotton t-shirt',
		price: { amount: 34.99, currency: 'USD' },
		countInStock: 200,
		category: { name: 'Fashion' },
		brand: 'EcoWear',
		status: 'draft',
		userId: { firstName: 'Mike', lastName: 'Fashion' },
		coverImage: null,
		createdAt: '2026-02-05',
	},
	{
		_id: '4',
		name: 'Professional DSLR Camera',
		description: '45MP full-frame camera for professional photography',
		price: { amount: 2499.99, currency: 'USD' },
		countInStock: 8,
		category: { name: 'Electronics' },
		brand: 'PhotoPro',
		status: 'active',
		userId: { firstName: 'Emily', lastName: 'Photo' },
		coverImage: null,
		createdAt: '2026-01-15',
	},
	{
		_id: '5',
		name: 'Handmade Leather Wallet',
		description: 'Premium Italian leather with RFID protection',
		price: { amount: 89.99, currency: 'USD' },
		countInStock: 35,
		category: { name: 'Accessories' },
		brand: 'LeatherCraft',
		status: 'inactive',
		userId: { firstName: 'Alex', lastName: 'Craft' },
		coverImage: null,
		createdAt: '2026-02-03',
	},
];

const statusConfig = {
	active: { color: 'success', label: 'Active' },
	draft: { color: 'warning', label: 'Draft' },
	inactive: { color: 'error', label: 'Inactive' },
	archived: { color: 'default', label: 'Archived' },
};

// Product Detail Modal
const ProductDetailModal = ({ isOpen, onClose, product }) => {
	if (!product) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="lg">
			<div className="space-y-6">
				{/* Product Header */}
				<div className="flex gap-6">
					<div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
						{product.coverImage?.secure_url ? (
							<img src={product.coverImage.secure_url} alt="" className="w-full h-full object-cover" />
						) : (
							<FiImage className="w-12 h-12 text-gray-400" />
						)}
					</div>
					<div className="flex-1">
						<h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
						<p className="text-gray-500 mb-3">{product.description}</p>
						<div className="flex items-center gap-3">
							<Badge variant={statusConfig[product.status]?.color}>
								{statusConfig[product.status]?.label}
							</Badge>
							<span className="text-sm text-gray-500">{product.brand}</span>
						</div>
					</div>
				</div>

				{/* Product Info Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-gray-50 rounded-xl p-4">
						<div className="flex items-center gap-2 text-gray-500 mb-1">
							<FiDollarSign className="w-4 h-4" />
							<span className="text-sm">Price</span>
						</div>
						<p className="text-xl font-bold text-gray-900">${product.price?.amount?.toFixed(2)}</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-4">
						<div className="flex items-center gap-2 text-gray-500 mb-1">
							<FiPackage className="w-4 h-4" />
							<span className="text-sm">Stock</span>
						</div>
						<p className={`text-xl font-bold ${product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
							{product.countInStock}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-4">
						<div className="flex items-center gap-2 text-gray-500 mb-1">
							<ProductIcon className="w-4 h-4" />
							<span className="text-sm">Category</span>
						</div>
						<p className="text-lg font-semibold text-gray-900">{product.category?.name || 'N/A'}</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-4">
						<div className="flex items-center gap-2 text-gray-500 mb-1">
							<FiUser className="w-4 h-4" />
							<span className="text-sm">Seller</span>
						</div>
						<p className="text-lg font-semibold text-gray-900">
							{product.userId?.firstName} {product.userId?.lastName}
						</p>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-3 pt-4 border-t border-gray-100">
					<Button variant="secondary" onClick={onClose} fullWidth>
						Close
					</Button>
					<Button 
						variant={product.status === 'active' ? 'warning' : 'primary'} 
						fullWidth
						icon={product.status === 'active' ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
					>
						{product.status === 'active' ? 'Deactivate' : 'Activate'}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

// Product Row Component
const ProductRow = ({ product, onView, onToggleStatus, onDelete, isDeleting }) => (
	<motion.tr
		layout
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
	>
		<td className="py-4 px-6">
			<div className="flex items-center gap-4">
				<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
					{product.coverImage?.secure_url ? (
						<img src={product.coverImage.secure_url} alt="" className="w-full h-full object-cover" />
					) : (
						<FiImage className="w-6 h-6 text-gray-400" />
					)}
				</div>
				<div>
					<h4 className="font-semibold text-gray-900">{product.name}</h4>
					<p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
				</div>
			</div>
		</td>
		<td className="py-4 px-6">
			<span className="font-bold text-emerald-600">${product.price?.amount?.toFixed(2)}</span>
		</td>
		<td className="py-4 px-6">
			<span className={`font-medium ${product.countInStock > 10 ? 'text-emerald-600' : product.countInStock > 0 ? 'text-amber-600' : 'text-rose-600'}`}>
				{product.countInStock}
			</span>
		</td>
		<td className="py-4 px-6">
			<span className="text-gray-600">{product.category?.name || 'N/A'}</span>
		</td>
		<td className="py-4 px-6">
			<span className="text-gray-600 text-sm">
				{product.userId?.firstName} {product.userId?.lastName?.[0]}.
			</span>
		</td>
		<td className="py-4 px-6">
			<Badge variant={statusConfig[product.status]?.color || 'default'}>
				{statusConfig[product.status]?.label || product.status}
			</Badge>
		</td>
		<td className="py-4 px-6">
			<div className="flex items-center gap-2">
				<button
					onClick={() => onView(product)}
					className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600"
					title="View details"
				>
					<FiEye className="w-4 h-4" />
				</button>
				<button
					onClick={() => onToggleStatus(product)}
					className={`p-2 rounded-lg transition-colors ${product.status === 'active' ? 'hover:bg-amber-100 text-amber-600' : 'hover:bg-emerald-100 text-emerald-600'}`}
					title={product.status === 'active' ? 'Deactivate' : 'Activate'}
				>
					{product.status === 'active' ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
				</button>
				<button
					onClick={() => onDelete(product._id)}
					className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600"
					title="Delete product"
					disabled={isDeleting}
				>
					<FiTrash2 className="w-4 h-4" />
				</button>
			</div>
		</td>
	</motion.tr>
);

// Stats Card
const StatsCard = ({ title, value, icon: Icon, gradient, trend }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-5 border border-gray-100"
	>
		<div className="flex items-center justify-between">
			<div>
				<h4 className="text-2xl font-bold text-gray-900">{value}</h4>
				<p className="text-sm text-gray-500">{title}</p>
				{trend && (
					<span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
						{trend > 0 ? '+' : ''}{trend}% this month
					</span>
				)}
			</div>
			<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
				<Icon className="w-6 h-6 text-white" />
			</div>
		</div>
	</motion.div>
);

// Main Products Page
const ProductsPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [viewingProduct, setViewingProduct] = useState(null);
	const [deletingId, setDeletingId] = useState(null);
	
	// Real hook
	const { products: fetchedProducts, isLoading: isProductsLoading } = useAdminProducts();
	
	// Fallback to mock data
	const products = fetchedProducts?.length > 0 ? fetchedProducts : mockProducts;
	const isLoading = isProductsLoading;

	// Calculate stats
	const stats = useMemo(() => ({
		total: products.length,
		active: products.filter(p => p.status === 'active').length,
		outOfStock: products.filter(p => p.countInStock === 0).length,
		totalValue: products.reduce((sum, p) => sum + (p.price?.amount || 0) * (p.countInStock || 0), 0),
	}), [products]);

	// Get unique categories
	const categories = useMemo(() => {
		const cats = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
		return cats;
	}, [products]);

	// Filter products
	const filteredProducts = useMemo(() => {
		return products.filter(product => {
			const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
			const matchesCategory = categoryFilter === 'all' || product.category?.name === categoryFilter;
			return matchesSearch && matchesStatus && matchesCategory;
		});
	}, [products, searchQuery, statusFilter, categoryFilter]);

	const handleView = (product) => {
		setViewingProduct(product);
	};

	const handleToggleStatus = (product) => {
		const newStatus = product.status === 'active' ? 'inactive' : 'active';
		setProducts(prev => prev.map(p => 
			p._id === product._id ? { ...p, status: newStatus } : p
		));
		// TODO: Call API
	};

	const handleDelete = (id) => {
		setDeletingId(id);
		setTimeout(() => {
			setProducts(prev => prev.filter(p => p._id !== id));
			setDeletingId(null);
		}, 500);
		// TODO: Call API
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Product Management 📦</h1>
				<p className="text-gray-500 mt-1">Manage all products across the platform</p>
			</div>

			{/* Stats Row */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard title="Total Products" value={stats.total} icon={ProductIcon} gradient="from-indigo-500 to-purple-600" trend={12} />
				<StatsCard title="Active Listings" value={stats.active} icon={FiEye} gradient="from-emerald-500 to-teal-600" trend={8} />
				<StatsCard title="Out of Stock" value={stats.outOfStock} icon={FiPackage} gradient="from-amber-500 to-orange-500" trend={-5} />
				<StatsCard title="Total Value" value={`$${(stats.totalValue / 1000).toFixed(1)}K`} icon={FiDollarSign} gradient="from-rose-500 to-pink-600" trend={15} />
			</div>

			{/* Filters */}
			<div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100">
				<div className="relative flex-1">
					<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search products..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					/>
				</div>
				<div className="flex items-center gap-2">
					<FiFilter className="text-gray-400 w-5 h-5" />
					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					>
						<option value="all">All Categories</option>
						{categories.map(cat => (
							<option key={cat} value={cat}>{cat}</option>
						))}
					</select>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					>
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="draft">Draft</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>

			{/* Products Table */}
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
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Price</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Stock</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Category</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Seller</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Actions</th>
								</tr>
							</thead>
							<tbody>
								<AnimatePresence mode="popLayout">
									{filteredProducts.map(product => (
										<ProductRow 
											key={product._id}
											product={product}
											onView={handleView}
											onToggleStatus={handleToggleStatus}
											onDelete={handleDelete}
											isDeleting={deletingId === product._id}
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
						<ProductIcon className="w-10 h-10 text-indigo-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
					<p className="text-gray-500">Try adjusting your search or filters</p>
				</div>
			)}

			{/* Product Detail Modal */}
			<ProductDetailModal
				isOpen={!!viewingProduct}
				onClose={() => setViewingProduct(null)}
				product={viewingProduct}
			/>
		</div>
	);
};

export default ProductsPage;
