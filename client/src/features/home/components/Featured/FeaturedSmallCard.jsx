import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge, Button } from '../../../../shared/ui';

const FeaturedSmallCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
            className="md:col-start-2 relative group overflow-hidden rounded-[2rem] shadow-xl h-full flex flex-col bg-white border border-gray-100/50"
        >
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-[2rem]">
                <img
                    src={product.image?.secure_url || 'https://placehold.co/400x300'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <Badge className="absolute top-4 left-4 bg-gray-900 text-white border-none font-black px-3 py-1 shadow-lg text-[10px]">
                    ⭐ FEATURED
                </Badge>
            </div>

            <div className="p-8 flex flex-col items-start gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    {product.category?.name || 'Handpicked'}
                </span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-500 transition-colors duration-300 line-clamp-1">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between w-full mt-4 border-t border-gray-50 pt-6">
                    <span className="text-2xl font-black text-gray-900">
                        ${product.price?.amount || product.price || 0}
                    </span>
                    <Link to={`/products/${product._id}`}>
                        <Button 
                            variant="primary" 
                            size="sm"
                            className="px-6 py-3 shadow-lg"
                        >
                            VIEW PRODUCT
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default FeaturedSmallCard;
