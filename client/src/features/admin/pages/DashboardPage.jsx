import React from 'react';
import { PageHeader, StatCard, Card, DataTable, Badge, Button, Skeleton } from '../../../shared/ui';
import { FiUsers, FiShoppingBag, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { useDashboardPage } from '../hooks/index.js';

const AdminDashboardPage = () => {
	const { stats, recentOrders, isLoading, error } = useDashboardPage();

	const adminStats = [
		{ title: 'Total Revenue', value: stats?.find(s => s.id === 'revenue')?.value || '$0', icon: <FiTrendingUp />, color: 'primary', change: stats?.find(s => s.id === 'revenue')?.change },
		{ title: 'Active Sellers', value: stats?.find(s => s.id === 'sellers')?.value || '0', icon: <FiUsers />, color: 'accent', change: stats?.find(s => s.id === 'sellers')?.change },
		{ title: 'New Orders', value: stats?.find(s => s.id === 'orders')?.value || '0', icon: <FiShoppingBag />, color: 'emerald', change: stats?.find(s => s.id === 'orders')?.change },
		{ title: 'Satisfaction', value: '4.8', icon: <FiCheckCircle />, color: 'warning', change: 'Consistent' }
	];

	const orderColumns = [
		{ header: 'Order ID', key: 'id' },
		{ header: 'Customer', key: 'customerName' },
		{ header: 'Status', render: (row) => <Badge variant={row.statusColor || 'primary'}>{row.status}</Badge> },
		{ header: 'Amount', key: 'total' },
		{ header: 'Date', key: 'date' }
	];

	if (isLoading) {
		return (
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/3 h-10" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Skeleton variant="card" count={4} />
				</div>
				<Skeleton variant="image" className="h-64 rounded-3xl" />
			</div>
		);
	}

	if (error) {
		return (
			<Card className="text-center py-12 border-rose-100 bg-rose-50">
				<p className="text-rose-600 font-bold">Failed to load dashboard data. Please try again.</p>
				<Button variant="danger" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
			</Card>
		);
	}

	return (
		<div className="space-y-8">
			<PageHeader
				title="Admin Overview"
				subtitle="Monitor the entire ecosystem performance and key business metrics at a glance."
				actions={<Badge variant="primary" size="lg">Super Admin Access</Badge>}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{adminStats.map((stat, i) => (
					<StatCard key={i} {...stat} />
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<Card padding="none" className="lg:col-span-2 overflow-hidden">
					<div className="p-6 border-b border-gray-100 flex items-center justify-between">
						<h3 className="text-xl font-bold font-display text-gray-900">Live Transaction Stream</h3>
						<Button variant="ghost" size="sm">Download Report</Button>
					</div>
					<DataTable columns={orderColumns} data={recentOrders || []} />
				</Card>

				<div className="space-y-6">
					<Card className="bg-indigo-600 text-white">
						<h3 className="text-xl font-bold mb-4">System Health</h3>
						<div className="space-y-4">
							<div className="flex justify-between items-center text-sm">
								<span>Server Status</span>
								<Badge variant="success" className="bg-emerald-400/20 text-emerald-100 border-none">99.9% Uptime</Badge>
							</div>
							<div className="flex justify-between items-center text-sm">
								<span>API Latency</span>
								<span className="font-bold">42ms</span>
							</div>
						</div>
					</Card>

					<Card>
						<h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
						<div className="flex flex-col gap-2">
							<Button variant="outline" className="justify-start">Verified Sellers</Button>
							<Button variant="outline" className="justify-start">Dispute Management</Button>
							<Button variant="outline" className="justify-start">Global Config</Button>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboardPage;
