import DashboardHeader from '../components/DashboardHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import TaskList from '../components/TaskList.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import {
	OrderIcon,
	InventoryIcon,
	UsersIcon,
} from '../../../shared/constants/icons.jsx';

const tasks = [
	{ id: 1, title: 'Process new orders', count: 8, priority: 'high' },
	{ id: 2, title: 'Update inventory', count: 3, priority: 'medium' },
	{ id: 3, title: 'Customer inquiries', count: 12, priority: 'high' },
	{ id: 4, title: 'Returns processing', count: 2, priority: 'low' },
];

const ordersToProcess = [
	{ id: 'ORD-445', customer: 'Emma Watson', items: 2, time: '10 min ago' },
	{ id: 'ORD-444', customer: 'John Carter', items: 5, time: '25 min ago' },
	{ id: 'ORD-443', customer: 'Sarah Mills', items: 1, time: '1 hour ago' },
];

const stats = [
	{ icon: OrderIcon, label: 'Orders to Process', value: '23', color: 'from-pink-500 to-rose-500' },
	{ icon: InventoryIcon, label: 'Low Stock Alerts', value: '7', color: 'from-amber-500 to-orange-500' },
	{ icon: UsersIcon, label: 'Customer Messages', value: '12', color: 'from-indigo-500 to-purple-500' },
];

const EmployeeDashboardPage = () => {
	return (
		<div className="space-y-8">
			{/* Page Header */}
			<DashboardHeader 
				title="Good morning! 💼"
				subtitle="Here are your tasks for today."
			/>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{stats.map((stat, index) => (
					<StatCard key={stat.label} stat={stat} index={index} />
				))}
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Tasks List */}
				<TaskList tasks={tasks} />

				{/* Quick Actions/Recent */}
				<RecentOrders orders={ordersToProcess} />
			</div>
		</div>
	);
};

export default EmployeeDashboardPage;
