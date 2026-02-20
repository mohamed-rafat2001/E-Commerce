import { motion, AnimatePresence } from 'framer-motion';
import { OrderIcon } from '../../../shared/constants/icons.jsx';
import { Button, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { FiSearch, FiFilter, FiPackage, FiTruck, FiCheck, FiClock, FiRefreshCw } from 'react-icons/fi';
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
		isLoading,
		isUpdating,
		handleUpdateStatus
	} = useSellerOrdersPage();

	if (error) {
		return (
			<div className="text-center py-20">
				<div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
					<OrderIcon className="w-10 h-10 text-rose-400" />
				</div>
				<h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Orders</h3>
				<p className="text-rose-600 font-medium mb-4">Unable to fetch your orders. Please try again.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
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

			{/* Stats Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0 }}
					className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
				>
					<div className="flex items-center justify-between mb-2">
						<div>
							<p className="text-gray-500 text-sm font-medium">Pending</p>
							<h3 className="text-2xl font-bold text-gray-900 mt-1">{orderStats.pending}</h3>
						</div>
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
							<FiClock className="w-5 h-5 text-white" />
						</div>
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
				>
					<div className="flex items-center justify-between mb-2">
						<div>
							<p className="text-gray-500 text-sm font-medium">Processing</p>
							<h3 className="text-2xl font-bold text-gray-900 mt-1">{orderStats.processing}</h3>
						</div>
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
							<FiPackage className="w-5 h-5 text-white" />
						</div>
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
				>
					<div className="flex items-center justify-between mb-2">
						<div>
							<p className="text-gray-500 text-sm font-medium">Shipped</p>
							<h3 className="text-2xl font-bold text-gray-900 mt-1">{orderStats.shipped}</h3>
						</div>
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
							<FiTruck className="w-5 h-5 text-white" />
						</div>
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
				>
					<div className="flex items-center justify-between mb-2">
						<div>
							<p className="text-gray-500 text-sm font-medium">Delivered</p>
							<h3 className="text-2xl font-bold text-gray-900 mt-1">{orderStats.delivered}</h3>
						</div>
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
							<FiCheck className="w-5 h-5 text-white" />
						</div>
					</div>
				</motion.div>
			</div>

			{/* Search & Filter */}
			<div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
				<div className="relative flex-1">
					<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search by order ID or customer..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-medium"
					/>
				</div>
				<div className="flex items-center gap-2">
					<FiFilter className="text-gray-400 w-5 h-5 flex-shrink-0" />
					<Select
						containerClassName="min-w-[180px]"
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

			{/* Orders List */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
					<LoadingSpinner size="lg" color="indigo" />
					<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Fetching Orders...</p>
				</div>
			) : orders.length > 0 ? (
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
					<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<OrderIcon className="w-10 h-10 text-indigo-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
					<p className="text-gray-500 max-w-sm mx-auto">
						{searchQuery || statusFilter !== 'all' 
							? 'Try adjusting your search or filters'
							: 'Orders will appear here when customers make purchases'}
					</p>
				</div>
			)}
		</div>
	);
};

export default OrdersPage;