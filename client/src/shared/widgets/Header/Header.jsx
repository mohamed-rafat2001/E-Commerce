import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useCurrentUser from '../../../features/user/hooks/useCurrentUser.js';
import useLogout from '../../../features/auth/hooks/useLogout.jsx';
import { roleThemes } from "../../constants/theme.js";
import { Avatar, Badge, Modal, Button } from '../../ui/index.js';
import useWishlist from '../../../features/wishList/hooks/useWishlist.js';
import useCart from '../../../features/cart/hooks/useCart.js';
import CartDropdown from './CartDropdown.jsx';
import WishlistDropdown from './WishlistDropdown.jsx';
import useDeleteFromCart from '../../../features/cart/hooks/useDeleteFromCart.js';
import useDeleteFromWishlist from '../../../features/wishList/hooks/useDeleteFromWishlist.js';
import useAddToCart from '../../../features/cart/hooks/useAddToCart.js';
import toast from 'react-hot-toast';
import {
	NotificationIcon,
	StoreIcon,
	HeartIcon,
	DashboardIcon,
	LogoutIcon,
	ChevronRightIcon,
	SettingsIcon,
	UserIcon
} from '../../constants/icons.jsx';
import CartDrawer from '../../components/CartDrawer.jsx';
import WishlistDrawer from '../../components/WishlistDrawer.jsx';

const Header = ({ isPanel = false }) => {
	const { userRole, user, isAuthenticated, isLoading } = useCurrentUser();
	const { logout } = useLogout();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isWishlistOpen, setIsWishlistOpen] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

	const dropdownRef = useRef(null);
	const cartRef = useRef(null);
	const wishlistRef = useRef(null);

	const { deleteFromCart } = useDeleteFromCart();
	const { deleteFromWishlist } = useDeleteFromWishlist();
	const { addToCart } = useAddToCart();

	const { cart, cartItemCount, cartTotal } = useCart();
	const cartItems = cart?.items || [];
	const cartCount = cartItemCount;

	const { wishlist } = useWishlist();
	const wishlistItems = wishlist?.items || [];
	const wishlistCount = wishlistItems.length;

	const handleMoveToCart = async (product) => {
		try {
			await addToCart(product, 1);
			await deleteFromWishlist(product._id || product.id);
			toast.success(`${product.name} moved to cart!`);
		} catch {
			toast.error("Failed to move item to cart");
		}
	};

	const roleTheme = roleThemes[userRole] || roleThemes.Customer;

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

	const cartViewAllPath = isAuthenticated ? "/customer/cart" : "/cart";
	const wishlistViewAllPath = isAuthenticated ? "/customer/wishlist" : "/public-wishlist";

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
						{!isPanel && (
							<div className="flex items-center gap-10">
								<Link to="/" className="flex items-center gap-2 group">
									<span className="text-2xl font-bold text-gray-900 font-display tracking-tight">
										CuratorMarket
									</span>
								</Link>

								<nav className="hidden lg:flex items-center gap-8">
									<Link to="/products" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">Explore</Link>
									<Link to="/designers" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">Designers</Link>
									<Link to="/trending" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">Trending</Link>
								</nav>
							</div>
						)}

						{/* Right hand Side: Search + Icons */}
						<div className="flex items-center gap-6">
							{/* Search Bar */}
							{!isPanel && (
								<div className="hidden md:flex w-full max-w-[240px]">
									<div className="relative w-full">
										<input
											type="text"
											placeholder="Search curated goods..."
											className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full
												text-sm text-gray-700 placeholder:text-gray-400
												focus:ring-2 focus:ring-primary/10 focus:bg-white
												transition-all duration-300"
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

							<div className="flex items-center gap-2">
								{/* Wishlist */}
								<div className="relative" ref={wishlistRef}>
									<motion.button
										onClick={() => setIsWishlistOpen(!isWishlistOpen)}
										className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<HeartIcon className="w-5 h-5" />
										{wishlistCount > 0 && (
											<span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
												{wishlistCount}
											</span>
										)}
									</motion.button>
									<AnimatePresence>
										{isWishlistOpen && (
											<WishlistDropdown
												items={wishlistItems}
												isLoading={isLoading}
												viewAllPath={wishlistViewAllPath}
												onRemove={deleteFromWishlist}
												onMoveToCart={handleMoveToCart}
											/>
										)}
									</AnimatePresence>
								</div>

								{/* Cart */}
								<div className="relative" ref={cartRef}>
									<motion.button
										onClick={() => setIsCartOpen(!isCartOpen)}
										className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<StoreIcon className="w-5 h-5" />
										{cartCount > 0 && (
											<span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
												{cartCount}
											</span>
										)}
									</motion.button>
									<AnimatePresence>
										{isCartOpen && (
											<CartDropdown
												items={cartItems}
												total={cartTotal}
												isLoading={isLoading}
												viewAllPath={cartViewAllPath}
												onRemove={deleteFromCart}
											/>
										)}
									</AnimatePresence>
								</div>

								{/* Notification */}
								<motion.button
									className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<NotificationIcon className="w-5 h-5" />
								</motion.button>
							</div>

							{isAuthenticated ? (
								<div className="relative pl-2 border-l border-gray-100" ref={dropdownRef}>
									<button
										onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
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
												className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden font-sans"
											>
												<Link to={`/${userRole?.toLowerCase()}/dashboard`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
													<DashboardIcon className="w-4 h-4 text-gray-400" />
													<span className="font-medium">Dashboard</span>
												</Link>
												<Link to={`/${userRole?.toLowerCase()}/settings`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
													<SettingsIcon className="w-4 h-4 text-gray-400" />
													<span className="font-medium">Settings</span>
												</Link>
												<div className="h-px bg-gray-50 my-1"></div>
												<button
													onClick={() => {
														setIsLogoutModalOpen(true);
														setIsDropdownOpen(false);
													}}
													className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
												>
													<LogoutIcon className="w-4 h-4" />
													<span className="font-medium">Logout</span>
												</button>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							) : (
								<div className="flex items-center gap-3 pl-2 border-l border-gray-100 font-sans">
									<Link to="/login">
										<Button variant="ghost" size="sm" className="rounded-full px-6 font-bold text-gray-700 hover:bg-gray-100">
											Login
										</Button>
									</Link>
									<Link to="/register">
										<Button variant="primary" size="sm" className="rounded-full px-6 !bg-gray-900 !text-white !border-gray-900 shadow-lg hover:bg-black transition-all active:scale-95">
											Get Started
										</Button>
									</Link>
								</div>
							)}
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
				<div className="p-6 text-center font-sans">
					<div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
						<LogoutIcon className="w-10 h-10 text-red-500" />
					</div>
					<h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Trying to leave?</h3>
					<p className="text-gray-500 mb-8 font-medium">We'll miss you. Are you sure you want to logout from your account?</p>
					<div className="flex flex-col sm:flex-row gap-3">
						<Button
							fullWidth
							variant="outline"
							onClick={() => setIsLogoutModalOpen(false)}
							className="rounded-full py-4 uppercase font-black tracking-widest text-xs"
						>
							Stay logged in
						</Button>
						<Button
							fullWidth
							variant="primary"
							className="!bg-red-500 !text-white !border-red-500 rounded-full py-4 uppercase font-black tracking-widest text-xs shadow-xl shadow-red-100"
							onClick={handleLogout}
						>
							Yes, Logout
						</Button>
					</div>
				</div>
			</Modal>
		</motion.header>
	);
};

export default Header;
