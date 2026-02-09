import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, itemLabel = 'items' }) => {
	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
			<p className="text-sm text-gray-500">
				Showing{' '}
				<span className="font-semibold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
				<span className="font-semibold text-gray-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
				<span className="font-semibold text-gray-700">{totalItems}</span> {itemLabel}
			</p>
			<div className="flex items-center gap-2">
				<button 
					onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
					disabled={currentPage === 1}
					className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
				>
					<FiChevronLeft className="w-4 h-4" />
				</button>
				{Array.from({ length: totalPages }, (_, i) => i + 1)
					.filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
					.map((page, idx, arr) => (
						<span key={page} className="flex items-center">
							{idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-gray-400 px-1">...</span>}
							<button
								onClick={() => onPageChange(page)}
								className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${currentPage === page ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
							>
								{page}
							</button>
						</span>
					))
				}
				<button 
					onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
					disabled={currentPage === totalPages}
					className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
				>
					<FiChevronRight className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
