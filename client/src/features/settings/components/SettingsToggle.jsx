import { motion } from 'framer-motion';

const SettingsToggle = ({ enabled, onChange }) => (
    <motion.button
        className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-200 ${enabled ? 'bg-indigo-500' : 'bg-gray-300'
            }`}
        onClick={onChange}
        whileTap={{ scale: 0.95 }}
    >
        <motion.div
            className="w-5 h-5 bg-white rounded-full shadow-sm"
            animate={{ x: enabled ? 28 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
    </motion.button>
);

export default SettingsToggle;
