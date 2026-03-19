import { AnimatePresence, motion } from 'framer-motion';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

const BrandCategoryFilter = ({
    categoriesTree, allProductsCount,
    selectedSubCategory, setSelectedSubCategory,
    expandedCategories, toggleCategory,
    onSubCategorySelect
}) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                <FiFilter className="mr-2" /> Categories
            </h3>
        </div>
        <div className="p-2 space-y-1">
            <button
                onClick={() => setSelectedSubCategory('all')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${selectedSubCategory === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
                <span>All Products</span>
                <span className={`text-xs py-0.5 px-2 rounded-full ${selectedSubCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                    {allProductsCount}
                </span>
            </button>

            {categoriesTree.length > 0 ? (
                categoriesTree.map((cat) => (
                    <div key={cat._id} className="rounded-xl overflow-hidden">
                        <button onClick={() => toggleCategory(cat._id)} className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors">
                            <span className="flex items-center">{cat.name}</span>
                            <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedCategories[cat._id] ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {expandedCategories[cat._id] && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-gray-50/50">
                                    {cat.subCategories.map((sub) => (
                                        <button key={sub._id} onClick={() => onSubCategorySelect(sub._id)} className={`w-full text-left pl-8 pr-3 py-2 text-sm transition-colors flex items-center gap-2 ${selectedSubCategory === sub._id ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedSubCategory === sub._id ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                            {sub.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))
            ) : (
                <div className="px-3 py-4 text-center text-gray-400 text-xs">No categories found</div>
            )}
        </div>
    </div>
);

export default BrandCategoryFilter;
