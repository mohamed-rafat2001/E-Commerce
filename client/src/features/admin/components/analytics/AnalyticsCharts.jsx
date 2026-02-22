import TopSellersCard from './TopSellersCard.jsx';
import TopProductsCard from './TopProductsCard.jsx';
import UserDistributionCard from './UserDistributionCard.jsx';
import RecentActivityCard from './RecentActivityCard.jsx';

const AnalyticsCharts = ({ analytics }) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<TopSellersCard sellers={analytics.topSellers} />
			<TopProductsCard products={analytics.topProducts} />
			<div className="space-y-6">
				<UserDistributionCard users={analytics.users} />
				<RecentActivityCard activities={analytics.recentActivity} />
			</div>
		</div>
	);
};

export default AnalyticsCharts;
