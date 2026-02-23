import { FiPackage, FiActivity, FiEdit2, FiAlertCircle, FiBox } from 'react-icons/fi';
import AdminStatCard from '../AdminStatCard.jsx';

const ProductsStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminStatCard label="Total Products" value={stats.total} icon={FiPackage} color="bg-gray-900" />
      <AdminStatCard label="Active" value={stats.active} icon={FiActivity} color="bg-emerald-600" />
      <AdminStatCard label="Draft" value={stats.draft} icon={FiEdit2} color="bg-amber-500" />
      <AdminStatCard label="Low Stock" value={stats.lowStock} icon={FiAlertCircle} color="bg-orange-500" />
      <AdminStatCard label="Out of Stock" value={stats.outOfStock} icon={FiBox} color="bg-rose-500" />
    </div>
  );
};

export default ProductsStats;
