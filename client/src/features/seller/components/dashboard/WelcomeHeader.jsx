import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiArrowRight } from 'react-icons/fi';

const WelcomeHeader = () => {
	return (
		<motion.div 
			initial={{ opacity: 0, y: -20 }} 
			animate={{ opacity: 1, y: 0 }}
			className="relative rounded-3xl p-8 border border-gray-100 overflow-hidden bg-white"
			style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}
		>
			{/* Decorative gradient blobs */}
			<div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
			<div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

			<div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
						Welcome Back 👋
					</h1>
					<p className="text-gray-500 font-medium text-sm leading-relaxed">
						Here's what's happening with your store today
					</p>
				</div>
				<Link 
					to="/seller/analytics"
					className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 
						text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-200/50 
						hover:-translate-y-0.5 transition-all duration-300 group shrink-0"
				>
					<FiBarChart2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
					View Analytics
					<FiArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
				</Link>
			</div>
		</motion.div>
	);
};

export default WelcomeHeader;
