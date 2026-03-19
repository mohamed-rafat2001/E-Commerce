import { FiX, FiFilter, FiChevronDown } from 'react-icons/fi';
import { Select } from '../../../shared/ui/index.js';
import useCategories from '../../home/hooks/useCategories.js';
import useBrands from '../../home/hooks/useBrands.js';

export default function SortBar({ totalCount, filters, setFilter, clearFilters, onMobileFilterClick }) {
    const { categories } = useCategories();
    const { brands } = useBrands();

    const activeFilters = [];
    if (filters.category) {
        const cat = categories?.find(c => c._id === filters.category);
        activeFilters.push({ key: 'category', label: `Category: ${cat?.name || 'Loading...'}` });
    }
    if (filters.search) activeFilters.push({ key: 'search', label: `Search: "${filters.search}"` });
    if (filters.minPrice || filters.maxPrice) {
        const min = filters.minPrice ? `$${filters.minPrice}` : '$0';
        const max = filters.maxPrice ? `$${filters.maxPrice}` : 'Any';
        activeFilters.push({ key: 'price', label: `Price: ${min} - ${max}` });
    }
    if (filters.brand) {
        filters.brand.split(',').forEach(brandId => {
            const brand = brands?.find(b => b._id === brandId);
            activeFilters.push({ key: `brand-${brandId}`, label: `Brand: ${brand?.name || brandId}`, type: 'brand', val: brandId });
        });
    }
    if (filters.rating) activeFilters.push({ key: 'rating', label: `Rating: ${filters.rating}+ Stars` });
    if (filters.inStock) activeFilters.push({ key: 'inStock', label: 'In Stock Only' });

    const handleRemoveFilter = (filterObj) => {
        if (filterObj.type === 'brand') {
            const currentBrands = filters.brand.split(',');
            const newBrands = currentBrands.filter(id => id !== filterObj.val);
            setFilter('brandId', newBrands.join(','));
        } else if (filterObj.key === 'price') {
            setFilter('price[gte]', '');
            setFilter('price[lte]', '');
        } else if (filterObj.key === 'rating') {
            setFilter('ratingAverage[gte]', '');
        } else {
            setFilter(filterObj.key, '');
        }
    };

    return (
        <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <p className="text-gray-600 font-medium">
                        Showing <span className="font-black text-gray-900">{totalCount}</span> results
                    </p>
                    <button
                        onClick={onMobileFilterClick}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-gray-50 active:bg-gray-100"
                    >
                        <FiFilter /> Filters
                    </button>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Sort By</span>
                    <Select
                        value={filters.sort}
                        onChange={(e) => setFilter('sort', e.target.value)}
                        options={[
                            { value: '-createdAt', label: 'Newest First' },
                            { value: 'createdAt', label: 'Oldest First' },
                            { value: 'price.amount', label: 'Price: Low to High' },
                            { value: '-price.amount', label: 'Price: High to Low' },
                            { value: '-ratingAverage', label: 'Best Rating' },
                            { value: '-sold', label: 'Best Selling' },
                        ]}
                        className="w-full sm:w-48 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                    />
                </div>
            </div>

            {/* Active Filters Chips */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-2">Set Filters:</span>
                    {activeFilters.map(af => (
                        <div key={af.key} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-[11px] font-bold">
                            {af.label}
                            <button onClick={() => handleRemoveFilter(af)} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors">
                                <FiX className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <button onClick={clearFilters} className="ml-2 text-xs font-bold text-gray-400 hover:text-rose-500 hover:underline transition-colors uppercase tracking-wider">
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
}
