import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DataHeader = ({ 
    title, 
    description, 
    searchPlaceholder = "Search...", 
    sortOptions = [],
    filterOptions = [],
    actions,
    showSearch = true,
    showSort = true
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [sortValue, setSortValue] = useState(searchParams.get("sort") || (sortOptions[0]?.value || ""));

    // Sync state with URL params
    useEffect(() => {
        const currentSearch = searchParams.get("search") || "";
        if (currentSearch !== searchTerm) {
            setSearchTerm(currentSearch);
        }
        
        const currentSort = searchParams.get("sort") || (sortOptions[0]?.value || "");
        if (currentSort !== sortValue) {
            setSortValue(currentSort);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Handle Search with Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = searchParams.get("search") || "";
            // Only update if the search term has actually changed from what's in the URL
            if (searchTerm !== currentSearch) {
                setSearchParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    if (searchTerm) {
                        newParams.set("search", searchTerm);
                    } else {
                        newParams.delete("search");
                    }
                    newParams.set("page", "1"); // Reset to page 1 on search
                    return newParams;
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, setSearchParams, searchParams]);

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortValue(value);
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (value) {
                newParams.set("sort", value);
            } else {
                newParams.delete("sort");
            }
            return newParams;
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
                    {description && (
                        <p className="mt-1 text-gray-500 font-medium">{description}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>

            {(showSearch || showSort || filterOptions.length > 0) && (
                <div className="flex flex-col md:flex-row gap-4 p-1">
                    {showSearch && (
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-3 ml-auto">
                        {filterOptions.map((filter) => (
                             <div key={filter.key} className="relative min-w-[140px]">
                                <select
                                    value={searchParams.get(filter.key) || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchParams(prev => {
                                            const newParams = new URLSearchParams(prev);
                                            if (value) {
                                                newParams.set(filter.key, value);
                                            } else {
                                                newParams.delete(filter.key);
                                            }
                                            newParams.set("page", "1");
                                            return newParams;
                                        });
                                    }}
                                    className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="">{filter.label}</option>
                                    {filter.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                        ))}

                        {showSort && sortOptions.length > 0 && (
                            <div className="relative min-w-[180px]">
                                <select
                                    value={sortValue}
                                    onChange={handleSortChange}
                                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer shadow-sm"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            Sort by: {option.label}
                                        </option>
                                    ))}
                                </select>
                                <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default DataHeader;