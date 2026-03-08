import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiStar } from 'react-icons/fi';
import { Badge, Button, Card } from '../../../../shared/ui';

const ProductCard = ({ product, index, onAddToCart }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Card hoverable className="p-0 border-none group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <img
                        src={product.image?.secure_url || 'https://placehold.co/400x500'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNew && <Badge variant="new">New</Badge>}
                        {product.discount > 0 && <Badge variant="sale">-{product.discount}%</Badge>}
                    </div>

                    <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-300 shadow-lg">
                        <FiHeart className="w-5 h-5" />
                    </button>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            className="w-full"
                        >
                            <Button
                                onClick={() => onAddToCart(product)}
                                className="w-full bg-white text-gray-900 border-none hover:bg-gray-100 font-black py-4 flex items-center justify-center gap-3 shadow-2xl"
                            >
                                <FiShoppingBag className="w-5 h-5" /> Add to Cart
                            </Button>
                        </motion.div>
                    </div>
                </div>

                <div className="py-6 px-2">
                    <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">{product.category?.name || 'General'}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <FiStar className="fill-current" /> {product.ratingsAverage || 4.5}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-indigo-600">
                            ${typeof product.price === 'object' ? product.price.amount : product.price}
                        </span>
                        {product.oldPrice && (
                            <span className="text-gray-400 line-through text-sm font-medium">
                                ${typeof product.oldPrice === 'object' ? product.oldPrice.amount : product.oldPrice}
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default ProductCard;
