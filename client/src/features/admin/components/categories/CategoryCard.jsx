import { motion } from 'framer-motion';
import { Badge } from '../../../../shared/ui/index.js';
import { EditIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '../../../../shared/constants/icons.jsx';

const CategoryCard = ({ 
	category, 
	onToggleStatus, 
	onEdit, 
	onDelete, 
	isDeleting,
	showSubCategoriesToggle = false,
	isExpanded = false,
	onToggleExpand,
	subCategoryCount = 0
}) => {
	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			whileHover={{ y: -8 }}
			className="group relative h-[360px] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-700 cursor-pointer"
		>
			{/* Background Image/Gradient */}
			{category.coverImage?.secure_url ? (
				<>
					<img 
						src={category.coverImage.secure_url} 
						alt="" 
						className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
						crossOrigin="anonymous"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
				</>
			) : (
				<div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">
					<div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
					<div className="absolute inset-0 flex items-center justify-center opacity-10">
						<span className="text-[12rem] font-black text-white select-none">
							{category.name?.[0]}
						</span>
					</div>
				</div>
			)}

			{/* Top: Status & Actions */}
			<div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
				<button 
					onClick={(e) => { e.stopPropagation(); onToggleStatus(category); }}
					className="cursor-pointer"
					title={`Click to ${category.isActive ? 'deactivate' : 'activate'}`}
				>
					<Badge 
						variant={category.isActive ? 'success' : 'secondary'}
						className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-black ${
							category.isActive 
							? 'bg-emerald-500/90 text-white border-none backdrop-blur-md' 
							: 'bg-white/20 text-white border-white/20 backdrop-blur-md'
						}`}
					>
						{category.isActive ? 'Active' : 'Inactive'}
					</Badge>
				</button>
				
				<div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-out">
					<button 
						onClick={(e) => { e.stopPropagation(); onEdit(category); }}
						className="w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
						title="Edit"
					>
						<EditIcon className="w-5 h-5" />
					</button>
					<button 
						onClick={(e) => { e.stopPropagation(); onDelete(category); }}
						className="w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-rose-500 hover:border-rose-500 transition-all duration-300"
						title="Delete"
						disabled={isDeleting}
					>
						<TrashIcon className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Bottom Content */}
			<div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
				<div className="space-y-4">
					<div>
						<h3 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-indigo-300 transition-colors drop-shadow-lg">
							{category.name}
						</h3>
						<p className="text-sm text-gray-300 font-medium leading-relaxed line-clamp-2 mt-2 drop-shadow-md">
							{category.description || "No description provided."}
						</p>
					</div>

					{/* Subcategories Info */}
					{showSubCategoriesToggle && (
						<div className="flex items-center justify-between pt-2">
							<button
								onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
								className="flex items-center gap-2 text-sm font-medium text-white hover:text-indigo-200 transition-colors"
							>
								{isExpanded ? (
									<ChevronDownIcon className="w-4 h-4" />
								) : (
									<ChevronRightIcon className="w-4 h-4" />
								)}
								<span>
									{isExpanded ? 'Hide' : 'Show'} Subcategories 
									{subCategoryCount > 0 && ` (${subCategoryCount})`}
								</span>
							</button>
						</div>
					)}

					<div className="pt-4 border-t border-white/10 flex items-center gap-6">
						<div className="space-y-0.5">
							<p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Created</p>
							<p className="text-sm font-bold text-white">
								{category.createdAt ? new Date(category.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
							</p>
						</div>
						<div className="space-y-0.5">
							<p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Status</p>
							<div className="flex items-center gap-1.5">
								<span className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
								<p className="text-sm font-bold text-white">{category.isActive ? 'Active' : 'Inactive'}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Hover effect */}
			<div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
		</motion.div>
	);
};

export default CategoryCard;
