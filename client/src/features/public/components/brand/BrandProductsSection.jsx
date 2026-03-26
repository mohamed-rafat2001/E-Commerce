import { useMemo, useState } from "react";
import { FiFilter, FiSearch, FiChevronDown } from "react-icons/fi";
import PublicProductCard from "../../../../shared/components/PublicProductCard.jsx";
import { Button, EmptyState, Pagination } from "../../../../shared/ui/index.js";
import BrandProductsSkeleton from "./BrandProductsSkeleton.jsx";

const sortOptions = [
	{ value: "newest", label: "Newest" },
	{ value: "priceLow", label: "Price: Low to High" },
	{ value: "priceHigh", label: "Price: High to Low" },
	{ value: "popular", label: "Most Popular" },
];

const filterTabs = [
	{ value: "", label: "All" },
	{ value: "newest", label: "New" },
	{ value: "popular", label: "Sale" },
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
			<div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
				<p className="text-rose-700 font-bold mb-4">Failed to load products for this brand.</p>
				<Button onClick={onRetry}>Try Again</Button>
			</div>
		);
	}

	return (
		<section>
			{/* Section header with filter tabs */}
			<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
				<div>
					<div className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Current Collection</div>
					<h2 className="text-xl md:text-2xl font-black text-gray-900 mt-1">
						{brand?.currentCollectionTitle || "Latest Arrivals"}
					</h2>
				</div>

				<div className="flex items-center gap-3">
					{/* Quick filter pills */}
					<div className="flex items-center gap-2">
						{filterTabs.map((tab) => (
							<button
								key={tab.value || "all"}
								type="button"
								onClick={() => tab.value ? onSortChange(tab.value) : onSortChange("newest")}
								className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${filters.sort === tab.value || (!tab.value && filters.sort === "newest")
										? "bg-gray-900 border-gray-900 text-white"
										: "bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300"
									}`}
							>
								{tab.label}
							</button>
						))}
					</div>

					{/* Sort dropdown */}
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowFilterPanel((prev) => !prev)}
							className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all bg-white"
							aria-label="Sort products"
						>
							<FiFilter className="w-3.5 h-3.5" />
							Sort
							<FiChevronDown className={`w-3 h-3 transition-transform ${showFilterPanel ? "rotate-180" : ""}`} />
						</button>

						{showFilterPanel && (
							<div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl p-2 z-20">
								{sortOptions.map((option) => (
									<button
										key={option.value}
										type="button"
										onClick={() => {
											onSortChange(option.value);
											setShowFilterPanel(false);
										}}
										className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${filters.sort === option.value
												? "bg-gray-900 text-white font-bold"
												: "text-gray-600 hover:bg-gray-50 font-medium"
											}`}
									>
										{option.label}
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Products Grid */}
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
