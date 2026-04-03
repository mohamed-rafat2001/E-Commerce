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
		{ name: 'All Products', path: '/products' },
		{ name: 'Help', path: '/help', isHelp: true },
	];

	const helpLinks = [
		{ name: 'Cart', path: '/cart' },
		{ name: 'Wishlist', path: '/public-wishlist' },
		{ name: 'Checkout', path: '/checkout' },
		{ name: 'Orders', path: '/orders' },
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
					link.isHelp ? (
						<DropdownMenu
							key={link.name}
							label={link.name}
							items={helpLinks}
							basePath=""
							viewAllPath="/help"
							isSimple={true}
						/>
					) : (
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
					)
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
								<div className="pb-4 border-b border-gray-100 mb-4 space-y-3">
									<div className="space-y-1">
										<NavLink
											to="/brands/all"
											onClick={() => setIsMobileMenuOpen(false)}
											className={({ isActive }) => "flex items-center px-4 py-3 rounded-xl font-bold transition-all " + (isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-900 bg-gray-50 hover:bg-gray-100")}
										>
											All Brands
										</NavLink>
										<div className="grid grid-cols-2 gap-1 px-2 pt-2">
											{brands?.slice(0, 4)?.map(brand => (
												<NavLink
													key={brand.id || brand.name}
													to={`/brands/${brand.id || brand._id || brand.slug}`}
													onClick={() => setIsMobileMenuOpen(false)}
													className="text-xs font-semibold text-gray-500 py-1.5 px-3 rounded-lg hover:text-indigo-600 hover:bg-indigo-50/50 line-clamp-1"
												>
													{brand.name}
												</NavLink>
											))}
										</div>
									</div>

									<div className="space-y-1 pt-2 border-t border-gray-50">
										<NavLink
											to="/categories/all"
											onClick={() => setIsMobileMenuOpen(false)}
											className={({ isActive }) => "flex items-center px-4 py-3 rounded-xl font-bold transition-all mt-1 " + (isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-900 bg-gray-50 hover:bg-gray-100")}
										>
											All Categories
										</NavLink>
										<div className="grid grid-cols-1 gap-1 px-2 pt-2">
											{categories?.slice(0, 3)?.map(category => (
												<NavLink
													key={category.id || category.name}
													to={`/products?category=${category.id || category._id}`}
													onClick={() => setIsMobileMenuOpen(false)}
													className="text-xs font-semibold text-gray-500 py-1.5 px-3 rounded-lg hover:text-indigo-600 hover:bg-indigo-50/50"
												>
													{category.name}
												</NavLink>
											))}
										</div>
									</div>
								</div>

								{staticLinks.filter(link => !link.isHelp).map((link) => (
									<NavLink
										key={link.name}
										to={link.path}
										className={({ isActive }) => "flex items-center px-4 py-3 rounded-xl font-bold transition-all " + (isActive ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50")}
									>
										{link.name}
									</NavLink>
								))}

								{/* Help Links on Mobile (as separate items for better accessibility) */}
								<div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
									<NavLink
										to="/help"
										className={({ isActive }) => "flex items-center px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest " + (isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-900")}
									>
										Help Center
									</NavLink>
									{helpLinks.map((link) => (
										<NavLink
											key={link.name}
											to={link.path}
											className={({ isActive }) => "flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all " + (isActive ? "text-gray-900" : "text-gray-500 hover:bg-gray-50")}
										>
											{link.name}
										</NavLink>
									))}
								</div>
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
