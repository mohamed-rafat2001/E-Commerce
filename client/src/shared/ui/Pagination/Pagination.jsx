import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../Button/Button.jsx';

const Pagination = ({ totalPages }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page")) || 1;

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", page);
        setSearchParams(newParams);
        
        // Scroll to top of list
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (totalPages <= 1) return null;

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            // Calculate start and end of visible range around current page
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust if current page is near start
            if (currentPage <= 3) {
                end = 4;
            }
            
            // Adjust if current page is near end
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }
            
            // Add ellipsis if gap
            if (start > 2) {
                pages.push('...');
            }
            
            // Add pages in range
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            // Add ellipsis if gap
            if (end < totalPages - 1) {
                pages.push('...');
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2!"
            >
                <FiChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-2 text-gray-400">...</span>
                        ) : (
                            <button
                                onClick={() => handlePageChange(page)}
                                className={`
                                    min-w-8 h-8 rounded-lg text-sm font-medium transition-colors
                                    ${currentPage === page 
                                        ? 'bg-indigo-600 text-white shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }
                                `}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2!"
            >
                <FiChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
};

export default Pagination;