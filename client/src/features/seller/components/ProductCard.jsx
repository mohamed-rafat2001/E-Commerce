import { motion } from 'framer-motion';
import { Button, Badge } from '../../../shared/ui/index.js';
import { FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';

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
				
				<div className="absolute top-3 right-3">
					<Badge variant={statusColors[product.status] || 'secondary'}>
						{product.status}
					</Badge>
				</div>
			</div>

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

export default ProductCard;
