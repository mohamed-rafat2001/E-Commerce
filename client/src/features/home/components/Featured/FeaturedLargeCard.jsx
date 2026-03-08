import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge, Button } from '../../../../shared/ui';

const FeaturedLargeCard = ({ product }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="md:row-span-2 relative group overflow-hidden rounded-[2.5rem] shadow-2xl h-full min-h-[500px]"
        >
            <img
                src={product.image?.secure_url || 'https://placehold.co/800x1000?text=Featured+Hero'}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent p-10 flex flex-col justify-end">
                <Badge className="w-fit mb-6 bg-amber-400 text-black border-none font-black px-4 py-2 shadow-xl shadow-amber-400/20">
                    ⭐ TOP PICK
                </Badge>

                <h3 className="text-4xl md:text-5xl font-black text-white mb-4 leading-none tracking-tight">
                    {product.name}
                </h3>

                <p className="text-gray-300 text-lg mb-8 max-w-md line-clamp-3 font-medium leading-relaxed">
                    Designed for maximum performance and ultimate comfort. Our flagship selection of the season is here.
                </p>

                <div className="flex items-center gap-8">
                    <span className="text-3xl font-black text-amber-400">
                        ${product.price?.amount || product.price || 0}
                    </span>
                    <Link to={`/products/${product._id}`}>
                        <Button className="!bg-indigo-600 text-white border-none px-12 py-5 font-black hover:!bg-indigo-700 shadow-2xl transition-all">
                            Shop All Now
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default FeaturedLargeCard;
