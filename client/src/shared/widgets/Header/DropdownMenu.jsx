import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, SearchIcon } from '../../constants/icons.jsx';

/**
 * @typedef {Object} DropdownItem
 * @property {string|number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} [icon]
 */

/**
 * @typedef {Object} DropdownMenuProps
 * @property {string} label - The text label for the dropdown trigger.
 * @property {DropdownItem[]} items - The list of items to display in the dropdown.
 * @property {string} viewAllPath - The path to navigate to when clicking the "View All" CTA.
 * @property {string} basePath - The base URL path for individual item links.
 * @property {boolean} [isSimple] - If true, displays a simpler, narrower dropdown without search.
 */

/**
 * A scalable, accessible mega-menu dropdown with search filtering and responsive grid layout.
 *
 * @param {DropdownMenuProps} props
 * @returns {JSX.Element}
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

	// Lock body scroll when dropdown is open to prevent scroll bug
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => { document.body.style.overflow = ''; };
	}, [isOpen]);

	const clearCloseTimeout = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
	};

	const openDropdown = () => {
		clearCloseTimeout();
		setIsOpen(true);
	};

	const scheduleCloseDropdown = () => {
		clearCloseTimeout();
		closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 180);
	};

	useEffect(() => {
		return () => clearCloseTimeout();
	}, []);

	const toggleDropdown = () => {
		if (isDesktop) {
			openDropdown();
			return;
		}
		setIsOpen((prev) => !prev);
	};

	// Detect desktop vs mobile
	useEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 1024px)');
		const apply = () => setIsDesktop(mediaQuery.matches);
		apply();
		mediaQuery.addEventListener('change', apply);
		return () => mediaQuery.removeEventListener('change', apply);
	}, []);

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);

	// Accessibility: Close on Escape key and focus trapping
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}

			if (event.key === 'Tab' && isOpen && menuRef.current) {
				const focusableElements = menuRef.current.querySelectorAll(
					'a, button, input, [tabindex]:not([tabindex="-1"])'
				);
				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];

				if (event.shiftKey) {
					if (document.activeElement === firstElement) {
						event.preventDefault();
						lastElement.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						event.preventDefault();
						firstElement.focus();
					}
				}
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
			// Focus search input when opening if not simple
			if (!isSimple) {
				setTimeout(() => searchInputRef.current?.focus(), 100);
			}
		}

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, isSimple]);

	// Filter items based on search query
	const filteredItems = useMemo(() => {
		if (!searchQuery) return items;
		return items.filter((item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [items, searchQuery]);

	useEffect(() => {
		if (!isOpen || !isCategoriesMenu) return;
		const firstId = filteredItems?.[0]?._id || filteredItems?.[0]?.id || null;
		setActiveCategoryId((prev) => prev || firstId);
	}, [filteredItems, isCategoriesMenu, isOpen]);

	// Reset search when closing
	useEffect(() => {
		if (!isOpen) {
			setSearchQuery('');
		}
	}, [isOpen]);

	const hasManyItems = items.length > 8;
	const activeCategory = useMemo(() => {
		if (!isCategoriesMenu) return null;
		return (
			filteredItems.find((item) => (item._id || item.id) === activeCategoryId) ||
			filteredItems[0] ||
			null
		);
	}, [activeCategoryId, filteredItems, isCategoriesMenu]);

	const getEntityId = (item) => item?._id || item?.id || null;

	const resolveItemPath = (item) => {
		if (item.path) return item.path;
		const itemId = getEntityId(item);
		const itemSlug = item.slug || itemId;
		if (!itemSlug) return viewAllPath;
		return `${basePath}/${itemSlug}`;
	};

	const closeMenu = () => setIsOpen(false);

	return (
		<div
			className="relative inline-block"
			ref={containerRef}
			onMouseEnter={isDesktop ? openDropdown : undefined}
			onMouseLeave={isDesktop ? scheduleCloseDropdown : undefined}
		>
			{/* Dropdown Trigger */}
			<button
				onClick={toggleDropdown}
				onFocus={isDesktop ? () => setIsOpen(true) : undefined}
				aria-expanded={isOpen}
				aria-haspopup="true"
				className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none
					${isOpen ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
			>
				{label}
				<ChevronDownIcon
					className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}
				/>
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
					{/* Full-screen overlay to prevent background interaction */}
					{!isSimple && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/25 z-[9998]"
							onClick={closeMenu}
							aria-hidden="true"
						/>
					)}
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className={`${isSimple ? 'absolute left-0 top-full mt-3' : 'fixed top-[80px] left-1/2 -translate-x-1/2 mt-2'} 
							max-h-[calc(100vh-100px)] lg:max-h-[600px] bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-[9999] flex flex-col overflow-hidden backdrop-blur-xl
							${isSimple ? 'w-52' : isCategoriesMenu ? 'w-[96vw] lg:w-[92vw] max-w-6xl' : isBrandsMenu ? 'w-[96vw] lg:w-[92vw] max-w-5xl' : 'w-[88vw] md:w-[460px] lg:w-[540px]'}`}
						ref={menuRef}
						role="menu"
						onMouseEnter={isDesktop ? clearCloseTimeout : undefined}
						onMouseLeave={isDesktop ? scheduleCloseDropdown : undefined}
					>
						{/* Invisible bridge to prevent mouse-leave when moving between trigger and menu */}
						<div className="absolute top-[-12px] left-0 w-full h-[12px] -z-10" />
						{!isSimple && (
							<div className="p-3 border-b border-gray-50 dark:border-gray-700 sticky top-0 bg-white/95 dark:bg-gray-900/95 z-10">
								<div className="relative">
									<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
									<input
										ref={searchInputRef}
										type="text"
										placeholder={`Search ${label.toLowerCase()}...`}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm text-gray-800 dark:text-gray-100
											focus:outline-none focus:ring-2 focus:ring-gray-900/5 dark:focus:ring-white/10 transition-all font-medium placeholder-gray-400 dark:placeholder-gray-500"
									/>
								</div>
							</div>
						)}

						<div className={`flex-1 overflow-y-auto overscroll-contain custom-scrollbar ${isSimple ? 'p-2' : 'p-3'}`}>
								{/* Content Routing based on Menu Type */}
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

						{!isSimple && (
							<div className="p-3 border-t border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 sticky bottom-0 backdrop-blur-sm">
								<Link
									to={viewAllPath}
									onClick={closeMenu}
									className="flex items-center justify-center w-full py-2.5 px-6 bg-gray-900 dark:bg-gray-100 border border-gray-900 dark:border-gray-100
										rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white dark:text-gray-900 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white
										transition-all duration-300 shadow-xl"
								>
									View All {label}
								</Link>
							</div>
						)}
					</motion.div>
					</>
				)}
			</AnimatePresence>

			<style>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: #E5E7EB;
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #D1D5DB;
				}
			`}</style>
		</div>
	);
};

/* --- Sub Components --- */

const EmptyState = () => (
    <div className="py-8 text-center">
        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
            <SearchIcon className="w-4 h-4 text-gray-300 dark:text-gray-500" />
        </div>
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500">No results found</p>
    </div>
);

const CategoriesGrid = ({ filteredItems, activeCategory, setActiveCategoryId, closeMenu, getEntityId }) => {
    if (filteredItems.length === 0) return <EmptyState />;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
            <div className="border border-gray-100 dark:border-gray-700 rounded-2xl p-2 bg-gray-50/60 dark:bg-gray-800/60 max-h-[290px] overflow-y-auto overscroll-contain custom-scrollbar">
                {filteredItems.map((item) => {
                    const itemId = item._id || item.id;
                    const isActive = (activeCategory?._id || activeCategory?.id) === itemId;
                    return (
                        <button
                            key={itemId || item.name}
                            onMouseEnter={() => setActiveCategoryId(itemId)}
                            onFocus={() => setActiveCategoryId(itemId)}
                            onClick={() => setActiveCategoryId(itemId)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                                ? 'bg-white dark:bg-gray-900 text-indigo-600 shadow-sm border border-indigo-100 dark:border-indigo-500/30'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            {item.name}
                        </button>
                    );
                })}
            </div>

            <div className="border border-gray-100 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-900 min-h-[220px] max-h-[290px] overflow-y-auto overscroll-contain custom-scrollbar">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">
                        {activeCategory?.name || 'Category'}
                    </h3>
                    {activeCategory && getEntityId(activeCategory) && (
                        <Link
                            to={`/products?category=${encodeURIComponent(getEntityId(activeCategory))}`}
                            onClick={closeMenu}
                            className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                            View Category
                        </Link>
                    )}
                </div>
                {(activeCategory?.subCategories || []).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1.5">
                        {activeCategory.subCategories.map((sub) => {
                            const categoryId = getEntityId(activeCategory);
                            const subCategoryId = getEntityId(sub);
                            if (!categoryId || !subCategoryId) {
                                return (
                                    <span
                                        key={sub._id || sub.id || sub.name}
                                        className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-[11px] font-semibold text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                    >
                                        {sub.name}
                                    </span>
                                );
                            }
                            return (
                                <Link
                                    key={sub._id || sub.id || sub.name}
                                    to={`/products?category=${encodeURIComponent(categoryId)}&subCategory=${encodeURIComponent(subCategoryId)}`}
                                    onClick={closeMenu}
                                    className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/30 text-[11px] font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all"
                                >
                                    {sub.name}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-semibold py-8 text-center">
                        No subcategories available
                    </div>
                )}
            </div>
        </div>
    );
};

const BrandsGrid = ({ filteredItems, closeMenu, getEntityId }) => {
    if (filteredItems.length === 0) return <EmptyState />;
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredItems.map((brand) => {
                    const brandId = getEntityId(brand);
                    const logo = brand.logo?.secure_url || brand.logo?.url || brand.logo;
                    return (
                        <Link
                            key={brandId || brand.name}
                            to={brandId ? `/brands/${encodeURIComponent(brandId)}` : '/brands/all'}
                            onClick={closeMenu}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/15 transition-all"
                        >
                            {logo ? (
                                <img src={logo} alt={brand.name} className="h-8 w-8 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[9px] font-black text-gray-500 dark:text-gray-300">
                                    {(brand.name || 'BR').slice(0, 2).toUpperCase()}
                                </div>
                            )}
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 line-clamp-1">{brand.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

const SimpleList = ({ filteredItems, resolveItemPath, closeMenu, isSimple, hasManyItems }) => {
    if (filteredItems.length === 0) return <EmptyState />;
    return (
        <div className={`grid gap-2 ${isSimple ? 'grid-cols-1' : hasManyItems ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {filteredItems.map((item) => (
                <Link
                    key={item.id || item._id || item.name}
                    to={resolveItemPath(item)}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-100 ${isSimple ? 'p-2' : 'p-2.5'}`}
                    role="menuitem"
                >
                    {item.icon && (
                        <span className="text-base group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                        </span>
                    )}
                    <div className="flex flex-col">
                        <span className="text-gray-600 group-hover:text-gray-900 font-bold transition-colors text-xs">
                            {item.name}
                        </span>
                        {!isSimple && item.description && (
                            <span className="text-[10px] text-gray-400 font-medium line-clamp-1 group-hover:text-gray-500 transition-colors">
                                {item.description}
                            </span>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default DropdownMenu;
