import React from 'react';
import SEO, { schemas } from '../../../shared/components/SEO.jsx';
import {
	HeroSection,
	FeaturesStrip,
	BrandsSection,
	CategoriesSection,
	FlashSaleSection,
	ProductsSection,
	BestSellersSection,
	FeaturedSection,
	TestimonialsSection,
	StatsSection,
	SellerCtaBanner,
	NewsletterSection
} from '../components';

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
				{/* Hero Section */}
				<HeroSection />

				{/* Features Trust Strip */}
				<FeaturesStrip />

				{/* Brands Section */}
				<section aria-label="Featured brands">
					<BrandsSection />
				</section>

				{/* Categories Section */}
				<section aria-label="Shop by category">
					<CategoriesSection />
				</section>

				{/* Flash Sale Section */}
				<section aria-label="Flash sale deals">
					<FlashSaleSection />
				</section>

				{/* New Arrivals */}
				<section aria-label="New product arrivals">
					<ProductsSection />
				</section>

				{/* Best Sellers */}
				<section aria-label="Best selling products">
					<BestSellersSection />
				</section>

				{/* Featured Picks */}
				<section aria-label="Featured picks">
					<FeaturedSection />
				</section>

				{/* Testimonials */}
				<section aria-label="Customer testimonials">
					<TestimonialsSection />
				</section>

				{/* Stats */}
				<StatsSection />

				{/* Seller CTA */}
				<SellerCtaBanner />

				{/* Newsletter */}
				<NewsletterSection />
			</main>
		</>
	);
};

export default HomePage;
