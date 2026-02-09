import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	ProductIcon 
} from '../../../shared/constants/icons.jsx';
import { Button, Modal, Input, Badge, LoadingSpinner } from '../../../shared/ui/index.js';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiImage } from 'react-icons/fi';
import useSellerProducts from '../hooks/useSellerProducts.js';
import useAddProduct from '../hooks/useAddProduct.js';
import useUpdateProduct from '../hooks/useUpdateProduct.js';
import useDeleteProduct from '../hooks/useDeleteProduct.js';

// Product Form Modal Component
const ProductFormModal = ({ isOpen, onClose, product = null, onSubmit, isLoading }) => {
	const isEditing = !!product;
	const [formData, setFormData] = useState({
		name: product?.name || '',
		description: product?.description || '',
		price: product?.price?.amount || '',
		brand: product?.brand || '',
		category: product?.category?._id || '',
		countInStock: product?.countInStock || 0,
		status: product?.status || 'draft',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({
			...formData,
			price: { amount: parseFloat(formData.price), currency: 'USD' },
		});
	};

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title={isEditing ? 'Edit Product' : 'Add New Product'}
			size="md"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
					<Input
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Enter product name"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Enter product description"
						rows={3}
						className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
						<Input
							type="number"
							name="price"
							value={formData.price}
							onChange={handleChange}
							placeholder="0.00"
							min="0"
							step="0.01"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
						<Input
							type="number"
							name="countInStock"
							value={formData.countInStock}
							onChange={handleChange}
							placeholder="0"
							min="0"
							required
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
					<Input
						name="brand"
						value={formData.brand}
						onChange={handleChange}
						placeholder="Enter brand name"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
					<select
						name="status"
						value={formData.status}
						onChange={handleChange}
						className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					>
						<option value="draft">Draft</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
						<option value="archived">Archived</option>
					</select>
				</div>

				<div className="flex gap-3 pt-4">
					<Button variant="secondary" type="button" onClick={onClose} fullWidth>
						Cancel
					</Button>
					<Button type="submit" loading={isLoading} fullWidth>
						{isEditing ? 'Update Product' : 'Add Product'}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

// Product Card Component
const ProductCard = ({ product, onEdit, onDelete, isDeleting }) => {
	const statusColors = {
		active: 'success',
		draft: 'warning',
		inactive: 'error',
		archived: 'default',
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
		>
			{/* Product Image */}
			<div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
				{product.coverImage?.secure_url ? (
					<img 
						src={product.coverImage.secure_url} 
						alt={product.name}
						className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					/>
				) : (
					<div className="flex flex-col items-center gap-2 text-gray-400">
						<FiImage className="w-12 h-12" />
						<span className="text-sm">No image</span>
					</div>
				)}
				
				{/* Status Badge */}
				<div className="absolute top-3 right-3">
					<Badge variant={statusColors[product.status] || 'default'}>
						{product.status}
					</Badge>
				</div>
			</div>

			{/* Product Info */}
			<div className="p-5">
				<h3 className="font-bold text-lg text-gray-900 truncate mb-1">{product.name}</h3>
				<p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
				
				<div className="flex items-center justify-between mb-4">
					<span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
						${product.price?.amount?.toFixed(2) || '0.00'}
					</span>
					<span className={`text-sm font-medium ${product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
						{product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
					</span>
				</div>

				<div className="flex gap-2">
					<Button 
						variant="secondary" 
						size="sm" 
						onClick={() => onEdit(product)}
						icon={<FiEdit2 className="w-4 h-4" />}
						className="flex-1"
					>
						Edit
					</Button>
					<Button 
						variant="danger" 
						size="sm" 
						onClick={() => onDelete(product._id)}
						icon={<FiTrash2 className="w-4 h-4" />}
						loading={isDeleting}
						className="flex-1"
					>
						Delete
					</Button>
				</div>
			</div>
		</motion.div>
	);
};

// Main Products Page
const ProductsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [deletingId, setDeletingId] = useState(null);

	const { products, isLoading, error, refetch } = useSellerProducts();
	const { addProduct, isAdding } = useAddProduct();
	const { updateProduct, isUpdating } = useUpdateProduct();
	const { deleteProduct, isDeleting } = useDeleteProduct();

	// Filter products
	const filteredProducts = useMemo(() => {
		return products.filter(product => {
			const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [products, searchQuery, statusFilter]);

	const handleAddProduct = (data) => {
		addProduct(data, {
			onSuccess: () => {
				setIsModalOpen(false);
				refetch();
			}
		});
	};

	const handleUpdateProduct = (data) => {
		updateProduct({ id: editingProduct._id, product: data }, {
			onSuccess: () => {
				setEditingProduct(null);
				setIsModalOpen(false);
				refetch();
			}
		});
	};

	const handleDeleteProduct = (id) => {
		setDeletingId(id);
		deleteProduct(id, {
			onSuccess: () => {
				setDeletingId(null);
				refetch();
			},
			onError: () => {
				setDeletingId(null);
			}
		});
	};

	const handleEdit = (product) => {
		setEditingProduct(product);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingProduct(null);
	};

	if (error) {
		return (
			<div className="text-center py-20">
				<p className="text-rose-600">Error loading products. Please try again.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">My Products 📦</h1>
					<p className="text-gray-500 mt-1">Manage your product listings</p>
				</div>
				<Button 
					onClick={() => setIsModalOpen(true)}
					icon={<FiPlus className="w-5 h-5" />}
				>
					Add Product
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100">
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
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					>
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="draft">Draft</option>
						<option value="inactive">Inactive</option>
						<option value="archived">Archived</option>
					</select>
				</div>
			</div>

			{/* Products Grid */}
			{isLoading ? (
				<div className="flex justify-center py-20">
					<LoadingSpinner />
				</div>
			) : filteredProducts.length > 0 ? (
				<motion.div 
					layout
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
				>
					<AnimatePresence mode="popLayout">
						{filteredProducts.map(product => (
							<ProductCard 
								key={product._id}
								product={product}
								onEdit={handleEdit}
								onDelete={handleDeleteProduct}
								isDeleting={isDeleting && deletingId === product._id}
							/>
						))}
					</AnimatePresence>
				</motion.div>
			) : (
				<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
					<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<ProductIcon className="w-10 h-10 text-indigo-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
					<p className="text-gray-500 mb-6">
						{searchQuery || statusFilter !== 'all' 
							? 'Try adjusting your filters'
							: 'Add your first product to get started'}
					</p>
					{!searchQuery && statusFilter === 'all' && (
						<Button onClick={() => setIsModalOpen(true)} icon={<FiPlus className="w-5 h-5" />}>
							Add Your First Product
						</Button>
					)}
				</div>
			)}

			{/* Product Form Modal */}
			<ProductFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				product={editingProduct}
				onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
				isLoading={isAdding || isUpdating}
			/>
		</div>
	);
};

export default ProductsPage;
