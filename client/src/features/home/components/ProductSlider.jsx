import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Card, Badge, Button } from '../../../shared/ui/index.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductSlider = ({ products }) => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-16">
                    <div>
                        <Badge variant="primary" className="mb-4">Handpicked</Badge>
                        <h2 className="text-4xl font-black text-gray-900 mb-2">Featured Products</h2>
                        <p className="text-gray-500">Discover the most trending items in our global marketplace.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="product-prev p-3.5 rounded-2xl bg-[#0f172a] text-white hover:bg-white hover:text-[#0f172a] border border-[#0f172a] transition-all shadow-xl cursor-pointer">
                            <FiArrowLeft className="w-5 h-5" />
                        </button>
                        <button className="product-next p-3.5 rounded-2xl bg-[#0f172a] text-white hover:bg-white hover:text-[#0f172a] border border-[#0f172a] transition-all shadow-xl cursor-pointer">
                            <FiArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={{
                        prevEl: '.product-prev',
                        nextEl: '.product-next',
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                    className="!pb-12"
                >
                    {products.map((product, idx) => (
                        <SwiperSlide key={product.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card variant="elevated" className="overflow-hidden group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="secondary" className="backdrop-blur-md bg-white/70 text-indigo-600 border-0">
                                                {product.category}
                                            </Badge>
                                        </div>
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                            <Button className="w-full bg-white text-gray-900 hover:bg-indigo-50 border-0 font-bold py-3 flex items-center justify-center gap-2 rounded-xl">
                                                <FiShoppingBag /> Quick Add
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                                                ★ {product.rating} <span className="text-gray-400 font-normal">({product.reviews})</span>
                                            </div>
                                            <span className="text-xl font-black text-indigo-600">{product.price}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </h3>
                                    </div>
                                </Card>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default ProductSlider;
