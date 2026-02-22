import { FiEye } from 'react-icons/fi';
import { UsersIcon, ProductIcon, OrderIcon } from '../../../../shared/constants/icons.jsx';
import SmallStatCard from './SmallStatCard.jsx';

const AnalyticsGrid = ({ analytics }) => {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<SmallStatCard
				title="Total Users"
				value={analytics.users.total.toLocaleString()}
				subtitle={`+${analytics.users.change}% growth`}
				icon={UsersIcon}
				gradient="from-indigo-500 to-purple-600"
			/>
			<SmallStatCard
				title="Total Products"
				value={analytics.products.total.toLocaleString()}
				subtitle={`${analytics.products.active} active`}
				icon={ProductIcon}
				gradient="from-emerald-500 to-teal-600"
			/>
			<SmallStatCard
				title="Active Orders"
				value="0" // TODO: Add to API
				subtitle="Processing now"
				icon={OrderIcon}
				gradient="from-blue-500 to-indigo-600"
			/>
			<SmallStatCard
				title="Conversion Rate"
				value="0%"
				subtitle="+0% this week"
				icon={FiEye}
				gradient="from-pink-500 to-rose-600"
			/>
		</div>
	);
};

export default AnalyticsGrid;
