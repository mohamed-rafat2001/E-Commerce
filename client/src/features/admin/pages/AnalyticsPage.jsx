import { LoadingSpinner } from '../../../shared/ui/index.js';
import { useAnalyticsPage } from '../hooks/index.js';
import AnalyticsHeader from '../components/analytics/AnalyticsHeader.jsx';
import AnalyticsSummary from '../components/analytics/AnalyticsSummary.jsx';
import AnalyticsGrid from '../components/analytics/AnalyticsGrid.jsx';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts.jsx';

const AnalyticsPage = () => {
	const {
		timeRange,
		setTimeRange,
		analytics,
		isLoading,
		error
	} = useAnalyticsPage();

	if (error) return <div className="text-red-500">Error loading analytics: {error.message}</div>;

	return (
		<div className="space-y-6">
			<AnalyticsHeader timeRange={timeRange} setTimeRange={setTimeRange} />

			{isLoading ? (
				<div className="flex justify-center py-20">
					<LoadingSpinner />
				</div>
			) : (
				<>
					<AnalyticsSummary analytics={analytics} />
					<AnalyticsGrid analytics={analytics} />
					<AnalyticsCharts analytics={analytics} />
				</>
			)}
		</div>
	);
};

export default AnalyticsPage;
