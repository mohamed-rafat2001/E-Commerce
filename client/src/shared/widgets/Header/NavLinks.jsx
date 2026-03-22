import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, CloseIcon } from '../../constants/icons.jsx';
import DropdownMenu from './DropdownMenu.jsx';

/**
 * @typedef {Object} NavLinkItem
 * @property {string|number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} [icon]
 */

/**
 * @typedef {Object} NavLinksProps
 * @property {NavLinkItem[]} brands - The list of brands to display in the Brands dropdown.
 * @property {NavLinkItem[]} categories - The list of categories to display in the Categories dropdown.
 */

/**
 * Main navigation links component for the application header.
 * Handles static links, dropdowns, and responsive mobile view.
 *
 * @param {NavLinksProps} props
 * @returns {JSX.Element}
 */
const NavLinks = ({ brands = [], categories = [] }) => {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Close mobile menu on route change
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	// Close mobile menu on Escape key
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') setIsMobileMenuOpen(false);
		};
		if (isMobileMenuOpen) {
			document.addEventListener('keydown', handleKeyDown);
		}
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isMobileMenuOpen]);

	const staticLinks = [
		{ name: 'New Arrivals', path: '/new-arrivals' },
	];

	return (
		<nav className="flex items-center" aria-label="Main Navigation">
			{/* Desktop Navigation */}
			<div className="hidden lg:flex items-center gap-1 xl:gap-4">
				{/* Dropdowns */}
				<DropdownMenu
					label="Brands"
					items={brands}
					basePath="/brands"
					viewAllPath="/brands/all"
				/>
				<DropdownMenu
					label="Categories"
					items={categories}
					basePath="/categories"
					viewAllPath="/categories/all"
				/>

				{/* Static Links */}
				{staticLinks.map((link) => (
					<NavLink
						key={link.name}
						to={link.path}
						className={({ isActive }) => `
							px-3 py-2 text-sm font-medium transition-all duration-200 relative
							${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}
						`}
					>
						{({ isActive }) => (
							<>
								{link.name}
								{isActive && (
									<motion.div
										layoutId="nav-active-indicator"
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
										initial={false}
										transition={{ type: 'spring', stiffness: 380, damping: 30 }}
									/>
								)}
							</>
						)}
					</NavLink>
				))}
			</div>

			{/* Mobile Navigation Trigger */}
			<div className="lg:hidden">
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
					aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
					aria-expanded={isMobileMenuOpen}
				>
					{isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
				</button>
			</div>

			{/* Mobile Navigation Drawer */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						{/* Overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
						/>

						{/* Drawer Content */}
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 25, stiffness: 200 }}
							className="fixed right-0 top-0 h-full w-[280px] bg-white z-50 shadow-2xl lg:hidden flex flex-col"
						>
							{/* Drawer Header */}
							<div className="flex items-center justify-between p-4 border-b border-gray-100">
								<span className="text-lg font-bold text-gray-800">Navigation</span>
								<button
									onClick={() => setIsMobileMenuOpen(false)}
									className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<CloseIcon className="w-6 h-6" />
								</button>
							</div>

							{/* Drawer Links */}
							<div className="flex-1 overflow-y-auto p-4 space-y-2">
								{/* Direct Access to Main Lists on Mobile */}
								<div className="pb-4 border-b border-gray-100 mb-4">
									<NavLink
										to="/brands/all"
										className={({ isActive }) => `
											flex items-center px-4 py-3 rounded-xl font-semibold transition-all
											${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}
										`}
									>
										Brands
									</NavLink>
									<NavLink
										to="/categories/all"
										className={({ isActive }) => `
											flex items-center px-4 py-3 rounded-xl font-semibold transition-all mt-1
											${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}
										`}
									>
										Categories
									</NavLink>
								</div>

								{staticLinks.map((link) => (
									<NavLink
										key={link.name}
										to={link.path}
										className={({ isActive }) => `
											flex items-center px-4 py-3 rounded-xl font-semibold transition-all
											${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}
										`}
									>
										{link.name}
									</NavLink>
								))}
							</div>

							{/* Drawer Footer */}
							<div className="p-4 bg-gray-50 text-center">
								<p className="text-xs text-gray-400">© 2024 E-Commerce Store</p>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default NavLinks;
