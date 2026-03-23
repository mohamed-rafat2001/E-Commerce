/* Codebase Pattern Summary:
Modeled after features/product/pages/ProductsPage.jsx top controls and admin filter components.
It follows the same search + sort + result count composition and uses URL-driven filter updates
through the page hook so behavior matches existing listing pages.
*/
import { FiSearch } from "react-icons/fi";

const sortOptions = [
	{ value: "az", label: "A-Z" },
	{ value: "za", label: "Z-A" },
	{ value: "popular", label: "Most Popular" },
	{ value: "newest", label: "Newest" },
];

export default function BrandsFilter({ filters, setFilter, totalCount }) {
	return (
		<div className="border-b border-gray-100 pb-8 mb-10">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div className="flex-1">
					<label htmlFor="brands-search" className="sr-only">
						Search brands
					</label>
					<div className="relative">
						<FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							id="brands-search"
							type="text"
							value={filters.search}
							onChange={(e) => setFilter("search", e.target.value)}
							placeholder="Search brands..."
							className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
						/>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<span className="hidden md:block text-sm text-gray-400 font-medium">Sort by:</span>
					<div className="relative group">
						<select
							value={filters.sort}
							onChange={(e) => setFilter("sort", e.target.value)}
							className="appearance-none bg-gray-50 border border-gray-100 rounded-full pl-6 pr-12 py-3 text-sm font-black uppercase tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
							aria-label="Sort brands"
						>
							{sortOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			<p className="text-sm text-gray-500 mt-5">
				Showing <span className="font-bold text-gray-900">{totalCount}</span> brands
			</p>
		</div>
	);
}
