import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiImage, FiTag, FiBox, FiLayers, FiStar, FiEye, FiTrash2, FiActivity, FiX } from 'react-icons/fi';
import ProductStatusSelector from './ProductStatusSelector.jsx';

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
				<ProductStatusSelector 
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

export default ProductRow;
