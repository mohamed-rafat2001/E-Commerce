import { motion } from 'framer-motion';
import { Button } from '../../../shared/ui/index.js';

const ShippingAddressesHeader = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
		>
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Shipping Addresses</h1>
				<p className="text-gray-500">Manage your delivery locations</p>
			</div>
			<Button variant="primary" icon={<span className="text-lg">+</span>}>
				Add New Address
			</Button>
		</motion.div>
	);
};

export default ShippingAddressesHeader;
