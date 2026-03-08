import React from 'react';

const ProductThumbnails = ({ gallery, activeIndex, onSelect }) => {
    if (gallery.length <= 1) return null;

    return (
        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
            {gallery.map((img, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(idx)}
                    className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${idx === activeIndex
                            ? 'border-indigo-600 shadow-lg shadow-indigo-100'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                >
                    <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className={`w-full h-full object-cover ${idx === activeIndex ? 'opacity-100' : 'opacity-60'}`}
                    />
                </button>
            ))}
        </div>
    );
};

export default ProductThumbnails;
