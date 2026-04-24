import React, { lazy, Suspense } from 'react';
import SEO from '../../../shared/components/SEO.jsx';
import { schemas } from '../../../shared/components/SEOSchemas.js';
import { HeroSection } from '../components';

// ── Lazy-load below-fold sections ──────────────────────────────────
// Only HeroSection (LCP element) loads eagerly.
// Every section below the fold is code-split into its own chunk
// and loaded only when React renders it — saving ~60% of the
// initial homepage JS payload.
const FeaturesStrip = lazy(() => import('../components/Features/FeaturesStrip'));
const BrandsSection = lazy(() => import('../components/Brands/BrandsSection'));
const CategoriesSection = lazy(() => import('../components/Categories/CategoriesSection'));
const FlashSaleSection = lazy(() => import('../components/FlashSale/FlashSaleSection'));
const ProductsSection = lazy(() => import('../components/Products/ProductsSection'));
const BestSellersSection = lazy(() => import('../components/BestSellers/BestSellersSection'));
const FeaturedSection = lazy(() => import('../components/Featured/FeaturedSection'));
const TestimonialsSection = lazy(() => import('../components/Testimonials/TestimonialsSection'));
const StatsSection = lazy(() => import('../components/Stats/StatsSection'));
const SellerCtaBanner = lazy(() => import('../components/SellerCTA/SellerCtaBanner'));
const NewsletterSection = lazy(() => import('../components/Newsletter/NewsletterSection'));

// Minimal inline skeleton for below-fold lazy sections (no extra bundle cost)
const SectionFallback = () => (
	<div className="w-full py-12 animate-pulse">
		<div className="max-w-7xl mx-auto px-4 space-y-4">
			<div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
				))}
			</div>
		</div>
	</div>
);

const HomePage = () => {
	const jsonLd = [
		schemas.webSite(),
		schemas.organization(),
	];

	return (
		<>
			<SEO
				title="Home"
				description="Discover curated luxury fashion, tech gadgets, and home essentials at ShopyNow. Premium products, unbeatable prices, and fast delivery."
				canonical="/"
				jsonLd={jsonLd}
			/>
			<main>
				{/* Hero Section — loads eagerly (LCP element) */}
				<HeroSection />

				{/* Everything below the fold is lazy-loaded */}
				<Suspense fallback={<SectionFallback />}>
					<FeaturesStrip />
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<section aria-label="Featured brands">
						<BrandsSection />
					</section>
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<section aria-label="Shop by category">
						<CategoriesSection />
					</section>
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<section aria-label="Flash sale deals">
						<FlashSaleSection />
					</section>
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<section aria-label="New product arrivals">
						<ProductsSection />
					</section>
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<section aria-label="Best selling products">
						<BestSellersSection />
					</section>
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<section aria-label="Featured picks">
						<FeaturedSection />
					</section>
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<section aria-label="Customer testimonials">
						<TestimonialsSection />
					</section>
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<StatsSection />
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<SellerCtaBanner />
				</Suspense>

				<Suspense fallback={<SectionFallback />}>
					<NewsletterSection />
				</Suspense>
			</main>
		</>
	);
};

export default HomePage;
