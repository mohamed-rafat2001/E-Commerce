import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiFilter, FiX } from 'react-icons/fi';
import { Button } from '../../../shared/ui/index.js';
import useCategories from '../../home/hooks/useCategories.js';
import useBrands from '../../home/hooks/useBrands.js';

export default function FiltersSidebar({ filters, setFilter, clearFilters, hasActiveFilters, isMobileOpen, setIsMobileOpen }) {
    const { categories } = useCategories();
    const { brands } = useBrands();

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
        const currentBrands = filters.brand ? filters.brand.split(',') : [];
        let newBrands;
        if (currentBrands.includes(brandId)) {
            newBrands = currentBrands.filter(id => id !== brandId);
        } else {
            newBrands = [...currentBrands, brandId];
        }
        setFilter('brandId', newBrands.join(','));
    };

    const sidebarContent = (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-y-auto max-h-[calc(100vh-120px)] hide-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <FiFilter className="text-indigo-600" /> Filters
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors uppercase tracking-wider"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Category Filter */}
                <FilterSection title="Category" isOpen={openSections.category} onToggle={() => toggleSection('category')}>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        <button
                            onClick={() => setFilter('category', '')}
                            className={`w-full text-left text-sm py-1.5 transition-colors ${!filters.category ? 'font-bold text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            All Categories
                        </button>
                        {categories?.map(cat => (
                            <button
                                key={cat._id}
                                onClick={() => setFilter('category', cat._id)}
                                className={`w-full text-left text-sm py-1.5 transition-colors ${filters.category === cat._id ? 'font-bold text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price Range" isOpen={openSections.price} onToggle={() => toggleSection('price')}>
                    <form onSubmit={handlePriceApply} className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input
                                    type="number"
                                    name="min"
                                    defaultValue={filters.minPrice}
                                    placeholder="Min"
                                    className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                />
                            </div>
                            <span className="text-gray-300">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input
                                    type="number"
                                    name="max"
                                    defaultValue={filters.maxPrice}
                                    placeholder="Max"
                                    className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <Button type="submit" variant="outline" size="sm" fullWidth className="py-2 text-xs font-bold uppercase tracking-wider">
                            Apply Range
                        </Button>
                    </form>
                </FilterSection>

                {/* Brands Filter */}
                {brands?.length > 0 && (
                    <FilterSection title="Brands" isOpen={openSections.brand} onToggle={() => toggleSection('brand')}>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {brands.map(brand => {
                                const isSelected = (filters.brand || '').includes(brand._id);
                                return (
                                    <label key={brand._id} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 group-hover:border-indigo-400'}`}>
                                            {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`text-sm select-none transition-colors ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                            {brand.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </FilterSection>
                )}

                {/* Rating Filter */}
                <FilterSection title="Rating" isOpen={openSections.rating} onToggle={() => toggleSection('rating')}>
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map(rating => (
                            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={filters.rating === String(rating)}
                                    onChange={() => setFilter('ratingAverage[gte]', String(rating))}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                />
                                <div className="flex items-center gap-1 text-sm text-gray-600 group-hover:text-gray-900">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-gray-300 fill-gray-100'}`} />
                                        ))}
                                    </div>
                                    <span className="ml-1">& Up</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Availability Filter */}
                <FilterSection title="Availability" isOpen={openSections.availability} onToggle={() => toggleSection('availability')}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.inStock ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 group-hover:border-emerald-400'}`}>
                            {filters.inStock && <FiCheck className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-sm select-none transition-colors ${filters.inStock ? 'font-semibold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            In Stock Only
                        </span>
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={!!filters.inStock}
                            onChange={(e) => setFilter('inStock', e.target.checked ? 'true' : '')}
                        />
                    </label>
                </FilterSection>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 shrink-0 relative z-10 sticky top-28">
                {sidebarContent}
            </div>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-white z-[101] shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h3 className="text-xl font-black text-gray-900">Filters</h3>
                                <button onClick={() => setIsMobileOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                                <div className="p-6">
                                    {sidebarContent}
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                                <Button variant="outline" fullWidth onClick={() => { clearFilters(); setIsMobileOpen(false); }}>
                                    Clear
                                </Button>
                                <Button variant="primary" fullWidth onClick={() => setIsMobileOpen(false)}>
                                    View Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
                
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
}

const FilterSection = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full py-2 mb-2 group"
        >
            <span className="font-bold text-gray-800 text-sm uppercase tracking-wide group-hover:text-indigo-600 transition-colors">{title}</span>
            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                {isOpen ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
            </div>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="pt-2 pb-1">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FiCheck = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const FiStar = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
