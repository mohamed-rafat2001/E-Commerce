import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner, Pagination, EmptyState, Button } from '../../../shared/ui/index.js';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../shared/index.js';
import { FiSearch, FiFrown, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import useProductsPage from '../hooks/useProductsPage.js';
import FiltersSidebar from '../components/FiltersSidebar.jsx';
import ScrollToTop from '../../../shared/components/ScrollToTop.jsx';
import SEO from '../../../shared/components/SEO.jsx';
import Breadcrumbs from '../../../shared/components/Breadcrumbs.jsx';

// Memoize product card to prevent unnecessary re-renders in the list
const MemoizedProductCard = memo(PublicProductCard);

export default function ProductsPage() {
	const {
		products, totalCount, totalPages, currentPage,
		isLoading, error, filters, setFilter, clearFilters, hasActiveFilters
	} = useProductsPage();

	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

	// Scroll to top when page changes
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [currentPage]);

	// Memoized callbacks to prevent child re-renders
	const handleSortChange = useCallback((e) => setFilter('sort', e.target.value), [setFilter]);
	const handlePageChange = useCallback((page) => setFilter('page', page), [setFilter]);
	const openMobileFilters = useCallback(() => setIsMobileFiltersOpen(true), []);
	const closeMobileFilters = useCallback(() => setIsMobileFiltersOpen(false), []);
	const handleClearAndClose = useCallback(() => {
		clearFilters();
		setIsMobileFiltersOpen(false);
	}, [clearFilters]);

	const breadcrumbItems = [
		{ name: 'Home', url: '/' },
		{ name: 'Products' },
	];

	if (error) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center p-4 font-sans">
				<FiFrown className="w-16 h-16 text-rose-500 mb-4" aria-hidden="true" />
				<h1 className="text-2xl font-black text-gray-900 mb-2">Oops, something went wrong.</h1>
				<p className="text-gray-500 mb-6 font-medium">We couldn't load the products. Please try again later.</p>
				<button
					onClick={() => window.location.reload()}
					className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
					aria-label="Retry loading products"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors">
			<SEO
				title="Products — Browse Our Curated Collection"
				description="Browse our curated collection of premium products. Filter by category, brand, price, and more. Free shipping on orders over $50."
				canonical="/products"
			/>
			<ScrollToTop />

			{/* Page Header */}
			<div className="max-w-screen-xl mx-auto px-4 md:px-6 pt-12 md:pt-20">
				<Breadcrumbs items={breadcrumbItems} />
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
					<div className="flex flex-col gap-2">
						<span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
							Curated Collection
						</span>
						<h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
							Latest Findings
						</h1>
					</div>

					<div className="flex items-center gap-4">
						<label htmlFor="sort-select" className="hidden md:block text-sm text-gray-400 font-medium mr-4">
							Sort by:
						</label>
						<div className="relative group">
							<select
								id="sort-select"
								value={filters.sort}
								onChange={handleSortChange}
								className="appearance-none flex items-center gap-2 px-6 py-3 pr-12 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-900 cursor-pointer hover:border-gray-900 focus:border-gray-900 focus:ring-0 transition-all duration-300 outline-none shadow-sm h-12"
								aria-label="Sort products"
							>
								<option value="-createdAt">Relevance</option>
								<option value="price.amount">Price: Low to High</option>
								<option value="-price.amount">Price: High to Low</option>
								<option value="-ratingAverage">Best Rated</option>
							</select>
							<FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-900 transition-colors" aria-hidden="true" />
						</div>
					</div>
				</div>
			</div >

			<div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-10">
				<div className="flex flex-col lg:flex-row gap-12">
					{/* Desktop Filters Sidebar */}
					<aside className="hidden lg:block w-80 shrink-0 lg:sticky lg:top-28 self-start h-fit" aria-label="Product filters">
						<FiltersSidebar
							filters={filters}
							setFilter={setFilter}
							clearFilters={clearFilters}
							hasActiveFilters={hasActiveFilters}
						/>
					</aside>

					<div className="flex-1">
						{/* Grid Header */}
						<div className="sticky top-24 z-20 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md py-3 mb-8 border-b border-gray-100 dark:border-gray-700">
							<div className="flex items-center justify-between">
							<p className="text-sm text-gray-400 font-medium tracking-tight">
								Showing <span className="font-bold text-gray-900">{totalCount}</span> exquisite products
							</p>

							<div className="lg:hidden text-center">
								<Button
									variant="outline"
									onClick={openMobileFilters}
									className="rounded-full px-6 flex items-center gap-2 border-gray-200"
									aria-label="Open filters panel"
								>
									<FiFilter className="w-4 h-4" aria-hidden="true" />
									<span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
								</Button>
							</div>
							</div>
						</div>

						{/* Products Grid */}
						{isLoading ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16" aria-busy="true">
								{[...Array(6)].map((_, i) => (
									<PublicProductCardSkeleton key={i} />
								))}
							</div>
						) : products.length > 0 ? (
							<>
								<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
									<AnimatePresence mode="popLayout">
										{products.map((product) => (
											<MemoizedProductCard key={product._id} product={product} />
										))}
									</AnimatePresence>
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<nav className="mt-20 border-t border-gray-50 pt-10" aria-label="Products pagination">
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={handlePageChange}
										/>
									</nav>
								)}
							</>
						) : (
							<EmptyState
								icon={<FiSearch className="w-12 h-12" aria-hidden="true" />}
								title="No pieces found"
								message="Try adjusting your filters to find what you're looking for."
								action={{
									label: "Clear All Filters",
									onClick: clearFilters
								}}
								className="py-20 bg-gray-50 rounded-[4rem] border border-dashed border-gray-100"
							/>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Filters Modal */}
			<AnimatePresence>
				{isMobileFiltersOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={closeMobileFilters}
							className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
							aria-hidden="true"
						/>
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 25, stiffness: 200 }}
							className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 z-[101] shadow-2xl p-0 flex flex-col"
							role="dialog"
							aria-modal="true"
							aria-label="Filter products"
						>
							<div className="flex items-center justify-between p-8 border-b border-gray-50 dark:border-gray-700">
								<h2 className="text-2xl font-black text-gray-900 tracking-tight">Refine Collection</h2>
								<button
									onClick={closeMobileFilters}
									className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
									aria-label="Close filters panel"
								>
									<FiX className="w-5 h-5" aria-hidden="true" />
								</button>
							</div>
							
							<div className="flex-1 overflow-y-auto">
								<FiltersSidebar
									filters={filters}
									setFilter={setFilter}
									clearFilters={clearFilters}
									hasActiveFilters={hasActiveFilters}
									isMobile={true}
								/>
							</div>

							<div className="p-8 border-t border-gray-50 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm grid grid-cols-2 gap-4">
								<button
									onClick={handleClearAndClose}
									className="w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-900 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
									aria-label="Reset all filters"
								>
									Reset
								</button>
								<button
									onClick={closeMobileFilters}
									className="w-full py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
									aria-label="Apply filters and view results"
								>
									See Results
								</button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
