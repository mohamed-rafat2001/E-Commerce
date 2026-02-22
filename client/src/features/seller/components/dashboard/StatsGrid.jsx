import { Card } from '../../../../shared/ui/index.js';
import { FiPackage } from 'react-icons/fi';
import StatCard from './StatCard.jsx';

const StatsGrid = ({ statsArray }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{statsArray && statsArray.length > 0 ? (
				statsArray.map((stat, index) => (
					<StatCard 
						key={stat.id}
						stat={stat}
						index={index}
					/>
				))
			) : (
				<div className="col-span-4">
					<Card variant="elevated" className="text-center py-12">
						<div className="text-gray-400">
							<FiPackage className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p className="font-medium">No stats available</p>
							<p className="text-sm mt-1">Loading dashboard data...</p>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
};

export default StatsGrid;
