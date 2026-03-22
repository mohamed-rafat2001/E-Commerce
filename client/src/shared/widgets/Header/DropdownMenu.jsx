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
 */

/**
 * A scalable, accessible dropdown menu with search filtering and responsive grid layout.
 *
 * @param {DropdownMenuProps} props
 * @returns {JSX.Element}
 */
const DropdownMenu = ({ label, items, viewAllPath, basePath }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const containerRef = useRef(null);
	const searchInputRef = useRef(null);
	const menuRef = useRef(null);

	// Toggle dropdown
	const toggleDropdown = () => setIsOpen((prev) => !prev);

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
			// Focus search input when opening
			setTimeout(() => searchInputRef.current?.focus(), 100);
		}

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen]);

	// Filter items based on search query
	const filteredItems = useMemo(() => {
		if (!searchQuery) return items;
		return items.filter((item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [items, searchQuery]);

	// Reset search when closing
	useEffect(() => {
		if (!isOpen) {
			setSearchQuery('');
		}
	}, [isOpen]);

	return (
		<div className="relative inline-block" ref={containerRef}>
			{/* Dropdown Trigger */}
			<button
				onClick={toggleDropdown}
				aria-expanded={isOpen}
				aria-haspopup="true"
				className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none
					${isOpen ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
			>
				{label}
				<ChevronDownIcon
					className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}
				/>
			</button>

			{/* Dropdown Content */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className="absolute left-0 mt-2 w-[90vw] md:w-[600px] lg:w-[800px] max-h-[500px]
							bg-white rounded-xl shadow-lg border border-gray-100 z-50 flex flex-col overflow-hidden"
						ref={menuRef}
						role="menu"
					>
						{/* Search Input */}
						<div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
							<div className="relative">
								<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									ref={searchInputRef}
									type="text"
									placeholder={`Search ${label.toLowerCase()}...`}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm
										focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								/>
							</div>
						</div>

						{/* Items Grid */}
						<div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
							{filteredItems.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
									{filteredItems.map((item) => (
										<Link
											key={item.id}
											to={`${basePath}/${item.slug}`}
											onClick={() => setIsOpen(false)}
											className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50
												transition-colors duration-150 group"
											role="menuitem"
										>
											{item.icon && (
												<span className="text-lg group-hover:scale-110 transition-transform">
													{item.icon}
												</span>
											)}
											<span className="text-sm text-gray-700 group-hover:text-blue-600 font-medium">
												{item.name}
											</span>
										</Link>
									))}
								</div>
							) : (
								<div className="py-8 text-center">
									<p className="text-sm text-gray-500">No {label.toLowerCase()} found matching "{searchQuery}"</p>
								</div>
							)}
						</div>

						{/* Sticky Footer CTA */}
						<div className="p-4 border-t border-gray-100 bg-gray-50 sticky bottom-0">
							<Link
								to={viewAllPath}
								onClick={() => setIsOpen(false)}
								className="flex items-center justify-center w-full py-2.5 px-4 bg-white border border-gray-200
									rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 hover:border-blue-600
									transition-all duration-200 shadow-sm"
							>
								View All {label}
							</Link>
						</div>
					</motion.div>
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

export default DropdownMenu;
