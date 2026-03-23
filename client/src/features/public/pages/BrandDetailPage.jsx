/* Pattern Summary:
Modeled after features/product/pages/ProductDetailPage.jsx and ProductsPage.jsx.
The page follows route-param driven data hooks, URL-based filters, and shared error/loading
patterns while composing feature components for sidebar, hero, products, and newsletter sections.
*/
import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import useAuthGuard from "../../../hooks/useAuthGuard.js";
import { Button } from "../../../shared/ui/index.js";
import usePublicBrand from "../hooks/usePublicBrand.js";
import usePublicBrandProducts from "../hooks/usePublicBrandProducts.js";
import BrandHeroBanner from "../components/brand/BrandHeroBanner.jsx";
import BrandSidebar from "../components/brand/BrandSidebar.jsx";
import BrandProductsSection from "../components/brand/BrandProductsSection.jsx";
import BrandNewsletterSection from "../components/brand/BrandNewsletterSection.jsx";

function BrandPageSkeleton() {
	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-12 grid lg:grid-cols-[220px_1fr] gap-8">
				<div className="hidden lg:block">
					<div className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
				</div>
				<div className="space-y-8">
					<div className="h-[360px] rounded-3xl bg-gray-100 animate-pulse" />
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[...Array(4)].map((_, idx) => (
							<div key={idx} className="h-80 rounded-3xl bg-gray-100 animate-pulse" />
						))}
					</div>
					<div className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
				</div>
			</div>
		</div>
	);
}

export default function BrandDetailPage() {
	const { brandId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const { isAuthenticated } = useCurrentUser();
	const { requireAuth } = useAuthGuard();
	const { brand, isLoading: isBrandLoading, error: brandError, refetch: refetchBrand } = usePublicBrand(brandId);

	const filters = useMemo(
		() => ({
			category: searchParams.get("category") || "",
			subCategory: searchParams.get("sub") || "",
			sort: searchParams.get("sort") || "newest",
			page: parseInt(searchParams.get("page"), 10) || 1,
		}),
		[searchParams]
	);

	const {
		products,
		pagination,
		isLoading: isProductsLoading,
		error: productsError,
		refetch: refetchProducts,
	} = usePublicBrandProducts({
		brandId,
		category: filters.category || undefined,
		subCategory: filters.subCategory || undefined,
		sort: filters.sort,
		page: filters.page,
	});

	const followUnavailable = true;

	const setFilter = (key, value) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			if (!value) next.delete(key);
			else next.set(key, String(value));
			if (key !== "page") next.delete("page");
			return next;
		});
	};

	const handleCategorySelect = (categoryId) => {
		setFilter("category", categoryId);
		setFilter("sub", "");
	};

	const handleSubCategorySelect = (categoryId, subCategoryId) => {
		setFilter("category", categoryId);
		setFilter("sub", subCategoryId);
	};

	const handleClearCategory = () => {
		setFilter("category", "");
		setFilter("sub", "");
	};

	const handleFollowAction = () => {
		if (!isAuthenticated) {
			requireAuth({ redirectAfter: `/brands/${brandId}` });
			return;
		}
		if (followUnavailable) {
			toast("Follow action is currently unavailable.");
		}
	};

	if (isBrandLoading) return <BrandPageSkeleton />;

	if (brandError) {
		const status = brandError?.response?.status;
		if (status === 404) {
			return (
				<div className="min-h-[70vh] flex items-center justify-center p-4">
					<div className="rounded-3xl border border-gray-200 bg-white max-w-md w-full p-8 text-center">
						<FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<h1 className="text-2xl font-black text-gray-900">Brand not found</h1>
						<p className="text-gray-500 mt-2">The brand you're looking for doesn't exist or is no longer available.</p>
						<Link to="/brands" className="inline-block mt-6">
							<Button>Browse All Brands</Button>
						</Link>
					</div>
				</div>
			);
		}

		return (
			<div className="min-h-[70vh] flex items-center justify-center p-4">
				<div className="rounded-3xl border border-rose-100 bg-rose-50 max-w-md w-full p-8 text-center">
					<FiAlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
					<h1 className="text-2xl font-black text-rose-700">Unable to load brand</h1>
					<p className="text-rose-600/80 mt-2">Please check your connection and try again.</p>
					<Button onClick={() => refetchBrand()} className="mt-6">
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	if (!brand) {
		return (
			<div className="min-h-[70vh] flex items-center justify-center p-4">
				<div className="rounded-3xl border border-gray-200 bg-white max-w-md w-full p-8 text-center">
					<FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<h1 className="text-2xl font-black text-gray-900">Brand not found</h1>
					<Link to="/brands" className="inline-block mt-6">
						<Button>Browse All Brands</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-12 grid lg:grid-cols-[220px_1fr] gap-8">
				<BrandSidebar
					brand={brand}
					activeCategory={filters.category}
					activeSubCategory={filters.subCategory}
					onCategorySelect={handleCategorySelect}
					onSubCategorySelect={handleSubCategorySelect}
					onClearCategory={handleClearCategory}
				/>

				<main>
					<BrandHeroBanner
						brand={brand}
						isAuthenticated={isAuthenticated}
						onFollowAction={handleFollowAction}
						followUnavailable={followUnavailable}
					/>
					<BrandProductsSection
						brand={brand}
						products={products}
						pagination={pagination}
						isLoading={isProductsLoading}
						error={productsError}
						onRetry={() => refetchProducts()}
						filters={filters}
						onSortChange={(value) => setFilter("sort", value)}
						onClearCategory={handleClearCategory}
					/>
					<BrandNewsletterSection brand={brand} brandId={brandId} />
				</main>
			</div>
		</div>
	);
}
