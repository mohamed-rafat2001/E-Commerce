import { Button, Badge, LoadingSpinner } from '../../../../shared/ui/index.js';
import { 
	PlusIcon, TagIcon, EditIcon, TrashIcon 
} from '../../../../shared/constants/icons.jsx';

const SubCategoriesTable = ({ 
	subCategories, 
	isLoading, 
	categoryId,
	categoryName,
	onCreateSubCategory, 
	onEditSubCategory, 
	onDeleteSubCategory 
}) => {
	return (
		<div className="py-4 pl-14 pr-4">
			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
					<h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
						<TagIcon className="w-4 h-4 text-indigo-500" />
						Subcategories for {categoryName}
					</h4>
					<Button 
						size="sm" 
						variant="secondary"
						onClick={(e) => {
							e.stopPropagation();
							onCreateSubCategory(categoryId);
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
								onCreateSubCategory(categoryId);
							}}
						>
							Create the first one
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SubCategoriesTable;
