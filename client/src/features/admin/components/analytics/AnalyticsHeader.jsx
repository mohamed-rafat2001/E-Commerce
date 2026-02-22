const AnalyticsHeader = ({ timeRange, setTimeRange }) => {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Platform Analytics 📊</h1>
				<p className="text-gray-500 mt-1">Comprehensive overview of your e-commerce platform</p>
			</div>
			<select
				value={timeRange}
				onChange={(e) => setTimeRange(e.target.value)}
				className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
			>
				<option value="week">Last 7 days</option>
				<option value="month">Last 30 days</option>
				<option value="quarter">Last 3 months</option>
				<option value="year">Last 12 months</option>
			</select>
		</div>
	);
};

export default AnalyticsHeader;
