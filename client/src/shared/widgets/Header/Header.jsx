import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useCurrentUser from '../../../features/user/hooks/useCurrentUser.js';
import useLogout from '../../../features/auth/hooks/useLogout.jsx';
import { Avatar, Modal, Button } from '../../ui/index.js';
import useWishlist from '../../../features/wishList/hooks/useWishlist.js';
import useCart from '../../../features/cart/hooks/useCart.js';
import NavLinks from './NavLinks.jsx';
import useCategories from '../../../features/home/hooks/useCategories.js';
import useBrands from '../../../features/home/hooks/useBrands.js';
import {
	StoreIcon,
	HeartIcon,
	DashboardIcon,
	LogoutIcon,
	SettingsIcon
} from '../../constants/icons.jsx';
import CartDrawer from '../../components/CartDrawer.jsx';
import WishlistDrawer from '../../components/WishlistDrawer.jsx';

const Header = ({ isPanel = false }) => {
	const { userRole, user, isAuthenticated } = useCurrentUser();
	const { logout } = useLogout();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isWishlistOpen, setIsWishlistOpen] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

	const dropdownRef = useRef(null);
	const cartRef = useRef(null);
	const wishlistRef = useRef(null);

	const { categories } = useCategories();
	const { originalBrands: brands } = useBrands();

	const { cartItemCount } = useCart();
	const cartCount = cartItemCount;

	const { wishlist } = useWishlist();
	const wishlistItems = wishlist?.items || [];
	const wishlistCount = wishlistItems.length;

	const fullName = user?.userId
		? `${user.userId.firstName} ${user.userId.lastName}`
		: user?.firstName
			? `${user.firstName} ${user.lastName}`
			: 'Guest';

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}

			// Don't close logic if click originates inside the drawer
			const isInsideCartDrawer = document.getElementById('cart-drawer')?.contains(event.target);
			if (cartRef.current && !cartRef.current.contains(event.target) && !isInsideCartDrawer) {
				setIsCartOpen(false);
			}

			const isInsideWishlistDrawer = document.getElementById('wishlist-drawer')?.contains(event.target);
			if (wishlistRef.current && !wishlistRef.current.contains(event.target) && !isInsideWishlistDrawer) {
				setIsWishlistOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = () => {
		logout();
		setIsDropdownOpen(false);
	};

	useEffect(() => {
		const isAnyDrawerOpen = isCartOpen || isWishlistOpen;
		if (!isAnyDrawerOpen) {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
			return;
		}

		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		document.body.style.overflow = 'hidden';
		if (scrollbarWidth > 0) {
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		}

		return () => {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		};
	}, [isCartOpen, isWishlistOpen]);

	return (
		<motion.header
			className={`sticky top-0 z-40 w-full ${isPanel ? 'bg-transparent' : ''}`}
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ type: 'spring', stiffness: 260, damping: 20 }}
		>
			{/* Glassmorphism header */}
			<div className={`${isPanel ? 'bg-white/40' : 'bg-white/80'} backdrop-blur-xl border-b border-gray-100/50 shadow-sm`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-20">
						{/* Logo & Brand */}
						{isPanel ? (
							<div /> // Spacer for justify-between in panel view
						) : (
							<div className="flex items-center gap-8">
								<Link to="/" className="flex items-center gap-2 group">
									<span className="text-2xl font-black text-gray-900 font-display tracking-tighter">
										CuratorMarket
									</span>
								</Link>

								{/* Desktop Navigation Links */}
								<div className="hidden lg:block">
									<NavLinks categories={categories} brands={brands} />
								</div>
							</div>
						)}

						{/* Right hand Side: Search + Icons */}
						<div className="flex items-center gap-6">
							{/* Search Bar - hidden on mobile */}
							{!isPanel && (
								<div className="hidden xl:flex w-full min-w-[300px]">
									<div className="relative w-full">
										<input
											type="text"
											placeholder="Search curated findings..."
											className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border-0 rounded-2xl
												text-sm text-gray-700 placeholder:text-gray-400
												focus:ring-2 focus:ring-gray-900/5 focus:bg-white
												transition-all duration-300 outline-none font-medium"
										/>
										<svg
											className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
									</div>
								</div>
							)}

							{(userRole === 'Customer' || !isAuthenticated) && (
								<div className="flex items-center gap-2">
									{/* Wishlist */}
									<div className="relative" ref={wishlistRef}>
										<motion.button
											onClick={() => {
												setIsWishlistOpen(!isWishlistOpen);
												setIsCartOpen(false);
											}}
											className="relative p-2.5 text-gray-700 bg-white border border-gray-100 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<HeartIcon className="w-5 h-5" />
											{wishlistCount > 0 && (
												<span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center">
													{wishlistCount}
												</span>
											)}
										</motion.button>
									</div>

									{/* Cart */}
									<div className="relative" ref={cartRef}>
										<motion.button
											onClick={() => {
												setIsCartOpen(!isCartOpen);
												setIsWishlistOpen(false);
											}}
											className="relative p-2.5 text-gray-700 bg-white border border-gray-100 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<StoreIcon className="w-5 h-5" />
											{cartCount > 0 && (
												<span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center">
													{cartCount}
												</span>
											)}
										</motion.button>
									</div>
								</div>
							)}

							{isAuthenticated ? (
								<div className="relative" ref={dropdownRef}>
									<button
										onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
									>
										<Avatar
											src={user?.userId?.profileImg?.secure_url || user?.profileImg?.secure_url}
											name={fullName}
											size="md"
										/>
									</button>
									<AnimatePresence>
										{isDropdownOpen && (
											<motion.div
												initial={{ opacity: 0, y: 10, scale: 0.95 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												exit={{ opacity: 0, y: 10, scale: 0.95 }}
												className="absolute right-0 mt-2 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden font-sans"
											>
												<div className="px-6 py-4 border-b border-gray-50 mb-2">
													<p className="text-sm font-black text-gray-900 truncate">{fullName}</p>
													<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{userRole}</p>
												</div>

												<Link to={`/${userRole?.toLowerCase()}/dashboard`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-4 px-6 py-3.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
													<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
														<DashboardIcon className="w-4 h-4" />
													</div>
													<span className="font-bold">Dashboard</span>
												</Link>
												<Link to={`/${userRole?.toLowerCase()}/settings`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-4 px-6 py-3.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
													<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
														<SettingsIcon className="w-4 h-4" />
													</div>
													<span className="font-bold">Settings</span>
												</Link>

												<div className="px-3 mt-2">
													<button
														onClick={() => {
															setIsLogoutModalOpen(true);
															setIsDropdownOpen(false);
														}}
														className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm text-red-500 hover:bg-red-50 transition-colors"
													>
														<LogoutIcon className="w-4 h-4" />
														<span className="font-black uppercase tracking-widest text-[10px]">Logout Account</span>
													</button>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							) : (
								<div className="flex items-center gap-3 font-sans">
									<Link to="/login">
										<Button variant="ghost" size="sm" className="rounded-full px-6 font-bold text-gray-700 hover:text-gray-900 border border-gray-100">
											Login
										</Button>
									</Link>
									<Link to="/register">
										<Button variant="primary" size="sm" className="rounded-full px-6 shadow-xl hover:bg-black hover:text-white transition-all active:scale-95">
											Get Started
										</Button>
									</Link>
								</div>
							)}

							{/* Mobile Menu Toggle - Only visible on small screens */}
							<div className="lg:hidden pl-2 border-l border-gray-100">
								<NavLinks categories={categories} brands={brands} />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Logout Confirmation Modal */}
			<Modal
				isOpen={isLogoutModalOpen}
				onClose={() => setIsLogoutModalOpen(false)}
				title="Confirm Logout"
			>
				<div className="p-8 text-center font-sans">
					<div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
						<LogoutIcon className="w-10 h-10 text-red-500" />
					</div>
					<h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter">Parting ways?</h3>
					<p className="text-gray-500 mb-10 font-medium">We hope you'll be back soon to discover more curated finds.</p>
					<div className="flex flex-col gap-3">
						<Button
							fullWidth
							variant="danger"
							className="rounded-full py-5 uppercase font-black tracking-widest text-xs shadow-2xl shadow-red-100"
							onClick={handleLogout}
						>
							Confirm Logout
						</Button>
						<Button
							fullWidth
							variant="outline"
							onClick={() => setIsLogoutModalOpen(false)}
							className="rounded-full py-5 uppercase font-black tracking-widest text-xs border-gray-100 hover:bg-gray-50"
						>
							Cancel
						</Button>
					</div>
				</div>
			</Modal>

			<CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
			<WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
		</motion.header>
	);
};

export default Header;
