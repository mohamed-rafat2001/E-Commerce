import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Slider } from '../../../shared/ui/index.js';

const CategorySlider = ({ categories }) => {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">Explore Categories</h2>
                        <p className="text-gray-500">Find exactly what you're looking for in our specialized collections.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="category-prev p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                            <FiArrowLeft />
                        </button>
                        <button className="category-next p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                            <FiArrowRight />
                        </button>
                    </div>
                </div>

                <Slider
                    spaceBetween={24}
                    slidesPerView={2}
                    nextEl=".category-next"
                    prevEl=".category-prev"
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                        1280: { slidesPerView: 6 },
                    }}
                    swiperClassName="!pb-12"
                >
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link to={`/category/${cat.name.toLowerCase()}`} className={`block p-8 rounded-3xl ${cat.color} text-center transition-all duration-300 hover:shadow-xl hover:bg-white border border-transparent hover:border-indigo-100 group`}>
                                <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                                    {cat.icon}
                                </span>
                                <p className="font-bold text-gray-900 mb-1">{cat.name}</p>
                                <p className="text-xs text-gray-500 font-medium">{cat.count} Items</p>
                            </Link>
                        </motion.div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default CategorySlider;
