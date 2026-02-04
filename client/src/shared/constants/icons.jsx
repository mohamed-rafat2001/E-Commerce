// Modern icon components using react-icons for consistent, scalable icons
import { motion } from 'framer-motion';
import {
	FiUser,
	FiHome,
	FiTruck,
	FiCreditCard,
	FiShoppingBag,
	FiSettings,
	FiLogOut,
	FiGrid,
	FiBox,
	FiUsers,
	FiBarChart2,
	FiShoppingCart,
	FiHeart,
	FiBell,
	FiChevronRight,
	FiMenu,
	FiX,
	FiArchive,
	FiChevronLeft,
	FiMail,
	FiLock,
	FiPhone,
	FiEye,
	FiEyeOff,
	FiCheck,
	FiFacebook,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

// Wrapper for animated icons
export const IconWrapper = ({ children, className = '', animate = true }) => {
	if (!animate) {
		return <span className={className}>{children}</span>;
	}
	return (
		<motion.span
			className={className}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			transition={{ type: 'spring', stiffness: 400, damping: 17 }}
		>
			{children}
		</motion.span>
	);
};

// Icon components wrapping react-icons
// Passing className and other props down to the icon

export const UserIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiUser className={className} {...props} />
);

export const HomeIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiHome className={className} {...props} />
);

export const ShippingIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiTruck className={className} {...props} />
);

export const PaymentIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiCreditCard className={className} {...props} />
);

export const OrderIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiShoppingBag className={className} {...props} />
);

export const SettingsIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiSettings className={className} {...props} />
);

export const LogoutIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiLogOut className={className} {...props} />
);

export const DashboardIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiGrid className={className} {...props} />
);

export const ProductIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiBox className={className} {...props} />
);

export const UsersIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiUsers className={className} {...props} />
);

export const AnalyticsIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiBarChart2 className={className} {...props} />
);

export const StoreIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiShoppingCart className={className} {...props} />
);

export const HeartIcon = ({ className = 'w-5 h-5', filled = false, color, ...props }) => (
	<FiHeart 
		className={className} 
		fill={filled ? (color || 'currentColor') : 'none'} 
		stroke={color}
		{...props} 
	/>
);

export const NotificationIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiBell className={className} {...props} />
);

export const ChevronRightIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiChevronRight className={className} {...props} />
);

export const ChevronLeftIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiChevronLeft className={className} {...props} />
);

export const MenuIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiMenu className={className} {...props} />
);

export const CloseIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiX className={className} {...props} />
);

export const InventoryIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiArchive className={className} {...props} />
);

export const MailIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiMail className={className} {...props} />
);

export const LockIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiLock className={className} {...props} />
);

export const PhoneIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiPhone className={className} {...props} />
);

export const EyeIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiEye className={className} {...props} />
);

export const EyeOffIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiEyeOff className={className} {...props} />
);

export const CheckIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiCheck className={className} {...props} />
);

export const FacebookIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FiFacebook className={className} {...props} />
);

export const GoogleIcon = ({ className = 'w-5 h-5', ...props }) => (
	<FcGoogle className={className} {...props} />
);
