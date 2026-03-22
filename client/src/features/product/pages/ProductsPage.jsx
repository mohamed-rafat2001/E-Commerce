import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner, Pagination, EmptyState, Button } from '../../../shared/ui/index.js';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../shared/index.js';
import { FiSearch, FiFrown, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import useProductsPage from '../hooks/useProductsPage.js';
import FiltersSidebar from '../components/FiltersSidebar.jsx';
import ScrollToTop from '../../../shared/components/ScrollToTop.jsx';

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

	if (error) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center p-4 font-sans">
				<FiFrown className="w-16 h-16 text-rose-500 mb-4" />
				<h1 className="text-2xl font-black text-gray-900 mb-2">Oops, something went wrong.</h1>
				<p className="text-gray-500 mb-6 font-medium">We couldn't load the products. Please try again later.</p>
				<button onClick={() => window.location.reload()} className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200">
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white font-sans">
			<ScrollToTop />
			{/* Page Header */}
			<div className="max-w-screen-xl mx-auto px-4 md:px-6 pt-12 md:pt-20">
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
						<div className="hidden md:block text-sm text-gray-400 font-medium mr-4">
							Sort by:
						</div>
						<div className="relative group">
							<select
								value={filters.sort}
								onChange={(e) => setFilter('sort', e.target.value)}
								className="appearance-none flex items-center gap-2 px-6 py-3 pr-12 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-900 cursor-pointer hover:border-gray-900 focus:border-gray-900 focus:ring-0 transition-all duration-300 outline-none shadow-sm h-12"
							>
								<option value="-createdAt">Relevance</option>
								<option value="price.amount">Price: Low to High</option>
								<option value="-price.amount">Price: High to Low</option>
								<option value="-ratingAverage">Best Rated</option>
							</select>
							<FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-900 transition-colors" />
						</div>
					</div>
				</div>
			</div >

			<div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-10">
				<div className="flex gap-12">
					{/* Desktop Filters Sidebar */}
					<aside className="hidden lg:block w-72 shrink-0 border-r border-gray-100 pr-12 sticky top-24 self-start">
						<FiltersSidebar
							filters={filters}
							setFilter={setFilter}
							clearFilters={clearFilters}
						/>
					</aside>

					<div className="flex-1">
						{/* Grid Header */}
						<div className="flex items-center justify-between mb-8">
							<p className="text-sm text-gray-400 font-medium tracking-tight">
								Showing <span className="font-bold text-gray-900">{totalCount}</span> exquisite products
							</p>

							<div className="lg:hidden text-center">
								<Button
									variant="outline"
									onClick={() => setIsMobileFiltersOpen(true)}
									className="rounded-full px-6 flex items-center gap-2 border-gray-200"
								>
									<FiFilter className="w-4 h-4" />
									<span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
								</Button>
							</div>
						</div>

						{/* Products Grid */}
						{isLoading ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
								{[...Array(6)].map((_, i) => (
									<PublicProductCardSkeleton key={i} />
								))}
							</div>
						) : products.length > 0 ? (
							<>
								<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
									<AnimatePresence mode="popLayout">
										{products.map((product) => (
											<PublicProductCard key={product._id} product={product} />
										))}
									</AnimatePresence>
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<div className="mt-20 border-t border-gray-50 pt-10">
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={(page) => setFilter('page', page)}
										/>
									</div>
								)}
							</>
						) : (
							<EmptyState
								icon={<FiSearch className="w-12 h-12" />}
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
							onClick={() => setIsMobileFiltersOpen(false)}
							className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
						/>
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 25, stiffness: 200 }}
							className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[101] shadow-2xl p-8 overflow-y-auto"
						>
							<div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
								<h2 className="text-2xl font-black text-gray-900 tracking-tight">Refine Collection</h2>
								<button
									onClick={() => setIsMobileFiltersOpen(false)}
									className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
								>
									<FiX className="w-5 h-5" />
								</button>
							</div>
							<FiltersSidebar
								filters={filters}
								setFilter={setFilter}
								clearFilters={clearFilters}
							/>
							<div className="mt-12 sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-50 flex gap-3">
								<Button
									variant="outline"
									fullWidth
									onClick={() => { clearFilters(); setIsMobileFiltersOpen(false); }}
									className="rounded-full h-14"
								>
									Reset
								</Button>
								<Button
									fullWidth
									onClick={() => setIsMobileFiltersOpen(false)}
									className="rounded-full h-14 bg-gray-900 hover:bg-black text-white font-black"
								>
									Results
								</Button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
