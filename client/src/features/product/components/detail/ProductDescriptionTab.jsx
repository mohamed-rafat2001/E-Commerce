import React from 'react';

const ProductDescriptionTab = ({ description }) => {
    if (!description) {
        return (
            <div className="bg-white rounded-[2.5rem] p-20 border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 font-black text-3xl">?</div>
                <h4 className="text-xl font-black text-gray-900 mb-2">No Description Found</h4>
                <p className="text-gray-400 font-medium max-w-xs">It seems this product doesn't have a vision narrative or public copy yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-gray-100 min-h-[400px]">
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 border-l-2 border-indigo-600 pl-4">Product Narrative</h3>
            <div className="prose prose-indigo max-w-none">
                <p className="text-gray-600 text-lg md:text-xl leading-[1.8] font-medium whitespace-pre-wrap">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ProductDescriptionTab;
