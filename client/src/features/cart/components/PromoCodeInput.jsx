import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validatePromo, removePromo, selectPromoInfo } from '../../../app/store/slices/cartSlice';
import useCart from '../hooks/useCart';

/**
 * Promo Code component for entering and applying discount codes
 */
const PromoCodeInput = () => {
    const dispatch = useDispatch();
    const { cartItems } = useCart();
    const { code, amount, error, isLoading } = useSelector(selectPromoInfo);
    const [inputValue, setInputValue] = useState(code || '');

    useEffect(() => {
        if (code) setInputValue(code);
    }, [code]);

    const handleApply = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        dispatch(validatePromo({ code: inputValue.trim(), cartItems }));
    };

    const handleRemove = () => {
        dispatch(removePromo());
        setInputValue('');
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Promo Code
            </label>
            <form onSubmit={handleApply} className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    disabled={!!code || isLoading}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                    placeholder="Enter code"
                    className={`flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/10 transition-all ${
                        error ? 'border-red-300' : 'border-transparent'
                    } ${code ? 'opacity-75 cursor-not-allowed' : ''}`}
                />
                {!code ? (
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="px-6 py-2.5 bg-gray-900 dark:bg-black text-white rounded-xl text-sm font-bold hover:bg-black dark:hover:bg-gray-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? '...' : 'Apply'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="px-4 py-2.5 text-red-500 font-bold text-sm hover:text-red-700 transition-colors"
                    >
                        Remove
                    </button>
                )}
            </form>
            {code && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pl-1 animate-fadeIn flex justify-between">
                    <span>Code {code} applied!</span>
                    <span>Saved ${amount.toFixed(2)}</span>
                </p>
            )}
            {error && (
                <p className="text-xs text-red-500 font-medium pl-1 animate-fadeIn">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PromoCodeInput;
