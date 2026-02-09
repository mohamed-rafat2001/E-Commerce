import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	UsersIcon,
	UserIcon 
} from '../../../shared/constants/icons.jsx';
import { Button, Modal, Input, Badge, LoadingSpinner } from '../../../shared/ui/index.js';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiMail, FiPhone, FiShield, FiUserCheck, FiUserX } from 'react-icons/fi';
import { useAdminUsers, useUpdateUser, useDeleteUser } from '../hooks/index.js';

// Mock data for users
const mockUsers = [
	{
		_id: '1',
		firstName: 'John',
		lastName: 'Smith',
		email: 'john.smith@example.com',
		phoneNumber: '+1234567890',
		role: 'Customer',
		status: 'active',
		createdAt: '2026-01-15',
		profileImage: null,
	},
	{
		_id: '2',
		firstName: 'Sarah',
		lastName: 'Johnson',
		email: 'sarah.j@example.com',
		phoneNumber: '+1234567891',
		role: 'Seller',
		status: 'active',
		createdAt: '2026-01-20',
		profileImage: null,
	},
	{
		_id: '3',
		firstName: 'Mike',
		lastName: 'Davis',
		email: 'mike.d@example.com',
		phoneNumber: '+1234567892',
		role: 'Customer',
		status: 'suspended',
		createdAt: '2026-02-01',
		profileImage: null,
	},
	{
		_id: '4',
		firstName: 'Emily',
		lastName: 'Wilson',
		email: 'emily.w@example.com',
		phoneNumber: '+1234567893',
		role: 'Admin',
		status: 'active',
		createdAt: '2025-12-10',
		profileImage: null,
	},
	{
		_id: '5',
		firstName: 'Alex',
		lastName: 'Chen',
		email: 'alex.chen@example.com',
		phoneNumber: '+1234567894',
		role: 'Seller',
		status: 'active',
		createdAt: '2026-02-05',
		profileImage: null,
	},
];

// Role badge configuration
const roleConfig = {
	Customer: { color: 'bg-blue-100 text-blue-700', icon: FiUserCheck },
	Seller: { color: 'bg-emerald-100 text-emerald-700', icon: FiShield },
	Admin: { color: 'bg-purple-100 text-purple-700', icon: FiShield },
	SuperAdmin: { color: 'bg-rose-100 text-rose-700', icon: FiShield },
};

const statusConfig = {
	active: { color: 'bg-emerald-100 text-emerald-700', label: 'Active' },
	suspended: { color: 'bg-amber-100 text-amber-700', label: 'Suspended' },
	deleted: { color: 'bg-rose-100 text-rose-700', label: 'Deleted' },
};

// User Edit Modal
const UserEditModal = ({ isOpen, onClose, user, onSubmit, isLoading }) => {
	const [formData, setFormData] = useState({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		email: user?.email || '',
		phoneNumber: user?.phoneNumber || '',
		role: user?.role || 'Customer',
		status: user?.status || 'active',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title="Edit User"
			size="md"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
						<Input
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							placeholder="First name"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
						<Input
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							placeholder="Last name"
							required
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<Input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="Email address"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
					<Input
						name="phoneNumber"
						value={formData.phoneNumber}
						onChange={handleChange}
						placeholder="Phone number"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
						<select
							name="role"
							value={formData.role}
							onChange={handleChange}
							className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
						>
							<option value="Customer">Customer</option>
							<option value="Seller">Seller</option>
							<option value="Admin">Admin</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
						>
							<option value="active">Active</option>
							<option value="suspended">Suspended</option>
							<option value="deleted">Deleted</option>
						</select>
					</div>
				</div>

				<div className="flex gap-3 pt-4">
					<Button variant="secondary" type="button" onClick={onClose} fullWidth>
						Cancel
					</Button>
					<Button type="submit" loading={isLoading} fullWidth>
						Update User
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
			className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
		>
			<td className="py-4 px-6">
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
						{user.firstName?.[0]}{user.lastName?.[0]}
					</div>
					<div>
						<h4 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h4>
						<div className="flex items-center gap-1 text-sm text-gray-500">
							<FiMail className="w-3 h-3" />
							<span>{user.email}</span>
						</div>
					</div>
				</div>
			</td>
			<td className="py-4 px-6">
				<div className="flex items-center gap-1 text-gray-600">
					<FiPhone className="w-4 h-4" />
					<span>{user.phoneNumber || 'N/A'}</span>
				</div>
			</td>
			<td className="py-4 px-6">
				<span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${roleConfig[user.role]?.color}`}>
					<RoleIcon className="w-3.5 h-3.5" />
					{user.role}
				</span>
			</td>
			<td className="py-4 px-6">
				<span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[user.status]?.color}`}>
					{statusConfig[user.status]?.label}
				</span>
			</td>
			<td className="py-4 px-6">
				<span className="text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
			</td>
			<td className="py-4 px-6">
				<div className="flex items-center gap-2">
					<button
						onClick={() => onEdit(user)}
						className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600"
						title="Edit user"
					>
						<FiEdit2 className="w-4 h-4" />
					</button>
					<button
						onClick={() => onToggleStatus(user)}
						className={`p-2 rounded-lg transition-colors ${user.status === 'active' ? 'hover:bg-amber-100 text-amber-600' : 'hover:bg-emerald-100 text-emerald-600'}`}
						title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
					>
						{user.status === 'active' ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
					</button>
					<button
						onClick={() => onDelete(user._id)}
						className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600"
						title="Delete user"
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
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-5 border border-gray-100"
	>
		<div className="flex items-center gap-4">
			<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
				<Icon className="w-6 h-6 text-white" />
			</div>
			<div>
				<h4 className="text-2xl font-bold text-gray-900">{value}</h4>
				<p className="text-sm text-gray-500">{title}</p>
				{subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
			</div>
		</div>
	</motion.div>
);

// Main Users Page
const UsersPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [editingUser, setEditingUser] = useState(null);
	
	// Use real hooks
	const { users: fetchedUsers, isLoading: isUsersLoading, refetch } = useAdminUsers();
	const { updateUser, isUpdating } = useUpdateUser();
	const { deleteUser, isDeleting } = useDeleteUser();
	
	// Fallback to mock data if API fails or returns empty (for demo purposes)
	const users = fetchedUsers?.length > 0 ? fetchedUsers : mockUsers;
	const isLoading = isUsersLoading;

	// Calculate stats
	const stats = useMemo(() => ({
		total: users.length,
		customers: users.filter(u => u.role === 'Customer').length,
		sellers: users.filter(u => u.role === 'Seller').length,
		admins: users.filter(u => u.role === 'Admin' || u.role === 'SuperAdmin').length,
		active: users.filter(u => u.status === 'active').length,
		suspended: users.filter(u => u.status === 'suspended').length,
	}), [users]);

	// Filter users
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

	const handleEdit = (user) => {
		setEditingUser(user);
	};

	const handleUpdateUser = (data) => {
		updateUser({ id: editingUser._id, data }, {
			onSuccess: () => {
				setEditingUser(null);
				// Refetch handled by hook 'onSuccess' invalidation
			}
		});
	};

	const handleDelete = (id) => {
		if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
			deleteUser(id);
		}
	};

	const handleToggleStatus = (user) => {
		const newStatus = user.status === 'active' ? 'suspended' : 'active';
		updateUser({ id: user._id, data: { status: newStatus } });
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">User Management 👥</h1>
				<p className="text-gray-500 mt-1">Manage all users, customers, sellers, and admins</p>
			</div>

			{/* Stats Row */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard title="Total Users" value={stats.total} icon={UsersIcon} gradient="from-indigo-500 to-purple-600" />
				<StatsCard title="Customers" value={stats.customers} icon={UserIcon} gradient="from-blue-500 to-cyan-500" />
				<StatsCard title="Sellers" value={stats.sellers} icon={FiShield} gradient="from-emerald-500 to-teal-600" />
				<StatsCard title="Admins" value={stats.admins} icon={FiShield} gradient="from-rose-500 to-pink-600" />
			</div>

			{/* Filters */}
			<div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100">
				<div className="relative flex-1">
					<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search by name or email..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					/>
				</div>
				<div className="flex items-center gap-2">
					<FiFilter className="text-gray-400 w-5 h-5" />
					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					>
						<option value="all">All Roles</option>
						<option value="Customer">Customer</option>
						<option value="Seller">Seller</option>
						<option value="Admin">Admin</option>
					</select>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					>
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="suspended">Suspended</option>
					</select>
				</div>
			</div>

			{/* Users Table */}
			{isLoading ? (
				<div className="flex justify-center py-20">
					<LoadingSpinner />
				</div>
			) : filteredUsers.length > 0 ? (
				<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">User</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Phone</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Role</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Joined</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Actions</th>
								</tr>
							</thead>
							<tbody>
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
					</div>
				</div>
			) : (
				<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
					<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<UsersIcon className="w-10 h-10 text-indigo-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
					<p className="text-gray-500">Try adjusting your search or filters</p>
				</div>
			)}

			{/* Edit Modal */}
			{editingUser && (
				<UserEditModal
					isOpen={!!editingUser}
					onClose={() => setEditingUser(null)}
					user={editingUser}
					onSubmit={handleUpdateUser}
					isLoading={false}
				/>
			)}
		</div>
	);
};

export default UsersPage;
