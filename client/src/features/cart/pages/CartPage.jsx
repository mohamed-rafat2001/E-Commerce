import React, { useEffect } from 'react';
import CartItemCard from '../components/CartItemCard.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import EmptyCart from '../components/EmptyCart.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import useCartPage from '../hooks/useCartPage.js';
import { PageHeader } from '../../../shared/ui/index.js';

/**
 * Public Cart Page - Production-grade React component adhering to user spec
 */
const CartPage = ({ isPanel = false }) => {
    const {
        cartItems,
        calculations,
        handleQuantityChange,
        removeFromCart,
        handleCheckout
    } = useCartPage();

    // Ensure we start at the top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={isPanel ? "font-sans min-h-[calc(100vh-200px)]" : "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans"}>
            <div className={isPanel ? "max-w-7xl mx-auto" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20"}>
                {/* Header Section */}
                {isPanel ? (
                    <PageHeader 
                        title="Your Cart"
                        subtitle="Review your selected pieces before finishing."
                    />
                ) : (
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                            Your Cart
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg tracking-tight">
                            Review your selected pieces before finishing.
                        </p>
                    </header>
                )}

                {cartItems.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className={isPanel ? "flex flex-col lg:flex-row gap-8 items-start" : "flex flex-col lg:flex-row gap-12 items-start"}>
                        {/* Left Column: Cart Items List */}
                        <div className="flex-1 w-full space-y-4">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item, index) => {
                                    const product = item.item || item.itemId || item.productId || item;
                                    const keyId = product?._id || product?.id || item.product_id || item._id || `cart-item-${index}`;
                                    return (
                                        <motion.div
                                            key={keyId}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <CartItemCard
                                                item={item}
                                                onRemove={removeFromCart}
                                                onUpdateQuantity={handleQuantityChange}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Right Column: Order Summary Card */}
                        <aside className="w-full lg:w-[380px] shrink-0">
                            <OrderSummary
                                onCheckout={handleCheckout}
                                calculations={calculations}
                                isPanel={isPanel}
                            />
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
