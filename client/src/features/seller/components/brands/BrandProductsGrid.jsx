import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiChevronDown, FiBox, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../../../product/components/ProductCard.jsx';

const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name', value: 'name-asc' }
];

const BrandProductsGrid = ({
    paginatedProducts, displayedProducts,
    selectedSubCategory, products,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    isSortDropdownOpen, setIsSortDropdownOpen,
    totalPages, currentPage, handlePageChange,
    handleUpdateStock, handleEditProduct, deleteProduct,
    isUpdating, isDeleting
}) => (
    <div className="lg:col-span-3">
        {/* Header & Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                        {selectedSubCategory === 'all' ? 'All Products' : (products || []).find(p => p.subCategory?._id === selectedSubCategory)?.subCategory?.name || 'Products'}
                    </h2>
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {displayedProducts.length}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative grow sm:grow-0 sm:w-64">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm" />
                    </div>
                    <div className="relative sm:w-48">
                        <button onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)} className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm group">
                            <span className="text-gray-600 truncate mr-2">Sort: <span className="text-gray-900 font-medium">{SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Newest'}</span></span>
                            <FiChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 shrink-0 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isSortDropdownOpen && (
                                <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-full min-w-[180px] bg-white border border-gray-100 rounded-lg shadow-lg shadow-gray-200/50 z-20 overflow-hidden py-1">
                                    {SORT_OPTIONS.map((option) => (
                                        <button key={option.value} onClick={() => { setSortBy(option.value); setIsSortDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${sortBy === option.value ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700'}`}>
                                            {option.label}
                                            {sortBy === option.value && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 ml-2"></div>}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>

        {paginatedProducts.length > 0 ? (
            <>
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-10">
                    <AnimatePresence mode="popLayout">
                        {paginatedProducts.map((product, i) => (
                            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                                <ProductCard product={product} basePath="/seller/inventory" onUpdateStock={handleUpdateStock} isUpdating={isUpdating} onEdit={handleEditProduct} onDelete={(id) => deleteProduct(id)} isDeleting={isDeleting} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 gap-2">
                        <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <FiChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => handlePageChange(page)} className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                {page}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <FiChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                )}
            </>
        ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <FiBox className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any products in this category. Try selecting a different category or check back later.</p>
            </div>
        )}
    </div>
);

export default BrandProductsGrid;
