import { motion } from 'framer-motion';
import { Badge } from '../../../../shared/ui/index.js';
import { EditIcon, TrashIcon } from '../../../../shared/constants/icons.jsx';

const SubCategoryCard = ({ subCategory, onToggleStatus, onEdit, onDelete, isDeleting }) => {
	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			whileHover={{ y: -5 }}
			className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer"
		>
			{/* Header with Status and Actions */}
			<div className="flex justify-between items-start mb-4">
				<button 
					onClick={(e) => { e.stopPropagation(); onToggleStatus(subCategory); }}
					className="cursor-pointer"
					title={`Click to ${subCategory.isActive ? 'deactivate' : 'activate'}`}
				>
					<Badge 
						variant={subCategory.isActive ? 'success' : 'secondary'}
						className={`px-3 py-1 text-xs font-bold ${
							subCategory.isActive 
							? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
							: 'bg-gray-100 text-gray-600 border-gray-200'
						}`}
					>
						{subCategory.isActive ? 'Active' : 'Inactive'}
					</Badge>
				</button>
				
				<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
					<button 
						onClick={(e) => { e.stopPropagation(); onEdit(subCategory); }}
						className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 rounded-lg transition-all duration-200"
						title="Edit"
					>
						<EditIcon className="w-4 h-4" />
					</button>
					<button 
						onClick={(e) => { e.stopPropagation(); onDelete(subCategory); }}
						className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-600 rounded-lg transition-all duration-200"
						title="Delete"
						disabled={isDeleting}
					>
						<TrashIcon className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="space-y-3">
				{/* Image */}
				{subCategory.image?.secure_url ? (
					<div className="relative rounded-xl overflow-hidden h-32">
						<img 
							src={subCategory.image.secure_url} 
							alt={subCategory.name}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							crossOrigin="anonymous"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
					</div>
				) : (
					<div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl h-32 flex items-center justify-center">
						<span className="text-4xl font-black text-indigo-300 select-none">
							{subCategory.name?.[0]?.toUpperCase() || 'S'}
						</span>
					</div>
				)}

				{/* Title and Description */}
				<div>
					<h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
						{subCategory.name}
					</h3>
					{subCategory.description && (
						<p className="text-sm text-gray-500 mt-1 line-clamp-2">
							{subCategory.description}
						</p>
					)}
				</div>

				{/* Category Info */}
				{subCategory.categoryId && (
					<div className="flex items-center gap-2 text-xs text-gray-500">
						<span className="font-medium">Category:</span>
						<Badge variant="secondary" size="sm">
							{subCategory.categoryId.name || subCategory.categoryId}
						</Badge>
					</div>
				)}

				{/* Footer Info */}
				<div className="flex items-center justify-between pt-3 border-t border-gray-100">
					<div className="text-xs text-gray-400">
						{subCategory.createdAt ? new Date(subCategory.createdAt).toLocaleDateString('en-US', { 
							month: 'short', 
							day: 'numeric' 
						}) : '—'}
					</div>
					<div className="flex items-center gap-1">
						<span className={`w-2 h-2 rounded-full ${subCategory.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
						<span className="text-xs font-medium text-gray-500">
							{subCategory.isActive ? 'Active' : 'Inactive'}
						</span>
					</div>
				</div>
			</div>

			{/* Hover effect overlay */}
			<div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		</motion.div>
	);
};

export default SubCategoryCard;