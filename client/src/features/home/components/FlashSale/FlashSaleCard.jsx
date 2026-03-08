import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiStar } from 'react-icons/fi';
import { Badge, Button, Card } from '../../../../shared/ui';
import SaleProgressBar from './SaleProgressBar';

const FlashSaleCard = ({ product, index, onAddToCart }) => {
    // Determine the original vs sale price correctly based on common schema patterns (mocking if missing)
    const currentPrice = product.price?.amount || product.price || 0;
    const originalPrice = product.oldPrice?.amount || product.oldPrice || (currentPrice * 1.4).toFixed(2);
    const discountPercent = product.discount || Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="p-1"
        >
            <Card hoverable className="p-0 border-none group bg-white shadow-2xl shadow-indigo-100 overflow-hidden h-full">
                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={product.image?.secure_url || 'https://placehold.co/500x500?text=Sale+Product'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />

                    {/* Urgent Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <Badge variant="sale" className="bg-red-500 text-white font-black px-3 py-1.5 shadow-xl">
                            -{discountPercent}% OFF
                        </Badge>
                        {discountPercent >= 40 && (
                            <Badge className="bg-amber-400 text-black border-none font-black px-2 py-1 shadow-lg text-[10px]">
                                🏆 MEGA DEAL
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {product.category?.name || 'Exclusive'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-1 rounded-full">
                            <FiStar className="fill-current" /> {product.ratingsAverage || 4.8}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">
                        {product.name}
                    </h3>

                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-2xl font-black text-red-500">
                            ${currentPrice}
                        </span>
                        <span className="text-gray-400 line-through text-sm font-medium">
                            ${originalPrice}
                        </span>
                    </div>

                    <SaleProgressBar sold={product.sold || (index + 2) * 5} total={(index + 5) * 10} />

                    <div className="mt-8">
                        <Button
                            fullWidth
                            variant="primary"
                            onClick={() => onAddToCart(product)}
                            className="bg-gray-900 border-none text-white hover:bg-black font-black py-4 flex items-center justify-center gap-3 shadow-xl transition-all group-hover:bg-indigo-600"
                        >
                            <FiShoppingBag className="w-5 h-5" /> Grab It Now
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default FlashSaleCard;
