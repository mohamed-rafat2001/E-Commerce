import { Button } from '../../../../shared/ui/index.js';
import { CategoryIcon } from '../../../../shared/constants/icons.jsx';
import CategoryRow from './CategoryRow.jsx';

const CategoriesTable = ({ 
	categories, 
	searchQuery, 
	setSearchQuery, 
	page, 
	limit, 
	total, 
	totalPages, 
	setPage,
	handleEditCategory,
	handleDeleteCategory,
	handleCreateSubCategory,
	handleEditSubCategory,
	handleDeleteSubCategory
}) => {
	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm text-gray-500">
					<thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold">
						<tr>
							<th className="px-6 py-4 w-12"></th>
							<th className="px-6 py-4">Category</th>
							<th className="px-6 py-4">Description</th>
							<th className="px-6 py-4">Subcategories</th>
							<th className="px-6 py-4">Products</th>
							<th className="px-6 py-4 text-center">Status</th>
							<th className="px-6 py-4 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{categories.length > 0 ? (
							categories.map((category) => (
								<CategoryRow 
									key={category._id} 
									category={category}
									onEditCategory={handleEditCategory}
									onDeleteCategory={handleDeleteCategory}
									onCreateSubCategory={handleCreateSubCategory}
									onEditSubCategory={handleEditSubCategory}
									onDeleteSubCategory={handleDeleteSubCategory}
								/>
							))
						) : (
							<tr>
								<td colSpan="6" className="px-6 py-12 text-center text-gray-500">
									<div className="flex flex-col items-center justify-center">
										<CategoryIcon className="w-12 h-12 text-gray-300 mb-3" />
										<h3 className="text-lg font-medium text-gray-900">No categories found</h3>
										<p className="max-w-sm mt-1 mb-4">
											{searchQuery ? `No results for "${searchQuery}"` : "Get started by creating your first category"}
										</p>
										{searchQuery && (
											<Button variant="secondary" onClick={() => setSearchQuery('')}>
												Clear Search
											</Button>
										)}
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			
			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
					<div className="text-sm text-gray-500">
						Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
						<span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
						<span className="font-medium">{total}</span> results
					</div>
					<div className="flex gap-2">
						<Button 
							variant="secondary" 
							size="sm" 
							onClick={() => setPage(p => Math.max(1, p - 1))}
							disabled={page === 1}
						>
							Previous
						</Button>
						<div className="flex items-center gap-1">
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								let p = i + 1;
								if (totalPages > 5 && page > 3) {
									p = page - 2 + i;
									if (p > totalPages) p = i + 1 + (totalPages - 5); 
								}
								if (p <= 0) p = i + 1; 
								
								return (
									<button
										key={p}
										onClick={() => setPage(p)}
										className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
											page === p 
												? 'bg-indigo-600 text-white shadow-sm' 
												: 'text-gray-600 hover:bg-gray-200'
										}`}
									>
										{p}
									</button>
								);
							})}
						</div>
						<Button 
							variant="secondary" 
							size="sm" 
							onClick={() => setPage(p => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CategoriesTable;
