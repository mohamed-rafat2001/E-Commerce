import React from 'react';
import { motion } from 'framer-motion';
import { Badge, Button } from '../../../../shared/ui/index.js';
import { FiCamera, FiGlobe, FiHash, FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';

const BrandCard = ({ brand, onEdit, onDelete, onLogoEdit, onSelect, isSelected }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className={`bg-white rounded-2xl border transition-all duration-300 ${
			isSelected 
				? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg' 
				: 'border-gray-100 hover:shadow-lg'
		}`}
	>
		<div className="flex items-start gap-5">
			<div className="relative group">
				{brand.logo?.secure_url ? (
					<img 
						src={brand.logo.secure_url} 
						alt={brand.name} 
						className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 shadow-sm"
						crossOrigin="anonymous"
					/>
				) : (
					<div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
						{brand.name?.[0]?.toUpperCase() || 'B'}
					</div>
				)}
				<button
					onClick={() => onLogoEdit(brand)}
					className="absolute inset-0 w-full h-full rounded-xl bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
				>
					<FiCamera className="w-5 h-5 text-white" />
				</button>
			</div>
			
			<div className="flex-1">
				<div className="flex items-start justify-between">
					<div>
						<h4 className="text-lg font-bold text-gray-900">{brand.name}</h4>
						<p className="text-gray-500 mt-1 text-sm leading-relaxed">{brand.description}</p>
					</div>
					<div className="flex items-center gap-2">
						{isSelected && (
							<Badge variant="success" size="sm">
								Selected
							</Badge>
						)}
						<Badge variant={brand.isActive ? "success" : "secondary"} size="sm">
							{brand.isActive ? "Active" : "Inactive"}
						</Badge>
					</div>
				</div>
				
				<div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600">
					{brand.website && (
						<span className="flex items-center gap-1.5">
							<FiGlobe className="w-4 h-4 text-gray-400" />
							<a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
								{brand.website}
							</a>
						</span>
					)}
					{brand.primaryCategory && (
						<span className="flex items-center gap-1.5">
							<FiHash className="w-4 h-4 text-gray-400" />
							{brand.primaryCategory.name}
						</span>
					)}
				</div>
				
				{brand.subCategories && brand.subCategories.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-3">
						{brand.subCategories.map((subCat, index) => (
							<span 
								key={subCat._id || index} 
								className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
							>
								{subCat.name}
							</span>
						))}
					</div>
				)}
			</div>
			
			<div className="flex flex-col gap-2">
				<Button 
					variant={isSelected ? "primary" : "secondary"} 
					size="sm" 
					onClick={() => onSelect(brand)}
					icon={<FiInfo className="w-4 h-4" />}
				>
					{isSelected ? "Selected" : "View Details"}
				</Button>
				<Button 
					variant="secondary" 
					size="sm" 
					onClick={() => onEdit(brand)}
					icon={<FiEdit2 className="w-4 h-4" />}
				>
					Edit
				</Button>
				<Button 
					variant="danger" 
					size="sm" 
					onClick={() => onDelete(brand._id)}
					icon={<FiTrash2 className="w-4 h-4" />}
				>
					Delete
				</Button>
			</div>
		</div>
	</motion.div>
);

export default BrandCard;
