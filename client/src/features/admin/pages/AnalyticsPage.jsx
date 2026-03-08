import { PageHeader, Card, Skeleton, Select } from '../../../shared/ui/index.js';
import { useAnalyticsPage } from '../hooks/index.js';
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

	if (error) {
		return (
			<Card className="text-center py-12 border-rose-100 bg-rose-50">
				<p className="text-rose-600 font-bold font-display">Logistics Failure</p>
				<p className="text-rose-500 mt-2">Error loading analytics: {error.message}</p>
			</Card>
		);
	}

	return (
		<div className="space-y-8 pb-10">
			<PageHeader
				title="Marketplace Intelligence"
				subtitle="Deep-dive metrics on revenue distribution, growth loops, and ecosystem health."
				actions={
					<div className="min-w-[180px]">
						<Select
							value={timeRange}
							onChange={setTimeRange}
							options={[
								{ value: 'week', label: 'Last 7 days' },
								{ value: 'month', label: 'Last 30 days' },
								{ value: 'quarter', label: 'Last 3 months' },
								{ value: 'year', label: 'Last 12 months' },
							]}
						/>
					</div>
				}
			/>

			{isLoading ? (
				<div className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<Skeleton variant="card" count={4} />
					</div>
					<Skeleton variant="card" className="h-96" />
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
