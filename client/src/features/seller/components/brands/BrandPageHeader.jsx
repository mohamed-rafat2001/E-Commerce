import { motion } from 'framer-motion';
import { Button } from '../../../../shared/ui/index.js';
import { FiPlus } from 'react-icons/fi';

const BrandPageHeader = ({ onCreate }) => (
	<motion.div 
		initial={{ opacity: 0, y: -20 }} 
		animate={{ opacity: 1, y: 0 }}
		className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
	>
		<div>
			<h1 className="text-3xl font-black text-gray-900 tracking-tight">Brand Management 🏷️</h1>
			<p className="text-gray-500 font-medium mt-1">Manage your brand portfolio and settings.</p>
		</div>
		<Button 
			onClick={onCreate}
			icon={<FiPlus className="w-4 h-4" />}
		>
			Add New Brand
		</Button>
	</motion.div>
);

export default BrandPageHeader;
