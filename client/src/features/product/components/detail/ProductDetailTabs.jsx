import React from 'react';

const ProductDetailTabs = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="flex border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative px-10 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'text-indigo-600'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default ProductDetailTabs;
