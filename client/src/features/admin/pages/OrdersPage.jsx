import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderIcon } from '../../../shared/constants/icons.jsx';
import { Button, Modal, Badge, LoadingSpinner } from '../../../shared/ui/index.js';
import { 
	FiSearch, 
	FiFilter, 
	FiEye, 
	FiTruck,
	FiPackage,
	FiCheck,
	FiClock,
	FiDollarSign,
	FiMapPin,
	FiUser,
	FiCalendar,
	FiChevronDown
} from 'react-icons/fi';
import { useAdminOrders } from '../hooks/index.js';

// Mock orders data
const mockOrders = [
	{
		_id: 'ORD-2024-001',
		userId: { firstName: 'John', lastName: 'Smith', email: 'john@example.com' },
		sellerId: { brand: 'TechStore' },
		items: [
			{ product: { name: 'Wireless Headphones' }, quantity: 2, price: { amount: 149.99 } },
			{ product: { name: 'Phone Case' }, quantity: 1, price: { amount: 29.99 } },
		],
		totalPrice: { amount: 329.97 },
		status: 'processing',
		paymentMethod: 'Credit Card',
		isPaid: true,
		paidAt: '2026-02-08',
		shippingAddress: { street: '123 Main St', city: 'New York', country: 'USA' },
		createdAt: '2026-02-08T10:30:00Z',
	},
	{
		_id: 'ORD-2024-002',
		userId: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' },
		sellerId: { brand: 'FashionHub' },
		items: [
			{ product: { name: 'Designer Dress' }, quantity: 1, price: { amount: 299.99 } },
		],
		totalPrice: { amount: 299.99 },
		status: 'shipped',
		paymentMethod: 'PayPal',
		isPaid: true,
		paidAt: '2026-02-07',
		shippingAddress: { street: '456 Oak Ave', city: 'Los Angeles', country: 'USA' },
		createdAt: '2026-02-07T15:45:00Z',
	},
	{
		_id: 'ORD-2024-003',
		userId: { firstName: 'Mike', lastName: 'Davis', email: 'mike@example.com' },
		sellerId: { brand: 'GadgetWorld' },
		items: [
			{ product: { name: 'Smart Watch' }, quantity: 1, price: { amount: 399.99 } },
			{ product: { name: 'Watch Band' }, quantity: 2, price: { amount: 24.99 } },
		],
		totalPrice: { amount: 449.97 },
		status: 'pending',
		paymentMethod: 'Credit Card',
		isPaid: false,
		shippingAddress: { street: '789 Pine Rd', city: 'Chicago', country: 'USA' },
		createdAt: '2026-02-09T08:15:00Z',
	},
	{
		_id: 'ORD-2024-004',
		userId: { firstName: 'Emily', lastName: 'Wilson', email: 'emily@example.com' },
		sellerId: { brand: 'HomeDecor' },
		items: [
			{ product: { name: 'Table Lamp' }, quantity: 2, price: { amount: 79.99 } },
			{ product: { name: 'Picture Frame Set' }, quantity: 1, price: { amount: 49.99 } },
		],
		totalPrice: { amount: 209.97 },
		status: 'delivered',
		paymentMethod: 'Stripe',
		isPaid: true,
		paidAt: '2026-02-05',
		deliveredAt: '2026-02-08',
		shippingAddress: { street: '321 Elm St', city: 'Miami', country: 'USA' },
		createdAt: '2026-02-05T12:00:00Z',
	},
	{
		_id: 'ORD-2024-005',
		userId: { firstName: 'Alex', lastName: 'Chen', email: 'alex@example.com' },
		sellerId: { brand: 'BookStore' },
		items: [
			{ product: { name: 'Programming Books Bundle' }, quantity: 1, price: { amount: 149.99 } },
		],
		totalPrice: { amount: 149.99 },
		status: 'cancelled',
		paymentMethod: 'Credit Card',
		isPaid: false,
		shippingAddress: { street: '555 Maple Dr', city: 'Seattle', country: 'USA' },
		createdAt: '2026-02-06T09:30:00Z',
	},
];

const statusConfig = {
	pending: { color: 'bg-gray-100 text-gray-700', icon: FiClock, label: 'Pending', gradient: 'from-gray-400 to-gray-500' },
	processing: { color: 'bg-blue-100 text-blue-700', icon: FiPackage, label: 'Processing', gradient: 'from-blue-400 to-blue-600' },
	shipped: { color: 'bg-indigo-100 text-indigo-700', icon: FiTruck, label: 'Shipped', gradient: 'from-indigo-400 to-indigo-600' },
	delivered: { color: 'bg-emerald-100 text-emerald-700', icon: FiCheck, label: 'Delivered', gradient: 'from-emerald-400 to-emerald-600' },
	cancelled: { color: 'bg-rose-100 text-rose-700', icon: FiClock, label: 'Cancelled', gradient: 'from-rose-400 to-rose-600' },
};

// Order Detail Modal
const OrderDetailModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
	if (!order) return null;

	const StatusIcon = statusConfig[order.status]?.icon || FiClock;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={`Order ${order._id}`} size="lg">
			<div className="space-y-6">
				{/* Order Status Timeline */}
				<div className={`bg-gradient-to-r ${statusConfig[order.status]?.gradient} p-4 rounded-xl text-white`}>
					<div className="flex items-center gap-3">
						<StatusIcon className="w-8 h-8" />
						<div>
							<h3 className="font-bold text-lg">{statusConfig[order.status]?.label}</h3>
							<p className="text-white/80 text-sm">Last updated: {new Date(order.createdAt).toLocaleString()}</p>
						</div>
					</div>
				</div>

				{/* Customer & Shipping Info */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gray-50 rounded-xl p-4">
						<h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<FiUser className="w-4 h-4" /> Customer
						</h4>
						<p className="font-medium">{order.userId?.firstName} {order.userId?.lastName}</p>
						<p className="text-sm text-gray-500">{order.userId?.email}</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-4">
						<h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<FiMapPin className="w-4 h-4" /> Shipping Address
						</h4>
						<p className="text-sm text-gray-600">
							{order.shippingAddress?.street}<br />
							{order.shippingAddress?.city}, {order.shippingAddress?.country}
						</p>
					</div>
				</div>

				{/* Order Items */}
				<div>
					<h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
					<div className="space-y-2">
						{order.items?.map((item, index) => (
							<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
										<FiPackage className="w-5 h-5 text-gray-500" />
									</div>
									<div>
										<p className="font-medium text-gray-900">{item.product?.name}</p>
										<p className="text-sm text-gray-500">Qty: {item.quantity}</p>
									</div>
								</div>
								<span className="font-semibold text-gray-900">${(item.price?.amount * item.quantity).toFixed(2)}</span>
							</div>
						))}
					</div>
				</div>

				{/* Payment Info */}
				<div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
					<div>
						<p className="text-sm text-gray-500">Payment Method</p>
						<p className="font-semibold text-gray-900">{order.paymentMethod}</p>
					</div>
					<div className="text-right">
						<p className="text-sm text-gray-500">Total Amount</p>
						<p className="text-2xl font-bold text-emerald-600">${order.totalPrice?.amount?.toFixed(2)}</p>
					</div>
				</div>

				{/* Status Update Buttons */}
				{order.status !== 'delivered' && order.status !== 'cancelled' && (
					<div className="flex gap-3 pt-4 border-t border-gray-100">
						<Button variant="secondary" onClick={onClose} fullWidth>
							Close
						</Button>
						{order.status === 'pending' && (
							<Button onClick={() => onUpdateStatus(order._id, 'processing')} fullWidth icon={<FiPackage className="w-4 h-4" />}>
								Start Processing
							</Button>
						)}
						{order.status === 'processing' && (
							<Button onClick={() => onUpdateStatus(order._id, 'shipped')} fullWidth icon={<FiTruck className="w-4 h-4" />}>
								Mark as Shipped
							</Button>
						)}
						{order.status === 'shipped' && (
							<Button onClick={() => onUpdateStatus(order._id, 'delivered')} fullWidth icon={<FiCheck className="w-4 h-4" />}>
								Mark as Delivered
							</Button>
						)}
					</div>
				)}
			</div>
		</Modal>
	);
};

// Order Row Component
const OrderRow = ({ order, onView, isExpanded, onToggleExpand }) => {
	const StatusIcon = statusConfig[order.status]?.icon || FiClock;

	return (
		<>
			<motion.tr
				layout
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
				onClick={() => onToggleExpand(order._id)}
			>
				<td className="py-4 px-6">
					<div className="flex items-center gap-2">
						<motion.div
							animate={{ rotate: isExpanded ? 180 : 0 }}
							transition={{ duration: 0.2 }}
						>
							<FiChevronDown className="w-4 h-4 text-gray-400" />
						</motion.div>
						<span className="font-semibold text-gray-900">{order._id}</span>
					</div>
				</td>
				<td className="py-4 px-6">
					<div>
						<p className="font-medium text-gray-900">{order.userId?.firstName} {order.userId?.lastName}</p>
						<p className="text-sm text-gray-500">{order.userId?.email}</p>
					</div>
				</td>
				<td className="py-4 px-6">
					<span className="text-gray-600">{order.items?.length || 0} items</span>
				</td>
				<td className="py-4 px-6">
					<span className="font-bold text-emerald-600">${order.totalPrice?.amount?.toFixed(2)}</span>
				</td>
				<td className="py-4 px-6">
					<span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[order.status]?.color}`}>
						<StatusIcon className="w-3.5 h-3.5" />
						{statusConfig[order.status]?.label}
					</span>
				</td>
				<td className="py-4 px-6">
					<span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
						{order.isPaid ? 'Paid' : 'Unpaid'}
					</span>
				</td>
				<td className="py-4 px-6">
					<span className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
				</td>
				<td className="py-4 px-6">
					<button
						onClick={(e) => { e.stopPropagation(); onView(order); }}
						className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600"
						title="View details"
					>
						<FiEye className="w-4 h-4" />
					</button>
				</td>
			</motion.tr>
			<AnimatePresence>
				{isExpanded && (
					<motion.tr
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
					>
						<td colSpan={8} className="bg-gray-50/50 px-6 py-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<h5 className="text-sm font-semibold text-gray-500 mb-2">Items</h5>
									{order.items?.map((item, idx) => (
										<div key={idx} className="text-sm text-gray-700">
											{item.quantity}x {item.product?.name}
										</div>
									))}
								</div>
								<div>
									<h5 className="text-sm font-semibold text-gray-500 mb-2">Shipping</h5>
									<p className="text-sm text-gray-700">
										{order.shippingAddress?.street}<br />
										{order.shippingAddress?.city}, {order.shippingAddress?.country}
									</p>
								</div>
								<div>
									<h5 className="text-sm font-semibold text-gray-500 mb-2">Payment</h5>
									<p className="text-sm text-gray-700">{order.paymentMethod}</p>
									{order.isPaid && <p className="text-sm text-emerald-600">Paid on {order.paidAt}</p>}
								</div>
							</div>
						</td>
					</motion.tr>
				)}
			</AnimatePresence>
		</>
	);
};

// Stats Card
const StatsCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-5 border border-gray-100"
	>
		<div className="flex items-center justify-between">
			<div>
				<h4 className="text-2xl font-bold text-gray-900">{value}</h4>
				<p className="text-sm text-gray-500">{title}</p>
				{subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
			</div>
			<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
				<Icon className="w-6 h-6 text-white" />
			</div>
		</div>
	</motion.div>
);

// Main Orders Page
const OrdersPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [paymentFilter, setPaymentFilter] = useState('all');
	const [viewingOrder, setViewingOrder] = useState(null);
	const [expandedId, setExpandedId] = useState(null);
	
	// Real hook
	const { orders: fetchedOrders, isLoading: isOrdersLoading } = useAdminOrders();
	
	// Fallback to mock data
	const orders = fetchedOrders?.length > 0 ? fetchedOrders : mockOrders;
	const isLoading = isOrdersLoading;

	// Calculate stats
	const stats = useMemo(() => ({
		total: orders.length,
		pending: orders.filter(o => o.status === 'pending').length,
		processing: orders.filter(o => o.status === 'processing').length,
		revenue: orders.filter(o => o.isPaid).reduce((sum, o) => sum + (o.totalPrice?.amount || 0), 0),
	}), [orders]);

	// Filter orders
	const filteredOrders = useMemo(() => {
		return orders.filter(order => {
			const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				`${order.userId?.firstName} ${order.userId?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
			const matchesPayment = paymentFilter === 'all' || 
				(paymentFilter === 'paid' && order.isPaid) ||
				(paymentFilter === 'unpaid' && !order.isPaid);
			return matchesSearch && matchesStatus && matchesPayment;
		});
	}, [orders, searchQuery, statusFilter, paymentFilter]);

	const handleView = (order) => {
		setViewingOrder(order);
	};

	const handleToggleExpand = (id) => {
		setExpandedId(expandedId === id ? null : id);
	};

	const handleUpdateStatus = (orderId, newStatus) => {
		setOrders(prev => prev.map(order => 
			order._id === orderId ? { ...order, status: newStatus } : order
		));
		setViewingOrder(null);
		// TODO: Call API
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Order Management 📋</h1>
				<p className="text-gray-500 mt-1">Track and manage all platform orders</p>
			</div>

			{/* Stats Row */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard title="Total Orders" value={stats.total} icon={OrderIcon} gradient="from-indigo-500 to-purple-600" />
				<StatsCard title="Pending" value={stats.pending} icon={FiClock} gradient="from-amber-500 to-orange-500" subtitle="Needs attention" />
				<StatsCard title="Processing" value={stats.processing} icon={FiPackage} gradient="from-blue-500 to-indigo-600" />
				<StatsCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={FiDollarSign} gradient="from-emerald-500 to-teal-600" />
			</div>

			{/* Filters */}
			<div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100">
				<div className="relative flex-1">
					<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search by order ID, customer name or email..."
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
						<option value="pending">Pending</option>
						<option value="processing">Processing</option>
						<option value="shipped">Shipped</option>
						<option value="delivered">Delivered</option>
						<option value="cancelled">Cancelled</option>
					</select>
					<select
						value={paymentFilter}
						onChange={(e) => setPaymentFilter(e.target.value)}
						className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					>
						<option value="all">All Payments</option>
						<option value="paid">Paid</option>
						<option value="unpaid">Unpaid</option>
					</select>
				</div>
			</div>

			{/* Orders Table */}
			{isLoading ? (
				<div className="flex justify-center py-20">
					<LoadingSpinner />
				</div>
			) : filteredOrders.length > 0 ? (
				<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Order ID</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Customer</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Items</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Total</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Payment</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Date</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Actions</th>
								</tr>
							</thead>
							<tbody>
								<AnimatePresence mode="popLayout">
									{filteredOrders.map(order => (
										<OrderRow 
											key={order._id}
											order={order}
											onView={handleView}
											isExpanded={expandedId === order._id}
											onToggleExpand={handleToggleExpand}
										/>
									))}
								</AnimatePresence>
							</tbody>
						</table>
					</div>
				</div>
			) : (
				<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
					<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<OrderIcon className="w-10 h-10 text-indigo-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
					<p className="text-gray-500">Try adjusting your search or filters</p>
				</div>
			)}

			{/* Order Detail Modal */}
			<OrderDetailModal
				isOpen={!!viewingOrder}
				onClose={() => setViewingOrder(null)}
				order={viewingOrder}
				onUpdateStatus={handleUpdateStatus}
			/>
		</div>
	);
};

export default OrdersPage;
