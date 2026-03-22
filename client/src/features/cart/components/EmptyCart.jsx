import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';

/**
 * EmptyCart Component for displaying when the cart is empty
 * Matches the required CTA behavior
 */
const EmptyCart = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm text-center min-h-[400px] animate-fadeIn">
            <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center animate-pulse">
                    <FiShoppingBag className="w-10 h-10 text-blue-600/60" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">0</span>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty.</h3>
            <p className="text-gray-400 max-w-xs mb-10 font-medium leading-relaxed tracking-tight">
                Looks like you haven't added anything to your cart yet. Browse our collections to find something you love.
            </p>

            <button
                onClick={() => navigate('/products')}
                className="group flex items-center gap-3 py-4 px-10 bg-[#1E3A8A] text-white rounded-full text-base font-bold shadow-2xl shadow-blue-900/40 hover:bg-black transition-all hover:scale-105 active:scale-95"
            >
                Start Exploring
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default EmptyCart;
