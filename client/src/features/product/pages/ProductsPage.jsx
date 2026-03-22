import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner, Pagination, EmptyState, Button } from '../../../shared/ui/index.js';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../shared/index.js';
import { FiSearch, FiFrown, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
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
			<div className="max-w-screen-xl mx-auto px-4 md:px-6 pt-12 md:pt-20">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
					<div className="flex flex-col gap-2">
						<span className="text-xs font-black text-primary uppercase tracking-[0.3em]">
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
								className="appearance-none flex items-center gap-2 px-6 py-3 pr-12 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-900 cursor-pointer hover:border-primary focus:border-primary focus:ring-0 transition-all duration-300 outline-none shadow-sm h-12"
							>
								<option value="-createdAt">Relevance</option>
								<option value="price.amount">Price: Low to High</option>
								<option value="-price.amount">Price: High to Low</option>
								<option value="-ratingAverage">Best Rated</option>
							</select>
							<FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
						</div>
					</div>
				</div>
			</div >

			<div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-20">
				<div className="flex flex-col lg:flex-row gap-12">
					{/* Desktop Filters Sidebar */}
					<aside className="hidden lg:block w-64 flex-shrink-0">
						<FiltersSidebar
							filters={filters}
							setFilter={setFilter}
							clearFilters={clearFilters}
							hasActiveFilters={hasActiveFilters}
						/>
					</aside>

					{/* Main Content */}
					<main className="flex-1 min-w-0">
						{/* Active Filters Summary (Optional, but useful) */}
						{hasActiveFilters && (
							<div className="flex items-center gap-2 flex-wrap mb-8">
								<span className="text-sm font-bold text-gray-400 mr-2 uppercase tracking-widest px-1">Filters</span>
								<button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest px-2 py-1">
									Clear all
								</button>
							</div>
						)}

						{isLoading && products.length === 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
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
								<p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
							</div>
						) : (
							<>
								<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100 transition-opacity duration-300'}`}>
									{products.map(product => (
										<PublicProductCard key={product._id} product={product} />
									))}
								</div>

								{totalPages > 1 && (
									<div className="flex items-center justify-center gap-2 mt-20 pt-10 border-t border-gray-50">
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

			{/* Mobile Filter Trigger (Floating) */}
			<button
				onClick={() => setIsMobileFiltersOpen(true)}
				className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all"
			>
				<FiFilter />
				Filter & Sort
			</button>

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
							className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[101] lg:hidden overflow-y-auto px-6 py-8"
						>
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-2xl font-black text-gray-900 tracking-tight">Filters</h2>
								<button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900">
									<FiX className="w-6 h-6" />
								</button>
							</div>
							<FiltersSidebar
								filters={filters}
								setFilter={setFilter}
								clearFilters={clearFilters}
								hasActiveFilters={hasActiveFilters}
								isMobile={true}
							/>
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
		</div >
	);
}
