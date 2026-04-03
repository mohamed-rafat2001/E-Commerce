import { FiX, FiFilter, FiChevronDown } from 'react-icons/fi';
import useCategories from '../../home/hooks/useCategories.js';
import useBrands from '../../home/hooks/useBrands.js';

export default function SortBar({ totalCount, filters, setFilter, clearFilters, onMobileFilterClick }) {
    const { categories } = useCategories();
    const { originalBrands: brands } = useBrands();

    const activeFilters = [];
    if (filters.category) {
        const cat = categories?.find(c => c._id === filters.category);
        if (cat) activeFilters.push({ key: 'category', label: `Category: ${cat.name}` });
    }
    if (filters.search) activeFilters.push({ key: 'search', label: `Search: "${filters.search}"` });
    if (filters['price[gte]'] || filters['price[lte]']) {
        const min = filters['price[gte]'] ? `$${filters['price[gte]']}` : '$0';
        const max = filters['price[lte]'] ? `$${filters['price[lte]']}` : 'Any';
        activeFilters.push({ key: 'price', label: `Price: ${min} - ${max}` });
    }
    if (filters.brandId) {
        filters.brandId.split(',').forEach(brandId => {
            const brand = brands?.find(b => b._id === brandId);
            if (brand) activeFilters.push({ key: `brand-${brandId}`, label: `Brand: ${brand.name}`, type: 'brand', val: brandId });
        });
    }
    if (filters['ratingAverage[gte]']) activeFilters.push({ key: 'ratingAverage[gte]', label: `Rating: ${filters['ratingAverage[gte]']}+ Stars` });
    if (filters.inStock) activeFilters.push({ key: 'inStock', label: 'In Stock Only' });

    const handleRemoveFilter = (filterObj) => {
        if (filterObj.type === 'brand') {
            const currentBrands = filters.brandId.split(',');
            const newBrands = currentBrands.filter(id => id !== filterObj.val);
            setFilter('brandId', newBrands.join(','));
        } else if (filterObj.key === 'price') {
            setFilter('price[gte]', '');
            setFilter('price[lte]', '');
        } else {
            setFilter(filterObj.key, '');
        }
    };

    const sortOptions = [
        { value: '-createdAt', label: 'Newest First' },
        { value: 'price.amount', label: 'Price: Low to High' },
        { value: '-price.amount', label: 'Price: High to Low' },
        { value: '-ratingAverage', label: 'Best Rated' },
        { value: '-sold', label: 'Most Popular' },
    ];

    return (
        <div className="w-full">
            {/* Active Filters Row */}
            {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-4">
                    {activeFilters.map(af => (
                        <div key={af.key} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full border border-gray-200">
                            {af.label}
                            <button onClick={() => handleRemoveFilter(af)} className="hover:bg-gray-200 rounded-full p-0.5 transition-colors">
                                <FiX className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {activeFilters.length >= 2 && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-red-500 hover:text-red-600 font-medium ml-auto flex-shrink-0"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            )}

            {/* Sort + Results Bar */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="hidden lg:block">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{totalCount}</span> results
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
                    <button
                        onClick={onMobileFilterClick}
                        className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-900 transition-all duration-150"
                    >
                        <FiFilter />
                        Filters
                        {activeFilters.length > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 bg-gray-900 text-white text-[10px] rounded-full">
                                {activeFilters.length}
                            </span>
                        )}
                    </button>

                    <div className="relative group">
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilter('sort', e.target.value)}
                            className="appearance-none bg-white border border-gray-200 hover:border-gray-400 pl-5 pr-10 py-2.5 rounded-full text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-100 cursor-pointer shadow-sm transition-all"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-gray-900 transition-colors">
                            <FiChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
