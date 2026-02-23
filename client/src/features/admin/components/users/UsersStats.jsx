import { FiUsers, FiUser, FiShoppingBag, FiShield, FiUserX } from 'react-icons/fi';
import AdminStatCard from '../AdminStatCard.jsx';

const UsersStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminStatCard label="Total Users" value={stats.total} icon={FiUsers} color="bg-gray-900" />
      <AdminStatCard label="Customers" value={stats.customers} icon={FiUser} color="bg-blue-600" />
      <AdminStatCard label="Sellers" value={stats.sellers} icon={FiShoppingBag} color="bg-emerald-600" />
      <AdminStatCard label="Admins" value={stats.admins} icon={FiShield} color="bg-purple-600" />
      <AdminStatCard label="Suspended" value={stats.suspended} icon={FiUserX} color="bg-rose-500" />
    </div>
  );
};

export default UsersStats;
