import { Modal, Button } from '../../../../shared/ui/index.js';
import { FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { roleConfig } from './userConstants.js';

const UserDetailModal = ({ user, isOpen, onClose }) => {
	if (!user) return null;

	const config = roleConfig[user.role] || roleConfig.Customer;
	const RoleIcon = config.icon;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
			<div className="space-y-6">
				{/* User Header */}
				<div className="flex items-center gap-4">
					<div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
						{user.profileImg?.secure_url ? (
							<img src={user.profileImg.secure_url} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
						) : (
							<div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
								{user.firstName?.[0]}{user.lastName?.[0]}
							</div>
						)}
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h3>
						<div className="flex items-center gap-2 mt-1 flex-wrap">
							<span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-xs font-medium ${config.color}`}>
								<RoleIcon className="w-3 h-3" />
								{config.label}
							</span>
							<span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-xs font-medium ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
								<span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
								{user.status === 'active' ? 'Active' : 'Suspended'}
							</span>
						</div>
					</div>
				</div>

				{/* Contact Info */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-2 break-all">
							<FiMail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
							{user.email}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
							<FiPhone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
							{user.phoneNumber || '—'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Joined</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
							<FiCalendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
							{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Last Updated</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
							<FiCalendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
							{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
						</p>
					</div>
				</div>

				{/* User ID */}
				<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
					<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">User ID</p>
					<p className="text-xs font-mono text-gray-600 select-all">{user._id}</p>
				</div>

				<div className="flex justify-end pt-4 border-t border-gray-100">
					<Button variant="secondary" onClick={onClose}>Close</Button>
				</div>
			</div>
		</Modal>
	);
};

export default UserDetailModal;
