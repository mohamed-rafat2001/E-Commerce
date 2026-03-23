import React from 'react';

const SizeSelector = ({ sizes = [], selectedSize, onSelect, onOpenSizeGuide }) => {
  if (!sizes.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
          Select Size
        </h3>
        <button 
          onClick={onOpenSizeGuide}
          className="text-blue-600 font-bold hover:underline text-sm uppercase tracking-widest"
        >
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-3">
        {sizes.map((sizeObj, idx) => {
          const isObject = typeof sizeObj === 'object';
          const size = isObject ? sizeObj.size : sizeObj;
          const isAvailable = isObject ? sizeObj.available : true;
          const isActive = selectedSize === size;

          return (
            <button
              key={idx}
              onClick={() => isAvailable && onSelect(size)}
              disabled={!isAvailable}
              className={`
                px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 border-2
                ${!isAvailable 
                  ? 'opacity-40 cursor-not-allowed line-through border-gray-100 bg-gray-50 text-gray-300' 
                  : isActive 
                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100' 
                    : 'border-gray-100 text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              aria-label={`Size ${size}`}
              aria-pressed={isActive}
              aria-disabled={!isAvailable}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
