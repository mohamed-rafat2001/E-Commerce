import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Badge, LoadingSpinner } from '../../../../shared/ui/index.js';
import { 
	PlusIcon, CategoryIcon, TagIcon, ChevronDownIcon, ChevronRightIcon, 
	EditIcon, TrashIcon 
} from '../../../../shared/constants/icons.jsx';
import { useAdminSubCategories } from '../../../subCategory/hooks/useAdminSubCategories.js';

const CategoryRow = ({ 
	category, 
	onEditCategory, 
	onDeleteCategory, 
	onCreateSubCategory, 
	onEditSubCategory, 
	onDeleteSubCategory 
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	
	// Fetch subcategories only when expanded or to show count
	// To show count without fetching all data, we might need a separate count endpoint or just fetch length
	// For now, let's fetch them. React Query will cache this.
	// If we want to optimize, we can fetch only when isExpanded is true, 
	// but we need the count for the badge.
	// If the count is important, we should probably include it in the category response from the server (e.g. via virtual populate)
	// For now, let's fetch when expanded, and show "..." or a load button if not expanded?
	// Or just fetch all for this category.
	
	const { subCategories, isLoading } = useAdminSubCategories({ 
		categoryId: category._id,
		limit: 100, // Reasonable limit for subcategories of one category
		populate: 'productCount'
	});

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<>
			<tr 
				className={`hover:bg-gray-50 transition-colors cursor-pointer ${isExpanded ? 'bg-gray-50' : ''}`}
				onClick={handleToggle}
			>
				<td className="px-6 py-4">
					<button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
						{isExpanded ? (
							<ChevronDownIcon className="w-4 h-4 text-gray-500" />
						) : (
							<ChevronRightIcon className="w-4 h-4 text-gray-500" />
						)}
					</button>
				</td>
				<td className="px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
							{category.image?.secure_url ? (
								<img 
									src={category.image.secure_url} 
									alt={category.name} 
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<CategoryIcon className="w-5 h-5 text-gray-400" />
								</div>
							)}
						</div>
						<div>
							<div className="font-semibold text-gray-900">{category.name}</div>
							<div className="text-xs text-gray-500">{category._id}</div>
						</div>
					</div>
				</td>
				<td className="px-6 py-4 max-w-xs truncate">
					{category.description || <span className="text-gray-400 italic">No description</span>}
				</td>
				<td className="px-6 py-4">
					<Badge variant="secondary" size="sm">
						{isLoading ? '...' : `${subCategories.length} items`}
					</Badge>
				</td>
				<td className="px-6 py-4">
					<Badge variant="indigo" size="sm">
						{category.productCount || 0} items
					</Badge>
				</td>
				<td className="px-6 py-4 text-center">
					<Badge 
						variant={category.isActive ? 'success' : 'neutral'} 
						size="sm"
					>
						{category.isActive ? 'Active' : 'Inactive'}
					</Badge>
				</td>
				<td className="px-6 py-4 text-right">
					<div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
						<Button 
							variant="ghost" 
							size="sm" 
							onClick={(e) => {
								e.stopPropagation();
								onEditCategory(category);
							}}
						>
							<EditIcon className="w-4 h-4 text-gray-500" />
						</Button>
						<Button 
							variant="ghost" 
							size="sm" 
							onClick={(e) => {
								e.stopPropagation();
								onDeleteCategory(category);
							}}
						>
							<TrashIcon className="w-4 h-4 text-rose-500" />
						</Button>
					</div>
				</td>
			</tr>
			
			{/* Expanded Subcategories Row */}
			<AnimatePresence>
				{isExpanded && (
					<tr className="bg-gray-50/50">
						<td colSpan="7" className="px-6 py-0 border-none">
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden"
							>
								<div className="py-4 pl-14 pr-4">
									<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
										<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
											<h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
												<TagIcon className="w-4 h-4 text-indigo-500" />
												Subcategories for {category.name}
											</h4>
											<Button 
												size="sm" 
												variant="secondary"
												onClick={(e) => {
													e.stopPropagation();
													onCreateSubCategory(category._id);
												}}
											>
												<PlusIcon className="w-3 h-3 mr-1" />
												Add Subcategory
											</Button>
										</div>
										
										{isLoading ? (
											<div className="flex justify-center py-8">
												<LoadingSpinner size="md" />
											</div>
										) : subCategories.length > 0 ? (
											<table className="w-full text-sm text-left">
												<thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
													<tr>
														<th className="px-4 py-2">Name</th>
														<th className="px-4 py-2">Description</th>
														<th className="px-4 py-2">Products</th>
														<th className="px-4 py-2 text-center">Status</th>
														<th className="px-4 py-2 text-right">Actions</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-100">
													{subCategories.map(sub => (
														<tr key={sub._id} className="hover:bg-gray-50">
															<td className="px-4 py-3 font-medium text-gray-900">
																{sub.name}
															</td>
															<td className="px-4 py-3 text-gray-500 max-w-xs truncate">
																{sub.description || '-'}
															</td>
															<td className="px-4 py-3 text-gray-500">
																{sub.productCount || 0} items
															</td>
															<td className="px-4 py-3 text-center">
																<Badge 
																	variant={sub.isActive ? 'success' : 'neutral'} 
																	size="xs"
																>
																	{sub.isActive ? 'Active' : 'Inactive'}
																</Badge>
															</td>
															<td className="px-4 py-3 text-right">
																<div className="flex justify-end gap-1">
																	<button 
																		onClick={(e) => {
																			e.stopPropagation();
																			onEditSubCategory(sub);
																		}}
																		className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-indigo-600 transition-colors"
																	>
																		<EditIcon className="w-3 h-3" />
																	</button>
																	<button 
																		onClick={(e) => {
																			e.stopPropagation();
																			onDeleteSubCategory(sub);
																		}}
																		className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-rose-600 transition-colors"
																	>
																		<TrashIcon className="w-3 h-3" />
																	</button>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										) : (
											<div className="p-8 text-center text-gray-500">
												<TagIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
												<p>No subcategories found</p>
												<Button 
													variant="link" 
													size="sm"
													onClick={(e) => {
														e.stopPropagation();
														onCreateSubCategory(category._id);
													}}
												>
													Create the first one
												</Button>
											</div>
										)}
									</div>
								</div>
							</motion.div>
						</td>
					</tr>
				)}
			</AnimatePresence>
		</>
	);
};

export default CategoryRow;