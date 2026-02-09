import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	ProductIcon 
} from '../../../shared/constants/icons.jsx';
import { Button, Modal, Input, Badge, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiImage } from 'react-icons/fi';
import useSellerProducts from '../hooks/useSellerProducts.js';
import useAddProduct from '../hooks/useAddProduct.js';
import useUpdateProduct from '../hooks/useUpdateProduct.js';
import useDeleteProduct from '../hooks/useDeleteProduct.js';

const statusOptions = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'archived', label: 'Archived' },
];

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

	const handleSelectChange = (name, value) => {
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

				<Select
					label="Product Status"
					value={formData.status}
					onChange={(val) => handleSelectChange('status', val)}
					options={statusOptions}
				/>

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
		inactive: 'danger',
		archived: 'secondary',
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
			<div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
				{product.coverImage?.secure_url ? (
					<img 
						src={product.coverImage.secure_url} 
						alt={product.name}
						className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
						crossOrigin="anonymous"
					/>
				) : (
					<div className="flex flex-col items-center gap-2 text-gray-400">
						<FiImage className="w-12 h-12" />
						<span className="text-sm">No image</span>
					</div>
				)}
				
				{/* Status Badge */}
				<div className="absolute top-3 right-3">
					<Badge variant={statusColors[product.status] || 'secondary'}>
						{product.status}
					</Badge>
				</div>
			</div>

			{/* Product Info */}
			<div className="p-5">
				<h3 className="font-bold text-lg text-gray-900 truncate mb-1">{product.name}</h3>
				<p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
				
				<div className="flex items-center justify-between mb-4">
					<span className="text-2xl font-bold text-indigo-600">
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
		if (window.confirm("Are you sure you want to delete this product?")) {
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
		}
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
				<p className="text-rose-600 font-bold">Error loading products. Please try again.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Catalog 📦</h1>
					<p className="text-gray-500 font-medium mt-1">Manage and monitor your digital storefront.</p>
				</div>
				<Button 
					onClick={() => setIsModalOpen(true)}
					icon={<FiPlus className="w-5 h-5" />}
					className="h-12 px-6 rounded-xl shadow-lg shadow-indigo-100"
				>
					Add New Product
				</Button>
			</div>

			{/* Filters */}
			<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
				<div className="relative flex-1">
					<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Scan inventory by name or description..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-medium"
					/>
				</div>
				<Select
					containerClassName="md:w-64"
					value={statusFilter}
					onChange={setStatusFilter}
					options={[
						{ value: 'all', label: 'All Managed States' },
						...statusOptions
					]}
				/>
			</div>

			{/* Products Grid */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
					<LoadingSpinner size="lg" color="indigo" />
					<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Accessing Inventory Records...</p>
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
				<div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
					<div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
						<ProductIcon className="w-12 h-12 text-indigo-300" />
					</div>
					<h3 className="text-2xl font-black text-gray-900 mb-2">No items discovered</h3>
					<p className="text-gray-500 font-medium max-w-xs mx-auto mb-8 leading-relaxed">
						{searchQuery || statusFilter !== 'all' 
							? 'No records match your active search filters. Try refining your query.'
							: 'Your storefront is currently empty. Start your journey by adding your first product.'}
					</p>
					{!searchQuery && statusFilter === 'all' && (
						<Button onClick={() => setIsModalOpen(true)} icon={<FiPlus className="w-5 h-5" />}>
							Initialize First Product
						</Button>
					)}
				</div>
			)}

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
