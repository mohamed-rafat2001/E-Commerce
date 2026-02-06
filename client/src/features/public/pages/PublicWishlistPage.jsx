import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowLeft } from 'react-icons/fi';
import { Button } from '../../../shared/ui';

const PublicWishlistPage = () => {
    const guestWishlistItems = JSON.parse(localStorage.getItem('guest_wishlist') || '{"items":[]}').items;

    return (
        <div className="container mx-auto px-4 py-12 mt-20">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-8 group">
                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Shopping
                </Link>

                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                        <FiHeart className="w-10 h-10 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Public Wishlist</h2>
                    <p className="text-gray-500 mb-8 max-w-xs text-center">
                        {guestWishlistItems.length > 0 
                            ? `You have ${guestWishlistItems.length} items in your guest wishlist.`
                            : "Your guest wishlist is empty. Save items you love to see them here!"}
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

export default PublicWishlistPage;
