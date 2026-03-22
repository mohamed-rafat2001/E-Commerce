import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyPromoCode, selectPromoInfo } from '../../../app/store/slices/cartSlice';

/**
 * Promo Code component for entering and applying discount codes
 */
const PromoCodeInput = () => {
    const dispatch = useDispatch();
    const { code, discount } = useSelector(selectPromoInfo);
    const [inputValue, setInputValue] = useState(code || '');
    const [status, setStatus] = useState(null); // 'success' | 'error' | null

    const handleApply = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        dispatch(applyPromoCode(inputValue.trim()));

        // Mocking success/error feedback based on local SAVE10 logic
        if (inputValue.toUpperCase() === 'SAVE10') {
            setStatus('success');
        } else {
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleApply} className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Promo Code
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        if (status) setStatus(null);
                    }}
                    placeholder="Enter code"
                    className={`flex-1 px-4 py-2.5 bg-gray-100 border rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/10 transition-all ${status === 'error' ? 'border-red-300' : 'border-transparent'
                        }`}
                />
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-md active:scale-95"
                >
                    Apply
                </button>
            </div>
            {status === 'success' && (
                <p className="text-xs text-emerald-600 font-medium pl-1 animate-fadeIn">
                    Promo code applied! {discount}% discount saved.
                </p>
            )}
            {status === 'error' && (
                <p className="text-xs text-red-500 font-medium pl-1 animate-fadeIn">
                    Invalid promo code. Try SAVE10
                </p>
            )}
        </form>
    );
};

export default PromoCodeInput;
