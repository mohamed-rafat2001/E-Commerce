import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { Button, Badge, Slider } from '../../../shared/ui/index.js';

const HeroSlider = ({ slides }) => {
    return (
        <section className="relative h-[90vh] w-full overflow-hidden">
            <Slider
                effect="fade"
                speed={1000}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={true}
                loop={true}
                className="h-full w-full"
                swiperClassName="h-full w-full"
            >
                {slides.map((slide) => (
                    <div key={slide.id} className="relative h-full w-full flex items-center overflow-hidden">
                        {/* Background Image with Parallax-like effect */}
                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110 active:scale-100 transition-transform duration-[5000ms]"
                            style={{ backgroundImage: `url("${slide.image}")` }}
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                            <div className="max-w-3xl">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <Badge variant="gradient" size="lg" className="mb-6 float-animation">
                                        {slide.badge}
                                    </Badge>
                                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
                                        {slide.title}
                                        <span className={`block italic text-transparent bg-clip-text bg-linear-to-r ${slide.color}`}>
                                            {slide.subtitle}
                                        </span>
                                    </h1>
                                    <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                                        {slide.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                        <div className="relative group flex-1 max-w-md">
                                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                placeholder="Search for premium products..."
                                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 outline-hidden focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            />
                                        </div>
                                        <Button variant="premium" size="lg" className="animated-gradient text-white border-0 px-8">
                                            Explore Collection
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default HeroSlider;
