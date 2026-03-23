import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { Badge, Button, Card } from '../../../../shared/ui';
import { AddToCartButton, WishlistButton } from '../../../../shared';
import ProductCardGallery from '../../../product/components/ProductCardGallery.jsx';

const ProductCard = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Build images array for gallery
    const allImages = [
        product.image,
        ...(Array.isArray(product.images) ? product.images : [])
    ].filter(Boolean);
    const productId = product._id || product.id || product.product_id;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Card hoverable className="p-0 border-none group">
                <div 
                    className="relative aspect-[4/5] overflow-hidden rounded-2xl"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Link to={`/products/${productId}`} className="block w-full h-full">
                        <ProductCardGallery
                            images={allImages}
                            productName={product.name}
                            isHovered={isHovered}
                        />
                    </Link>

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNew && <Badge variant="new">New</Badge>}
                        {product.discount > 0 && <Badge variant="sale">-{product.discount}%</Badge>}
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                        <WishlistButton product={product} size="md" />
                    </div>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            className="w-full"
                        >
                            <AddToCartButton 
                                product={product}
                                variant="primary"
                                size="lg"
                                fullWidth
                                className="!bg-indigo-600 !text-white border-none hover:!bg-indigo-700 font-black py-4 shadow-2xl"
                            />
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
                    <Link to={`/products/${productId}`}>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
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
