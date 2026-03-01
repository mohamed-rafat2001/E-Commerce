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
			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100"
				style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
			>
				<div className="relative">
					<LoadingSpinner size="lg" color="indigo" />
					<div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl opacity-30 animate-pulse" />
				</div>
				<p className="mt-6 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">Fetching Orders...</p>
			</motion.div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
				<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<OrderIcon className="w-10 h-10 text-indigo-500" />
				</div>
				<h3 className="text-xl font-black text-gray-900 mb-2">No orders found</h3>
				<p className="text-gray-500 max-w-sm mx-auto font-medium">
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
