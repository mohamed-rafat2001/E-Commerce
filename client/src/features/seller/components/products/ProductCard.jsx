import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Badge } from '../../../../shared/ui/index.js';
import { FiEdit2, FiTrash2, FiImage, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onEdit, onDelete, onUpdateStock, isUpdating, isDeleting }) => {
	const [isEditingStock, setIsEditingStock] = useState(false);
	const [stockValue, setStockValue] = useState(product.countInStock);

	const handleSaveStock = () => {
		if (stockValue < 0) {
			toast.error('Stock cannot be negative');
			return;
		}
		onUpdateStock(product._id, Number(stockValue));
		setIsEditingStock(false);
	};

	const handleCancelStock = () => {
		setStockValue(product.countInStock);
		setIsEditingStock(false);
	};

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
			<Link to={`/seller/products/${product._id}`} className="block">
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
					
					{/* Image Count Indicator */}
					{(product.images?.length > 0) && (
						<div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
							+{product.images.length} images
						</div>
					)}
				</div>
			</Link>

			<div className="p-5">
				<h3 className="font-bold text-lg text-gray-900 truncate mb-1">
					<Link to={`/seller/products/${product._id}`}>{product.name}</Link>
				</h3>
				<p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
				
				{/* Brand and Category Info */}
				<div className="flex flex-wrap gap-2 mb-3">
					{product.brandId && (
						<span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
							{product.brandId.name || 'Brand N/A'}
						</span>
					)}
					{product.primaryCategory && (
						<span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
							{product.primaryCategory.name || 'Category N/A'}
						</span>
					)}
					{product.subCategory && (
						<span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
							{product.subCategory.name || 'Sub N/A'}
						</span>
					)}
					{Array.isArray(product.sizes) && product.sizes.length > 0 && product.sizes.map(size => (
						<span key={size} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-[11px] font-medium">
							{size}
						</span>
					))}
				</div>
				
				<div className="flex items-center justify-between mb-4">
					<span className="text-2xl font-bold text-indigo-600">
						${product.price?.amount?.toFixed(2) || '0.00'}
					</span>
					<div className="flex items-center gap-2">
						{isEditingStock ? (
							<div className="flex items-center gap-2">
								<input
									type="number"
									value={stockValue}
									onChange={(e) => setStockValue(e.target.value)}
									className="w-20 px-3 py-2 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-bold outline-none"
									min="0"
								/>
								<button
									onClick={handleSaveStock}
									disabled={isUpdating}
									className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
								>
									<FiSave className="w-4 h-4" />
								</button>
								<button
									onClick={handleCancelStock}
									className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
								>
									<FiX className="w-4 h-4" />
								</button>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<span className={`text-sm font-medium ${product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
									{product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
								</span>
								<button
									onClick={() => setIsEditingStock(true)}
									className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
								>
									<FiEdit2 className="w-4 h-4" />
								</button>
							</div>
						)}
					</div>
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

export default ProductCard;
