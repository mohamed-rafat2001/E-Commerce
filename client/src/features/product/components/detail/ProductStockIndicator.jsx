import React from 'react';
import { FiPackage } from 'react-icons/fi';
import { Badge } from '../../../../shared/ui';

const ProductStockIndicator = ({ stock = 0 }) => {
    const isOut = stock === 0;
    const isLow = stock > 0 && stock <= 5;

    return (
        <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Inventory State</p>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] shadow-inner">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm">
                        <FiPackage className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-gray-900 leading-none">{stock}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Available</span>
                    </div>
                </div>

                {isOut && (
                    <Badge className="!bg-rose-500 !text-white !border-none px-4 py-2 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-rose-100">
                        Out of Stock
                    </Badge>
                )}
                {isLow && (
                    <Badge className="!bg-amber-400 !text-black !border-none px-4 py-2 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-amber-100 animate-pulse">
                        Low Stock Warning
                    </Badge>
                )}
            </div>
        </div>
    );
};

export default ProductStockIndicator;
