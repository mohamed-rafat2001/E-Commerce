import { motion } from 'framer-motion';
import { Card } from '../ui/index.js';
import { useLocation } from 'react-router-dom';

const PlaceholderPage = ({ title }) => {
	const location = useLocation();
	const pageTitle = title || location.pathname.split('/').pop().replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
		>
			<Card variant="elevated" className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
				<div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-4xl mb-4">
					🚧
				</div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
				<p className="text-gray-500 max-w-md">
					This feature is currently under development. 
					We're working hard to bring you the best experience!
				</p>
			</Card>
		</motion.div>
	);
};

export default PlaceholderPage;
