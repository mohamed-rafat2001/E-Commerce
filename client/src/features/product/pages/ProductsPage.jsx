import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner, Pagination, EmptyState, Button } from '../../../shared/ui/index.js';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../shared/index.js';
import { FiSearch, FiFrown, FiFilter, FiX } from 'react-icons/fi';
import useProductsPage from '../hooks/useProductsPage.js';
import FiltersSidebar from '../components/FiltersSidebar.jsx';
import SortBar from '../components/SortBar.jsx';

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
			<div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
				<FiFrown className="w-16 h-16 text-rose-500 mb-4" />
				<h1 className="text-2xl font-black text-gray-900 mb-2">Oops, something went wrong.</h1>
				<p className="text-gray-500 mb-6">We couldn't load the products. Please try again later.</p>
				<button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Page Header */}
			<div className="max-w-screen-xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
				<nav className="flex items-center text-sm text-gray-400 mb-4 whitespace-nowrap overflow-x-auto no-scrollbar">
					<a href="/" className="hover:text-primary transition-colors">Home</a>
					<span className="mx-2 text-gray-300">/</span>
					<span className="text-gray-700 font-medium">Products</span>
				</nav>
				
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mt-1">
							Collection
						</h1>
						<p className="text-gray-500 text-sm mt-1">
							Explore our hand-picked collection
						</p>
					</div>
					<div className="md:hidden">
						<p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">{totalCount}</span> products</p>
					</div>
				</div>
			</div>

			<div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-10">
				<div className="flex gap-8">
					{/* Desktop Filters Sidebar */}
					<aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start">
						<FiltersSidebar
							filters={filters}
							setFilter={setFilter}
							clearFilters={clearFilters}
							hasActiveFilters={hasActiveFilters}
						/>
					</aside>

					{/* Main Content */}
					<main className="flex-1 min-w-0">
						<SortBar
							totalCount={totalCount}
							filters={filters}
							setFilter={setFilter}
							clearFilters={clearFilters}
							onMobileFilterClick={() => setIsMobileFiltersOpen(true)}
						/>

						{isLoading && products.length === 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
								{[...Array(6)].map((_, i) => (
									<PublicProductCardSkeleton key={`skeleton-${i}`} />
								))}
							</div>
						) : !isLoading && products.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
								<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
									<FiSearch className="w-10 h-10 text-gray-300" />
								</div>
								<h3 className="text-lg font-semibold text-gray-700">No products found</h3>
								<p className="text-sm text-gray-400 mt-1 mb-6">Try adjusting your filters or search terms</p>
								{hasActiveFilters && (
									<Button variant="outline" onClick={clearFilters}>
										Clear all filters
									</Button>
								)}
							</div>
						) : (
							<>
								<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100 transition-opacity duration-300'}`}>
									{products.map(product => (
										<PublicProductCard key={product._id} product={product} />
									))}
								</div>

								{totalPages > 1 && (
									<div className="flex items-center justify-center gap-2 mt-10">
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={(page) => setFilter('page', page.toString())}
										/>
									</div>
								)}
							</>
						)}
					</main>
				</div>
			</div>

			{/* Mobile Filter Drawer */}
			<AnimatePresence>
				{isMobileFiltersOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileFiltersOpen(false)}
							className="fixed inset-0 bg-black/40 z-[100] lg:hidden"
						/>
						<motion.div
							initial={{ x: '-100%' }}
							animate={{ x: 0 }}
							exit={{ x: '-100%' }}
							transition={{ type: 'tween', duration: 0.3 }}
							className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-[101] shadow-2xl lg:hidden flex flex-col"
						>
							<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
								<h3 className="text-lg font-bold text-gray-900">Filters</h3>
								<button 
									onClick={() => setIsMobileFiltersOpen(false)}
									className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900"
								>
									<FiX className="w-5 h-5" />
								</button>
							</div>
							<div className="flex-1 overflow-y-auto p-5">
								<FiltersSidebar
									filters={filters}
									setFilter={setFilter}
									clearFilters={clearFilters}
									hasActiveFilters={hasActiveFilters}
									isMobile={true}
								/>
							</div>
							<div className="p-4 border-t border-gray-100 bg-white flex gap-3">
								<Button variant="outline" fullWidth onClick={() => { clearFilters(); setIsMobileFiltersOpen(false); }}>
									Reset
								</Button>
								<Button variant="primary" fullWidth onClick={() => setIsMobileFiltersOpen(false)}>
									Show Results
								</Button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
