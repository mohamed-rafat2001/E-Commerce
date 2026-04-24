import { motion } from 'framer-motion';
import { FiCheck, FiPackage, FiTruck, FiHome, FiXCircle, FiClock } from 'react-icons/fi';

const TIMELINE_STEPS = [
	{ key: 'pending', label: 'Pending', icon: FiClock, desc: 'Order received' },
	{ key: 'processing', label: 'Processing', icon: FiPackage, desc: 'Being prepared' },
	{ key: 'shipped', label: 'Shipped', icon: FiTruck, desc: 'On the way' },
	{ key: 'delivered', label: 'Delivered', icon: FiHome, desc: 'Order complete' },
];

const STATUS_ORDER = { pending: 0, processing: 1, shipped: 2, delivered: 3 };

/**
 * Visual order tracking timeline stepper
 */
const OrderTimeline = ({ status }) => {
	const normalizedStatus = (status || 'pending').toLowerCase();
	const isCancelled = normalizedStatus === 'cancelled';
	const currentIndex = STATUS_ORDER[normalizedStatus] ?? -1;

	if (isCancelled) {
		return (
			<motion.div
				className="flex items-center gap-4 p-5 rounded-2xl bg-red-50 border border-red-100"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
			>
				<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
					<FiXCircle className="w-6 h-6 text-red-500" />
				</div>
				<div>
					<p className="font-bold text-red-800">Order Cancelled</p>
					<p className="text-sm text-red-600/80">This order has been cancelled and cannot be processed further.</p>
				</div>
			</motion.div>
		);
	}

	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 w-full">
			{TIMELINE_STEPS.map((step, index) => {
				const isCompleted = index <= currentIndex;
				const isActive = index === currentIndex;
				const Icon = step.icon;

				return (
					<div key={step.key} className="flex items-center flex-1 w-full sm:w-auto">
						<motion.div
							className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-1 py-2 sm:py-0"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							{/* Circle */}
							<motion.div
								className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
									${isCompleted
										? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200'
										: 'bg-gray-100 text-gray-400 border-2 border-gray-200'
									}`}
								animate={isActive ? { scale: [1, 1.1, 1] } : {}}
								transition={{ duration: 2, repeat: Infinity }}
							>
								{isCompleted ? (
									<FiCheck className="w-5 h-5" />
								) : (
									<Icon className="w-5 h-5" />
								)}
								{isActive && (
									<div className="absolute -inset-1 rounded-full border-2 border-emerald-300 animate-ping opacity-30" />
								)}
							</motion.div>

							{/* Label */}
							<div className="sm:text-center">
								<p className={`text-xs font-bold transition-colors ${isCompleted ? 'text-emerald-700' : 'text-gray-400'}`}>
									{step.label}
								</p>
								<p className={`text-[10px] ${isCompleted ? 'text-emerald-600/70' : 'text-gray-300'} hidden sm:block`}>
									{step.desc}
								</p>
							</div>
						</motion.div>

						{/* Connector */}
						{index < TIMELINE_STEPS.length - 1 && (
							<>
								{/* Horizontal connector (desktop) */}
								<div className="hidden sm:block flex-1 h-0.5 mx-1 bg-gray-200 rounded-full overflow-hidden">
									<motion.div
										className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
										initial={{ width: 0 }}
										animate={{ width: index < currentIndex ? '100%' : '0%' }}
										transition={{ duration: 0.5, delay: (index + 1) * 0.15 }}
									/>
								</div>
								{/* Vertical connector (mobile) */}
								<div className="block sm:hidden w-0.5 h-6 ml-5 bg-gray-200 rounded-full overflow-hidden">
									<motion.div
										className="w-full bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-full"
										initial={{ height: 0 }}
										animate={{ height: index < currentIndex ? '100%' : '0%' }}
										transition={{ duration: 0.5, delay: (index + 1) * 0.15 }}
									/>
								</div>
							</>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default OrderTimeline;
