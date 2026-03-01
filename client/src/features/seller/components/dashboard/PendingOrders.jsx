import { motion } from 'framer-motion';
import { Badge } from '../../../../shared/ui/index.js';
import { FiShoppingBag, FiCalendar, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PendingOrders = ({ orders = [] }) => {
	const hasOrders = orders && orders.length > 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3, type: 'spring', bounce: 0.2 }}
			className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col"
			style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}
		>
			{/* Header */}
			<div className="px-6 pt-5 pb-4 border-b border-gray-100/80 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200/50">
						<FiShoppingBag className="w-4 h-4 text-white" />
					</div>
					<h3 className="font-bold text-gray-900 text-sm">Pending Orders</h3>
				</div>
				<Badge variant="warning" size="sm">
					{hasOrders ? orders.length : 0} New
				</Badge>
			</div>

			{/* Content */}
			<div className="flex-1 p-4 space-y-3">
				{hasOrders ? (
					orders.map((order, index) => (
						<motion.div
							key={order._id || order.id}
							className="p-4 rounded-xl bg-gray-50/80 hover:bg-indigo-50/50
								transition-all duration-200 border border-gray-100 hover:border-indigo-200 cursor-pointer group"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 + index * 0.05 }}
						>
							<div className="flex items-center justify-between mb-3">
								<span className="font-mono text-xs text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100 font-bold">
									#{order._id?.slice(-6) || order.id?.slice(-6) || 'N/A'}
								</span>
								<Badge variant={order.status === 'pending' ? 'warning' : 'info'} size="sm">
									{order.status || 'Pending'}
								</Badge>
							</div>
							<p className="font-bold text-gray-900 text-sm mb-2">
								{order.customer?.name || order.customer || 'Customer Name'}
							</p>
							<div className="grid grid-cols-2 gap-3 text-xs">
								<div className="flex items-center gap-1.5">
									<FiDollarSign className="w-3.5 h-3.5 text-emerald-500" />
									<span className="font-bold text-gray-800">
										${order.totalPrice?.toFixed(2) || order.amount?.toFixed(2) || '0.00'}
									</span>
								</div>
								<div className="flex items-center gap-1.5">
									<FiCalendar className="w-3.5 h-3.5 text-indigo-500" />
									<span className="text-gray-500 font-medium">
										{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
									</span>
								</div>
							</div>
						</motion.div>
					))
				) : (
					<div className="text-center py-10">
						<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
							<FiShoppingBag className="w-7 h-7 text-indigo-400" />
						</div>
						<p className="text-gray-900 font-bold text-sm">No pending orders</p>
						<p className="text-xs text-gray-400 mt-1 font-medium">All orders are fulfilled</p>
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="px-4 pb-4">
				<Link 
					to="/seller/orders"
					className="flex items-center justify-center gap-2 w-full py-3 text-center text-indigo-600 font-bold text-xs
						rounded-xl border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300
						transition-all duration-200 group uppercase tracking-wider"
				>
					View All Orders
					<FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
				</Link>
			</div>
		</motion.div>
	);
};

export default PendingOrders;
