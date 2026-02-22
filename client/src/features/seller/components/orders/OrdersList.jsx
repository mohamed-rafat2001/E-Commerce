import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../../../../shared/ui/index.js';
import { OrderIcon } from '../../../../shared/constants/icons.jsx';
import OrderCard from './OrderCard.jsx';

const OrdersList = ({ 
	isLoading, 
	orders, 
	searchQuery, 
	statusFilter, 
	onUpdateStatus 
}) => {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
				<LoadingSpinner size="lg" color="indigo" />
				<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Fetching Orders...</p>
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
				<div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<OrderIcon className="w-10 h-10 text-indigo-500" />
				</div>
				<h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
				<p className="text-gray-500 max-w-sm mx-auto">
					{searchQuery || statusFilter !== 'all' 
						? 'Try adjusting your search or filters'
						: 'Orders will appear here when customers make purchases'}
				</p>
			</div>
		);
	}

	return (
		<motion.div layout className="space-y-4">
			<AnimatePresence mode="popLayout">
				{orders.map(order => (
					<OrderCard 
						key={order.id}
						order={order}
						onUpdateStatus={onUpdateStatus}
					/>
				))}
			</AnimatePresence>
		</motion.div>
	);
};

export default OrdersList;
