import { motion } from 'framer-motion';
import { Badge } from '../../../shared/ui/index.js';
import useMutationFactory from '../../../shared/hooks/useMutationFactory.jsx';
import { setDefaultPaymentMethodFunc } from '../services/customerService.js';

const PaymentCard = ({ card, index, onEdit, onDelete }) => {
	const { mutate: setDefault, isPending: isSettingDefault } = useMutationFactory(
		setDefaultPaymentMethodFunc,
		['customerProfile'],
		'Payment method set as default'
	);

	// Removed internal delete mutation as it's now handled by the page for the confirm modal

	const getGradient = (type) => {
		switch (type) {
			case 'Visa': return 'from-blue-600 to-indigo-700';
			case 'Mastercard': return 'from-gray-700 to-gray-900';
			case 'PayPal': return 'from-blue-400 to-blue-600';
			case 'Apple Pay': return 'from-gray-100 to-gray-300 !text-gray-900';
			case 'Google Pay': return 'from-blue-500 via-red-500 to-yellow-500';
			default: return 'from-indigo-500 to-purple-600';
		}
	};

	const getIcon = (type) => {
		switch (type) {
			case 'Visa': return '💳';
			case 'Mastercard': return '💳';
			case 'PayPal': return '🅿️';
			case 'Apple Pay': return '🍎';
			case 'Google Pay': return '🔍';
			default: return '💳';
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			className={isSettingDefault ? 'opacity-50 pointer-events-none' : ''}
		>
			{/* Credit Card Visual */}
			<div className="relative group perspective-1000">
				<div className={`relative h-56 rounded-2xl p-6 text-white shadow-xl overflow-hidden
					bg-linear-to-br ${getGradient(card.type)} transition-transform duration-500 group-hover:scale-[1.02]`}>
					
					{/* Decorative Circles */}
					<div className={`absolute top-0 right-0 w-32 h-32 rounded-full translate-x-10 -translate-y-10 blur-xl ${card.type === 'Apple Pay' ? 'bg-black/5' : 'bg-white/10'}`} />
					<div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full -translate-x-5 translate-y-5 blur-xl ${card.type === 'Apple Pay' ? 'bg-black/5' : 'bg-white/10'}`} />

					<div className="relative z-10 flex flex-col h-full justify-between">
						<div className="flex justify-between items-start">
							<div className="text-2xl">{getIcon(card.type)}</div>
							<h3 className={`font-bold tracking-wider ${card.type === 'Apple Pay' ? 'text-gray-900 opacity-90' : 'opacity-90'}`}>{card.type}</h3>
						</div>

						<div className="space-y-1">
							<p className={`text-xs uppercase tracking-widest ${card.type === 'Apple Pay' ? 'text-gray-600 opacity-75' : 'opacity-75'}`}>Card Number</p>
							<p className={`text-2xl font-mono tracking-widest ${card.type === 'Apple Pay' ? 'text-gray-900' : ''}`}>
								{card.last4 ? `•••• •••• •••• ${card.last4}` : 'Digital Wallet'}
							</p>
						</div>

						<div className="flex justify-between items-end">
							<div>
								<p className={`text-xs uppercase tracking-widest ${card.type === 'Apple Pay' ? 'text-gray-600 opacity-75' : 'opacity-75'}`}>Card Holder</p>
								<p className={`font-medium tracking-wide ${card.type === 'Apple Pay' ? 'text-gray-800' : ''}`}>{card.holder || 'Not specified'}</p>
							</div>
							<div className="text-right">
								<p className={`text-xs uppercase tracking-widest ${card.type === 'Apple Pay' ? 'text-gray-600 opacity-75' : 'opacity-75'}`}>Expires</p>
								<p className={`font-medium tracking-wide ${card.type === 'Apple Pay' ? 'text-gray-800' : ''}`}>{card.expiry || '--/--'}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="mt-4 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
					{card.isDefault ? (
						<Badge variant="success" size="sm">Default</Badge>
					) : (
						<button 
							onClick={() => setDefault(card._id)}
							className="text-sm text-gray-500 hover:text-indigo-600 font-medium transition-colors"
						>
							Set as Default
						</button>
					)}
					<div className="flex gap-2">
						<button 
							onClick={onEdit}
							className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
							</svg>
						</button>
						<button 
							onClick={onDelete}
							className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default PaymentCard;
