import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, Button, Input } from '../../shared/ui/index.js';
import { OrderIcon } from '../../shared/constants/icons.jsx';

const orders = [
	{
		id: 'ORD-2024-001',
		date: 'Feb 4, 2026',
		items: [
			{ name: 'Wireless Headphones', price: '$299', image: '🎧', qty: 1 },
			{ name: 'Laptop Stand', price: '$79', image: '💻', qty: 1 },
		],
		total: '$378.00',
		status: 'Processing',
		statusColor: 'warning',
	},
	{
		id: 'ORD-2024-002',
		date: 'Jan 28, 2026',
		items: [
			{ name: 'Smart Watch Pro', price: '$399', image: '⌚', qty: 1 },
		],
		total: '$399.00',
		status: 'Shipped',
		statusColor: 'info',
	},
	{
		id: 'ORD-2024-003',
		date: 'Jan 15, 2026',
		items: [
			{ name: 'Mechanical Keyboard', price: '$159', image: '⌨️', qty: 1 },
			{ name: 'Mouse Pad', price: '$29', image: '🖱️', qty: 2 },
		],
		total: '$217.00',
		status: 'Delivered',
		statusColor: 'success',
	},
];

const OrderHistoryPage = () => {
	const [activeTab, setActiveTab] = useState('All');
	const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

	const filteredOrders = activeTab === 'All' 
		? orders 
		: orders.filter(order => order.status === activeTab);

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col gap-4"
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Order History</h1>
					<p className="text-gray-500">Track and view your previous orders</p>
				</div>
				
				{/* Search & Tabs */}
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
					<div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto max-w-full no-scrollbar">
						{tabs.map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
									${activeTab === tab 
										? 'bg-white text-indigo-600 shadow-sm' 
										: 'text-gray-500 hover:text-gray-700'}`}
							>
								{tab}
							</button>
						))}
					</div>
					<div className="w-full sm:w-auto">
						<Input placeholder="Search orders..." icon="🔍" className="min-w-[250px]" />
					</div>
				</div>
			</motion.div>

			{/* Orders List */}
			<AnimatePresence mode="wait">
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.2 }}
					className="space-y-4"
				>
					{filteredOrders.length > 0 ? (
						filteredOrders.map((order, index) => (
							<Card key={order.id} variant="elevated" className="overflow-hidden">
								<div className="flex flex-col md:flex-row gap-6">
									{/* Order Info */}
									<div className="flex-1 space-y-4">
										<div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
											<div className="flex items-center gap-3">
												<div className={`p-2 rounded-lg bg-${order.statusColor === 'warning' ? 'orange' : order.statusColor === 'info' ? 'blue' : 'green'}-50`}>
													<OrderIcon className={`w-5 h-5 text-${order.statusColor === 'warning' ? 'orange' : order.statusColor === 'info' ? 'blue' : 'green'}-600`} />
												</div>
												<div>
													<p className="font-bold text-gray-900">{order.id}</p>
													<p className="text-xs text-gray-500">{order.date}</p>
												</div>
											</div>
											<Badge variant={order.statusColor}>{order.status}</Badge>
										</div>

										<div className="space-y-3">
											{order.items.map((item, i) => (
												<div key={i} className="flex items-center gap-4">
													<div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">
														{item.image}
													</div>
													<div className="flex-1">
														<p className="font-medium text-gray-900">{item.name}</p>
														<p className="text-sm text-gray-500">Qty: {item.qty} × {item.price}</p>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Total & Actions */}
									<div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 gap-4">
										<div>
											<p className="text-sm text-gray-500">Total Amount</p>
											<p className="text-2xl font-bold text-gray-900">{order.total}</p>
										</div>
										<div className="space-y-2">
											<Button variant="primary" fullWidth size="sm">
												Track Order
											</Button>
											<Button variant="outline" fullWidth size="sm">
												View Invoice
											</Button>
										</div>
									</div>
								</div>
							</Card>
						))
					) : (
						<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
							<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
								<OrderIcon className="w-8 h-8 text-gray-400" />
							</div>
							<h3 className="text-lg font-bold text-gray-900">No orders found</h3>
							<p className="text-gray-500">There are no orders in this category</p>
						</div>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default OrderHistoryPage;
