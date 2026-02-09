import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	UsersIcon,
	UserIcon 
} from '../../../shared/constants/icons.jsx';
import { Button, Modal, Input, Badge, LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { useForm, Controller } from 'react-hook-form';
import { 
	FiSearch, 
	FiEdit2, 
	FiTrash2, 
	FiMail, 
	FiPhone, 
	FiShield, 
	FiUserCheck, 
	FiUserX, 
	FiPlus, 
	FiAlertTriangle, 
	FiCircle, 
	FiLock, 
	FiActivity, 
	FiSettings, 
	FiUnlock, 
	FiChevronDown, 
	FiGlobe,
	FiUsers,
	FiUser,
	FiShoppingBag,
	FiCpu
} from 'react-icons/fi';
import { useAdminUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/index.js';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';
import toast from 'react-hot-toast';

// Configuration
const roleConfig = {
	Customer: { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: FiUserCheck, label: 'Customer' },
	Seller: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: FiShield, label: 'Seller' },
	Admin: { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: FiLock, label: 'Admin' },
};

const roleOptions = [
	{ value: 'Customer', label: 'Standard Customer' },
	{ value: 'Seller', label: 'Merchant/Seller' },
	{ value: 'Admin', label: 'System Admin' },
];

const statusOptions = [
	{ value: 'active', label: 'Active User' },
	{ value: 'suspended', label: 'Suspended' },
];

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
	<motion.div 
		whileHover={{ y: -5, scale: 1.02 }}
		className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/50 flex items-center justify-between"
	>
		<div className="space-y-1">
			<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
			<h3 className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{value}</h3>
			{trend && <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">+{trend}% Efficiency</p>}
		</div>
		<div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl shadow-${color.split('-')[1]}-100 transition-transform`}>
			<Icon className="w-7 h-7" />
		</div>
	</motion.div>
);

// Quick Role Selector Component
const RoleSelector = ({ value, onChange, disabled }) => {
	const [isOpen, setIsOpen] = useState(false);
	const ActiveIcon = roleConfig[value]?.icon;
	
	return (
		<div className="relative">
			<button
				disabled={disabled}
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all ${roleConfig[value]?.color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
			>
				{ActiveIcon && <ActiveIcon className="w-3 h-3" />}
				{value}
				<FiChevronDown className={`w-2.5 h-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			
			<AnimatePresence>
				{isOpen && !disabled && (
					<>
						<div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-40"
						>
							<p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 py-2 border-b border-slate-50 mb-1">Set Clearance Level</p>
							{roleOptions.map((opt) => {
								const OptionIcon = roleConfig[opt.value]?.icon;
								return (
									<button
										key={opt.value}
										onClick={() => { onChange(opt.value); setIsOpen(false); }}
										className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}
									>
										<div className={`w-6 h-6 rounded-lg flex items-center justify-center border shadow-xs ${roleConfig[opt.value]?.color}`}>
											{OptionIcon && <OptionIcon className="w-3.5 h-3.5" />}
										</div>
										<span className="text-[10px] font-black uppercase tracking-tight">{opt.label}</span>
									</button>
								);
							})}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

// Modal component for creating/editing users
const UserModal = ({ isOpen, onClose, user, onSubmit, isLoading }) => {
	const isEdit = !!user;
	const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			role: 'Customer',
			status: 'active',
			password: '',
			confirmPassword: '',
		}
	});

	useEffect(() => {
		if (isOpen) {
			reset({
				firstName: user?.firstName || '',
				lastName: user?.lastName || '',
				email: user?.email || '',
				phoneNumber: user?.phoneNumber || '',
				role: user?.role || 'Customer',
				status: user?.status || 'active',
				password: '',
				confirmPassword: '',
			});
		}
	}, [isOpen, user, reset]);

	const onInternalSubmit = (data) => {
		if (isEdit && !data.password) {
			delete data.password;
			delete data.confirmPassword;
		}
		if (!isEdit && data.password !== data.confirmPassword) {
			return toast.error("Passwords do not match");
		}
		onSubmit(data);
	};

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title={isEdit ? "Update Credentials" : "Provision Access Node"}
			size="md"
		>
			<form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-5">
				<div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-white">
					<div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-3 border border-indigo-50">
						{isEdit ? <FiSettings className="w-8 h-8" /> : <FiLock className="w-8 h-8" />}
					</div>
					<div className="text-center">
						<p className="font-black text-gray-900 text-base">{isEdit ? "Modify Profile" : "New Security Node"}</p>
						<p className="text-[9px] text-indigo-500 font-extrabold tracking-widest uppercase">Encryption & Access Protocol</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<Input label="First Name" placeholder="Jane" {...register('firstName', { required: 'Required' })} error={errors.firstName?.message} />
					<Input label="Last Name" placeholder="Smith" {...register('lastName', { required: 'Required' })} error={errors.lastName?.message} />
				</div>

				<Input label="Email Identity" type="email" placeholder="jane@example.com" {...register('email', { required: 'Required' })} error={errors.email?.message} />
				<Input label="Network Phone" placeholder="+1234567890" {...register('phoneNumber', { required: 'Required' })} error={errors.phoneNumber?.message} />

				<div className="grid grid-cols-2 gap-4">
					<Controller name="role" control={control} render={({ field }) => <Select label="Clearance Tier" options={roleOptions} {...field} />} />
					<Controller name="status" control={control} render={({ field }) => <Select label="Auth Status" options={statusOptions} {...field} />} />
				</div>

				{!isEdit && (
					<div className="grid grid-cols-2 gap-4">
						<Input label="Master Pass" type="password" placeholder="••••••••" {...register('password', { required: !isEdit })} error={errors.password?.message} />
						<Input label="Confirm Sync" type="password" placeholder="••••••••" {...register('confirmPassword', { required: !isEdit })} error={errors.confirmPassword?.message} />
					</div>
				)}

				<div className="flex gap-3 pt-4 border-t border-gray-100">
					<Button variant="ghost" type="button" onClick={onClose} fullWidth className="font-bold text-gray-400">Abort</Button>
					<Button type="submit" loading={isLoading} fullWidth className="font-black bg-indigo-600">Apply Field Update</Button>
				</div>
			</form>
		</Modal>
	);
};

// User Row Component
const UserRow = ({ user, onUpdateField, onEdit, onDelete, currentUserId }) => {
	const isSelf = user._id === currentUserId;

	return (
		<motion.tr
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="border-b border-slate-50 hover:bg-slate-50 transition-all group/row"
		>
			<td className="py-4 px-4 whitespace-nowrap">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm relative group/avatar">
						{user.profileImg?.secure_url ? (
							<img 
								src={user.profileImg.secure_url} 
								alt="" 
								className="w-full h-full object-cover"
								crossOrigin="anonymous"
							/>
						) : (
							<div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
								{user.firstName?.[0]}{user.lastName?.[0]}
							</div>
						)}
					</div>
					<div className="flex flex-col">
						<span className="font-black text-gray-900 text-sm tracking-tight uppercase leading-tight">
							{user.firstName} {user.lastName}
							{isSelf && <span className="ml-2 text-[8px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded italic font-black">SELF</span>}
						</span>
						<span className="text-[10px] text-gray-400 font-extrabold lowercase truncate max-w-[150px] tracking-wide">{user.email}</span>
					</div>
				</div>
			</td>

			<td className="py-4 px-4 whitespace-nowrap">
				<div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px]">
					<FiPhone className="w-3.5 h-3.5 text-indigo-400" />
					<span className="tabular-nums">{user.phoneNumber || '—'}</span>
				</div>
			</td>
			<td className="py-4 px-3 whitespace-nowrap">
				<RoleSelector 
					value={user.role} 
					onChange={(newRole) => onUpdateField(user._id, { role: newRole })} 
					disabled={isSelf}
				/>
			</td>
			<td className="py-4 px-3 whitespace-nowrap">
				<button 
					disabled={isSelf}
					onClick={() => onUpdateField(user._id, { status: user.status === 'active' ? 'suspended' : 'active' })}
					className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-[8px] font-black uppercase tracking-[0.1em] ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white'} ${isSelf ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
				>
					<div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'} group-hover:bg-white`} />
					{user.status === 'active' ? 'Active' : 'Revoked'}
				</button>
			</td>
			<td className="py-4 px-4 whitespace-nowrap text-right">
				<div className="flex items-center justify-end gap-1.5">
					<button onClick={() => onEdit(user)} className="p-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-500 hover:text-white rounded-lg transition-all shadow-xs border border-indigo-100"><FiEdit2 className="w-3.5 h-3.5" /></button>
					{!isSelf && (
						<button onClick={() => onDelete(user)} className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg transition-all border border-rose-100 shadow-xs"><FiTrash2 className="w-3.5 h-3.5" /></button>
					)}
				</div>
			</td>
		</motion.tr>
	);
};

// Main Page
const UsersPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [selectedUser, setSelectedUser] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);
	
	const { user: currUser } = useCurrentUser();
	const { users: allUsers, isLoading } = useAdminUsers();
	const { createUser, isCreating } = useCreateUser();
	const { updateUser, isUpdating } = useUpdateUser();
	const { deleteUser, isDeleting } = useDeleteUser();
	
	const users = allUsers || [];

	const filteredUsers = useMemo(() => {
		return users.filter(u => {
			const name = `${u.firstName} ${u.lastName}`.toLowerCase();
			const matchesSearch = name.includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesRole = roleFilter === 'all' || u.role === roleFilter;
			const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
			return matchesSearch && matchesRole && matchesStatus;
		});
	}, [users, searchQuery, roleFilter, statusFilter]);

	const stats = useMemo(() => {
		const counts = {
			total: users.length,
			customers: users.filter(u => u.role === 'Customer').length,
			sellers: users.filter(u => u.role === 'Seller').length,
			admins: users.filter(u => u.role === 'Admin').length
		};
		return counts;
	}, [users]);

	const handleUpdateField = (id, data) => {
		updateUser({ id, data });
	};

	return (
		<div className="space-y-8 pb-10">
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
							<FiShield className="w-7 h-7 font-black" />
						</div>
						<div>
							<h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">User Management</h1>
							<p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Direct Entity Management (Field Mapping Layer)</p>
						</div>
					</div>
				</div>
				<motion.button 
					whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
					whileTap={{ scale: 0.95 }}
					onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
					className="h-14 px-8 rounded-[1.5rem] bg-indigo-600 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-indigo-100"
				>
					<div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
						<FiPlus className="w-4 h-4" />
					</div>
					Add New User
				</motion.button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard label="Total Users" value={stats.total} icon={FiUsers} color="bg-gray-900" trend="12" />
				<StatCard label="Total Customers" value={stats.customers} icon={FiUser} color="bg-blue-600" trend="8" />
				<StatCard label="Total Sellers" value={stats.sellers} icon={FiShoppingBag} color="bg-emerald-600" trend="15" />
				<StatCard label="Total Admins" value={stats.admins} icon={FiCpu} color="bg-rose-600" trend="2" />
			</div>

			<div className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-slate-200/50 space-y-5">
				<div className="flex flex-col lg:flex-row gap-4 px-2 items-end">
					<div className="relative flex-1 group w-full">
						<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 opacity-0 pointer-events-none">Search Label Placeholder</p>
						<FiSearch className="absolute left-4 top-[calc(50%+10px)] transform -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 w-4 h-4 transition-colors" />
						<input
							type="text"
							placeholder="Scan Data Layer (Name, Email, Metadata)..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-none bg-slate-50 focus:bg-white focus:ring-[4px] focus:ring-indigo-50 transition-all outline-none font-bold text-xs shadow-inner"
						/>
					</div>
					<div className="flex gap-3 w-full lg:w-auto">
						<Select containerClassName="min-w-[180px] flex-1 lg:flex-none" label="Clearance Tier" value={roleFilter} onChange={setRoleFilter} options={[{ value: 'all', label: 'All Managed Tiers' }, ...roleOptions]} />
						<Select containerClassName="min-w-[180px] flex-1 lg:flex-none" label="Validation State" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All Validation States' }, ...statusOptions]} />
					</div>
				</div>

				<div className="overflow-x-auto rounded-3xl border border-slate-100 custom-scrollbar">
					<table className="w-full text-left">
						<thead>
							<tr className="bg-slate-50 border-b border-slate-100 italic">
								<th className="py-5 px-4 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Subject Identity (Mapping)</th>
								<th className="py-5 px-4 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Comms Node</th>
								<th className="py-5 px-3 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Clearance Level</th>
								<th className="py-5 px-3 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap">Auth State</th>
								<th className="py-5 px-4 font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] whitespace-nowrap text-right">Protocols</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-50">
							{isLoading ? (
								<tr><td colSpan={7} className="py-20 text-center"><LoadingSpinner size="sm" color="indigo" /></td></tr>
							) : filteredUsers.map(u => (
								<UserRow key={u._id} user={u} onUpdateField={handleUpdateField} onEdit={(u) => { setSelectedUser(u); setIsModalOpen(true); }} onDelete={setUserToDelete} currentUserId={currUser?.userId?._id} />
							))}
						</tbody>
					</table>
				</div>
			</div>

			<UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} onSubmit={(data) => selectedUser ? updateUser({ id: selectedUser._id, data }, { onSuccess: () => setIsModalOpen(false) }) : createUser(data, { onSuccess: () => setIsModalOpen(false) })} isLoading={isCreating || isUpdating} />
			
			<Modal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} title="Terminate Node Instance" size="sm">
				<div className="text-center p-6 space-y-6">
					<div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm animate-pulse border border-rose-100"><FiAlertTriangle className="w-8 h-8" /></div>
					<div className="space-y-2">
						<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Instance ID Termination:</p>
						<p className="text-xl font-black text-rose-600 uppercase italic tracking-tighter">{userToDelete?.firstName} {userToDelete?.lastName}</p>
					</div>
					<p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed px-4">Caution: This operation permanently desynchronizes the record from the data manifold. Non-recoverable.</p>
					<div className="flex gap-3 pt-2">
						<Button variant="ghost" onClick={() => setUserToDelete(null)} fullWidth className="font-black text-[10px] uppercase italic h-14 rounded-2xl">Abort</Button>
						<Button variant="danger" onClick={() => deleteUser(userToDelete._id, { onSuccess: () => setUserToDelete(null) })} fullWidth loading={isDeleting} className="font-black bg-rose-600 text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl">Confirm Purge</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default UsersPage;
