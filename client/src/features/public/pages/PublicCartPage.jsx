import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { Button } from '../../../shared/ui';

const PublicCartPage = () => {
    // For now, simple placeholder. In a real app, this would read from localStorage
    const guestCartItems = JSON.parse(localStorage.getItem('guest_cart') || '{"items":[]}').items;

    return (
        <div className="container mx-auto px-4 py-12 mt-20">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-8 group">
                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Shopping
                </Link>

                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                        <FiShoppingBag className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Public Shopping Cart</h2>
                    <p className="text-gray-500 mb-8 max-w-xs text-center">
                        {guestCartItems.length > 0 
                            ? `You have ${guestCartItems.length} items in your guest cart.`
                            : "Your guest cart is empty. Sign in to sync your cart across devices!"}
                    </p>
                    <div className="flex gap-4">
                        <Link to="/login">
                            <Button variant="primary">Sign In</Button>
                        </Link>
                        <Link to="/">
                            <Button variant="ghost">Continue Shopping</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicCartPage;
