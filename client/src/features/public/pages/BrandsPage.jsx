/* Codebase Pattern Summary:
Modeled after features/product/pages/ProductsPage.jsx for public listing layout, URL filter behavior,
and pagination flow, while reusing shared UI components (Pagination, EmptyState, Button).
This keeps the same max-width, header rhythm, and list-state handling conventions.
*/
import { FiFrown, FiSearch } from "react-icons/fi";
import { Button, EmptyState, Pagination } from "../../../shared/ui/index.js";
import { BrandCard, BrandsFilter } from "../components/index.js";
import { usePublicBrandsPage } from "../hooks/index.js";
import SEO from "../../../shared/components/SEO.jsx";
import Breadcrumbs from "../../../shared/components/Breadcrumbs.jsx";

export default function BrandsPage() {
	const { brands, totalCount, totalPages, filters, isLoading, error, refetch, setFilter, clearSearch } =
		usePublicBrandsPage();

	if (error) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center p-4 font-sans">
				<FiFrown className="w-16 h-16 text-rose-500 mb-4" />
				<h1 className="text-2xl font-black text-gray-900 mb-2">Oops, something went wrong.</h1>
				<p className="text-gray-500 mb-6 font-medium">We couldn't load the brands. Please try again.</p>
				<Button
					onClick={() => refetch()}
					className="px-8 py-4 !bg-gray-900 !text-white rounded-full hover:!bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
				>
					Try Again
				</Button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white font-sans">
			<SEO
				title="All Brands — Discover Global Leaders"
				description="Explore our complete, curated collection of the world's most innovative and luxurious brands."
				canonical="/brands"
			/>
			<div className="max-w-screen-xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-16">
				<Breadcrumbs items={[
					{ name: 'Home', url: '/' },
					{ name: 'Brands' },
				]} />
				<div className="flex flex-col gap-2 mb-8 mt-4">
					<span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Curated Collection</span>
					<h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">All Brands</h1>
					<p className="text-gray-500 font-medium mt-2">Discover curated brands from around the world</p>
				</div>

				<BrandsFilter filters={filters} setFilter={setFilter} totalCount={totalCount} />

				<div role="list" aria-busy={isLoading ? "true" : "false"}>
					{isLoading ? (
						<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
							{[...Array(12)].map((_, i) => (
								<div key={i} aria-hidden="true" className="h-[200px] rounded-3xl bg-gray-100 animate-pulse" />
							))}
						</div>
					) : brands.length > 0 ? (
						<>
							<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
								{brands.map((brand) => (
									<div key={brand._id || brand.id || brand.slug} role="listitem">
										<BrandCard brand={brand} />
									</div>
								))}
							</div>
							<div className="mt-20 border-t border-gray-50 pt-10">
								<Pagination
									currentPage={filters.page || 1}
									totalPages={totalPages}
									onPageChange={(page) => setFilter("page", page)}
								/>
							</div>
						</>
					) : (
						<EmptyState
							icon={<FiSearch className="w-12 h-12" />}
							title="No brands found"
							message="Try adjusting your search to find the brands you're looking for."
							action={filters.search ? { label: "Clear Search", onClick: clearSearch } : undefined}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
