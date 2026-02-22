import { FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import LargeStatCard from './LargeStatCard.jsx';

const AnalyticsSummary = ({ analytics }) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<LargeStatCard
				title="Total Revenue"
				value={`${(analytics.revenue.total / 1000).toFixed(1)}K`}
				change={analytics.revenue.change}
				icon={FiDollarSign}
				chartData={analytics.revenue.chartData}
				color="emerald"
				prefix="$"
			/>
			<LargeStatCard
				title="Total Orders"
				value={analytics.orders.total}
				change={analytics.orders.change}
				icon={FiShoppingBag}
				chartData={analytics.orders.chartData}
				color="indigo"
			/>
		</div>
	);
};

export default AnalyticsSummary;
