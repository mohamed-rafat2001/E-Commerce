import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBarChart2 } from 'react-icons/fi';

const WelcomeHeader = () => {
	return (
		<motion.div 
			initial={{ opacity: 0, y: -20 }} 
			animate={{ opacity: 1, y: 0 }}
			className="bg-linear-to-r from-white to-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm"
		>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back 👋</h1>
					<p className="text-gray-600 font-medium">Here's what's happening with your store today</p>
				</div>
				<Link 
					to="/seller/analytics"
					className="inline-flex items-center gap-3 px-6 py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 
						text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 
						hover:scale-105 transition-all duration-200 group"
				>
					<FiBarChart2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
					View Analytics
				</Link>
			</div>
		</motion.div>
	);
};

export default WelcomeHeader;
