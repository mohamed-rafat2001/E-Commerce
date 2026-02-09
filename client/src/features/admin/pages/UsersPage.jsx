import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	UsersIcon,
	UserIcon 
} from '../../../shared/constants/icons.jsx';
import { Button, Modal, Input, Badge, LoadingSpinner } from '../../../shared/ui/index.js';
import { useForm } from 'react-hook-form';
import { FiSearch, FiEdit2, FiTrash2, FiMail, FiPhone, FiShield, FiUserCheck, FiUserX, FiPlus } from 'react-icons/fi';
import { useAdminUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/index.js';

// Configuration
const roleConfig = {
	Customer: { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: FiUserCheck },
	Seller: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: FiShield },
	Admin: { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: FiShield },
};

const statusConfig = {
	active: { color: 'bg-emerald-50 text-emerald-600', label: 'Active' },
	suspended: { color: 'bg-amber-50 text-amber-600', label: 'Suspended' },
};

// Mock data (fallback)
const mockUsers = [
	{
		_id: '1',
		firstName: 'System',
		lastName: 'Administrator',
		email: 'admin@ecommerce.com',
		phoneNumber: '+1234567890',
		role: 'Admin',
		status: 'active',
		createdAt: new Date().toISOString(),
	}
];

// Modal component for creating/editing users
const UserModal = ({ isOpen, onClose, user, onSubmit, isLoading }) => {
	const isEdit = !!user;
	const { register, handleSubmit, formState: { errors }, reset } = useForm({
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

	// Reset form when modal opens or user changes
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
		// Remove password fields if they're empty on edit
		if (isEdit && !data.password) {
			delete data.password;
			delete data.confirmPassword;
		}
		onSubmit(data);
	};

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title={isEdit ? "Update User Account" : "Create New Account"}
			size="md"
		>
			<form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-6">
				<div className="flex flex-col items-center justify-center p-6 bg-indigo-50/50 rounded-3xl mb-2">
					<div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-3 border border-indigo-100">
						<UserIcon className="w-8 h-8" />
					</div>
					<div className="text-center">
						<p className="font-bold text-gray-900">{isEdit ? "Profile Modification" : "Identity Setup"}</p>
						<p className="text-xs text-indigo-500 font-semibold tracking-widest uppercase mt-1">
							{isEdit ? "Reviewing existing details" : "Registering new member"}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Input
						label="First Name"
						placeholder="Jane"
						{...register('firstName', { required: 'First name is required' })}
						error={errors.firstName?.message}
					/>
					<Input
						label="Last Name"
						placeholder="Smith"
						{...register('lastName', { required: 'Last name is required' })}
						error={errors.lastName?.message}
					/>
				</div>

				<Input
					label="Email Address"
					type="email"
					placeholder="jane.smith@example.com"
					{...register('email', { 
						required: 'Email is required',
						pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' }
					})}
					error={errors.email?.message}
				/>

				<Input
					label="Phone Number"
					placeholder="+1 (555) 000-0000"
					{...register('phoneNumber', { required: 'Phone number is required' })}
					error={errors.phoneNumber?.message}
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Account Role</label>
						<select
							{...register('role')}
							className="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-bold text-gray-700 appearance-none shadow-sm"
						>
							<option value="Customer">Customer</option>
							<option value="Seller">Seller</option>
							<option value="Admin">Administrator</option>
						</select>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Account Status</label>
						<select
							{...register('status')}
							className="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-bold text-gray-700 appearance-none shadow-sm"
						>
							<option value="active">Active</option>
							<option value="suspended">Suspended</option>
						</select>
					</div>
				</div>

				{(!isEdit) && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Input
							label="Security Password"
							type="password"
							placeholder="••••••••"
							{...register('password', { 
								required: !isEdit ? 'Password is required' : false, 
								minLength: { value: 8, message: 'Minimum 8 characters' } 
							})}
							error={errors.password?.message}
						/>
						<Input
							label="Confirm Identity"
							type="password"
							placeholder="••••••••"
							{...register('confirmPassword', { 
								required: !isEdit ? 'Please confirm password' : false 
							})}
							error={errors.confirmPassword?.message}
						/>
					</div>
				)}

				<div className="flex gap-3 pt-4 border-t border-gray-50">
					<Button variant="ghost" type="button" onClick={onClose} fullWidth className="font-bold text-gray-400">
						Discard
					</Button>
					<Button type="submit" loading={isLoading} fullWidth className="font-bold shadow-lg shadow-indigo-100">
						{isEdit ? "Update Member" : "Commit New Member"}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

// User Row Component
const UserRow = ({ user, onEdit, onDelete, onToggleStatus, isDeleting }) => {
	const RoleIcon = roleConfig[user.role]?.icon || FiUserCheck;

	return (
		<motion.tr
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="border-b border-gray-50/50 hover:bg-indigo-50/20 transition-colors group"
		>
			<td className="py-5 px-8">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 rotate-1 group-hover:rotate-0 transition-transform">
						{user.firstName?.[0]}{user.lastName?.[0]}
					</div>
					<div>
						<h4 className="font-black text-gray-900 text-base">{user.firstName} {user.lastName}</h4>
						<div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
							<FiMail className="w-3 h-3" />
							<span>{user.email}</span>
						</div>
					</div>
				</div>
			</td>
			<td className="py-5 px-6">
				<div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
					<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
						<FiPhone className="w-3.5 h-3.5" />
					</div>
					<span>{user.phoneNumber || '—'}</span>
				</div>
			</td>
			<td className="py-5 px-6">
				<span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border ${roleConfig[user.role]?.color}`}>
					<RoleIcon className="w-3 h-3" />
					{user.role}
				</span>
			</td>
			<td className="py-5 px-6">
				<Badge variant={user.status === 'active' ? 'success' : 'warning'} size="sm" dot>
					{statusConfig[user.status]?.label}
				</Badge>
			</td>
			<td className="py-5 px-6">
				<span className="text-gray-400 text-xs font-bold tabular-nums italic">
					{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
				</span>
			</td>
			<td className="py-5 px-8">
				<div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
					<button
						onClick={() => onEdit(user)}
						className="p-2.5 hover:bg-indigo-50 rounded-xl transition-all text-indigo-500 hover:scale-110 active:scale-95 shadow-sm hover:shadow-indigo-100"
						title="Edit Profile"
					>
						<FiEdit2 className="w-4 h-4" />
					</button>
					<button
						onClick={() => onToggleStatus(user)}
						className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm ${user.status === 'active' ? 'hover:bg-amber-50 text-amber-500 hover:shadow-amber-100' : 'hover:bg-emerald-50 text-emerald-500 hover:shadow-emerald-100'}`}
						title={user.status === 'active' ? 'Force Suspend' : 'Grant Access'}
					>
						{user.status === 'active' ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
					</button>
					<button
						onClick={() => onDelete(user._id)}
						className="p-2.5 hover:bg-rose-50 rounded-xl transition-all text-rose-500 hover:scale-110 active:scale-95 shadow-sm hover:shadow-rose-100"
						title="Terminate Account"
						disabled={isDeleting}
					>
						<FiTrash2 className="w-4 h-4" />
					</button>
				</div>
			</td>
		</motion.tr>
	);
};

// Stats Card
const StatsCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		whileHover={{ y: -5 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 relative overflow-hidden group"
	>
		<div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${gradient} opacity-[0.03] rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700`} />
		<div className="relative flex items-center gap-5">
			<div className={`w-16 h-16 rounded-[1.25rem] bg-linear-to-br ${gradient} flex items-center justify-center shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}>
				<Icon className="w-8 h-8 text-white" />
			</div>
			<div>
				<h4 className="text-4xl font-black text-gray-900 tracking-tighter">{value}</h4>
				<p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">{title}</p>
				{subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
			</div>
		</div>
	</motion.div>
);

// Main Users Page
const UsersPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [selectedUser, setSelectedUser] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	
	const { users: fetchedUsers, isLoading: isUsersLoading } = useAdminUsers();
	const { createUser, isCreating } = useCreateUser();
	const { updateUser, isUpdating } = useUpdateUser();
	const { deleteUser, isDeleting } = useDeleteUser();
	
	const users = fetchedUsers?.length > 0 ? fetchedUsers : mockUsers;
	const isLoading = isUsersLoading;

	const stats = useMemo(() => ({
		total: users.length,
		customers: users.filter(u => u.role === 'Customer').length,
		sellers: users.filter(u => u.role === 'Seller').length,
		admins: users.filter(u => u.role === 'Admin' || u.role === 'SuperAdmin').length,
	}), [users]);

	const filteredUsers = useMemo(() => {
		return users.filter(user => {
			const fullName = `${user.firstName || ''} ${user.lastName || ''}`;
			const matchesSearch = 
				fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.email?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesRole = roleFilter === 'all' || user.role === roleFilter;
			const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
			return matchesSearch && matchesRole && matchesStatus;
		});
	}, [users, searchQuery, roleFilter, statusFilter]);

	const handleAddNew = () => {
		setSelectedUser(null);
		setIsModalOpen(true);
	};

	const handleEdit = (user) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const handleModalSubmit = (data) => {
		if (selectedUser) {
			updateUser({ id: selectedUser._id, data }, {
				onSuccess: () => setIsModalOpen(false)
			});
		} else {
			createUser(data, {
				onSuccess: () => setIsModalOpen(false)
			});
		}
	};

	const handleDelete = (id) => {
		if (window.confirm('WARNING: Are you absolutely sure? This will permanently wipe this user account from the mainframe. This operation is irreversible.')) {
			deleteUser(id);
		}
	};

	const handleToggleStatus = (user) => {
		const newStatus = user.status === 'active' ? 'suspended' : 'active';
		updateUser({ id: user._id, data: { status: newStatus } });
	};

	return (
		<div className="space-y-10 pb-20">
			{/* Page Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
							<UsersIcon className="w-6 h-6" />
						</div>
						<h1 className="text-4xl font-black text-gray-900 tracking-tight">Access Control</h1>
					</div>
					<p className="text-gray-500 font-bold ml-11">Total system membership management and role provisioning.</p>
				</div>
				<Button 
					variant="primary" 
					icon={<FiPlus className="w-5 h-5" />}
					onClick={handleAddNew}
					className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.4)] transform hover:-translate-y-1 active:scale-95 transition-all"
				>
					Provision New User
				</Button>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard title="Total Cadre" value={stats.total} icon={UsersIcon} gradient="from-indigo-600 to-indigo-800" />
				<StatsCard title="Consumers" value={stats.customers} icon={UserIcon} gradient="from-blue-600 to-indigo-500" />
				<StatsCard title="Merchants" value={stats.sellers} icon={FiShield} gradient="from-emerald-600 to-teal-500" />
				<StatsCard title="Executive" value={stats.admins} icon={FiShield} gradient="from-rose-600 to-pink-500" />
			</div>

			{/* Control Center (Filters) */}
			<div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
				<div className="flex flex-col lg:flex-row gap-6">
					<div className="relative flex-1 group">
						<FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 w-6 h-6 transition-colors" />
						<input
							type="text"
							placeholder="Scan database by name, email or identifier..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-16 pr-6 py-5 rounded-2xl border-none bg-gray-50/50 focus:bg-white focus:ring-[6px] focus:ring-indigo-50 transition-all outline-none font-black text-gray-700 placeholder:text-gray-300 placeholder:font-bold"
						/>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
							<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Filter Role</label>
							<select
								value={roleFilter}
								onChange={(e) => setRoleFilter(e.target.value)}
								className="px-6 py-4 rounded-2xl border-none bg-gray-50/50 focus:bg-white transition-all outline-none font-black text-gray-600 appearance-none cursor-pointer shadow-sm focus:ring-4 focus:ring-indigo-50"
							>
								<option value="all">Every Profile Type</option>
								<option value="Customer">Consumers only</option>
								<option value="Seller">Merchants only</option>
								<option value="Admin">Administrators</option>
							</select>
						</div>
						<div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
							<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Check</label>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="px-6 py-4 rounded-2xl border-none bg-gray-50/50 focus:bg-white transition-all outline-none font-black text-gray-600 appearance-none cursor-pointer shadow-sm focus:ring-4 focus:ring-indigo-50"
							>
								<option value="all">Any Account State</option>
								<option value="active">Operational Only</option>
								<option value="suspended">Suspended Only</option>
							</select>
						</div>
					</div>
				</div>

				{/* Table Container */}
				<div className="mt-10 overflow-hidden rounded-3xl border border-gray-50 shadow-sm">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center py-32 bg-gray-50/30">
							<LoadingSpinner size="lg" color="indigo" />
							<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Accessing Database Records...</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-gray-50/80 border-b border-gray-100 italic">
										<th className="text-left py-6 px-8 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Profile Identity</th>
										<th className="text-left py-6 px-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Direct Line</th>
										<th className="text-left py-6 px-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Level</th>
										<th className="text-left py-6 px-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Operational</th>
										<th className="text-left py-6 px-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Registered</th>
										<th className="text-right py-6 px-8 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Encryption Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50 bg-white">
									<AnimatePresence mode="popLayout">
										{filteredUsers.map(user => (
											<UserRow 
												key={user._id}
												user={user}
												onEdit={handleEdit}
												onDelete={handleDelete}
												onToggleStatus={handleToggleStatus}
												isDeleting={isDeleting}
											/>
										))}
									</AnimatePresence>
								</tbody>
							</table>

							{filteredUsers.length === 0 && (
								<motion.div 
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-center py-32 px-10 bg-white"
								>
									<div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-3">
										<FiSearch className="w-10 h-10 text-rose-200" />
									</div>
									<h3 className="text-3xl font-black text-gray-900 mb-2 mt-4 tracking-tighter italic underline decoration-indigo-500 underline-offset-8">Zero Records Found</h3>
									<p className="text-gray-400 font-bold max-w-sm mx-auto leading-relaxed mt-4">The current filter parameters yielded no matches in the central directory. Please refine your scan queries.</p>
								</motion.div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Authentication Modal */}
			<UserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				user={selectedUser}
				onSubmit={handleModalSubmit}
				isLoading={isCreating || isUpdating}
			/>
		</div>
	);
};

export default UsersPage;
