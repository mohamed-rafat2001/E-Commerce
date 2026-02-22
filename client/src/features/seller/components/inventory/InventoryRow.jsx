import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiSave, FiX, FiEdit2 } from 'react-icons/fi';
import { Badge } from '../../../../shared/ui/index.js';
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
						<div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
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

export default InventoryRow;
