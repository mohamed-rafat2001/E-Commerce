import { motion } from 'framer-motion';

const InventoryHeader = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
		>
			<div>
				<h1 className="text-3xl font-black text-gray-900 tracking-tight">Inventory Manager 📊</h1>
				<p className="text-gray-500 font-medium mt-1">Track and manage your product stock levels</p>
			</div>
		</motion.div>
	);
};

export default InventoryHeader;
