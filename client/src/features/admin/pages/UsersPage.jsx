import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
	FiPlus, 
	FiAlertTriangle, 
	FiLock, 
	FiChevronDown, 
	FiChevronLeft,
	FiChevronRight,
	FiUsers,
	FiUser,
	FiShoppingBag,
	FiCpu,
	FiEye,
	FiCalendar,
	FiUserX,
	FiX
} from 'react-icons/fi';
import { useAdminUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/index.js';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';
import toast from 'react-hot-toast';

// --- Configuration ---
const roleConfig = {
	Customer: { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: FiUser, label: 'Customer' },
	Seller: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: FiShoppingBag, label: 'Seller' },
	Admin: { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: FiShield, label: 'Admin' },
	SuperAdmin: { color: 'bg-purple-50 text-purple-600 border-purple-100', icon: FiLock, label: 'Super Admin' },
};

const roleOptions = [
	{ value: 'Customer', label: 'Customer' },
	{ value: 'Seller', label: 'Seller' },
	{ value: 'Admin', label: 'Admin' },
];

const statusOptions = [
	{ value: 'active', label: 'Active' },
	{ value: 'suspended', label: 'Suspended' },
];

const ITEMS_PER_PAGE = 10;

// --- Stat Card ---
const StatCard = ({ label, value, icon: Icon, color }) => (
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

// --- Inline Role Selector ---
const RoleSelector = ({ value, onChange, disabled }) => {
	const [isOpen, setIsOpen] = useState(false);
	const config = roleConfig[value] || roleConfig.Customer;
	const ActiveIcon = config.icon;
	
	return (
		<div className="relative">
			<button
				disabled={disabled}
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${config.color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
			>
				{ActiveIcon && <ActiveIcon className="w-3.5 h-3.5" />}
				{config.label}
				{!disabled && <FiChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
			</button>
			
			<AnimatePresence>
				{isOpen && !disabled && (
					<>
						<div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
						<motion.div
							initial={{ opacity: 0, y: 5, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 5, scale: 0.95 }}
							className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-40"
						>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2 border-b border-gray-50 mb-1">Change Role</p>
							{roleOptions.map((opt) => {
								const OptionIcon = roleConfig[opt.value]?.icon;
								return (
									<button
										key={opt.value}
										onClick={() => { onChange(opt.value); setIsOpen(false); }}
										className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-medium transition-all ${value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}
									>
										<div className={`w-6 h-6 rounded-md flex items-center justify-center border ${roleConfig[opt.value]?.color}`}>
											{OptionIcon && <OptionIcon className="w-3.5 h-3.5" />}
										</div>
										{opt.label}
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

// --- User Detail Modal ---
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

// --- Create/Edit User Modal ---
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
			title={isEdit ? "Edit User" : "Create New User"}
			size="md"
		>
			<form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-5">
				<div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
					<div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-3 border border-indigo-50">
						{isEdit ? <FiEdit2 className="w-7 h-7" /> : <FiUserCheck className="w-7 h-7" />}
					</div>
					<p className="font-bold text-gray-900 text-sm">{isEdit ? `Editing ${user?.firstName}'s profile` : "Fill in the new user's details"}</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<Input label="First Name" placeholder="Jane" {...register('firstName', { required: 'First name is required' })} error={errors.firstName?.message} />
					<Input label="Last Name" placeholder="Smith" {...register('lastName', { required: 'Last name is required' })} error={errors.lastName?.message} />
				</div>

				<Input label="Email" type="email" placeholder="jane@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
				<Input label="Phone Number" placeholder="+1234567890" {...register('phoneNumber', { required: 'Phone number is required' })} error={errors.phoneNumber?.message} />

				<div className="grid grid-cols-2 gap-4">
					<Controller name="role" control={control} render={({ field }) => <Select label="Role" options={roleOptions} {...field} />} />
					<Controller name="status" control={control} render={({ field }) => <Select label="Status" options={statusOptions} {...field} />} />
				</div>

				{!isEdit && (
					<div className="grid grid-cols-2 gap-4">
						<Input label="Password" type="password" placeholder="••••••••" {...register('password', { required: !isEdit ? 'Password is required' : false })} error={errors.password?.message} />
						<Input label="Confirm Password" type="password" placeholder="••••••••" {...register('confirmPassword', { required: !isEdit ? 'Confirmation is required' : false })} error={errors.confirmPassword?.message} />
					</div>
				)}

				<div className="flex gap-3 pt-4 border-t border-gray-100">
					<Button variant="secondary" type="button" onClick={onClose} fullWidth>Cancel</Button>
					<Button type="submit" loading={isLoading} fullWidth>{isEdit ? "Save Changes" : "Create User"}</Button>
				</div>
			</form>
		</Modal>
	);
};

// --- Delete Confirmation Modal ---
const DeleteConfirmModal = ({ isOpen, onClose, user, onConfirm, isLoading }) => {
	if (!user) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Delete User" size="sm">
			<div className="text-center space-y-6">
				<div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
					<FiAlertTriangle className="w-10 h-10" />
				</div>
				<div className="space-y-2">
					<h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
					<p className="text-gray-500 text-sm leading-relaxed px-4">
						You are about to delete <span className="font-bold text-gray-900">"{user.firstName} {user.lastName}"</span> ({user.email}).
						This action cannot be undone.
					</p>
				</div>
				<div className="flex gap-3 pt-4">
					<Button variant="secondary" onClick={onClose} fullWidth disabled={isLoading}>
						Cancel
					</Button>
					<Button 
						variant="primary" 
						className="bg-rose-500 hover:bg-rose-600 border-rose-600 shadow-rose-200"
						onClick={onConfirm} 
						fullWidth 
						loading={isLoading}
					>
						Yes, Delete
					</Button>
				</div>
			</div>
		</Modal>
	);
};

// --- User Row ---
const UserRow = ({ user, onUpdateField, onEdit, onView, onDelete, currentUserId }) => {
	const isSelf = user._id === currentUserId;
	const config = roleConfig[user.role] || roleConfig.Customer;

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

// --- Empty State ---
const EmptyState = ({ searchQuery, onClear }) => (
	<div className="text-center py-16">
		<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
			<FiUsers className="w-10 h-10 text-gray-300" />
		</div>
		<h3 className="text-lg font-bold text-gray-900 mb-2">
			{searchQuery ? 'No users found' : 'No users yet'}
		</h3>
		<p className="text-gray-500 text-sm max-w-sm mx-auto">
			{searchQuery 
				? `No users match "${searchQuery}". Try a different search.` 
				: 'Create your first user to get started.'}
		</p>
		{searchQuery && (
			<Button variant="ghost" className="mt-4" onClick={onClear}>
				Clear Search
			</Button>
		)}
	</div>
);

// --- Main Page ---
const UsersPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [selectedUser, setSelectedUser] = useState(null);
	const [viewingUser, setViewingUser] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	
	const { user: currUser } = useCurrentUser();
	const { users: allUsers, isLoading } = useAdminUsers();
	const { createUser, isCreating } = useCreateUser();
	const { updateUser, isUpdating } = useUpdateUser();
	const { deleteUser, isDeleting } = useDeleteUser();
	
	const users = allUsers || [];

	const filteredUsers = useMemo(() => {
		return users.filter(u => {
			const name = `${u.firstName} ${u.lastName}`.toLowerCase();
			const query = searchQuery.toLowerCase();
			const matchesSearch = name.includes(query) || u.email?.toLowerCase().includes(query) || u.phoneNumber?.includes(query);
			const matchesRole = roleFilter === 'all' || u.role === roleFilter;
			const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
			return matchesSearch && matchesRole && matchesStatus;
		});
	}, [users, searchQuery, roleFilter, statusFilter]);

	// Pagination
	const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
	const paginatedUsers = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredUsers, currentPage]);

	// Reset page when filters change
	useMemo(() => {
		setCurrentPage(1);
	}, [searchQuery, roleFilter, statusFilter]);

	const stats = useMemo(() => ({
		total: users.length,
		customers: users.filter(u => u.role === 'Customer').length,
		sellers: users.filter(u => u.role === 'Seller').length,
		admins: users.filter(u => u.role === 'Admin' || u.role === 'SuperAdmin').length,
		suspended: users.filter(u => u.status === 'suspended').length,
	}), [users]);

	const handleUpdateField = (id, data) => {
		updateUser({ id, data });
	};

	const handleConfirmDelete = () => {
		if (userToDelete) {
			deleteUser(userToDelete._id, {
				onSuccess: () => setUserToDelete(null)
			});
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<LoadingSpinner size="lg" message="Loading users..." />
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Users</h1>
					<p className="text-gray-500 mt-1">Manage user accounts, roles, and access</p>
				</div>
				<Button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} icon={<FiPlus />}>
					Add New User
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
				<StatCard label="Total Users" value={stats.total} icon={FiUsers} color="bg-gray-900" />
				<StatCard label="Customers" value={stats.customers} icon={FiUser} color="bg-blue-600" />
				<StatCard label="Sellers" value={stats.sellers} icon={FiShoppingBag} color="bg-emerald-600" />
				<StatCard label="Admins" value={stats.admins} icon={FiShield} color="bg-purple-600" />
				<StatCard label="Suspended" value={stats.suspended} icon={FiUserX} color="bg-rose-500" />
			</div>

			{/* Table Card */}
			<div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 overflow-hidden">
				{/* Filters */}
				<div className="p-5 border-b border-gray-100">
					<div className="flex flex-col lg:flex-row gap-4 items-end">
						<div className="relative flex-1 w-full">
							<FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="text"
								placeholder="Search by name, email, or phone..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
							/>
						</div>
						<div className="flex gap-3 w-full lg:w-auto">
							<Select 
								containerClassName="min-w-[160px] flex-1 lg:flex-none" 
								label="Role" 
								value={roleFilter} 
								onChange={setRoleFilter} 
								options={[{ value: 'all', label: 'All Roles' }, ...roleOptions]} 
							/>
							<Select 
								containerClassName="min-w-[160px] flex-1 lg:flex-none" 
								label="Status" 
								value={statusFilter} 
								onChange={setStatusFilter} 
								options={[{ value: 'all', label: 'All Statuses' }, ...statusOptions]} 
							/>
						</div>
					</div>
				</div>

				{/* Table */}
				{filteredUsers.length > 0 ? (
					<>
						<div className="overflow-x-auto">
							<table className="w-full text-left">
								<thead>
									<tr className="bg-gray-50/80 border-b border-gray-100">
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">User</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Phone</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Role</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Status</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Joined</th>
										<th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									<AnimatePresence>
										{paginatedUsers.map(u => (
											<UserRow 
												key={u._id} 
												user={u} 
												onUpdateField={handleUpdateField} 
												onEdit={(u) => { setSelectedUser(u); setIsModalOpen(true); }} 
												onView={setViewingUser}
												onDelete={setUserToDelete} 
												currentUserId={currUser?.userId?._id} 
											/>
										))}
									</AnimatePresence>
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
								<p className="text-sm text-gray-500">
									Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="font-semibold text-gray-700">{filteredUsers.length}</span> users
								</p>
								<div className="flex items-center gap-2">
									<button 
										onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
										disabled={currentPage === 1}
										className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
									>
										<FiChevronLeft className="w-4 h-4" />
									</button>
									{Array.from({ length: totalPages }, (_, i) => i + 1)
										.filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
										.map((page, idx, arr) => (
											<span key={page} className="flex items-center">
												{idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-gray-400 px-1">...</span>}
												<button
													onClick={() => setCurrentPage(page)}
													className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${currentPage === page ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
												>
													{page}
												</button>
											</span>
										))
									}
									<button 
										onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
										disabled={currentPage === totalPages}
										className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
									>
										<FiChevronRight className="w-4 h-4" />
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery('')} />
				)}
			</div>

			{/* User Detail Modal */}
			<UserDetailModal 
				user={viewingUser} 
				isOpen={!!viewingUser} 
				onClose={() => setViewingUser(null)} 
			/>

			{/* Create/Edit Modal */}
			<UserModal 
				isOpen={isModalOpen} 
				onClose={() => setIsModalOpen(false)} 
				user={selectedUser} 
				onSubmit={(data) => {
					if (selectedUser) {
						updateUser({ id: selectedUser._id, data }, { onSuccess: () => setIsModalOpen(false) });
					} else {
						createUser(data, { onSuccess: () => setIsModalOpen(false) });
					}
				}} 
				isLoading={isCreating || isUpdating} 
			/>
			
			{/* Delete Confirmation Modal */}
			<DeleteConfirmModal 
				isOpen={!!userToDelete}
				onClose={() => setUserToDelete(null)}
				user={userToDelete}
				onConfirm={handleConfirmDelete}
				isLoading={isDeleting}
			/>
		</div>
	);
};

export default UsersPage;
