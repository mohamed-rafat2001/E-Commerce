import { Button, Pagination } from '../../../../shared/ui/index.js';
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
				<div className="flex items-center justify-between px-6 py-8 border-t border-gray-100 bg-gray-50/50">
					<div className="text-sm text-gray-500 font-medium font-sans uppercase tracking-[0.08em]">
						Showing <span className="font-black text-gray-900">{(page - 1) * limit + 1}</span> to{' '}
						<span className="font-black text-gray-900">{Math.min(page * limit, total)}</span> of{' '}
						<span className="font-black text-gray-900">{total}</span> results
					</div>
					<Pagination 
						currentPage={page}
						totalPages={totalPages}
						onPageChange={setPage}
					/>
				</div>
			)}
		</div>
	);
};

export default CategoriesTable;
