import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/index.js';

const RevenueChart = () => {
	// Dummy data for visual representation
	const data = [45, 60, 52, 75, 60, 85, 95];
	const months = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	return (
		<motion.div
			className="lg:col-span-2"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<Card variant="elevated" className="h-full">
				<Card.Header>
					<div className="flex items-center justify-between">
						<div>
							<Card.Title>Revenue Growth</Card.Title>
							<p className="text-sm text-gray-500 mt-1">Weekly performance overview</p>
						</div>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								<div className="w-3 h-3 rounded-full bg-indigo-500" />
								<span className="text-xs text-gray-500">Revenue</span>
							</div>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<div className="relative h-[240px] mt-4 flex items-end justify-between gap-2 px-2">
						{/* Grid Lines */}
						<div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="w-full border-t border-gray-50" />
							))}
						</div>

						{/* Bars */}
						{data.map((value, index) => (
							<div key={index} className="relative flex-1 flex flex-col items-center group">
								<motion.div
									className="w-full max-w-[40px] bg-linear-to-t from-indigo-600 to-purple-500 rounded-t-lg relative"
									initial={{ height: 0 }}
									animate={{ height: `${value}%` }}
									transition={{ delay: 0.6 + index * 0.1, duration: 1, ease: "easeOut" }}
								>
									{/* Tooltip */}
									<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
										${(value * 120).toLocaleString()}
									</div>
								</motion.div>
								<span className="text-[10px] font-medium text-gray-400 mt-3 uppercase tracking-wider">
									{months[index]}
								</span>
							</div>
						))}
					</div>
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default RevenueChart;
