import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, SearchIcon } from '../../constants/icons.jsx';

// Refactored Sub-components
import BrandsGrid from './Dropdown/BrandsGrid.jsx';
import CategoriesGrid from './Dropdown/CategoriesGrid.jsx';
import SimpleList from './Dropdown/SimpleList.jsx';

/**
 * DropdownMenu - Refactored Mega-menu orchestrator
 */
const DropdownMenu = ({ label, items, viewAllPath, basePath, isSimple = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    const isCategoriesMenu = label.toLowerCase() === 'categories';
    const isBrandsMenu = label.toLowerCase() === 'brands';

    // --- Hooks & Effects ---

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        setIsDesktop(mediaQuery.matches);
        const handler = (e) => setIsDesktop(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && !isSimple) {
            if (!isDesktop) document.body.style.overflow = 'hidden';
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen, isDesktop, isSimple]);

    // --- Handlers ---

    const openDropdown = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsOpen(true);
    };

    const scheduleCloseDropdown = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 180);
    };

    const filteredItems = useMemo(() => {
        if (!searchQuery) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(i => i.name.toLowerCase().includes(q));
    }, [items, searchQuery]);

    const activeCategory = useMemo(() => {
        if (!isCategoriesMenu) return null;
        const targetId = activeCategoryId || filteredItems?.[0]?._id || filteredItems?.[0]?.id;
        return filteredItems.find(i => (i._id || i.id) === targetId) || filteredItems[0] || null;
    }, [activeCategoryId, filteredItems, isCategoriesMenu]);

    const resolveItemPath = (item) => {
        if (item.path) return item.path;
        const id = item._id || item.id;
        const slug = item.slug || id;
        return slug ? `${basePath}/${slug}` : viewAllPath;
    };

    return (
        <div
            className="relative inline-block"
            ref={containerRef}
            onMouseEnter={isDesktop ? openDropdown : undefined}
            onMouseLeave={isDesktop ? scheduleCloseDropdown : undefined}
        >
            <Link
                to={viewAllPath}
                onClick={() => setIsOpen(false)}
                className={`inline-flex items-center gap-1 h-10 px-3 xl:px-4 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200
                    ${isOpen ? 'text-gray-900 dark:text-gray-100 bg-gray-100/80 dark:bg-gray-800/70' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'}`}
            >
                {label}
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-gray-900 dark:text-gray-100' : 'text-gray-400'}`} />
            </Link>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`
                            ${isSimple ? 'absolute left-0 top-full mt-3' : isDesktop ? 'fixed top-[88px] left-1/2 -translate-x-1/2' : 'absolute left-0 top-full mt-3'} 
                            max-h-[min(600px,calc(100vh-120px))] bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-[9999] flex flex-col overflow-hidden backdrop-blur-xl
                            ${isSimple ? 'w-52' : isCategoriesMenu ? 'w-[96vw] lg:w-[92vw] max-w-6xl' : isBrandsMenu ? 'w-[96vw] lg:w-[92vw] max-w-5xl' : 'w-[88vw] md:w-[500px]'}
                        `}
                    >
                        {!isSimple && (
                            <div className="p-3 border-b border-gray-50 dark:border-gray-700">
                                <div className="relative">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={`Search ${label.toLowerCase()}...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 placeholder-gray-400 border-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div className={`flex-1 overflow-y-auto custom-scrollbar ${isSimple ? 'p-2' : 'p-3'}`}>
                            {isCategoriesMenu ? (
                                <CategoriesGrid 
                                    filteredItems={filteredItems} 
                                    activeCategory={activeCategory} 
                                    setActiveCategoryId={setActiveCategoryId} 
                                    closeMenu={() => setIsOpen(false)} 
                                    getEntityId={(i) => i?._id || i?.id} 
                                />
                            ) : isBrandsMenu ? (
                                <BrandsGrid 
                                    filteredItems={filteredItems} 
                                    closeMenu={() => setIsOpen(false)} 
                                    getEntityId={(i) => i?._id || i?.id} 
                                />
                            ) : (
                                <SimpleList 
                                    filteredItems={filteredItems} 
                                    resolveItemPath={resolveItemPath} 
                                    closeMenu={() => setIsOpen(false)} 
                                    isSimple={isSimple} 
                                    hasManyItems={items.length > 8} 
                                />
                            )}
                        </div>

                        {!isSimple && (
                            <div className="p-3 border-t border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40">
                                <Link
                                    to={viewAllPath}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center w-full py-2.5 bg-gray-900 dark:bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-white dark:text-gray-900 hover:bg-indigo-600 transition-all shadow-lg"
                                >
                                    View All {label}
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ddd; }
            `}</style>
        </div>
    );
};

export default DropdownMenu;
