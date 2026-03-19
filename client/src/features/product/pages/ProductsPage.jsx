import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner, Pagination, EmptyState } from '../../../shared/ui/index.js';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../shared/index.js';
import { FiSearch, FiFrown } from 'react-icons/fi';
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
				<button onClick={() => window.location.reload()} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#fafafa]">
			{/* Header Area */}
			<div className="bg-white border-b border-gray-100 py-6 md:py-10 relative overflow-hidden z-10 w-full shadow-sm">
				<div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-start justify-between gap-6">
					<div>
						<nav className="flex items-center text-sm text-gray-400 mb-4 whitespace-nowrap overflow-x-auto no-scrollbar">
							<a href="/" className="hover:text-primary transition-colors">Home</a>
							<span className="mx-2 text-gray-400">{'>'}</span>
							<span className="text-gray-700 font-medium">Products</span>
						</nav>
						<motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
							Latest Collection
						</motion.h1>
						<motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm font-medium text-gray-500 mt-2">
							Explore our hand-picked collection
						</motion.p>
					</div>
					<div className="md:hidden mt-2">
						<p className="text-sm text-gray-500">Showing {totalCount} products</p>
					</div>
				</div>
			</div>

			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-10 relative">
				<div className="flex flex-col lg:flex-row gap-10 items-start">

					{/* Filters Sidebar */}
					<FiltersSidebar
						filters={filters}
						setFilter={setFilter}
						clearFilters={clearFilters}
						hasActiveFilters={hasActiveFilters}
						isMobileOpen={isMobileFiltersOpen}
						setIsMobileOpen={setIsMobileFiltersOpen}
					/>

					{/* Main Content Area */}
					<div className="flex-1 w-full relative z-10">
						<SortBar
							totalCount={totalCount}
							filters={filters}
							setFilter={setFilter}
							clearFilters={clearFilters}
							onMobileFilterClick={() => setIsMobileFiltersOpen(true)}
						/>

						{isLoading && products.length === 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 relative">
								{[...Array(12)].map((_, i) => (
									<PublicProductCardSkeleton key={`skeleton-${i}`} />
								))}
							</div>
						) : !isLoading && products.length === 0 ? (
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
								<EmptyState
									icon={<FiSearch className="w-16 h-16" />}
									title="No products found"
									message="We couldn't find any products matching your selected filters."
									action={hasActiveFilters ? { label: "Clear all filters", onClick: clearFilters } : undefined}
								/>
							</motion.div>
						) : (
							<div className="flex flex-col gap-12">
								<motion.div
									className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 relative ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100 transition-opacity duration-300'}`}
								>
									{products.map(product => (
										<PublicProductCard key={product._id} product={product} />
									))}
								</motion.div>

								{totalPages > 1 && (
									<div className="flex justify-center border-t border-gray-200 pt-8 mt-4">
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={(page) => setFilter('page', page.toString())}
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
