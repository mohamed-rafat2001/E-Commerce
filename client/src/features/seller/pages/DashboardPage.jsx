import DashboardHeader from '../components/DashboardHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import TopProducts from '../components/TopProducts.jsx';
import PendingOrders from '../components/PendingOrders.jsx';
import {
	ProductIcon,
	OrderIcon,
	AnalyticsIcon,
	InventoryIcon,
} from '../../../shared/constants/icons.jsx';

const stats = [
	{
		id: 1,
		name: 'Total Products',
		value: '156',
		change: '+8.2%',
		changeType: 'positive',
		icon: ProductIcon,
		gradient: 'from-emerald-500 to-teal-600',
	},
	{
		id: 2,
		name: 'Active Orders',
		value: '43',
		change: '+12.5%',
		changeType: 'positive',
		icon: OrderIcon,
		gradient: 'from-indigo-500 to-purple-600',
	},
	{
		id: 3,
		name: 'Revenue Today',
		value: '$4,821',
		change: '+23.1%',
		changeType: 'positive',
		icon: AnalyticsIcon,
		gradient: 'from-orange-500 to-red-500',
	},
	{
		id: 4,
		name: 'Low Stock Items',
		value: '12',
		change: '-5%',
		changeType: 'negative',
		icon: InventoryIcon,
		gradient: 'from-pink-500 to-rose-500',
	},
];

const topProducts = [
	{
		id: 1,
		name: 'Wireless Headphones',
		sold: 234,
		revenue: '$8,424',
		image: '🎧',
	},
	{
		id: 2,
		name: 'Smart Watch Pro',
		sold: 189,
		revenue: '$18,900',
		image: '⌚',
	},
	{
		id: 3,
		name: 'Laptop Stand',
		sold: 156,
		revenue: '$4,680',
		image: '💻',
	},
	{
		id: 4,
		name: 'Mechanical Keyboard',
		sold: 142,
		revenue: '$14,200',
		image: '⌨️',
	},
];

const pendingOrders = [
	{ id: 'ORD-891', customer: 'Alex Chen', items: 3, total: '$289.00' },
	{ id: 'ORD-892', customer: 'Maria Lopez', items: 1, total: '$199.00' },
	{ id: 'ORD-893', customer: 'James Wilson', items: 5, total: '$459.00' },
];

const SellerDashboardPage = () => {
	return (
		<div className="space-y-8">
			{/* Page Header */}
			<DashboardHeader 
				title="Store Dashboard 🏪"
				subtitle="Track your sales and manage your products."
			/>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<StatCard key={stat.id} stat={stat} index={index} />
				))}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Top Products */}
				<TopProducts products={topProducts} />

				{/* Pending Orders */}
				<PendingOrders orders={pendingOrders} />
			</div>
		</div>
	);
};

export default SellerDashboardPage;
