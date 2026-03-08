import { motion } from 'framer-motion';
import { PageHeader, StatCard, Card, DataTable, Badge, Button, Skeleton } from '../../../shared/ui';
import { FiPackage, FiShoppingBag, FiTruck, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { useSellerDashboardPage } from '../hooks/index.js';

const DashboardPage = () => {
	const {
		stats,
		statsArray,
		products,
		alerts,
		isLoading
	} = useSellerDashboardPage();

	const dashboardStats = [
		{ title: 'Total Revenue', value: stats?.revenue || '$0.00', icon: <FiTrendingUp />, color: 'primary', change: '+12% from last month' },
		{ title: 'Orders', value: stats?.ordersCount || '0', icon: <FiShoppingBag />, color: 'accent', change: '5 pending' },
		{ title: 'Active Products', value: products?.length || '0', icon: <FiPackage />, color: 'emerald', change: '2 out of stock' },
		{ title: 'Shipments', value: stats?.shipments || '0', icon: <FiTruck />, color: 'warning', change: '3 on the way' }
	];

	const orderColumns = [
		{ header: 'Order ID', key: 'id' },
		{ header: 'Status', render: (row) => <Badge variant={row.statusColor}>{row.status}</Badge> },
		{ header: 'Amount', key: 'total' },
		{ header: 'Actions', render: () => <Button variant="ghost" size="sm">Manage</Button> }
	];

	if (isLoading) {
		return (
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/3 h-10" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Skeleton variant="card" count={4} />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<PageHeader
				title="Seller Dashboard"
				subtitle="Monitor your sales, manage inventory, and track customer orders."
			/>

			{alerts?.length > 0 && (
				<div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 text-amber-800">
					<FiAlertCircle className="w-6 h-6 flex-shrink-0" />
					<p className="font-medium">{alerts[0].message}</p>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{dashboardStats.map((stat, i) => (
					<StatCard key={i} {...stat} />
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<Card padding="none" className="lg:col-span-2 overflow-hidden">
					<div className="p-6 border-b border-gray-100 flex items-center justify-between">
						<h3 className="text-xl font-bold text-gray-900 font-display">Recent Orders</h3>
						<Button variant="ghost" size="sm">Manage All</Button>
					</div>
					<DataTable columns={orderColumns} data={stats?.recentOrders || []} />
				</Card>

				<Card className="flex flex-col">
					<h3 className="text-xl font-bold text-gray-900 mb-6 font-display">Top Products</h3>
					<div className="space-y-4">
						{(products || []).slice(0, 5).map(product => (
							<div key={product._id} className="flex items-center gap-4 group">
								<div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
									<img src={product.image?.secure_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-bold text-gray-900 truncate">{product.name}</p>
									<p className="text-xs text-gray-400 font-medium">{product.stock} units left</p>
								</div>
								<div className="text-right">
									<p className="font-black text-gray-900">${product.price?.amount || 0}</p>
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>
		</div>
	);
};

export default DashboardPage;
