import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../../../../shared/ui';

const CategoryCard = ({ category, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            <Link to={`/products?category=${category._id}`}>
                <img
                    src={category.image?.secure_url || 'https://placehold.co/400x600'}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-6">
                    <Badge variant="new" className="w-fit mb-3 bg-white/20 backdrop-blur-md text-white border-none">
                        {category.productCount || 0} Items
                    </Badge>
                    <h3 className="text-2xl font-black text-white group-hover:translate-x-2 transition-transform duration-500">
                        {category.name}
                    </h3>
                </div>
            </Link>
        </motion.div>
    );
};

export default CategoryCard;
