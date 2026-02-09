import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Modal, Badge, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { 
	FiSearch, 
	FiEdit2, 
	FiTrash2, 
	FiEye, 
	FiEyeOff,
	FiImage,
	FiPackage,
	FiUser,
	FiChevronDown,
	FiActivity,
	FiTag,
	FiBox,
	FiLayers,
	FiPlus,
	FiAlertCircle,
	FiStar,
	FiDollarSign,
	FiGlobe,
	FiLock,
	FiCalendar,
	FiHash,
	FiX,
	FiAlertTriangle,
	FiChevronLeft,
	FiChevronRight,
	FiExternalLink
} from 'react-icons/fi';
import { useAdminProducts, useUpdateProduct, useDeleteProduct, useAdminCategories } from '../hooks/index.js';

// --- Configuration ---
const statusConfig = {
	active: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-500', label: 'Active' },
	draft: { color: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-500', label: 'Draft' },
	inactive: { color: 'bg-slate-50 text-slate-500 border-slate-200', dot: 'bg-slate-400', label: 'Inactive' },
	archived: { color: 'bg-indigo-50 text-indigo-600 border-indigo-100', dot: 'bg-indigo-500', label: 'Archived' },
};

const statusOptions = [
	{ value: 'active', label: 'Active' },
	{ value: 'draft', label: 'Draft' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'archived', label: 'Archived' },
];

const ITEMS_PER_PAGE = 10;

// --- Stat Card ---
const StatCard = ({ label, value, icon: Icon, color }) => (
	<motion.div 
		whileHover={{ y: -4, scale: 1.01 }}
		className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 flex items-center justify-between"
	>
		<div className="space-y-1">
			<p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
			<h3 className="text-3xl font-extrabold text-gray-900 tabular-nums">{value}</h3>
		</div>
		<div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
			<Icon className="w-6 h-6" />
		</div>
	</motion.div>
);

// --- Inline Status Selector ---
const StatusSelector = ({ value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const config = statusConfig[value] || statusConfig.draft;
	
	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${config.color} hover:shadow-sm`}
			>
				<div className={`w-1.5 h-1.5 rounded-full ${config.dot} ${value === 'active' ? 'animate-pulse' : ''}`} />
				{config.label}
				<FiChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			
			<AnimatePresence>
				{isOpen && (
					<>
						<div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
						<motion.div
							initial={{ opacity: 0, y: 5, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 5, scale: 0.95 }}
							className="absolute top-full left-0 mt-1.5 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-40"
						>
							{statusOptions.map((opt) => (
								<button
									key={opt.value}
									onClick={() => { onChange(opt.value); setIsOpen(false); }}
									className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium transition-all ${value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}
								>
									<div className={`w-1.5 h-1.5 rounded-full ${statusConfig[opt.value]?.dot}`} />
									{opt.label}
								</button>
							))}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

// --- Product Detail Modal ---
const ProductDetailModal = ({ product, isOpen, onClose }) => {
	if (!product) return null;

	const rating = product.ratingAverage || 0;
	const reviewCount = product.ratingCount || 0;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="lg">
			<div className="space-y-6">
				{/* Image Section */}
				<div className="flex flex-col sm:flex-row gap-5">
					<div className="w-full sm:w-48 h-48 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
						{product.coverImage?.secure_url ? (
							<img src={product.coverImage.secure_url} alt={product.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
						) : (
							<div className="w-full h-full flex items-center justify-center text-gray-300">
								<FiImage className="w-12 h-12" />
							</div>
						)}
					</div>
					<div className="flex-1 space-y-3">
						<div>
							<h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
							<div className="flex items-center gap-2 mt-1">
								<Badge variant="secondary" className="text-xs">{product.brand}</Badge>
								<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${statusConfig[product.status]?.color}`}>
									<span className={`w-1.5 h-1.5 rounded-full ${statusConfig[product.status]?.dot}`} />
									{statusConfig[product.status]?.label}
								</span>
							</div>
						</div>
						<p className="text-2xl font-extrabold text-indigo-600">${product.price?.amount?.toFixed(2)} <span className="text-sm font-medium text-gray-400">{product.price?.currency}</span></p>
						<div className="flex items-center gap-4 text-sm text-gray-500">
							<span className="flex items-center gap-1.5"><FiStar className="w-4 h-4 text-amber-400" /> {rating.toFixed(1)} ({reviewCount} reviews)</span>
							<span className="flex items-center gap-1.5"><FiBox className="w-4 h-4" /> {product.countInStock} in stock</span>
						</div>
					</div>
				</div>

				{/* Description */}
				<div>
					<h4 className="text-sm font-bold text-gray-700 mb-2">Description</h4>
					<p className="text-sm text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
						{product.description || 'No description provided.'}
					</p>
				</div>

				{/* Additional gallery images */}
				{product.images?.length > 0 && (
					<div>
						<h4 className="text-sm font-bold text-gray-700 mb-2">Gallery ({product.images.length} images)</h4>
						<div className="flex gap-2 overflow-x-auto pb-2">
							{product.images.map((img, i) => (
								<div key={i} className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
									<img src={img.secure_url} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
								</div>
							))}
						</div>
					</div>
				)}

				{/* Metadata Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
							<FiLayers className="w-3.5 h-3.5 text-indigo-500" />
							{product.category?.name || '—'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Visibility</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
							{product.visibility === 'public' ? <FiGlobe className="w-3.5 h-3.5 text-emerald-500" /> : <FiLock className="w-3.5 h-3.5 text-amber-500" />}
							{product.visibility === 'public' ? 'Public' : 'Private'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Seller</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
							<FiUser className="w-3.5 h-3.5 text-blue-500" />
							{product.userId?.firstName ? `${product.userId.firstName} ${product.userId.lastName || ''}` : product.userId || '—'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Slug</p>
						<p className="text-sm font-semibold text-gray-800 truncate">{product.slug || '—'}</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Created</p>
						<p className="text-sm font-semibold text-gray-800">
							{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Updated</p>
						<p className="text-sm font-semibold text-gray-800">
							{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '—'}
						</p>
					</div>
				</div>

				{/* Reviews Preview */}
				{product.reviews?.length > 0 && (
					<div>
						<h4 className="text-sm font-bold text-gray-700 mb-2">Recent Reviews ({product.reviews.length})</h4>
						<div className="space-y-2 max-h-40 overflow-y-auto">
							{product.reviews.slice(0, 3).map((review, i) => (
								<div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
									<div className="flex items-center gap-0.5">
										{[...Array(5)].map((_, idx) => (
											<FiStar key={idx} className={`w-3 h-3 ${idx < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
										))}
									</div>
									<p className="text-xs text-gray-600 flex-1 line-clamp-2">{review.comment || 'No comment'}</p>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="flex justify-end pt-4 border-t border-gray-100">
					<Button variant="secondary" onClick={onClose}>Close</Button>
				</div>
			</div>
		</Modal>
	);
};

// --- Delete Confirmation Modal ---
const DeleteConfirmModal = ({ isOpen, onClose, product, onConfirm, isLoading }) => {
	if (!product) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Delete Product" size="sm">
			<div className="text-center space-y-6">
				<div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
					<FiAlertTriangle className="w-10 h-10" />
				</div>
				<div className="space-y-2">
					<h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
					<p className="text-gray-500 text-sm leading-relaxed px-4">
						You are about to delete <span className="font-bold text-gray-900">"{product.name}"</span>.
						This action cannot be undone.
					</p>
				</div>
				<div className="flex gap-3 pt-4">
					<Button variant="secondary" onClick={onClose} fullWidth disabled={isLoading}>
						Cancel
					</Button>
					<Button 
						variant="primary" 
						className="bg-rose-500 hover:bg-rose-600 border-rose-600 shadow-rose-200"
						onClick={onConfirm} 
						fullWidth 
						loading={isLoading}
					>
						Yes, Delete
					</Button>
				</div>
			</div>
		</Modal>
	);
};

// --- Product Row ---
const ProductRow = ({ product, onView, onDelete, onUpdateField, isUpdating }) => {
	const [isEditingStock, setIsEditingStock] = useState(false);
	const [stockVal, setStockVal] = useState(product.countInStock);

	const stockColor = product.countInStock > 10 
		? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
		: product.countInStock > 0 
			? 'bg-amber-50 text-amber-600 border-amber-100' 
			: 'bg-rose-50 text-rose-600 border-rose-100';

	return (
		<motion.tr
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
		>
			{/* Product */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
						{product.coverImage?.secure_url ? (
							<img src={product.coverImage.secure_url} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
						) : (
							<FiImage className="w-4 h-4 text-gray-300" />
						)}
					</div>
					<div className="min-w-0">
						<p className="font-bold text-gray-900 text-sm truncate max-w-[160px]">{product.name}</p>
						<p className="text-xs text-gray-400 truncate max-w-[160px]">{product.slug}</p>
					</div>
				</div>
			</td>

			{/* Brand */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<div className="flex items-center gap-1.5">
					<FiTag className="w-3.5 h-3.5 text-gray-400" />
					<span className="text-sm font-medium text-gray-600">{product.brand}</span>
				</div>
			</td>

			{/* Price */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<span className="font-bold text-indigo-600 text-sm tabular-nums">${product.price?.amount?.toFixed(2)}</span>
			</td>

			{/* Stock */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				{isEditingStock ? (
					<div className="flex items-center gap-1.5">
						<input
							type="number"
							value={stockVal}
							onChange={(e) => setStockVal(e.target.value)}
							className="w-16 px-2 py-1.5 rounded-lg bg-white border border-indigo-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100"
							autoFocus
							min="0"
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									onUpdateField(product._id, { countInStock: parseInt(stockVal) || 0 });
									setIsEditingStock(false);
								}
								if (e.key === 'Escape') {
									setStockVal(product.countInStock);
									setIsEditingStock(false);
								}
							}}
						/>
						<button 
							onClick={() => { onUpdateField(product._id, { countInStock: parseInt(stockVal) || 0 }); setIsEditingStock(false); }}
							className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
						>
							<FiActivity className="w-3 h-3" />
						</button>
						<button 
							onClick={() => { setStockVal(product.countInStock); setIsEditingStock(false); }}
							className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
						>
							<FiX className="w-3 h-3" />
						</button>
					</div>
				) : (
					<button 
						onClick={() => setIsEditingStock(true)}
						className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all hover:shadow-sm ${stockColor}`}
						title="Click to edit stock"
					>
						<FiBox className="w-3.5 h-3.5" />
						{product.countInStock}
						{product.countInStock === 0 && <span className="text-[10px]">(Out)</span>}
					</button>
				)}
			</td>

			{/* Category */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<div className="flex items-center gap-1.5 text-gray-500">
					<FiLayers className="w-3.5 h-3.5" />
					<span className="text-sm font-medium">{product.category?.name || '—'}</span>
				</div>
			</td>

			{/* Rating */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<div className="flex items-center gap-1">
					<FiStar className="w-3.5 h-3.5 text-amber-400" />
					<span className="text-sm font-semibold text-gray-700 tabular-nums">{(product.ratingAverage || 0).toFixed(1)}</span>
					<span className="text-xs text-gray-400">({product.ratingCount || 0})</span>
				</div>
			</td>

			{/* Status */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<StatusSelector 
					value={product.status} 
					onChange={(newStatus) => onUpdateField(product._id, { status: newStatus })} 
				/>
			</td>

			{/* Actions */}
			<td className="py-3.5 px-4 whitespace-nowrap text-right">
				<div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
					<button 
						onClick={() => onView(product)} 
						className="p-2 bg-white hover:bg-indigo-50 text-indigo-500 rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md" 
						title="View details"
					>
						<FiEye className="w-3.5 h-3.5" />
					</button>
					<button 
						onClick={() => onDelete(product)} 
						className="p-2 bg-white hover:bg-rose-50 text-rose-500 rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md" 
						title="Delete product"
					>
						<FiTrash2 className="w-3.5 h-3.5" />
					</button>
				</div>
			</td>
		</motion.tr>
	);
};

// --- Empty State ---
const EmptyState = ({ searchQuery, onClear }) => (
	<div className="text-center py-16">
		<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
			<FiPackage className="w-10 h-10 text-gray-300" />
		</div>
		<h3 className="text-lg font-bold text-gray-900 mb-2">
			{searchQuery ? 'No products found' : 'No products yet'}
		</h3>
		<p className="text-gray-500 text-sm max-w-sm mx-auto">
			{searchQuery 
				? `No products match "${searchQuery}". Try a different search term.` 
				: 'Products created by sellers will appear here.'}
		</p>
		{searchQuery && (
			<Button variant="ghost" className="mt-4" onClick={onClear}>
				Clear Search
			</Button>
		)}
	</div>
);

// --- Main Page ---
const ProductsPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [viewingProduct, setViewingProduct] = useState(null);
	const [productToDelete, setProductToDelete] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	
	const { products: fetchedProducts, isLoading } = useAdminProducts();
	const { categories: fetchedCategories } = useAdminCategories();
	const { updateProduct, isUpdating } = useUpdateProduct();
	const { deleteProduct, isDeleting } = useDeleteProduct();

	const products = fetchedProducts || [];
	const categories = fetchedCategories || [];

	const filteredProducts = useMemo(() => {
		return products.filter(p => {
			const name = (p.name || '').toLowerCase();
			const brand = (p.brand || '').toLowerCase();
			const query = searchQuery.toLowerCase();
			const matchesSearch = name.includes(query) || brand.includes(query);
			const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
			const matchesCategory = categoryFilter === 'all' || p.category?.name === categoryFilter;
			return matchesSearch && matchesStatus && matchesCategory;
		});
	}, [products, searchQuery, statusFilter, categoryFilter]);

	// Pagination
	const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
	const paginatedProducts = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredProducts, currentPage]);

	// Reset page when filters change
	useMemo(() => {
		setCurrentPage(1);
	}, [searchQuery, statusFilter, categoryFilter]);

	const stats = useMemo(() => ({
		total: products.length,
		active: products.filter(p => p.status === 'active').length,
		draft: products.filter(p => p.status === 'draft').length,
		lowStock: products.filter(p => p.countInStock <= 10 && p.countInStock > 0).length,
		outOfStock: products.filter(p => p.countInStock === 0).length,
	}), [products]);

	const categoryOptions = useMemo(() => {
		const names = [...new Set(categories.map(c => c.name).filter(Boolean))];
		return names.map(name => ({ value: name, label: name }));
	}, [categories]);

	const handleUpdateField = (id, data) => {
		updateProduct({ id, data });
	};

	const handleConfirmDelete = () => {
		if (productToDelete) {
			deleteProduct(productToDelete._id, {
				onSuccess: () => {
					setProductToDelete(null);
				}
			});
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<LoadingSpinner size="lg" message="Loading products..." />
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Products</h1>
					<p className="text-gray-500 mt-1">Manage all products across your marketplace</p>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
				<StatCard label="Total Products" value={stats.total} icon={FiPackage} color="bg-gray-900" />
				<StatCard label="Active" value={stats.active} icon={FiActivity} color="bg-emerald-600" />
				<StatCard label="Draft" value={stats.draft} icon={FiEdit2} color="bg-amber-500" />
				<StatCard label="Low Stock" value={stats.lowStock} icon={FiAlertCircle} color="bg-orange-500" />
				<StatCard label="Out of Stock" value={stats.outOfStock} icon={FiBox} color="bg-rose-500" />
			</div>

			{/* Table Card */}
			<div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 overflow-hidden">
				{/* Filters */}
				<div className="p-5 border-b border-gray-100">
					<div className="flex flex-col lg:flex-row gap-4 items-end">
						<div className="relative flex-1 w-full">
							<FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="text"
								placeholder="Search by name or brand..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
							/>
						</div>
						<div className="flex gap-3 w-full lg:w-auto">
							<Select 
								containerClassName="min-w-[170px] flex-1 lg:flex-none" 
								label="Category" 
								value={categoryFilter} 
								onChange={setCategoryFilter} 
								options={[{ value: 'all', label: 'All Categories' }, ...categoryOptions]} 
							/>
							<Select 
								containerClassName="min-w-[170px] flex-1 lg:flex-none" 
								label="Status" 
								value={statusFilter} 
								onChange={setStatusFilter} 
								options={[{ value: 'all', label: 'All Statuses' }, ...statusOptions]} 
							/>
						</div>
					</div>
				</div>

				{/* Table */}
				{filteredProducts.length > 0 ? (
					<>
						<div className="overflow-x-auto">
							<table className="w-full text-left">
								<thead>
									<tr className="bg-gray-50/80 border-b border-gray-100">
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Product</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Brand</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Price</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Stock</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Category</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Rating</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Status</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									<AnimatePresence>
										{paginatedProducts.map(p => (
											<ProductRow 
												key={p._id} 
												product={p} 
												onView={setViewingProduct} 
												onUpdateField={handleUpdateField} 
												onDelete={setProductToDelete} 
												isUpdating={isUpdating}
											/>
										))}
									</AnimatePresence>
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
								<p className="text-sm text-gray-500">
									Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="font-semibold text-gray-700">{filteredProducts.length}</span> products
								</p>
								<div className="flex items-center gap-2">
									<button 
										onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
										disabled={currentPage === 1}
										className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
									>
										<FiChevronLeft className="w-4 h-4" />
									</button>
									{Array.from({ length: totalPages }, (_, i) => i + 1)
										.filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
										.map((page, idx, arr) => (
											<span key={page} className="flex items-center">
												{idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-gray-400 px-1">...</span>}
												<button
													onClick={() => setCurrentPage(page)}
													className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${currentPage === page ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
												>
													{page}
												</button>
											</span>
										))
									}
									<button 
										onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
										disabled={currentPage === totalPages}
										className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
									>
										<FiChevronRight className="w-4 h-4" />
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery('')} />
				)}
			</div>

			{/* Product Detail Modal */}
			<ProductDetailModal 
				product={viewingProduct} 
				isOpen={!!viewingProduct} 
				onClose={() => setViewingProduct(null)} 
			/>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmModal 
				isOpen={!!productToDelete}
				onClose={() => setProductToDelete(null)}
				product={productToDelete}
				onConfirm={handleConfirmDelete}
				isLoading={isDeleting}
			/>
		</div>
	);
};

export default ProductsPage;
