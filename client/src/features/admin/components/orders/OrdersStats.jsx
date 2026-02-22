import { FiShoppingCart, FiClock, FiPackage, FiTruck, FiCheck, FiXCircle, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AdminStatCard from '../AdminStatCard.jsx';

const OrdersStats = ({ stats }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Total Orders" value={stats.total} icon={FiShoppingCart} color="bg-gray-900" />
        <AdminStatCard label="Pending" value={stats.pending} icon={FiClock} color="bg-gray-500" />
        <AdminStatCard label="Processing" value={stats.processing} icon={FiPackage} color="bg-blue-600" />
        <AdminStatCard label="Shipped" value={stats.shipped} icon={FiTruck} color="bg-amber-500" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminStatCard label="Delivered" value={stats.delivered} icon={FiCheck} color="bg-emerald-600" />
        <AdminStatCard label="Cancelled" value={stats.cancelled} icon={FiXCircle} color="bg-rose-500" />
        <div className="col-span-2 lg:col-span-1">
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 flex items-center justify-between h-full"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Revenue (Paid)</p>
              <h3 className="text-2xl font-extrabold text-indigo-600 tabular-nums">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <FiDollarSign className="w-6 h-6" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrdersStats;
