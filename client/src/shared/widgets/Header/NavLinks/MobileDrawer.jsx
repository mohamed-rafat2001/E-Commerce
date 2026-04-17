import { useEffect, memo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, HeartIcon, StoreIcon } from '../../../constants/icons.jsx';

/**
 * MobileDrawer - Refactored full-height navigation drawer for mobile/tablet
 */
const MobileDrawer = memo(({ 
    isOpen, 
    onClose, 
    wishlistCount, 
    cartItemCount, 
    isAuthenticated, 
    userRole,
    drawerLinks 
}) => {
    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
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
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] lg:hidden"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-[320px] max-w-[92vw] bg-white dark:bg-gray-900 z-[1000] shadow-[0_0_50px_rgba(0,0,0,0.3)] lg:hidden flex flex-col border-l border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="shrink-0 flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 h-[88px]">
                            <div className="flex items-center gap-2">
                                <img src="/logo.png" alt="Logo" className="h-6 w-auto mix-blend-multiply dark:mix-blend-normal object-contain" />
                                <span className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tighter">ShopyNow</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Quick Actions (Wishlist/Cart) */}
                        <div className="shrink-0 grid grid-cols-2 gap-px border-b border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                            {[
                                { name: 'Wishlist', path: '/public-wishlist', count: wishlistCount, icon: HeartIcon },
                                { name: 'Cart', path: '/cart', count: cartItemCount, icon: StoreIcon }
                            ].map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={onClose}
                                    className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="relative">
                                        <item.icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                        {item.count > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                                                {item.count}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{item.name}</span>
                                </NavLink>
                            ))}
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            {drawerLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        "flex items-center min-h-[52px] px-5 py-3 rounded-2xl text-sm font-black transition-all " +
                                        (isActive
                                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800")
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* Footer (Auth & Copyright) */}
                        <div className="shrink-0 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/40 flex flex-col gap-3">
                            {isAuthenticated ? (
                                <Link
                                    to={`/${userRole?.toLowerCase()}/dashboard`}
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-black text-xs uppercase tracking-widest text-center shadow-lg active:scale-95 transition-all"
                                >
                                    My Dashboard
                                </Link>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        to="/login"
                                        onClick={onClose}
                                        className="py-4 rounded-2xl border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 font-black text-xs uppercase tracking-widest text-center"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={onClose}
                                        className="py-4 rounded-2xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-black text-xs uppercase tracking-widest text-center shadow-lg"
                                    >
                                        Join
                                    </Link>
                                </div>
                            )}
                            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                                © {new Date().getFullYear()} ShopyNow
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

export default MobileDrawer;
