import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, CloseIcon, HeartIcon, StoreIcon, HomeIcon } from '../../constants/icons.jsx';
import DropdownMenu from './DropdownMenu.jsx';
import useCurrentUser from '../../../features/user/hooks/useCurrentUser.js';
import useWishlist from '../../../features/wishList/hooks/useWishlist.js';
import useCart from '../../../features/cart/hooks/useCart.js';

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

	// User, wishlist, cart data for mobile drawer
	const { isAuthenticated, userRole } = useCurrentUser();
	const { cartItemCount } = useCart();
	const { wishlist } = useWishlist();
	const wishlistCount = wishlist?.items?.length || 0;

	// Close mobile menu on route change
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
			document.documentElement.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
			document.documentElement.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
			document.documentElement.style.overflow = '';
		};
	}, [isMobileMenuOpen]);

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
								${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'}
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
					className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none
						min-h-[44px] min-w-[44px] flex items-center justify-center"
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
							className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] lg:hidden"
						/>

						{/* Drawer Content */}
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 25, stiffness: 200 }}
							className="fixed right-0 top-0 h-full w-[300px] bg-white dark:bg-gray-900 z-[130] shadow-2xl lg:hidden flex flex-col border-l border-gray-100 dark:border-gray-700"
						>
							{/* Drawer Header */}
							<div className="shrink-0 flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
								<div className="flex items-center gap-2">
									<img src="/logo.png" alt="ShopyNow Logo" className="h-6 w-auto mix-blend-multiply dark:mix-blend-normal object-contain" />
									<span className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tighter">ShopyNow</span>
								</div>
								<button
									onClick={() => setIsMobileMenuOpen(false)}
									className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors
										min-h-[44px] min-w-[44px] flex items-center justify-center"
									aria-label="Close navigation"
								>
									<CloseIcon className="w-5 h-5" />
								</button>
							</div>

							{/* Quick Access: Wishlist & Cart with badges */}
							<div className="shrink-0 flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
								<NavLink
									to="/public-wishlist"
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 font-semibold min-h-[44px]"
								>
									<div className="relative">
										<HeartIcon className="w-5 h-5" />
										{wishlistCount > 0 && (
											<span className="absolute -top-1 -right-1.5 bg-gray-900 text-white text-[10px]
												w-4 h-4 rounded-full flex items-center justify-center font-bold">
												{wishlistCount}
											</span>
										)}
									</div>
									Wishlist
								</NavLink>
								<NavLink
									to="/cart"
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 font-semibold min-h-[44px]"
								>
									<div className="relative">
										<StoreIcon className="w-5 h-5" />
										{cartItemCount > 0 && (
											<span className="absolute -top-1 -right-1.5 bg-gray-900 text-white text-[10px]
												w-4 h-4 rounded-full flex items-center justify-center font-bold">
												{cartItemCount}
											</span>
										)}
									</div>
									Cart
								</NavLink>
							</div>

							{/* Drawer Links */}
							<div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
								{[
									{ name: 'Brands', path: '/brands/all' },
									{ name: 'Categories', path: '/categories/all' },
									{ name: 'Products', path: '/products' },
									{ name: 'Help', path: '/help' },
								].map((link) => (
									<NavLink
										key={link.name}
										to={link.path}
										onClick={() => setIsMobileMenuOpen(false)}
										className={({ isActive }) =>
											"flex items-center px-4 py-3 rounded-xl font-bold transition-all " +
											(isActive
												? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
												: "text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700")
										}
									>
										{link.name}
									</NavLink>
								))}
							</div>

							{/* Drawer Footer — Auth + Copyright */}
							<div className="shrink-0 p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-2 bg-white dark:bg-gray-900">
								{isAuthenticated ? (
									<Link
										to={`/${userRole?.toLowerCase()}/dashboard`}
										onClick={() => setIsMobileMenuOpen(false)}
										className="w-full text-center py-3 px-4 rounded-xl bg-gray-900 dark:bg-gray-100
											text-white dark:text-gray-900 font-semibold text-sm hover:bg-gray-700 dark:hover:bg-white transition-colors min-h-[44px]
											flex items-center justify-center"
									>
										My Dashboard
									</Link>
								) : (
									<>
										<Link
											to="/login"
											onClick={() => setIsMobileMenuOpen(false)}
											className="w-full text-center py-3 px-4 rounded-xl border-2
												border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 font-semibold text-sm
												hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-colors min-h-[44px]
												flex items-center justify-center"
										>
											Login
										</Link>
										<Link
											to="/register"
											onClick={() => setIsMobileMenuOpen(false)}
											className="w-full text-center py-3 px-4 rounded-xl bg-gray-900 dark:bg-gray-100
												text-white dark:text-gray-900 font-semibold text-sm hover:bg-gray-700 dark:hover:bg-white transition-colors min-h-[44px]
												flex items-center justify-center"
										>
											Get Started
										</Link>
									</>
								)}
								<p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
									© {new Date().getFullYear()} ShopyNow
								</p>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default NavLinks;
