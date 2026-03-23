/* Pattern Summary:
Modeled after features/product/pages/ProductsPage.jsx and shared/components/PublicProductCard.jsx usage.
It preserves existing list header, filter, loading, empty, and pagination behavior while
keeping product cards sourced from shared components.
*/
import { useMemo, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import PublicProductCard from "../../../../shared/components/PublicProductCard.jsx";
import { Button, EmptyState, Pagination } from "../../../../shared/ui/index.js";
import BrandProductsSkeleton from "./BrandProductsSkeleton.jsx";

const sortOptions = [
	{ value: "newest", label: "Newest" },
	{ value: "priceLow", label: "Price: Low to High" },
	{ value: "priceHigh", label: "Price: High to Low" },
	{ value: "popular", label: "Most Popular" },
];

export default function BrandProductsSection({
	brand,
	products,
	pagination,
	isLoading,
	error,
	onRetry,
	filters,
	onSortChange,
	onClearCategory,
}) {
	const [showFilterPanel, setShowFilterPanel] = useState(false);
	const totalPages = useMemo(() => pagination?.numberOfPages || 1, [pagination?.numberOfPages]);
	const hasCategoryFilter = Boolean(filters.category || filters.subCategory);

	if (error) {
		return (
			<div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-center">
				<p className="text-rose-700 font-bold mb-4">Failed to load products for this brand.</p>
				<Button onClick={onRetry}>Try Again</Button>
			</div>
		);
	}

	return (
		<section>
			<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
				<div>
					<div className="text-xs font-black text-blue-600 uppercase tracking-[0.25em]">Current Collection</div>
					<h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
						{brand?.currentCollectionTitle || "Latest Arrivals"}
					</h2>
					<p className="text-gray-500 mt-2 max-w-2xl">
						{brand?.currentCollectionSubtitle ||
							"A meticulous study of form, function, and the enduring allure of quiet luxury."}
					</p>
				</div>

				<div className="self-start relative">
					<div className="flex items-center gap-3">
						<span className="text-[10px] font-black tracking-[0.25em] uppercase text-gray-400">Filter By</span>
						<button
							type="button"
							onClick={() => setShowFilterPanel((prev) => !prev)}
							className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center"
							aria-label="Open filters"
						>
							<FiFilter className="w-4 h-4" />
						</button>
					</div>

					{showFilterPanel && (
						<div className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-200 bg-white shadow-lg p-4 z-20">
							<label htmlFor="brand-products-sort" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
								Sort
							</label>
							<select
								id="brand-products-sort"
								value={filters.sort}
								onChange={(e) => {
									onSortChange(e.target.value);
									setShowFilterPanel(false);
								}}
								className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-gray-900/10"
							>
								{sortOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			</div>

			<div role="list" aria-busy={isLoading ? "true" : "false"}>
				{isLoading ? (
					<BrandProductsSkeleton />
				) : products.length > 0 ? (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
							{products.map((product) => (
								<div key={product?._id || product?.id} role="listitem">
									<PublicProductCard product={product} />
								</div>
							))}
						</div>
						{totalPages > 1 && (
							<div className="mt-12">
								<Pagination totalPages={totalPages} />
							</div>
						)}
					</>
				) : (
					<EmptyState
						icon={<FiSearch className="w-10 h-10" />}
						title="No products found in this collection"
						message="Try another collection or sort option."
						action={hasCategoryFilter ? { label: "Clear Filter", onClick: onClearCategory } : undefined}
					/>
				)}
			</div>
		</section>
	);
}
