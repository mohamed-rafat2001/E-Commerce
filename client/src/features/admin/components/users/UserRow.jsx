import { motion } from 'framer-motion';
import { FiPhone, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import RoleSelector from './RoleSelector.jsx';

const UserRow = ({ user, onUpdateField, onEdit, onView, onDelete, currentUserId }) => {
	const isSelf = user._id === currentUserId;

	return (
		<motion.tr
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
		>
			{/* User */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
						{user.profileImg?.secure_url ? (
							<img src={user.profileImg.secure_url} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
						) : (
							<div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
								{user.firstName?.[0]}{user.lastName?.[0]}
							</div>
						)}
					</div>
					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<span className="font-bold text-gray-900 text-sm">{user.firstName} {user.lastName}</span>
							{isSelf && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-semibold">You</span>}
						</div>
						<span className="text-xs text-gray-400 truncate max-w-[180px] block">{user.email}</span>
					</div>
				</div>
			</td>

			{/* Phone */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<div className="flex items-center gap-1.5 text-gray-500 text-sm">
					<FiPhone className="w-3.5 h-3.5 text-gray-400" />
					<span className="tabular-nums font-medium">{user.phoneNumber || '—'}</span>
				</div>
			</td>

			{/* Role */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<RoleSelector 
					value={user.role} 
					onChange={(newRole) => onUpdateField(user._id, { role: newRole })} 
					disabled={isSelf || user.role === 'SuperAdmin'}
				/>
			</td>

			{/* Status */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<button 
					disabled={isSelf || user.role === 'SuperAdmin'}
					onClick={() => onUpdateField(user._id, { status: user.status === 'active' ? 'suspended' : 'active' })}
					className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
						user.status === 'active' 
							? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:shadow-sm' 
							: 'bg-rose-50 text-rose-600 border-rose-100 hover:shadow-sm'
					} ${(isSelf || user.role === 'SuperAdmin') ? 'opacity-50 cursor-not-allowed' : ''}`}
				>
					<span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
					{user.status === 'active' ? 'Active' : 'Suspended'}
				</button>
			</td>

			{/* Joined */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<span className="text-sm text-gray-500 font-medium">
					{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
				</span>
			</td>

			{/* Actions */}
			<td className="py-3.5 px-4 whitespace-nowrap text-right">
				<div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
					<button 
						onClick={() => onView(user)} 
						className="p-2 bg-white hover:bg-indigo-50 text-indigo-500 rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md" 
						title="View details"
					>
						<FiEye className="w-3.5 h-3.5" />
					</button>
					<button 
						onClick={() => onEdit(user)} 
						className="p-2 bg-white hover:bg-blue-50 text-blue-500 rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md" 
						title="Edit user"
					>
						<FiEdit2 className="w-3.5 h-3.5" />
					</button>
					{!isSelf && user.role !== 'SuperAdmin' && (
						<button 
							onClick={() => onDelete(user)} 
							className="p-2 bg-white hover:bg-rose-50 text-rose-500 rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md" 
							title="Delete user"
						>
							<FiTrash2 className="w-3.5 h-3.5" />
						</button>
					)}
				</div>
			</td>
		</motion.tr>
	);
};

export default UserRow;
