import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiFilter, FiX, FiStar, FiRefreshCw } from 'react-icons/fi';
import useCategories from '../../home/hooks/useCategories.js';
import useBrands from '../../home/hooks/useBrands.js';

export default function FiltersSidebar({ filters, setFilter, clearFilters, hasActiveFilters, isMobile = false }) {
    const { categories } = useCategories();
    const { originalBrands: brands } = useBrands();

    const [openSections, setOpenSections] = useState({
        category: true,
        price: true,
        brand: true,
        rating: true,
        availability: true
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePriceApply = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const min = formData.get('min');
        const max = formData.get('max');
        setFilter('price[gte]', min || '');
        setFilter('price[lte]', max || '');
    };

    const handleBrandToggle = (brandId) => {
        const currentBrands = filters.brandId ? filters.brandId.split(',') : [];
        let newBrands;
        if (currentBrands.includes(brandId)) {
            newBrands = currentBrands.filter(id => id !== brandId);
        } else {
            newBrands = [...currentBrands, brandId];
        }
        setFilter('brandId', newBrands.join(','));
    };

    const sidebarClass = isMobile 
        ? "bg-white dark:bg-gray-900 px-4 pb-10" 
        : "bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-100/50 dark:shadow-black/20 p-8 sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto overscroll-contain custom-scrollbar";

    return (
        <div className={sidebarClass}>
            {!isMobile && (
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50 dark:border-gray-700">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100">
                            <FiFilter className="w-4 h-4" />
                        </div>
                        Refine Search
                    </h3>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 group"
                            title="Clear All"
                        >
                            <FiRefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                    )}
                </div>
            )}

            <div className="space-y-10">
                {/* Category Filter */}
                <FilterSection title="Category" isOpen={openSections.category} onToggle={() => toggleSection('category')}>
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-3 custom-scrollbar">
                        <button
                            onClick={() => {
                                setFilter('category', '');
                                setFilter('subCategory', '');
                            }}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${!filters.category ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 dark:bg-gray-100 dark:text-gray-900 dark:shadow-gray-900/40' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`}
                        >
                            All Pieces
                        </button>
                        {categories?.map(cat => {
                            const isCategoryActive = filters.category === cat._id;
                            return (
                                <div key={cat._id} className="space-y-1.5">
                                    <button
                                        onClick={() => {
                                            setFilter('category', cat._id);
                                            setFilter('subCategory', ''); // Clear subcategory when changing category
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${isCategoryActive ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 dark:bg-gray-100 dark:text-gray-900 dark:shadow-gray-900/40' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`}
                                    >
                                        {cat.name}
                                    </button>
                                    
                                    {/* Subcategories */}
                                    <AnimatePresence>
                                        {isCategoryActive && cat.subCategories?.length > 0 && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="pl-4 space-y-1 overflow-hidden"
                                            >
                                                {cat.subCategories.map(sub => (
                                                    <button
                                                        key={sub._id}
                                                        onClick={() => setFilter('subCategory', sub._id)}
                                                        className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${filters.subCategory === sub._id ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                    >
                                                        — {sub.name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price Point" isOpen={openSections.price} onToggle={() => toggleSection('price')}>
                    <form onSubmit={handlePriceApply} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                                <input
                                    type="number"
                                    name="min"
                                    defaultValue={filters['price[gte]']}
                                    placeholder="Min"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none text-xs font-bold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all outline-none appearance-none"
                                    onWheel={(e) => e.target.blur()}
                                />
                            </div>
                            <div className="h-px w-3 bg-gray-200" />
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                                <input
                                    type="number"
                                    name="max"
                                    defaultValue={filters['price[lte]']}
                                    placeholder="Max"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none text-xs font-bold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all outline-none appearance-none"
                                    onWheel={(e) => e.target.blur()}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-white hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900/40 transition-all duration-300 active:scale-95"
                        >
                            Update Range
                        </button>
                    </form>
                </FilterSection>

                {/* Brands Filter */}
                {brands?.length > 0 && (
                    <FilterSection title="Designers" isOpen={openSections.brand} onToggle={() => toggleSection('brand')}>
                        <div className="space-y-1 max-h-56 overflow-y-auto pr-3 custom-scrollbar">
                            {brands.map(brand => {
                                const isSelected = (filters.brandId || '').split(',').includes(brand._id);
                                return (
                                    <label key={brand._id} className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-500/15' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleBrandToggle(brand._id)}
                                                    className="peer w-5 h-5 rounded-md border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all cursor-pointer appearance-none checked:bg-gray-900 dark:checked:bg-gray-100 checked:border-gray-900 dark:checked:border-gray-100"
                                                />
                                                <FiX className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none rotate-45" />
                                            </div>
                                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                                                {brand.name}
                                            </span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </FilterSection>
                )}

                {/* Rating Filter */}
                <FilterSection title="Curator Rating" isOpen={openSections.rating} onToggle={() => toggleSection('rating')}>
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map(rating => {
                            const isSelected = filters['ratingAverage[gte]'] === String(rating);
                            return (
                                <label key={rating} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${isSelected ? 'bg-amber-50/50 dark:bg-amber-500/15' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={isSelected}
                                        onChange={() => setFilter('ratingAverage[gte]', String(rating))}
                                        className="w-5 h-5 text-amber-500 border-2 border-gray-200 dark:border-gray-600 focus:ring-amber-100 dark:focus:ring-amber-500/30 transition-all cursor-pointer"
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-amber-600' : 'text-gray-400'}`}>
                                            & Up
                                        </span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </FilterSection>

                {/* Availability Filter */}
                <FilterSection title="Stock Status" isOpen={openSections.availability} onToggle={() => toggleSection('availability')}>
                    <label className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${filters.inStock ? 'bg-emerald-50/50 dark:bg-emerald-500/15' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={!!filters.inStock}
                                    onChange={(e) => setFilter('inStock', e.target.checked ? 'true' : '')}
                                    className="peer w-5 h-5 rounded-md border-2 border-gray-200 dark:border-gray-600 text-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-500/30 transition-all cursor-pointer appearance-none checked:bg-emerald-500 checked:border-emerald-500"
                                />
                                <div className="absolute w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${filters.inStock ? 'text-emerald-600' : 'text-gray-600'}`}>
                                Ready to Ship
                            </span>
                        </div>
                    </label>
                </FilterSection>
            </div>

            {hasActiveFilters && isMobile && (
                <button
                    onClick={clearFilters}
                    className="w-full mt-10 py-4 rounded-xl border-2 border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-50 transition-all duration-300"
                >
                    Clear All Filters
                </button>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #e2e8f0; }
            `}</style>
        </div>
    );
}

const FilterSection = ({ title, isOpen, onToggle, children }) => (
    <div className="mb-2">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full mb-5 cursor-pointer group"
        >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 group-hover:text-amber-600 transition-colors">{title}</span>
            <div className={`transition-all duration-300 w-6 h-6 rounded-lg flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-gray-800 ${isOpen ? 'rotate-180' : ''}`}>
                <FiChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
            </div>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="pb-4">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);
