import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useCurrentUser from '../../../features/user/hooks/useCurrentUser.js';
import { roleThemes } from '../../constants/theme.js';
import { MenuIcon, CloseIcon } from '../../constants/icons.jsx';

// Modular Sub-components
import SidebarBrand from './SidebarBrand.jsx';
import NavItem from './NavItem.jsx';
import { roleNavigationConfig } from './navigationConfig.js';

/**
 * Sidebar - Dashboard shell orchestrator
 */
const Sidebar = () => {
    const { userRole } = useCurrentUser();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const roleTheme = roleThemes[userRole] || roleThemes.Customer;
    const navigationItems = roleNavigationConfig[userRole] || [];

    return (
        <>
            {/* Mobile Menu Toggle */}
            <motion.button
                className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg md:hidden flex items-center justify-center border border-gray-100 dark:border-gray-700"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle Menu"
            >
                {isMobileOpen ? (
                    <CloseIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                    <MenuIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
            </motion.button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Main Sidebar Aside */}
            <motion.aside
                className={`
                    fixed top-0 left-0 h-screen z-40
                    bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl md:shadow-lg
                    border-r border-gray-100 dark:border-gray-800 flex flex-col
                    transition-all duration-300 ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    w-80 md:w-72 lg:w-80
                `}
                style={{
                    borderRadius: '0 0 24px 0',
                }}
            >
                <SidebarBrand userRole={userRole} />

                {/* Vertical Navigation Bar */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {navigationItems.map((item, index) => (
                        <NavItem
                            key={item.path}
                            item={item}
                            index={index}
                            roleTheme={roleTheme}
                        />
                    ))}
                </nav>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #f0f0f0; border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e0e0e0; }
                `}</style>
            </motion.aside>
        </>
    );
};

export default Sidebar;
