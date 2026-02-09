import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import { statusConfig } from './orderConstants.js';
import OrderStatusSelector from './OrderStatusSelector.jsx';

const OrderRow = ({ order, onView, onUpdateStatus, isUpdating }) => {
	return (
		<motion.tr
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
		>
			<td className="py-3.5 px-4 whitespace-nowrap">
				<span className="text-xs font-mono font-semibold text-indigo-600">{order._id?.slice(-8)}</span>
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap">
				<div className="min-w-0">
					<p className="text-sm font-semibold text-gray-900 truncate max-w-[130px]">{order.userId?.firstName} {order.userId?.lastName}</p>
					<p className="text-xs text-gray-400 truncate max-w-[130px]">{order.userId?.email}</p>
				</div>
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap text-center">
				<span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
					{order.items?.length || 0}
				</span>
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap">
				<span className="text-sm font-bold text-gray-900 tabular-nums">${order.totalPrice?.amount?.toFixed(2) || '0.00'}</span>
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap">
				<OrderStatusSelector 
					value={order.status} 
					onChange={(newStatus) => onUpdateStatus(order._id, newStatus)}
					disabled={isUpdating}
				/>
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap">
				<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${order.isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
					<span className={`w-1.5 h-1.5 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
					{order.isPaid ? 'Paid' : 'Unpaid'}
				</span>
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap">
				<span className="text-sm text-gray-500 font-medium">
					{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
				</span>
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap text-right">
				<button
					onClick={() => onView(order)}
					className="p-2 bg-white hover:bg-indigo-50 text-indigo-500 rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md opacity-60 group-hover:opacity-100"
					title="View details"
				>
					<FiEye className="w-3.5 h-3.5" />
				</button>
			</td>
		</motion.tr>
	);
};

export default OrderRow;
