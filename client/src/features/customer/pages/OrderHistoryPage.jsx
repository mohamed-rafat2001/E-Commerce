import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderHistoryHeader from '../components/OrderHistoryHeader.jsx';
import OrderCard from '../components/OrderCard.jsx';
import { OrderIcon } from '../../../shared/constants/icons.jsx';

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
			<OrderHistoryHeader 
				tabs={tabs} 
				activeTab={activeTab} 
				onTabChange={setActiveTab} 
			/>

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
						filteredOrders.map((order) => (
							<OrderCard key={order.id} order={order} />
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
