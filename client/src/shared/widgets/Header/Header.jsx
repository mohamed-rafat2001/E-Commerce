import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useCurrentUser from '../../../features/user/hooks/useCurrentUser.js';
import { roleThemes } from "../../constants/theme.js";
import { Avatar, Badge } from '../../ui/index.js';
import {
	NotificationIcon,
	HomeIcon,
	StoreIcon,
	HeartIcon,
} from '../../constants/icons.jsx';

const Header = () => {
	const { userRole, user, isLoggedIn } = useCurrentUser();
	const roleTheme = roleThemes[userRole] || roleThemes.Customer;

	const fullName = user?.userId
		? `${user.userId.firstName} ${user.userId.lastName}`
		: 'Guest';

	return (
		<motion.header
			className="sticky top-0 z-30 w-full"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ type: 'spring', stiffness: 260, damping: 20 }}
		>
			{/* Glassmorphism header */}
			<div className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo & Brand */}
						<Link to="/" className="flex items-center gap-3 group">
							<motion.div
								className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
								style={{ background: roleTheme.gradient }}
								whileHover={{ scale: 1.05, rotate: 5 }}
								whileTap={{ scale: 0.95 }}
							>
								E
							</motion.div>
							<span className="text-xl font-bold text-gray-800 hidden sm:block group-hover:text-indigo-600 transition-colors">
								E-Commerce
							</span>
						</Link>

						{/* Search Bar (hidden on mobile) */}
						<div className="hidden md:flex flex-1 max-w-md mx-8">
							<div className="relative w-full">
								<input
									type="text"
									placeholder="Search products, orders..."
									className="w-full pl-4 pr-10 py-2.5 bg-gray-100/80 border-0 rounded-xl
										text-gray-700 placeholder:text-gray-400
										focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white
										transition-all duration-300"
								/>
								<svg
									className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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

						{/* Right side actions */}
						<div className="flex items-center gap-2 sm:gap-4">
							{/* Quick action buttons */}
							<div className="flex items-center gap-1">
								<motion.button
									className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 
										hover:bg-gray-100 transition-all duration-200"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<HomeIcon className="w-5 h-5" />
								</motion.button>
								<motion.button
									className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-700 
										hover:bg-gray-100 transition-all duration-200"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<HeartIcon className="w-5 h-5" />
									<span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 
										text-white text-[10px] font-bold rounded-full flex items-center justify-center">
										3
									</span>
								</motion.button>
								<motion.button
									className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-700 
										hover:bg-gray-100 transition-all duration-200"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<StoreIcon className="w-5 h-5" />
									<span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 
										text-white text-[10px] font-bold rounded-full flex items-center justify-center">
										2
									</span>
								</motion.button>
								<motion.button
									className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-700 
										hover:bg-gray-100 transition-all duration-200"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<NotificationIcon className="w-5 h-5" />
									<span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 
										text-white text-[10px] font-bold rounded-full flex items-center justify-center">
										5
									</span>
								</motion.button>
							</div>

							{/* Divider */}
							<div className="hidden sm:block w-px h-8 bg-gray-200"></div>

							{/* User profile */}
							{isLoggedIn ? (
								<Link
									to={`/${userRole?.toLowerCase()}/personalDetails`}
									className="flex items-center gap-3 p-1.5 pr-4 rounded-xl
										hover:bg-gray-100/80 transition-all duration-200"
								>
									<Avatar name={fullName} size="sm" status="online" />
									<div className="hidden sm:block">
										<p className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
											{fullName}
										</p>
										<Badge variant="primary" size="sm">
											{userRole}
										</Badge>
									</div>
								</Link>
							) : (
								<div className="flex items-center gap-2">
									<Link
										to="/login"
										className="px-4 py-2 text-sm font-medium text-gray-700 
											hover:text-indigo-600 transition-colors"
									>
										Sign In
									</Link>
									<Link
										to="/register"
										className="px-4 py-2 text-sm font-medium text-white rounded-xl
											shadow-lg hover:shadow-xl transition-all duration-200"
										style={{ background: roleTheme.gradient }}
									>
										Get Started
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.header>
	);
};

export default Header;
