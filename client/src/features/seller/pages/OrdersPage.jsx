import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderIcon } from '../../../shared/constants/icons.jsx';
import { Button, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { FiSearch, FiFilter, FiEye, FiPackage, FiTruck, FiCheck, FiX, FiClock } from 'react-icons/fi';
import OrderCard from '../components/OrderCard.jsx';
import StatCard from '../components/StatCard.jsx';
import { useSellerOrdersPage } from '../hooks/index.js';

const OrdersPage = () => {
	const {
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		orders,
		orderStats,
		error,
		handleUpdateStatus
	} = useSellerOrdersPage();

	if (error) {
		return (
			<div className="text-center py-20">
				<p className="text-rose-600 font-bold">Error loading orders. Please try again.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Customer Orders 📋</h1>
				<p className="text-gray-500 mt-1">Manage and fulfill customer orders</p>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard title="Pending" value={orderStats.pending} color="from-amber-500 to-orange-500" icon={FiClock} />
				<StatCard title="Processing" value={orderStats.processing} color="from-blue-500 to-indigo-500" icon={FiPackage} />
				<StatCard title="Shipped" value={orderStats.shipped} color="from-purple-500 to-pink-500" icon={FiTruck} />
				<StatCard title="Delivered" value={orderStats.delivered} color="from-emerald-500 to-teal-500" icon={FiCheck} />
			</div>

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
					<Select
						containerClassName="min-w-[170px]"
						label="Status"
						value={statusFilter}
						onChange={setStatusFilter}
						options={[
							{ value: 'all', label: 'All Status' },
							{ value: 'Pending', label: 'Pending' },
							{ value: 'Processing', label: 'Processing' },
							{ value: 'Shipped', label: 'Shipped' },
							{ value: 'Delivered', label: 'Delivered' },
							{ value: 'Cancelled', label: 'Cancelled' },
						]}
					/>
				</div>
			</div>

			{orders.length > 0 ? (
				<motion.div layout className="space-y-4">
					<AnimatePresence mode="popLayout">
						{orders.map(order => (
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
					<div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
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