import { motion } from 'framer-motion';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';
import { Button } from '../../../shared/ui/index.js';

const PAYMENT_METHODS = [
	{ value: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order is delivered' },
	{ value: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, American Express' },
	{ value: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'Pay securely via PayPal' },
	{ value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Direct bank wire transfer' },
	{ value: 'wallet', label: 'Digital Wallet', icon: '👝', desc: 'Use your wallet balance' },
];

/**
 * Payment step — lets user select their preferred payment method
 */
const PaymentStep = ({ paymentMethod, onSelect, onNext, onBack }) => {
	return (
		<motion.div
			className="space-y-6"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 0.3 }}
		>
			<div>
				<h2 className="text-xl font-bold text-gray-900 mb-1">Payment Method</h2>
				<p className="text-sm text-gray-500">Choose how you'd like to pay for your order.</p>
			</div>

			<div className="space-y-3">
				{PAYMENT_METHODS.map((method, index) => {
					const isSelected = paymentMethod === method.value;
					return (
						<motion.button
							key={method.value}
							type="button"
							onClick={() => onSelect(method.value)}
							className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 group
								${isSelected
									? 'border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-100'
									: 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
								}`}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
						>
							{isSelected && (
								<div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
									<FiCheck className="w-4 h-4 text-white" />
								</div>
							)}
							<div className="flex items-center gap-4">
								<span className="text-3xl flex-shrink-0">{method.icon}</span>
								<div>
									<p className="font-bold text-gray-900 text-sm">{method.label}</p>
									<p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
								</div>
							</div>
						</motion.button>
					);
				})}
			</div>

			{/* Navigation Buttons */}
			<div className="flex items-center justify-between pt-2">
				<Button variant="ghost" onClick={onBack} className="gap-2">
					<FiArrowLeft className="w-4 h-4" /> Back
				</Button>
				<Button
					variant="primary"
					size="lg"
					onClick={onNext}
					disabled={!paymentMethod}
					className="px-10"
				>
					Review Order
				</Button>
			</div>
		</motion.div>
	);
};

export default PaymentStep;
