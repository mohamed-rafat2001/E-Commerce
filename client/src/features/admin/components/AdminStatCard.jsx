import { motion } from 'framer-motion';

const AdminStatCard = ({ label, value, icon: Icon, color }) => (
	<motion.div 
		whileHover={{ y: -4, scale: 1.01 }}
		className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 flex items-center justify-between"
	>
		<div className="space-y-1">
			<p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
			<h3 className="text-3xl font-extrabold text-gray-900 tabular-nums">{value}</h3>
		</div>
		<div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
			<Icon className="w-6 h-6" />
		</div>
	</motion.div>
);

export default AdminStatCard;
