import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge, Button } from '../../../../shared/ui/index.js';
import { 
	FiCamera, 
	FiGlobe, 
	FiHash, 
	FiExternalLink, 
	FiEdit2, 
	FiTrash2, 
	FiMail, 
	FiPhone, 
	FiStar,
	FiCheckCircle,
	FiXCircle,
	FiBox
} from 'react-icons/fi';

const BrandCard = ({ brand, onEdit, onDelete, onLogoEdit }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden group/card"
	>
		<div className="p-4">
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-3">
					<div className="relative group">
						{brand.logo?.secure_url ? (
							<img 
								src={brand.logo.secure_url} 
								alt={brand.name} 
								className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
								crossOrigin="anonymous"
							/>
						) : (
							<div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
								{brand.name?.[0]?.toUpperCase() || 'B'}
							</div>
						)}
						<button
							onClick={(e) => { e.stopPropagation(); onLogoEdit(brand); }}
							className="absolute inset-0 w-full h-full rounded-xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] cursor-pointer"
						>
							<FiCamera className="w-5 h-5 text-white" />
						</button>
					</div>
					<div>
						<h3 className="text-lg font-bold text-gray-900 leading-tight">{brand.name}</h3>
						<div className="flex items-center gap-2 mt-1">
							<Badge variant={brand.isActive ? "success" : "secondary"} size="sm" className="gap-1 pl-1.5">
								{brand.isActive ? <FiCheckCircle className="w-3 h-3" /> : <FiXCircle className="w-3 h-3" />}
								{brand.isActive ? "Active" : "Inactive"}
							</Badge>
						</div>
					</div>
				</div>
				
				{/* Rating Badge */}
				<div className="flex flex-col items-end">
					 <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg border border-yellow-100">
						<FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
						<span className="font-bold">{brand.ratingAverage || 0}</span>
						<span className="text-xs text-yellow-600/80">({brand.ratingCount || 0})</span>
					</div>
				</div>
			</div>

			<p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 min-h-10">
				{brand.description || "No description available for this brand."}
			</p>

			<div className="space-y-2 mb-5">
				{brand.website && (
					<div className="flex items-center gap-2.5 text-sm text-gray-500 group/link">
						<div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 group-hover/link:bg-indigo-50 group-hover/link:text-indigo-600 transition-colors">
							<FiGlobe className="w-3.5 h-3.5" />
						</div>
						<a href={brand.website} target="_blank" rel="noopener noreferrer" className="truncate hover:text-indigo-600 font-medium transition-colors">
							{brand.website.replace(/^https?:\/\//, '')}
						</a>
					</div>
				)}
				
				<div className="flex items-center gap-2.5 text-sm text-gray-500 group/item">
					 <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-colors">
						<FiMail className="w-3.5 h-3.5" />
					</div>
					<span className="truncate">{brand.businessEmail || 'No email provided'}</span>
				</div>

				<div className="flex items-center gap-2.5 text-sm text-gray-500 group/item">
					 <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-colors">
						<FiPhone className="w-3.5 h-3.5" />
					</div>
					<span>{brand.businessPhone || 'No phone provided'}</span>
				</div>

				<div className="flex items-center gap-2.5 text-sm text-gray-500 group/item">
					 <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-colors">
						<FiBox className="w-3.5 h-3.5" />
					</div>
					<span>{brand.products?.length || 0} Products</span>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 mb-4">
				{brand.primaryCategory && (
					<span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium border border-indigo-100">
						<FiHash className="w-3 h-3" />
						{brand.primaryCategory.name}
					</span>
				)}
				{brand.subCategories?.slice(0, 3).map((subCat, index) => (
					<span 
						key={subCat._id || index} 
						className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-200"
					>
						{subCat.name}
					</span>
				))}
				{brand.subCategories?.length > 3 && (
					 <span className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-500 rounded-md text-xs font-medium border border-gray-200" title={brand.subCategories.slice(3).map(c => c.name).join(', ')}>
						+{brand.subCategories.length - 3}
					</span>
				)}
			</div>
		</div>

		<div className="border-t border-gray-100 bg-gray-50/50 p-4 flex items-center gap-2">
			<Link to={`/seller/brands/${brand._id}`} className="flex-1">
				<Button 
					variant="outline" 
					className="w-full justify-center text-sm"
					size="sm"
					icon={<FiExternalLink className="w-4 h-4" />}
				>
					View Details
				</Button>
			</Link>
			<div className="flex gap-2">
				<Button 
					variant="ghost" 
					size="sm"
					className="w-10 h-10 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
					onClick={() => onEdit(brand)}
					title="Edit Brand"
				>
					<FiEdit2 className="w-6 h-6" />
				</Button>
				<Button 
					variant="ghost" 
					size="sm"
					className="w-10 h-10 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
					onClick={() => onDelete(brand._id)}
					title="Delete Brand"
				>
					<FiTrash2 className="w-6 h-6" />
				</Button>
			</div>
		</div>
	</motion.div>
);

export default BrandCard;