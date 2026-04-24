import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { memo } from 'react';
import { SearchIcon } from '../../../constants/icons.jsx';
import EmptyState from './EmptyState.jsx';

/**
 * CategoriesGrid - Refactored Mega-menu display for Categories
 */
const CategoriesGrid = memo(({ filteredItems, activeCategory, setActiveCategoryId, closeMenu, getEntityId }) => {
    if (filteredItems.length === 0) return <EmptyState />;
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Left Column: Main Categories with Magnetic Highlight */}
            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-2 bg-gray-50/50 dark:bg-gray-800/20 max-h-[320px] overflow-y-auto custom-scrollbar relative">
                <motion.div 
                    className="space-y-1"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.02 }
                        }
                    }}
                >
                    {filteredItems.map((item) => {
                        const itemId = item._id || item.id;
                        const isActive = (activeCategory?._id || activeCategory?.id) === itemId;
                        return (
                            <motion.div
                                key={itemId || item.name}
                                variants={{
                                    hidden: { opacity: 0, x: -10 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                                className="relative"
                            >
                                <button
                                    onMouseEnter={() => setActiveCategoryId(itemId)}
                                    onFocus={() => setActiveCategoryId(itemId)}
                                    onClick={() => setActiveCategoryId(itemId)}
                                    className={`relative w-full appearance-none border-none text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all z-10 ${isActive
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-cat-bg"
                                            className="absolute inset-0 bg-white dark:bg-gray-900 shadow-sm border border-indigo-100 dark:border-indigo-500/20 rounded-xl -z-10"
                                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                    <span className="relative">{item.name}</span>
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Right Column: Subcategories Detail with Staggered Entrance */}
            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-sm min-h-[320px] max-h-[320px] overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory?._id || activeCategory?.id || 'none'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50 dark:border-gray-800">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Collection</span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight">
                                    {activeCategory?.name || 'Category'}
                                </h3>
                            </div>
                            {activeCategory && getEntityId(activeCategory) && (
                                <Link
                                    to={`/products?category=${encodeURIComponent(getEntityId(activeCategory))}`}
                                    onClick={closeMenu}
                                    className="px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                >
                                    View All
                                </Link>
                            )}
                        </div>

                        {(activeCategory?.subCategories || []).length > 0 ? (
                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.02, delayChildren: 0.1 }
                                    }
                                }}
                            >
                                {activeCategory.subCategories.map((sub) => {
                                    const categoryId = getEntityId(activeCategory);
                                    const subCategoryId = getEntityId(sub);
                                    if (!categoryId || !subCategoryId) return null;
                                    return (
                                        <motion.div
                                            key={subCategoryId || sub.name}
                                            variants={{
                                                hidden: { opacity: 0, scale: 0.95 },
                                                visible: { opacity: 1, scale: 1 }
                                            }}
                                        >
                                            <Link
                                                to={`/products?category=${encodeURIComponent(categoryId)}&subCategory=${encodeURIComponent(subCategoryId)}`}
                                                onClick={closeMenu}
                                                className="group flex flex-col p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all"
                                            >
                                                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                                                    {sub.name}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Explore pieces
                                                </span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <SearchIcon className="w-8 h-8 text-gray-200 mb-2" />
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    No Boutique Pieces yet
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
});

export default CategoriesGrid;
