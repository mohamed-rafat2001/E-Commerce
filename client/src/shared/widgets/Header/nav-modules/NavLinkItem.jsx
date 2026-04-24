import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Shared NavLinkItem component for consistent styling
 */
const NavLinkItem = ({ link }) => (
    <NavLink
        to={link.path}
        className={({ isActive }) => `
            inline-flex items-center h-10 px-2.5 xl:px-3.5 rounded-xl text-xs xl:text-sm font-semibold leading-none whitespace-nowrap select-none transition-all duration-150 relative
            ${isActive 
                ? 'text-gray-900 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/60' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/60'}
        `}
    >
        {({ isActive }) => (
            <>
                {link.name}
                {isActive && (
                    <motion.div
                        layoutId="nav-active-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-gray-100 rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                )}
            </>
        )}
    </NavLink>
);

export default NavLinkItem;
