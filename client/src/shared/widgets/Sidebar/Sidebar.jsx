import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useCurrentUser from '../../../features/user/hooks/useCurrentUser.js';
import { roleThemes } from '../../constants/theme.js';
import {
	UserIcon,
	ShippingIcon,
	PaymentIcon,
	OrderIcon,
	DashboardIcon,
	ProductIcon,
	UsersIcon,
	AnalyticsIcon,
	InventoryIcon,
	ChevronRightIcon,
	MenuIcon,
	CloseIcon,
	StoreIcon,
	HeartIcon,
	CategoryIcon,
	SettingsIcon,
	TagIcon
} from '../../constants/icons.jsx';

// Navigation link configurations for each role
const roleNavigationConfig = {
	Admin: [
		{
			label: 'Dashboard',
			path: 'dashboard',
			icon: DashboardIcon,
			description: 'Overview & analytics',
		},
		{
			label: 'Personal Details',
			path: 'personalDetails',
			icon: UserIcon,
			description: 'Manage your profile',
		},
		{
			label: 'User Management',
			path: 'users',
			icon: UsersIcon,
			description: 'Manage all users',
		},
		{
			label: 'Products',
			path: 'products',
			icon: ProductIcon,
			description: 'Product management',
		},
		{
			label: 'Categories',
			path: 'categories',
			icon: CategoryIcon,
			description: 'Manage product categories',
		},
		{
			label: 'Brands',
			path: 'brands',
			icon: TagIcon,
			description: 'Manage brands',
		},
		{
			label: 'Orders',
			path: 'orders',
			icon: OrderIcon,
			description: 'All order history',
		},
		{
			label: 'Analytics',
			path: 'analytics',
			icon: AnalyticsIcon,
			description: 'Sales & metrics',
		},
	],
	Seller: [
		{
			label: 'Dashboard',
			path: 'dashboard',
			icon: DashboardIcon,
			description: 'Store overview',
		},
		{
			label: 'Personal Details',
			path: 'personalDetails',
			icon: UserIcon,
			description: 'Your seller profile',
		},
		{
			label: 'Brands',
			path: 'brands',
			icon: StoreIcon,
			description: 'Manage your brands',
		},
		{
			label: 'My Products',
			path: 'products',
			icon: ProductIcon,
			description: 'Manage listings',
		},
		{
			label: 'Orders',
			path: 'orders',
			icon: OrderIcon,
			description: 'Customer orders',
		},
		{
			label: 'Analytics',
			path: 'analytics',
			icon: AnalyticsIcon,
			description: 'Sales performance',
		},
		
	],
	Customer: [
		{
			label: 'Dashboard',
			path: 'dashboard',
			icon: DashboardIcon,
			description: 'Overview & statistics',
		},
		{
			label: 'Personal Details',
			path: 'personalDetails',
			icon: UserIcon,
			description: 'Your profile info',
		},
		{
			label: 'Shipping Addresses',
			path: 'shippingAddresses',
			icon: ShippingIcon,
			description: 'Delivery locations',
		},
		{
			label: 'Payment Methods',
			path: 'paymentMethods',
			icon: PaymentIcon,
			description: 'Cards & payments',
		},
		{
			label: 'Order History',
			path: 'orderHistory',
			icon: OrderIcon,
			description: 'Past purchases',
		},
		{
			label: 'My Cart',
			path: 'cart',
			icon: StoreIcon,
			description: 'Items in your cart',
		},
		{
			label: 'Wishlist',
			path: 'wishlist',
			icon: HeartIcon,
			description: 'Your saved items',
		},
	],
};

// Single navigation link component
const NavItem = ({ item, index, roleTheme }) => {
	const Icon = item.icon;

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.05 }}
		>
			<NavLink
				to={item.path}
				className={({ isActive: linkActive }) => `
					group relative flex items-start gap-3 px-4 py-3 rounded-xl 
					transition-all duration-300 overflow-hidden
					${
						linkActive
							? 'text-white shadow-lg'
							: 'text-gray-600 hover:bg-gray-100/80 hover:text-indigo-600'
					}
				`}
				style={({ isActive: linkActive }) =>
					linkActive ? { 
						background: roleTheme.gradient,
						boxShadow: `0 10px 15px -3px ${roleTheme.primaryColor}40`
					} : {}
				}
			>
				{({ isActive: linkActive }) => (
					<>
						{/* Glow effect for active state */}
						{linkActive && (
							<motion.div
								className="absolute inset-0 opacity-30"
								style={{ background: roleTheme.gradient }}
								initial={{ scale: 0 }}
								animate={{ scale: 1.5 }}
								transition={{ duration: 0.3 }}
							/>
						)}

						{/* Icon */}
						<span
							className={`relative z-10 shrink-0 mt-1 ${
								linkActive
									? 'text-white'
									: 'text-gray-400 group-hover:text-gray-600'
							}`}
						>
							<Icon className="w-5 h-5" />
						</span>

						{/* Label and description */}
						<div className="relative z-10 flex-1 min-w-0">
							<span
								className={`block font-medium truncate ${
									linkActive ? 'text-white' : 'text-gray-700'
								}`}
							>
								{item.label}
							</span>
							<span
								className={`block text-xs truncate ${
									linkActive
										? 'text-white/80'
										: 'text-gray-400 group-hover:text-gray-500'
								}`}
							>
								{item.description}
							</span>
						</div>

						{/* Chevron */}
						<ChevronRightIcon
							className={`relative z-10 w-4 h-4 mt-1 transition-transform duration-200 ${
								linkActive
									? 'text-white/80 translate-x-1'
									: 'text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1'
							}`}
						/>
					</>
				)}
			</NavLink>
		</motion.div>
	);
};

// Brand section
const SidebarBrand = ({ userRole }) => {
	const roleTheme = roleThemes[userRole] || roleThemes.Customer;

	return (
		<Link to="/">
			<motion.div
				className="p-6 border-b border-gray-100 flex items-center gap-3 group cursor-pointer"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<motion.div
					className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
					style={{ background: roleTheme.gradient }}
					whileHover={{ scale: 1.05, rotate: 5 }}
					whileTap={{ scale: 0.95 }}
				>
					E
				</motion.div>
				<div className="flex flex-col">
					<span className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors tracking-tight">
						E-Commerce
					</span>
					<span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
						{userRole} Portal
					</span>
				</div>
			</motion.div>
		</Link>
	);
};

// Main Sidebar component
const Sidebar = () => {
	const { userRole } = useCurrentUser();
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const roleTheme = roleThemes[userRole] || roleThemes.Customer;
	const navigationItems = roleNavigationConfig[userRole] || [];

	return (
		<>
			{/* Mobile menu button */}
			<motion.button
				className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg 
					md:hidden flex items-center justify-center"
				onClick={() => setIsMobileOpen(!isMobileOpen)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				{isMobileOpen ? (
					<CloseIcon className="w-6 h-6 text-gray-600" />
				) : (
					<MenuIcon className="w-6 h-6 text-gray-600" />
				)}
			</motion.button>

			{/* Mobile overlay */}
			<AnimatePresence>
				{isMobileOpen && (
					<motion.div
						className="fixed inset-0 bg-black/50 z-40 md:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsMobileOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<motion.aside
				className={`
					fixed md:sticky top-0 left-0 h-screen z-40
					bg-white/95 backdrop-blur-xl shadow-xl md:shadow-lg
					border-r border-gray-100 flex flex-col
					transition-all duration-300

					${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
					w-80 md:w-72 lg:w-80
				`}
				style={{
					borderRadius: '0 24px 24px 0',
				}}
			>
				{/* Brand */}
				<SidebarBrand userRole={userRole} />

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto p-4 space-y-1">
					{navigationItems.map((item, index) => (
						<NavItem
							key={item.path}
							item={item}
							index={index}
							roleTheme={roleTheme}
						/>
					))}
				</nav>
			</motion.aside>
		</>
	);
};

export default Sidebar;
