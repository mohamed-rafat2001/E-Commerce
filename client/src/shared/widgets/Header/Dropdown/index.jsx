import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, SearchIcon } from '../../../constants/icons.jsx';

// Sub-components
import BrandsGrid from './BrandsGrid.jsx';
import CategoriesGrid from './CategoriesGrid.jsx';
import SimpleList from './SimpleList.jsx';

/**
 * DropdownMenu - Modular Mega-menu component
 */
const DropdownMenu = ({ label, items, viewAllPath, basePath, isSimple = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const menuRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    const isCategoriesMenu = label.toLowerCase() === 'categories';
    const isBrandsMenu = label.toLowerCase() === 'brands';

    // --- Interaction Hooks ---

    // Scroll locking for mobile
    useEffect(() => {
        if (isOpen && !isDesktop && !isSimple) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, isDesktop, isSimple]);

    // Outside click detection
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Responsive detection
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        setIsDesktop(mediaQuery.matches);
        const handler = (e) => setIsDesktop(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Accessibility (Escape & Search focus)
    useEffect(() => {
        const handleEscape = (e) => { if (e.key === 'Escape') setIsOpen(false); };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            if (!isSimple) setTimeout(() => searchInputRef.current?.focus(), 100);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, isSimple]);

    // --- Business Logic ---

    const openDropdown = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsOpen(true);
    };

    const scheduleCloseDropdown = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 180);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const filteredItems = useMemo(() => {
        if (!searchQuery) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item => item.name.toLowerCase().includes(query));
    }, [items, searchQuery]);

    const activeCategory = useMemo(() => {
        if (!isCategoriesMenu) return null;
        const firstId = filteredItems?.[0]?._id || filteredItems?.[0]?.id || null;
        const currentActiveId = activeCategoryId || firstId;
        return filteredItems.find(item => (item._id || item.id) === currentActiveId) || filteredItems[0] || null;
    }, [activeCategoryId, filteredItems, isCategoriesMenu]);

    const getEntityId = (item) => item?._id || item?.id || null;

    const resolveItemPath = (item) => {
        if (item.path) return item.path;
        const itemId = getEntityId(item);
        const itemSlug = item.slug || itemId;
        return itemSlug ? `${basePath}/${itemSlug}` : viewAllPath;
    };

    const hasManyItems = items.length > 8;

    return (
        <div
            className="relative inline-block"
            ref={containerRef}
            onMouseEnter={isDesktop ? openDropdown : undefined}
            onMouseLeave={isDesktop ? scheduleCloseDropdown : undefined}
        >
            {/* Trigger Link */}
            <Link
                to={viewAllPath}
                onClick={closeMenu}
                onFocus={isDesktop ? openDropdown : undefined}
                className={`inline-flex items-center gap-1 h-10 px-2.5 xl:px-3.5 rounded-xl text-xs xl:text-sm font-semibold leading-none whitespace-nowrap select-none transition-colors duration-150 focus:outline-none z-20
                    ${isOpen ? 'text-gray-900 dark:text-gray-100 bg-gray-100/80 dark:bg-gray-800/70 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/70 dark:hover:bg-gray-800/60'}`}
            >
                {label}
                <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}
                />
            </Link>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Mobile Overlay */}
                        {!isSimple && !isDesktop && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/25 z-[9998]"
                                onClick={closeMenu}
                            />
                        )}

                        {/* Menu Panel */}
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                            className={`
                                ${isSimple ? 'absolute left-0 top-full mt-3' : isDesktop ? 'fixed top-[88px] left-1/2 -translate-x-1/2' : 'absolute left-0 top-full mt-3'} 
                                max-h-[calc(100vh-120px)] lg:max-h-[600px] bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-[9999] flex flex-col overflow-hidden backdrop-blur-xl
                                ${isSimple ? 'w-52' : isCategoriesMenu ? 'w-[96vw] lg:w-[92vw] max-w-6xl' : isBrandsMenu ? 'w-[96vw] lg:w-[92vw] max-w-5xl' : 'w-[88vw] md:w-[500px]'}
                            `}
                            onMouseEnter={isDesktop ? openDropdown : undefined}
                            onMouseLeave={isDesktop ? scheduleCloseDropdown : undefined}
                        >
                            {/* Buffer bridge */}
                            <div className="absolute top-[-12px] left-0 w-full h-[12px] -z-10" />

                            {/* Search Bar */}
                            {!isSimple && (
                                <div className="p-3 border-b border-gray-50 dark:border-gray-700 sticky top-0 bg-white/95 dark:bg-gray-900/95 z-10">
                                    <div className="relative">
                                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder={`Find ${label.toLowerCase()}...`}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Scrollable Content */}
                            <div className={`flex-1 overflow-y-auto overscroll-contain custom-scrollbar ${isSimple ? 'p-2' : 'p-3'}`}>
                                {isCategoriesMenu ? (
                                    <CategoriesGrid 
                                        filteredItems={filteredItems} 
                                        activeCategory={activeCategory} 
                                        setActiveCategoryId={setActiveCategoryId} 
                                        closeMenu={closeMenu} 
                                        getEntityId={getEntityId} 
                                    />
                                ) : isBrandsMenu ? (
                                    <BrandsGrid 
                                        filteredItems={filteredItems} 
                                        closeMenu={closeMenu} 
                                        getEntityId={getEntityId} 
                                    />
                                ) : (
                                    <SimpleList 
                                        filteredItems={filteredItems} 
                                        resolveItemPath={resolveItemPath} 
                                        closeMenu={closeMenu} 
                                        isSimple={isSimple} 
                                        hasManyItems={hasManyItems} 
                                    />
                                )}
                            </div>

                            {/* Sticky Footer */}
                            {!isSimple && (
                                <div className="p-3 border-t border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 backdrop-blur-sm">
                                    <Link
                                        to={viewAllPath}
                                        onClick={closeMenu}
                                        className="flex items-center justify-center w-full py-2.5 px-6 bg-gray-900 dark:bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white dark:text-gray-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg"
                                    >
                                        Explore All {label}
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
            `}</style>
        </div>
    );
};

export default DropdownMenu;
