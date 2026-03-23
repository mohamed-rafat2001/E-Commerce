import React from 'react';

const ColorSelector = ({ colors = [], selectedColor, onSelect }) => {
  if (!colors.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
        Select Color: <span className="text-gray-900 ml-1">{selectedColor || 'None'}</span>
      </h3>
      <div className="flex flex-wrap gap-4">
        {colors.map((color, idx) => {
          const isActive = selectedColor === color;
          return (
            <button
              key={idx}
              onClick={() => onSelect(color)}
              className={`group relative w-10 h-10 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'ring-2 ring-blue-600 ring-offset-4 scale-110' 
                  : 'hover:scale-110 ring-1 ring-gray-200 ring-offset-2'
              }`}
              title={color}
              aria-label={`Select color ${color}`}
              aria-pressed={isActive}
            >
              <div 
                className="absolute inset-0 rounded-full border border-black/5 shadow-inner"
                style={{ backgroundColor: color }}
              />
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;
