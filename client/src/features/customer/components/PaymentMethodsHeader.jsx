import { motion } from 'framer-motion';
import { Button } from '../../../shared/ui/index.js';

const PaymentMethodsHeader = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
		>
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
				<p className="text-gray-500">Securely manage your payment options</p>
			</div>
			<Button variant="primary" icon={<span className="text-lg">+</span>}>
				Add Payment Method
			</Button>
		</motion.div>
	);
};

export default PaymentMethodsHeader;
