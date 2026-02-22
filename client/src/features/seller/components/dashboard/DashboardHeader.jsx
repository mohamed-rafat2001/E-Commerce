import { motion } from 'framer-motion';

const DashboardHeader = ({ title, subtitle, children }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex-1"
		>
			<h1 className="text-3xl font-bold text-gray-900">
				{title}
			</h1>
			<p className="text-gray-500 mt-1">
				{subtitle}
			</p>
			{children}
		</motion.div>
	);
};

export default DashboardHeader;
