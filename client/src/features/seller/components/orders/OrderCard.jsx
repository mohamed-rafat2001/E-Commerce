import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, LoadingSpinner } from '../../../../shared/ui/index.js';
import { FiEye, FiPackage, FiTruck, FiCheck, FiX, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Status configuration
const statusConfig = {
	Pending: { 
		color: 'bg-amber-100 text-amber-700 border-amber-200', 
		icon: FiClock,
		gradient: 'from-amber-500 to-orange-500'
	},
	Processing: { 
		color: 'bg-blue-100 text-blue-700 border-blue-200', 
		icon: FiPackage,
		gradient: 'from-blue-500 to-indigo-500'
	},
	Shipped: { 
		color: 'bg-purple-100 text-purple-700 border-purple-200', 
		icon: FiTruck,
		gradient: 'from-purple-500 to-pink-500'
	},
	Delivered: { 
		color: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
		icon: FiCheck,
		gradient: 'from-emerald-500 to-teal-500'
	},
	Cancelled: { 
		color: 'bg-rose-100 text-rose-700 border-rose-200', 
		icon: FiX,
		gradient: 'from-rose-500 to-red-500'
	},
};

const OrderCard = ({ order, onUpdateStatus }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const StatusIcon = statusConfig[order.status]?.icon || FiClock;

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
		>
			<div 
				className="p-6 cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className={`w-12 h-12 rounded-xl bg-linear-to-br ${statusConfig[order.status]?.gradient} flex items-center justify-center`}>
							<StatusIcon className="w-6 h-6 text-white" />
						</div>
						<div>
							<h3 className="font-bold text-gray-900">{order.id}</h3>
							<p className="text-sm text-gray-500">{order.customer.name} • {new Date(order.date).toLocaleDateString()}</p>
						</div>
					</div>
					
					<div className="flex items-center gap-4">
						<div className="text-right">
							<p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
							<p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
						</div>
						<span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${statusConfig[order.status]?.color}`}>
							<StatusIcon className="w-4 h-4" />
							{order.status}
						</span>
						<button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
							{isExpanded ? <FiChevronUp className="w-5 h-5 text-gray-400" /> : <FiChevronDown className="w-5 h-5 text-gray-400" />}
						</button>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="px-6 pb-6 border-t border-gray-100 pt-4">
							<div className="mb-6">
								<h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
								<div className="flex items-center gap-4 text-gray-600">
									<span>{order.customer.name}</span>
									<span className="text-gray-300">•</span>
									<span>{order.customer.email}</span>
								</div>
							</div>

							<div className="mb-6">
								<h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
								<div className="space-y-3">
									{order.items.map((item, index) => (
										<div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
													<FiPackage className="w-5 h-5 text-gray-400" />
												</div>
												<div>
													<p className="font-medium text-gray-900">{item.name}</p>
													<p className="text-sm text-gray-500">Qty: {item.quantity}</p>
												</div>
											</div>
											<span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
										</div>
									))}
								</div>
							</div>

							<div className="flex justify-end gap-3">
								{order.status !== 'Delivered' && order.status !== 'Cancelled' && (
									<>
										{order.status === 'Pending' && (
											<Button 
												onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'Processing'); }}
												className="bg-blue-600 hover:bg-blue-700 text-white"
											>
												Mark as Processing
											</Button>
										)}
										{order.status === 'Processing' && (
											<Button 
												onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'Shipped'); }}
												className="bg-purple-600 hover:bg-purple-700 text-white"
											>
												Mark as Shipped
											</Button>
										)}
										{order.status === 'Shipped' && (
											<Button 
												onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'Delivered'); }}
												className="bg-emerald-600 hover:bg-emerald-700 text-white"
											>
												Mark as Delivered
											</Button>
										)}
										<Button 
											onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'Cancelled'); }}
											variant="outline"
											className="text-rose-600 border-rose-200 hover:bg-rose-50"
										>
											Cancel Order
										</Button>
									</>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default OrderCard;
