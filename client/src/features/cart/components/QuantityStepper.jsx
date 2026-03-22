import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

/**
 * Reusable Quantity Stepper component as per spec
 * @param {number} quantity - The current quantity
 * @param {function} onIncrease - Callback for increase button
 * @param {function} onDecrease - Callback for decrease button
 * @param {boolean} disabled - Whether the stepper is interaction-disabled
 */
const QuantityStepper = ({ quantity, onIncrease, onDecrease, disabled = false }) => {
    // Zero-padded quantity: "01", "02", etc.
    const paddedQuantity = quantity.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-4 bg-gray-100/80 p-1.5 rounded-full px-4 w-fit">
            <button
                type="button"
                onClick={onDecrease}
                disabled={disabled || quantity <= 1}
                aria-label="Decrease quantity"
                className="text-blue-900/60 hover:text-blue-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <FiMinus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold text-blue-900 min-w-[20px] text-center">
                {paddedQuantity}
            </span>
            <button
                type="button"
                onClick={onIncrease}
                disabled={disabled}
                aria-label="Increase quantity"
                className="text-blue-900/60 hover:text-blue-900 transition-colors"
            >
                <FiPlus className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};

export default QuantityStepper;
