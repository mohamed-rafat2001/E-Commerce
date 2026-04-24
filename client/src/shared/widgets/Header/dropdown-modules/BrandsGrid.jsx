import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import EmptyState from './EmptyState.jsx';

/**
 * BrandsGrid - Refactored Mega-menu display for Brands
 */
const BrandsGrid = memo(({ filteredItems, closeMenu, getEntityId }) => {
    const [hoveredId, setHoveredId] = useState(null);

    if (filteredItems.length === 0) return <EmptyState />;

    return (
        <div className="space-y-4">
            <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-1"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.02
                        }
                    }
                }}
            >
                {filteredItems.map((brand) => {
                    const brandId = getEntityId(brand);
                    const logo = brand.logo?.secure_url || brand.logo?.url || brand.logo;
                    const isHovered = hoveredId === brandId;

                    return (
                        <motion.div
                            key={brandId || brand.name}
                            variants={{
                                hidden: { opacity: 0, y: 8 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="relative group h-full"
                        >
                            <Link
                                to={brandId ? `/brands/${encodeURIComponent(brandId)}` : '/brands/all'}
                                onClick={closeMenu}
                                onMouseEnter={() => setHoveredId(brandId)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="relative flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all duration-200 z-10 h-full overflow-hidden"
                            >
                                {/* Magnetic Hover Highlight */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            layoutId="brand-hover-highlight"
                                            className="absolute inset-0 bg-indigo-50/70 dark:bg-indigo-500/10 -z-10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                </AnimatePresence>

                                <motion.div 
                                    className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    {logo ? (
                                        <img src={logo} alt={brand.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[9px] font-black text-gray-400">
                                            {(brand.name || 'BR').slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </motion.div>
                                
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-200 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                                    {brand.name}
                                </span>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
});

export default BrandsGrid;
