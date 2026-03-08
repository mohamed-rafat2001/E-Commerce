import React, { useEffect } from 'react';
import { Header } from '../../../shared/widgets/Header';
import {
	HeroSection,
	BrandsSection,
	CategoriesSection,
	ProductsSection,
	FeaturedSection,
	TestimonialsSection,
	NewsletterSection,
	FooterSection
} from '../components';

const HomePage = () => {
	useEffect(() => {
		// Ensure we start at top on load
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="min-h-screen bg-white">
			<Header />

			<main>
				{/* SECTION B4: Hero Section (Full Screen Slider) */}
				<HeroSection />

				{/* SECTION B5: Brands Section (Infinite Ticker) */}
				<BrandsSection />

				{/* SECTION B6: Categories Section (Grid/Horizontal Scroll) */}
				<CategoriesSection />

				{/* SECTION B7: Products Section (Latest Products) */}
				<ProductsSection />

				{/* SECTION B8: Featured Products Section (Asymmetric Grid) */}
				<FeaturedSection />

				{/* SECTION B9: Testimonials Section (Swiper) */}
				<TestimonialsSection />

				{/* SECTION B10: Newsletter Section */}
				<NewsletterSection />
			</main>

			{/* Footer Section */}
			<FooterSection />
		</div>
	);
};

export default HomePage;
