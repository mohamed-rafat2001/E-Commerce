import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiShoppingBag, FiArchive, FiArrowRight } from 'react-icons/fi';

const QuickActionCard = ({ icon: Icon, title, to, gradient, description }) => (
	<Link to={to} className="group">
		<motion.div 
			whileHover={{ y: -4, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-indigo-100 
				transition-all duration-300 relative overflow-hidden group"
		>
			<div className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
				<Icon className="w-6 h-6 text-white" />
			</div>
			<h4 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h4>
			<p className="text-sm text-gray-500 leading-relaxed">{description}</p>
			<div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 
				flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
				<FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 
					group-hover:translate-x-0.5 transition-all duration-200" />
			</div>
		</motion.div>
	</Link>
);

const QuickActions = () => {
	return (
		<div>
			<h3 className="text-xl font-black text-gray-900 mb-4">Quick Actions ⚡</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<QuickActionCard
					icon={FiPlus}
					title="Add Product"
					to="/seller/products"
					gradient="from-indigo-500 to-purple-600"
					description="Create a new product listing"
				/>
				<QuickActionCard
					icon={FiShoppingBag}
					title="View Orders"
					to="/seller/orders"
					gradient="from-blue-500 to-indigo-600"
					description="Manage customer orders"
				/>
				<QuickActionCard
					icon={FiArchive}
					title="Inventory"
					to="/seller/inventory"
					gradient="from-emerald-500 to-teal-600"
					description="Update stock levels"
				/>
			</div>
		</div>
	);
};

export default QuickActions;
