import { useState } from 'react';
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
			className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
			style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}
		>
			<div 
				className="p-6 cursor-pointer group hover:bg-gray-50/50 transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusConfig[order.status]?.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
							<StatusIcon className="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">#{order.id?.slice(-8).toUpperCase()}</h3>
							<p className="text-sm text-gray-500 font-medium">{order.customer.name} • {new Date(order.date).toLocaleDateString()}</p>
						</div>
					</div>
					
					<div className="flex items-center gap-6">
						<div className="text-right">
							<p className="text-2xl font-black text-gray-900 tabular-nums">${order.total.toFixed(2)}</p>
							<p className="text-xs font-bold text-gray-400 tracking-wider uppercase">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
						</div>
						<span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${statusConfig[order.status]?.color}`}>
							<StatusIcon className="w-3.5 h-3.5" />
							{order.status}
						</span>
						<button className="p-2.5 hover:bg-white border hover:border-gray-200 border-transparent rounded-xl transition-all shadow-sm hover:shadow-md">
							{isExpanded ? <FiChevronUp className="w-5 h-5 text-gray-500" /> : <FiChevronDown className="w-5 h-5 text-gray-400" />}
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

							<div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
								{order.status !== 'Delivered' && order.status !== 'Cancelled' && (
									<>
										{order.status === 'Pending' && (
											<Button 
												onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'Processing'); }}
												className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-200"
											>
												Mark as Processing
											</Button>
										)}
										{order.status === 'Processing' && (
											<Button 
												onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'Shipped'); }}
												className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-200"
											>
												Mark as Shipped
											</Button>
										)}
										{order.status === 'Shipped' && (
											<Button 
												onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'Delivered'); }}
												className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200"
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
