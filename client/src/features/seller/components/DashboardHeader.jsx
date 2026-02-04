import { motion } from 'framer-motion';

const DashboardHeader = ({ title, subtitle }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
		>
			<div>
				<h1 className="text-3xl font-bold text-gray-900">
					{title}
				</h1>
				<p className="text-gray-500 mt-1">
					{subtitle}
				</p>
			</div>
			<motion.button
				className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white 
					font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
			>
				+ Add New Product
			</motion.button>
		</motion.div>
	);
};

export default DashboardHeader;
