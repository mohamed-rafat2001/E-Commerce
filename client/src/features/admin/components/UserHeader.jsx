import { FiMail, FiPhone, FiCalendar, FiMapPin, FiDollarSign, FiStar, FiInfo, FiUserCheck, FiCreditCard } from 'react-icons/fi';
import { roleConfig } from './users/userConstants.js';

const UserHeader = ({ user }) => {
  const config = roleConfig[user.role] || roleConfig.Customer;
  const RoleIcon = config.icon;

  return (
    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
          {user.profileImg?.secure_url ? (
            <img src={user.profileImg.secure_url} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
          ) : (
            <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-medium ${config.color}`}>
              <RoleIcon className="w-4 h-4" />
              {config.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-medium ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
              <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {user.status === 'active' ? 'Active' : 'Suspended'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;