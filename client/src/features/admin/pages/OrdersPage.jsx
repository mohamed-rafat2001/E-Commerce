import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderIcon } from '../../../shared/constants/icons.jsx';
import { Button, Modal, Badge, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { 
	FiSearch, 
	FiFilter, 
	FiEye, 
	FiTruck,
	FiPackage,
	FiCheck,
	FiClock,
	FiDollarSign,
	FiMapPin,
	FiUser,
	FiCalendar,
	FiChevronDown,
	FiXCircle,
	FiCreditCard
} from 'react-icons/fi';
import { useAdminOrders } from '../hooks/index.js';

const statusConfig = {
	pending: { color: 'secondary', icon: FiClock, label: 'Pending', gradient: 'from-gray-500 to-gray-600' },
	processing: { color: 'primary', icon: FiPackage, label: 'Processing', gradient: 'from-blue-500 to-indigo-600' },
	shipped: { color: 'warning', icon: FiTruck, label: 'Shipped', gradient: 'from-amber-500 to-orange-600' },
	delivered: { color: 'success', icon: FiCheck, label: 'Delivered', gradient: 'from-emerald-500 to-teal-600' },
	cancelled: { color: 'danger', icon: FiXCircle, label: 'Cancelled', gradient: 'from-rose-500 to-pink-600' },
};

// Order Row Component
const OrderRow = ({ order, onView, isExpanded, onToggleExpand }) => {
	return (
		<>
			<motion.tr
				layout
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer group/row"
				onClick={() => onToggleExpand(order._id)}
			>
				<td className="py-3 px-4 whitespace-nowrap">
					<div className="flex items-center gap-2">
						<motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
							<FiChevronDown className="w-3.5 h-3.5 text-slate-300" />
						</motion.div>
						<span className="font-black text-indigo-600 text-[10px] tracking-tight border-b border-indigo-100">{order._id}</span>
					</div>
				</td>
				<td className="py-3 px-3 whitespace-nowrap">
					<div>
						<p className="font-black text-gray-900 text-[10px] uppercase truncate max-w-[100px]">{order.userId?.firstName} {order.userId?.lastName}</p>
						<p className="text-[9px] text-gray-400 font-bold lowercase truncate max-w-[100px]">{order.userId?.email}</p>
					</div>
				</td>
				<td className="py-3 px-3 whitespace-nowrap text-center">
					<span className="text-gray-500 font-black text-[9px] uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded-lg border border-slate-200">
						{order.items?.length || 0}
					</span>
				</td>
				<td className="py-3 px-3 whitespace-nowrap">
					<span className="font-black text-gray-900 text-xs tabular-nums tracking-tight">${order.totalPrice?.amount?.toFixed(2)}</span>
				</td>
				<td className="py-3 px-3 whitespace-nowrap">
					<Badge variant={statusConfig[order.status]?.color} size="sm" dot className="text-[9px] py-0.5 px-2">
						{statusConfig[order.status]?.label}
					</Badge>
				</td>
				<td className="py-3 px-3 whitespace-nowrap">
					<div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${order.isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
						{order.isPaid ? 'Paid' : 'Unpaid'}
					</div>
				</td>
				<td className="py-3 px-3 whitespace-nowrap">
					<span className="text-gray-400 text-[10px] font-bold tabular-nums italic">{new Date(order.createdAt).toLocaleDateString()}</span>
				</td>
				<td className="py-3 px-4 whitespace-nowrap text-right">
					<button
						onClick={(e) => { e.stopPropagation(); onView(order); }}
						className="p-2 bg-white hover:bg-slate-50 rounded-lg transition-all text-indigo-500 opacity-0 group-hover/row:opacity-100 shadow-sm border border-slate-100"
					>
						<FiEye className="w-3.5 h-3.5" />
					</button>
				</td>
			</motion.tr>
			<AnimatePresence>
				{isExpanded && (
					<motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-slate-50/30">
						<td colSpan={8} className="px-5 py-4">
							<div className="grid grid-cols-3 gap-6">
								<div className="space-y-2">
									<h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Items</h5>
									<div className="space-y-1">
										{order.items?.map((item, idx) => (
											<div key={idx} className="flex justify-between text-[10px] bg-white p-2 rounded-lg border border-slate-100">
												<span className="font-bold text-gray-700 truncate max-w-[120px]">{item.product?.name}</span>
												<span className="font-black">x{item.quantity}</span>
											</div>
										))}
									</div>
								</div>
								<div className="space-y-2">
									<h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Address</h5>
									<div className="bg-white p-2 rounded-lg border border-slate-100 text-[10px] font-bold text-gray-600 leading-normal">
										{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
									</div>
								</div>
								<div className="space-y-2">
									<h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Payment</h5>
									<div className="bg-white p-2 rounded-lg border border-slate-100 text-[10px] font-black text-gray-900 uppercase">
										{order.paymentMethod}
									</div>
								</div>
							</div>
						</td>
					</motion.tr>
				)}
			</AnimatePresence>
		</>
	);
};

const OrdersPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [paymentFilter, setPaymentFilter] = useState('all');
	const [viewingOrder, setViewingOrder] = useState(null);
	const [expandedId, setExpandedId] = useState(null);
	
	const { orders: allOrders, isLoading } = useAdminOrders();
	const orders = allOrders || [];

	const filteredOrders = useMemo(() => {
		return orders.filter(o => {
			const matchesSearch = o._id.toLowerCase().includes(searchQuery.toLowerCase()) || `${o.userId?.firstName} ${o.userId?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
			const matchesPayment = paymentFilter === 'all' || (paymentFilter === 'paid' && o.isPaid) || (paymentFilter === 'unpaid' && !o.isPaid);
			return matchesSearch && matchesStatus && matchesPayment;
		});
	}, [orders, searchQuery, statusFilter, paymentFilter]);

	return (
		<div className="space-y-8 pb-10">
			<div>
				<h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Ledgers</h1>
				<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Transaction Monitoring</p>
			</div>

			<div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/50 space-y-5">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="relative flex-1 group">
						<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 w-4 h-4 transition-colors" />
						<input
							type="text"
							placeholder="Search by ID, customer..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-slate-50 focus:bg-white focus:ring-[4px] focus:ring-indigo-50 transition-all outline-none font-bold text-xs"
						/>
					</div>
					<div className="flex gap-3">
						<Select containerClassName="min-w-[150px]" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'processing', label: 'Processing' }, { value: 'shipped', label: 'Shipped' }, { value: 'delivered', label: 'Delivered' }]} />
						<Select containerClassName="min-w-[150px]" value={paymentFilter} onChange={setPaymentFilter} options={[{ value: 'all', label: 'All Clearing' }, { value: 'paid', label: 'Paid' }, { value: 'unpaid', label: 'Unpaid' }]} />
					</div>
				</div>

				<div className="overflow-x-auto rounded-2xl border border-slate-50 custom-scrollbar">
					<table className="w-full text-left">
						<thead>
							<tr className="bg-slate-50/50 border-b border-slate-100">
								<th className="py-4 px-4 font-black text-slate-400 uppercase text-[9px] tracking-widest whitespace-nowrap">Order ID</th>
								<th className="py-4 px-3 font-black text-slate-400 uppercase text-[9px] tracking-widest whitespace-nowrap">Customer</th>
								<th className="py-4 px-3 font-black text-slate-400 uppercase text-[9px] tracking-widest whitespace-nowrap text-center">Items</th>
								<th className="py-4 px-3 font-black text-slate-400 uppercase text-[9px] tracking-widest whitespace-nowrap">Total</th>
								<th className="py-4 px-3 font-black text-slate-400 uppercase text-[9px] tracking-widest whitespace-nowrap">Workflow</th>
								<th className="py-4 px-3 font-black text-slate-400 uppercase text-[9px] tracking-widest whitespace-nowrap">Clearing</th>
								<th className="py-4 px-3 font-black text-slate-400 uppercase text-[9px] tracking-widest whitespace-nowrap">Date</th>
								<th className="py-4 px-4 font-black text-slate-400 uppercase text-[9px] tracking-widest whitespace-nowrap text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-50">
							{isLoading ? (
								<tr><td colSpan={8} className="py-20 text-center"><LoadingSpinner size="sm" color="indigo" /></td></tr>
							) : filteredOrders.map(o => (
								<OrderRow key={o._id} order={o} onView={setViewingOrder} isExpanded={expandedId === o._id} onToggleExpand={setExpandedId} />
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default OrdersPage;
