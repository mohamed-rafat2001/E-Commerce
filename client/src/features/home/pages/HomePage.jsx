import React from 'react';
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
    

	return (
		<>
			<main>
				{/* 3. Hero Section */}
				<HeroSection />

				{/* 4. Features Trust Strip (Immediately after Hero) */}
				<FeaturesStrip />

				{/* 5. Brands Section */}
				<BrandsSection />

				{/* 6. Categories Section */}
				<CategoriesSection />

				{/* 7. Flash Sale Section (With Countdown) */}
				<FlashSaleSection />

				{/* 8. New Arrivals (Products Grid) */}
				<ProductsSection />

				{/* 9. Best Sellers Section (With Tabs) */}
				<BestSellersSection />

				{/* 10. Featured Picks (Asymmetric Grid) */}
				<FeaturedSection />

				{/* 11. What Our Community Says (Testimonials) */}
				<TestimonialsSection />

				{/* 12. Stats / Social Proof Numbers */}
				<StatsSection />

				{/* 13. Seller CTA Banner */}
				<SellerCtaBanner />

				{/* 14. Newsletter Section */}
				<NewsletterSection />
			</main>
		</>
	);
};

export default HomePage;
