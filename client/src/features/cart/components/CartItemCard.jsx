import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import QuantityStepper from './QuantityStepper.jsx';

/**
 * CartItemCard redesigned for the Public Cart Page as per design specification
 * @param {object} item - The cart item object
 */
const CartItemCard = ({ item, onRemove, onUpdateQuantity }) => {
    const product = item.item || item.itemId || item.productId || item;
    const productId = product?._id || product?.id || item.product_id || item.id;
    const price = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
    const name = product?.name || item.name;
    const image = product?.coverImage?.secure_url || product?.image?.secure_url || product?.image || item.image || "/placeholder-product.png";

    // Format variant details (mocking if not available)
    const variantInfo = `${item.color || 'Universal'} / ${item.size || 'One Size'} / ${item.material || 'Premium'}`;

    const handleRemove = () => {
        onRemove(productId);
    };

    const handleUpdateQuantity = (delta) => {
        onUpdateQuantity(productId, delta);
    };

    if (!productId) return null;

    return (
        <div className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex gap-6">
                {/* Product Thumbnail */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-50 shadow-inner">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        crossOrigin="anonymous"
                    />
                </div>

                {/* Product Details & Controls */}
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-10">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{name}</h3>
                            <p className="text-gray-400 text-sm font-medium tracking-tight">
                                {variantInfo}
                            </p>
                        </div>
                        {/* Delete Button (absolute top-right for control) */}
                        <button
                            onClick={handleRemove}
                            aria-label="Remove item"
                            className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                            <FiTrash2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                        {/* Quantity Stepper */}
                        <QuantityStepper
                            quantity={item.quantity}
                            onIncrease={() => handleUpdateQuantity(1)}
                            onDecrease={() => handleUpdateQuantity(-1)}
                        />

                        {/* Item Total Price */}
                        <div className="text-right">
                            <p className="text-xl font-bold text-blue-600 tracking-tight">
                                ${(price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;
