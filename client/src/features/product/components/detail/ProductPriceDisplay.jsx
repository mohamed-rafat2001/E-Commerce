import React from 'react';
import { Badge } from '../../../../shared/ui';

const ProductPriceDisplay = ({ price, discount = 0, className = "" }) => {
    const amount = typeof price === 'object' ? price.amount : price || 0;
    const hasDiscount = discount > 0;
    const originalPrice = hasDiscount ? (amount / (1 - discount / 100)).toFixed(2) : null;

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Retail Valuation</p>
            <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-gray-900 tracking-tighter flex items-center">
                    <span className="text-xl text-indigo-500 mr-1">$</span>
                    {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>

                {hasDiscount && (
                    <div className="flex flex-col">
                        <span className="text-lg text-gray-400 line-through font-bold decoration-2">
                            ${originalPrice}
                        </span>
                        <Badge variant="sale" className="!bg-rose-500 !text-white !border-none !px-2 !py-0.5 !text-[10px] !rounded-lg !font-black !w-fit mt-1">
                            -{discount}% OFF
                        </Badge>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPriceDisplay;
