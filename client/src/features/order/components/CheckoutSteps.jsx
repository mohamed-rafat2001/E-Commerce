import { motion } from 'framer-motion';
import { FiCheck, FiMapPin, FiCreditCard, FiClipboard } from 'react-icons/fi';

const STEPS = [
	{ id: 1, label: 'Shipping', icon: FiMapPin },
	{ id: 2, label: 'Payment', icon: FiCreditCard },
	{ id: 3, label: 'Review', icon: FiClipboard },
];

/**
 * Checkout step indicator — shows progress through the 3-step checkout flow
 */
const CheckoutSteps = ({ currentStep = 1 }) => {
	return (
		<div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-10">
			{STEPS.map((step, index) => {
				const isCompleted = currentStep > step.id;
				const isActive = currentStep === step.id;
				const Icon = step.icon;

				return (
					<div key={step.id} className="flex items-center flex-1 last:flex-none">
						{/* Step Circle */}
						<motion.div
							className="relative flex flex-col items-center"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: index * 0.1 }}
						>
							<motion.div
								className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500
									${isCompleted
										? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200'
										: isActive
											? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-100'
											: 'bg-gray-100 text-gray-400 border-2 border-gray-200'
									}`}
								animate={isActive ? { scale: [1, 1.05, 1] } : {}}
								transition={{ duration: 2, repeat: Infinity }}
							>
								{isCompleted ? (
									<FiCheck className="w-5 h-5" />
								) : (
									<Icon className="w-5 h-5" />
								)}
							</motion.div>
							<span className={`absolute -bottom-6 text-xs font-bold whitespace-nowrap transition-colors duration-300
								${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}
							>
								{step.label}
							</span>
						</motion.div>

						{/* Connector Line */}
						{index < STEPS.length - 1 && (
							<div className="flex-1 h-0.5 mx-2 rounded-full bg-gray-200 overflow-hidden">
								<motion.div
									className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full"
									initial={{ width: 0 }}
									animate={{ width: isCompleted ? '100%' : '0%' }}
									transition={{ duration: 0.5, delay: 0.2 }}
								/>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default CheckoutSteps;
