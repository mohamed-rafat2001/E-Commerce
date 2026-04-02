import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../../shared/ui';

const CategoryCard = ({ category }) => {
    const imageUrl = category.image?.secure_url || category.image?.url || category.image;
    const itemCount = category.productsCount || category.productCount || 0;

    return (
        <div className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
            <Link to={`/categories/${category._id || category.id}`}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        crossOrigin="anonymous"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-6">
                    <Badge variant="new" className="w-fit mb-3 bg-white/20 backdrop-blur-md text-white border-none">
                        {itemCount} Items
                    </Badge>
                    <h3 className="text-2xl font-black text-white group-hover:translate-x-2 transition-transform duration-500">
                        {category.name}
                    </h3>
                </div>
            </Link>
        </div>
    );
};

export default CategoryCard;
