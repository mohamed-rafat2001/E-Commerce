import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * SidebarBrand - Dashboard branding section with role indicators
 */
const SidebarBrand = ({ userRole }) => {
    return (
        <Link to="/">
            <motion.div
                className="h-[88px] px-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 group cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg bg-gray-50 dark:bg-gray-800"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </motion.div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                        ShopyNow
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                        {userRole} Portal
                    </span>
                </div>
            </motion.div>
        </Link>
    );
};

export default SidebarBrand;
