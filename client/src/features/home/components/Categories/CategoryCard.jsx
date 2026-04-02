import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../../shared/ui';

const CategoryCard = ({ category }) => {
    const imageUrl = category.image?.secure_url || category.image?.url || category.image;
    const itemCount = category.productsCount || category.productCount || 0;

    return (
        <div className="group relative h-52 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
            <Link to={`/categories/${category._id || category.id}`}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        crossOrigin="anonymous"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <Badge variant="new" className="w-fit mb-2 bg-white/10 backdrop-blur-md text-white border-none text-[8px] px-2 py-0.5 uppercase tracking-widest">
                        {itemCount} Items
                    </Badge>
                    <h3 className="text-lg font-black text-white group-hover:translate-x-1 transition-transform duration-500 tracking-tight">
                        {category.name}
                    </h3>
                </div>
            </Link>
        </div>
    );
};

export default CategoryCard;
