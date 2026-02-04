import { motion } from 'framer-motion';
import { Badge } from '../../../shared/ui/index.js';

const DashboardHeader = ({ title, subtitle, role }) => {
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
			<div className="flex items-center gap-3">
				<Badge variant="gradient" size="lg" icon={<span>👑</span>}>
					{role}
				</Badge>
			</div>
		</motion.div>
	);
};

export default DashboardHeader;
