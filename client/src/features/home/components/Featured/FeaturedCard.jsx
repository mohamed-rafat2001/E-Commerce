import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge, Button } from '../../../../shared/ui';

const FeaturedCard = ({ product, isLarge, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className={`relative rounded-[2.5rem] overflow-hidden group shadow-2xl ${isLarge ? 'md:col-span-2 aspect-[16/10]' : 'aspect-square'}`}
        >
            <img
                src={product.image?.secure_url || 'https://placehold.co/800x600'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent p-8 flex flex-col justify-end">
                <Badge variant="featured" className="w-fit mb-4 bg-yellow-400 text-gray-900 border-none shadow-glow-orange">
                    Featured
                </Badge>

                <h3 className={`${isLarge ? 'text-4xl' : 'text-2xl'} font-black text-white mb-3 group-hover:translate-x-2 transition-transform duration-500`}>
                    {product.name}
                </h3>

                {isLarge && (
                    <p className="text-gray-300 mb-8 max-w-lg line-clamp-2">
                        Experience the pinnacle of design and performance with our handpicked selection.
                    </p>
                )}

                <div className="flex items-center gap-6">
                    <span className="text-2xl font-black text-yellow-400">
                        ${typeof product.price === 'object' ? product.price.amount : product.price}
                    </span>
                    {isLarge && (
                        <Link to={`/products/${product._id}`}>
                            <Button className="bg-white text-gray-900 border-none px-8 font-black hover:bg-yellow-400">
                                View Details
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default FeaturedCard;
