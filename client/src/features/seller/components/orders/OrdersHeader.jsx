import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

const OrdersHeader = ({ isUpdating }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
		>
			<div>
				<h1 className="text-3xl font-black text-gray-900 tracking-tight">Customer Orders 📋</h1>
				<p className="text-gray-500 font-medium mt-1">Manage and fulfill customer orders</p>
			</div>
			{isUpdating && (
				<div className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
					<FiRefreshCw className="w-4 h-4 animate-spin" />
					Updating order...
				</div>
			)}
		</motion.div>
	);
};

export default OrdersHeader;
