import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderIcon } from '../../../shared/constants/icons.jsx';
import { Button, Badge, LoadingSpinner } from '../../../shared/ui/index.js';
import { FiSearch, FiFilter, FiEye, FiPackage, FiTruck, FiCheck, FiX, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Mock data for orders (will be replaced with actual API data)
const mockOrders = [
	{
		id: 'ORD-2024-001',
		customer: { name: 'Alex Chen', email: 'alex@example.com' },
		date: '2026-02-08',
		items: [
			{ name: 'Wireless Headphones', quantity: 2, price: 149.99, image: '🎧' },
			{ name: 'Phone Case', quantity: 1, price: 29.99, image: '📱' },
		],
		total: 329.97,
		status: 'Pending',
		paymentStatus: 'Paid',
	},
	{
		id: 'ORD-2024-002',
		customer: { name: 'Maria Lopez', email: 'maria@example.com' },
		date: '2026-02-07',
		items: [
			{ name: 'Smart Watch', quantity: 1, price: 299.99, image: '⌚' },
		],
		total: 299.99,
		status: 'Processing',
		paymentStatus: 'Paid',
	},
	{
		id: 'ORD-2024-003',
		customer: { name: 'James Wilson', email: 'james@example.com' },
		date: '2026-02-06',
		items: [
			{ name: 'Laptop Stand', quantity: 1, price: 79.99, image: '💻' },
			{ name: 'USB-C Hub', quantity: 2, price: 49.99, image: '🔌' },
		],
		total: 179.97,
		status: 'Shipped',
		paymentStatus: 'Paid',
	},
	{
		id: 'ORD-2024-004',
		customer: { name: 'Sarah Brown', email: 'sarah@example.com' },
		date: '2026-02-05',
		items: [
			{ name: 'Mechanical Keyboard', quantity: 1, price: 159.99, image: '⌨️' },
		],
		total: 159.99,
		status: 'Delivered',
		paymentStatus: 'Paid',
	},
];

// Status configuration
const statusConfig = {
	Pending: { 
		color: 'bg-amber-100 text-amber-700 border-amber-200', 
		icon: FiClock,
		gradient: 'from-amber-500 to-orange-500'
	},
	Processing: { 
		color: 'bg-blue-100 text-blue-700 border-blue-200', 
		icon: FiPackage,
		gradient: 'from-blue-500 to-indigo-500'
	},
	Shipped: { 
		color: 'bg-purple-100 text-purple-700 border-purple-200', 
		icon: FiTruck,
		gradient: 'from-purple-500 to-pink-500'
	},
	Delivered: { 
		color: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
		icon: FiCheck,
		gradient: 'from-emerald-500 to-teal-500'
	},
	Cancelled: { 
		color: 'bg-rose-100 text-rose-700 border-rose-200', 
		icon: FiX,
		gradient: 'from-rose-500 to-red-500'
	},
};

// Order Card Component
const OrderCard = ({ order, onUpdateStatus }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const StatusIcon = statusConfig[order.status]?.icon || FiClock;

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
		>
			{/* Order Header */}
			<div 
				className="p-6 cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusConfig[order.status]?.gradient} flex items-center justify-center`}>
							<StatusIcon className="w-6 h-6 text-white" />
						</div>
						<div>
							<h3 className="font-bold text-gray-900">{order.id}</h3>
							<p className="text-sm text-gray-500">{order.customer.name} • {new Date(order.date).toLocaleDateString()}</p>
						</div>
					</div>
					
					<div className="flex items-center gap-4">
						<div className="text-right">
							<p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
							<p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
						</div>
						<span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${statusConfig[order.status]?.color}`}>
							<StatusIcon className="w-4 h-4" />
							{order.status}
						</span>
						<button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
							{isExpanded ? <FiChevronUp className="w-5 h-5 text-gray-400" /> : <FiChevronDown className="w-5 h-5 text-gray-400" />}
						</button>
					</div>
				</div>
			</div>

			{/* Expanded Content */}
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="px-6 pb-6 border-t border-gray-100 pt-4">
							{/* Customer Info */}
							<div className="mb-6">
								<h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
								<div className="flex items-center gap-4 text-gray-600">
									<span>{order.customer.name}</span>
									<span className="text-gray-300">•</span>
									<span>{order.customer.email}</span>
								</div>
							</div>

							{/* Order Items */}
							<div className="mb-6">
								<h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
								<div className="space-y-3">
									{order.items.map((item, index) => (
										<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
											<div className="flex items-center gap-3">
												<span className="text-2xl">{item.image}</span>
												<div>
													<p className="font-medium text-gray-900">{item.name}</p>
													<p className="text-sm text-gray-500">Qty: {item.quantity}</p>
												</div>
											</div>
											<span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
										</div>
									))}
								</div>
							</div>

							{/* Actions */}
							<div className="flex flex-wrap gap-3">
								{order.status === 'Pending' && (
									<>
										<Button 
											size="sm" 
											onClick={() => onUpdateStatus(order.id, 'Processing')}
											icon={<FiPackage className="w-4 h-4" />}
										>
											Start Processing
										</Button>
										<Button 
											variant="danger" 
											size="sm" 
											onClick={() => onUpdateStatus(order.id, 'Cancelled')}
											icon={<FiX className="w-4 h-4" />}
										>
											Cancel Order
										</Button>
									</>
								)}
								{order.status === 'Processing' && (
									<Button 
										size="sm" 
										onClick={() => onUpdateStatus(order.id, 'Shipped')}
										icon={<FiTruck className="w-4 h-4" />}
									>
										Mark as Shipped
									</Button>
								)}
								{order.status === 'Shipped' && (
									<Button 
										variant="success" 
										size="sm" 
										onClick={() => onUpdateStatus(order.id, 'Delivered')}
										icon={<FiCheck className="w-4 h-4" />}
									>
										Mark as Delivered
									</Button>
								)}
								<Button variant="secondary" size="sm" icon={<FiEye className="w-4 h-4" />}>
									View Full Details
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

// Stat Card Component
const StatCard = ({ title, value, color, icon: Icon }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.9 }}
		animate={{ opacity: 1, scale: 1 }}
		className="bg-white rounded-2xl p-5 border border-gray-100"
	>
		<div className="flex items-center gap-3">
			<div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
				<Icon className="w-5 h-5 text-white" />
			</div>
			<div>
				<p className="text-2xl font-bold text-gray-900">{value}</p>
				<p className="text-sm text-gray-500">{title}</p>
			</div>
		</div>
	</motion.div>
);

// Main Orders Page
const OrdersPage = () => {
	const [orders, setOrders] = useState(mockOrders);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const isLoading = false; // Replace with actual loading state

	// Calculate order stats
	const orderStats = useMemo(() => ({
		pending: orders.filter(o => o.status === 'Pending').length,
		processing: orders.filter(o => o.status === 'Processing').length,
		shipped: orders.filter(o => o.status === 'Shipped').length,
		delivered: orders.filter(o => o.status === 'Delivered').length,
	}), [orders]);

	// Filter orders
	const filteredOrders = useMemo(() => {
		return orders.filter(order => {
			const matchesSearch = 
				order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [orders, searchQuery, statusFilter]);

	const handleUpdateStatus = (orderId, newStatus) => {
		setOrders(prev => prev.map(order => 
			order.id === orderId ? { ...order, status: newStatus } : order
		));
		// TODO: Call API to update order status
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Customer Orders 📋</h1>
				<p className="text-gray-500 mt-1">Manage and fulfill customer orders</p>
			</div>

			{/* Stats Row */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard title="Pending" value={orderStats.pending} color="from-amber-500 to-orange-500" icon={FiClock} />
				<StatCard title="Processing" value={orderStats.processing} color="from-blue-500 to-indigo-500" icon={FiPackage} />
				<StatCard title="Shipped" value={orderStats.shipped} color="from-purple-500 to-pink-500" icon={FiTruck} />
				<StatCard title="Delivered" value={orderStats.delivered} color="from-emerald-500 to-teal-500" icon={FiCheck} />
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100">
				<div className="relative flex-1">
					<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search by order ID or customer..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					/>
				</div>
				<div className="flex items-center gap-2">
					<FiFilter className="text-gray-400 w-5 h-5" />
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					>
						<option value="all">All Status</option>
						<option value="Pending">Pending</option>
						<option value="Processing">Processing</option>
						<option value="Shipped">Shipped</option>
						<option value="Delivered">Delivered</option>
						<option value="Cancelled">Cancelled</option>
					</select>
				</div>
			</div>

			{/* Orders List */}
			{isLoading ? (
				<div className="flex justify-center py-20">
					<LoadingSpinner />
				</div>
			) : filteredOrders.length > 0 ? (
				<motion.div layout className="space-y-4">
					<AnimatePresence mode="popLayout">
						{filteredOrders.map(order => (
							<OrderCard 
								key={order.id}
								order={order}
								onUpdateStatus={handleUpdateStatus}
							/>
						))}
					</AnimatePresence>
				</motion.div>
			) : (
				<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
					<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<OrderIcon className="w-10 h-10 text-indigo-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
					<p className="text-gray-500">
						{searchQuery || statusFilter !== 'all' 
							? 'Try adjusting your filters'
							: 'Orders will appear here when customers make purchases'}
					</p>
				</div>
			)}
		</div>
	);
};

export default OrdersPage;
