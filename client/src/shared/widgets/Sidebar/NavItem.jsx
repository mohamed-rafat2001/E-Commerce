import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '../../constants/icons.jsx';

/**
 * NavItem - Individual navigation link component with premium animations
 */
const NavItem = ({ item, index, roleTheme }) => {
    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
        >
            <NavLink
                to={item.path}
                className={({ isActive }) => `
                    group relative flex items-start gap-3 px-4 py-3 rounded-xl 
                    transition-all duration-300 overflow-hidden
                    ${isActive
                        ? 'text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'}
                `}
                style={({ isActive }) =>
                    isActive ? { 
                        background: roleTheme.gradient,
                        boxShadow: `0 10px 15px -3px ${roleTheme.primaryColor}40`
                    } : {}
                }
            >
                {({ isActive }) => (
                    <>
                        {/* Glow effect for active state */}
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 opacity-30"
                                style={{ background: roleTheme.gradient }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1.5 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}

                        {/* Icon */}
                        <span className={`relative z-10 shrink-0 mt-1 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                            <Icon className="w-5 h-5" />
                        </span>

                        {/* Label and description */}
                        <div className="relative z-10 flex-1 min-w-0">
                            <span className={`block font-medium truncate ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                                {item.label}
                            </span>
                            <span className={`block text-xs truncate ${isActive ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>
                                {item.description}
                            </span>
                        </div>

                        {/* Chevron */}
                        <ChevronRightIcon className={`relative z-10 w-4 h-4 mt-1 transition-transform duration-200 ${isActive ? 'text-white/80 translate-x-1' : 'text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1'}`} />
                    </>
                )}
            </NavLink>
        </motion.div>
    );
};

export default NavItem;
