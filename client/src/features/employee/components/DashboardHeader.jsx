import { motion } from 'framer-motion';
import { Badge } from '../../../shared/ui/index.js';

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
			<Badge
				variant="gradient"
				size="lg"
				className="!bg-gradient-to-r !from-pink-500 !to-amber-400"
			>
				Employee Portal
			</Badge>
		</motion.div>
	);
};

export default DashboardHeader;
