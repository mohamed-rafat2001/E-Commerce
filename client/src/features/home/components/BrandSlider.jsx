import { Slider } from '../../../shared/ui/index.js';

const BrandSlider = ({ brands }) => {
    return (
        <section className="py-12 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
                    Trusted by Global Leaders
                </p>
                <Slider
                    spaceBetween={50}
                    slidesPerView={2}
                    loop={true}
                    speed={3000}
                    navigation={false}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 5 },
                        1280: { slidesPerView: 6 },
                    }}
                    swiperClassName="brand-swiper !ease-linear"
                >
                    {brands.map((brand, idx) => (
                        <div key={idx} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-8 md:h-12 w-auto object-contain"
                            />
                        </div>
                    ))}
                </Slider>
            </div>
            <style>{`
				.brand-swiper .swiper-wrapper {
					transition-timing-function: linear !important;
				}
			`}</style>
        </section>
    );
};

export default BrandSlider;
