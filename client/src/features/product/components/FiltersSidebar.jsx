import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiFilter, FiX, FiStar } from 'react-icons/fi';
import useCategories from '../../home/hooks/useCategories.js';
import useBrands from '../../home/hooks/useBrands.js';

export default function FiltersSidebar({ filters, setFilter, clearFilters, hasActiveFilters, isMobile = false }) {
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
        const currentBrands = filters.brandId ? filters.brandId.split(',') : [];
        let newBrands;
        if (currentBrands.includes(brandId)) {
            newBrands = currentBrands.filter(id => id !== brandId);
        } else {
            newBrands = [...currentBrands, brandId];
        }
        setFilter('brandId', newBrands.join(','));
    };

    const sidebarClass = isMobile ? "bg-white" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-5";

    return (
        <div className={sidebarClass}>
            {!isMobile && (
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <FiFilter /> Filters
                    </h3>
                </div>
            )}

            <div className="space-y-6">
                {/* Category Filter */}
                <FilterSection title="Category" isOpen={openSections.category} onToggle={() => toggleSection('category')}>
                    <div className="space-y-1">
                        <button
                            onClick={() => setFilter('category', '')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${!filters.category ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            All Categories
                        </button>
                        {categories?.map(cat => (
                            <button
                                key={cat._id}
                                onClick={() => setFilter('category', cat._id)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${filters.category === cat._id ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
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
                            <input
                                type="number"
                                name="min"
                                defaultValue={filters['price[gte]']}
                                placeholder="Min"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                                onWheel={(e) => e.target.blur()}
                            />
                            <span className="text-gray-400">—</span>
                            <input
                                type="number"
                                name="max"
                                defaultValue={filters['price[lte]']}
                                placeholder="Max"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-150"
                        >
                            Apply Range
                        </button>
                    </form>
                </FilterSection>

                {/* Brands Filter */}
                {brands?.length > 0 && (
                    <FilterSection title="Brands" isOpen={openSections.brand} onToggle={() => toggleSection('brand')}>
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {brands.map(brand => {
                                const isSelected = (filters.brandId || '').split(',').includes(brand._id);
                                return (
                                    <label key={brand._id} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleBrandToggle(brand._id)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                                        />
                                        <span className={`text-sm ${isSelected ? 'font-semibold text-primary' : 'text-gray-600'}`}>
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
                    <div className="space-y-1">
                        {[4, 3, 2, 1].map(rating => (
                            <label key={rating} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={filters['ratingAverage[gte]'] === String(rating)}
                                    onChange={() => setFilter('ratingAverage[gte]', String(rating))}
                                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary/20"
                                />
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <div className="flex text-yellow-400">
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
                    <label className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={!!filters.inStock}
                            onChange={(e) => setFilter('inStock', e.target.checked ? 'true' : '')}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                        />
                        <span className={`text-sm ${filters.inStock ? 'font-semibold text-primary' : 'text-gray-600'}`}>
                            In Stock Only
                        </span>
                    </label>
                </FilterSection>
            </div>

            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="text-sm text-center text-gray-400 hover:text-red-500 transition-colors duration-150 mt-8 block w-full"
                >
                    Reset all filters
                </button>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
            `}</style>
        </div>
    );
}

const FilterSection = ({ title, isOpen, onToggle, children }) => (
    <div className="mb-2">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full mb-3 cursor-pointer group"
        >
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">{title}</span>
            <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                <FiChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary" />
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
                    <div className="pb-1">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

