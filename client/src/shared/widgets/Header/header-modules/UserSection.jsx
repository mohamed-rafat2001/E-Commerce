import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Button } from '../../../ui/index.js';
import { DashboardIcon, SettingsIcon, LogoutIcon } from '../../../constants/icons.jsx';

/**
 * UserSection - Profile dropdown and authentication controls
 */
const UserSection = ({ user, isAuthenticated, userRole, onLogoutClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fullName = user?.userId
        ? `${user.userId.firstName} ${user.userId.lastName}`
        : (user?.firstName ? `${user.firstName} ${user.lastName}` : 'Guest');

    // Close on click outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isDropdownOpen]);

    if (!isAuthenticated) {
        return (
            <div className="hidden md:flex items-center gap-1.5 xl:gap-2 shrink-0">
                <Link to="/login">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full px-3.5 lg:px-4 xl:px-5 text-xs xl:text-sm font-semibold border border-gray-300 dark:border-gray-700 !text-gray-900 dark:!text-gray-100 min-w-[84px] xl:min-w-[92px]"
                    >
                        Login
                    </Button>
                </Link>
                <Link to="/register">
                    <Button
                        variant="primary"
                        size="sm"
                        className="rounded-full px-3.5 lg:px-4 xl:px-5 text-xs xl:text-sm !text-white shadow-xl hover:bg-black min-w-[108px] xl:min-w-[120px]"
                    >
                        Get Started
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative shrink-0" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="User menu"
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
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 py-3 z-[60] overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 mb-2">
                            <p className="text-sm font-black text-gray-900 dark:text-gray-100 truncate">{fullName}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{userRole}</p>
                        </div>

                        <Link to={`/${userRole?.toLowerCase()}/dashboard`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-4 px-6 py-3.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                <DashboardIcon className="w-4 h-4" />
                            </div>
                            <span className="font-bold">Dashboard</span>
                        </Link>
                        
                        <Link to={`/${userRole?.toLowerCase()}/settings`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-4 px-6 py-3.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                <SettingsIcon className="w-4 h-4" />
                            </div>
                            <span className="font-bold">Settings</span>
                        </Link>

                        <div className="px-3 mt-2">
                            <button
                                onClick={() => {
                                    onLogoutClick();
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <LogoutIcon className="w-4 h-4" />
                                <span className="font-black uppercase tracking-widest text-[10px]">Logout Account</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserSection;
