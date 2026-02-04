import { motion } from 'framer-motion';
import { Input } from '../../../shared/ui/index.js';

const OrderHistoryHeader = ({ tabs, activeTab, onTabChange }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col gap-4"
		>
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Order History</h1>
				<p className="text-gray-500">Track and view your previous orders</p>
			</div>
			
			{/* Search & Tabs */}
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
				<div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto max-w-full no-scrollbar">
					{tabs.map((tab) => (
						<button
							key={tab}
							onClick={() => onTabChange(tab)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
								${activeTab === tab 
									? 'bg-white text-indigo-600 shadow-sm' 
									: 'text-gray-500 hover:text-gray-700'}`}
						>
							{tab}
						</button>
					))}
				</div>
				<div className="w-full sm:w-auto">
					<Input placeholder="Search orders..." icon="🔍" className="min-w-[250px]" />
				</div>
			</div>
		</motion.div>
	);
};

export default OrderHistoryHeader;
