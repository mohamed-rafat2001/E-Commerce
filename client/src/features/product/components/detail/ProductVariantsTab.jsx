import React from 'react';

const ProductVariantsTab = ({ colors = [], sizes = [] }) => {
    const hasVariants = colors.length > 0 || sizes.length > 0;

    if (!hasVariants) {
        return (
            <div className="bg-white rounded-[2.5rem] p-16 border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 font-black text-2xl">!</div>
                <h4 className="text-xl font-black text-gray-900 mb-2">Standard Configuration</h4>
                <p className="text-gray-400 font-medium max-w-xs">This product does not currently feature color or size variations.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colors Section */}
            {colors.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">Available Colors</h4>
                    <div className="flex flex-wrap gap-5">
                        {colors.map((color, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3 group">
                                <div
                                    className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl shadow-gray-200 group-hover:scale-110 group-hover:shadow-indigo-100 transition-all cursor-crosshair"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{color}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes Section */}
            {sizes.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">Size Selection</h4>
                    <div className="flex flex-wrap gap-3">
                        {sizes.map((size, idx) => (
                            <div
                                key={idx}
                                className="px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 text-xs font-black text-gray-900 uppercase tracking-widest hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all cursor-default"
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductVariantsTab;
