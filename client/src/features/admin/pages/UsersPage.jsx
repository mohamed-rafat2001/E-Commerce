import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Select, LoadingSpinner } from '../../../shared/ui/index.js';
import { FiSearch, FiPlus, FiUsers, FiUser, FiShoppingBag, FiShield, FiUserX, FiExternalLink } from 'react-icons/fi';
import { useAdminUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/index.js';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';
import { roleOptions, statusOptions, ITEMS_PER_PAGE } from '../components/users/userConstants.js';
import AdminStatCard from '../components/AdminStatCard.jsx';
import Pagination from '../components/Pagination.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import UserFormModal from '../components/users/UserFormModal.jsx';
import UserRow from '../components/users/UserRow.jsx';

const UsersPage = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [selectedUser, setSelectedUser] = useState(null);
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

	const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
	const paginatedUsers = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredUsers, currentPage]);

	useMemo(() => { setCurrentPage(1); }, [searchQuery, roleFilter, statusFilter]);

	const stats = useMemo(() => ({
		total: users.length,
		customers: users.filter(u => u.role === 'Customer').length,
		sellers: users.filter(u => u.role === 'Seller').length,
		admins: users.filter(u => u.role === 'Admin' || u.role === 'SuperAdmin').length,
		suspended: users.filter(u => u.status === 'suspended').length,
	}), [users]);

	const handleUpdateField = (id, data) => { updateUser({ id, data }); };

	const handleConfirmDelete = () => {
		if (userToDelete) {
			deleteUser(userToDelete._id, { onSuccess: () => setUserToDelete(null) });
		}
	};

	const handleViewUser = (user) => {
		navigate(`/admin/users/${user._id}`);
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
				<AdminStatCard label="Total Users" value={stats.total} icon={FiUsers} color="bg-gray-900" />
				<AdminStatCard label="Customers" value={stats.customers} icon={FiUser} color="bg-blue-600" />
				<AdminStatCard label="Sellers" value={stats.sellers} icon={FiShoppingBag} color="bg-emerald-600" />
				<AdminStatCard label="Admins" value={stats.admins} icon={FiShield} color="bg-purple-600" />
				<AdminStatCard label="Suspended" value={stats.suspended} icon={FiUserX} color="bg-rose-500" />
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
							<Select containerClassName="min-w-[160px] flex-1 lg:flex-none" label="Role" value={roleFilter} onChange={setRoleFilter} options={[{ value: 'all', label: 'All Roles' }, ...roleOptions]} />
							<Select containerClassName="min-w-[160px] flex-1 lg:flex-none" label="Status" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All Statuses' }, ...statusOptions]} />
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
												onView={handleViewUser}
												onDelete={setUserToDelete} 
												currentUserId={currUser?.userId?._id} 
											/>
										))}
									</AnimatePresence>
								</tbody>
							</table>
						</div>

						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							totalItems={filteredUsers.length}
							itemsPerPage={ITEMS_PER_PAGE}
							onPageChange={setCurrentPage}
							itemLabel="users"
						/>
					</>
				) : (
					<EmptyState
						icon={FiUsers}
						title={searchQuery ? 'No users found' : 'No users yet'}
						subtitle={searchQuery ? `No users match "${searchQuery}". Try a different search.` : 'Create your first user to get started.'}
						searchQuery={searchQuery}
						onClear={() => setSearchQuery('')}
					/>
				)}
			</div>

			<UserFormModal 
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
			
			<DeleteConfirmModal 
				isOpen={!!userToDelete}
				onClose={() => setUserToDelete(null)}
				title="Delete User"
				entityName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ''}
				description={userToDelete ? ` (${userToDelete.email}). This action cannot be undone.` : undefined}
				onConfirm={handleConfirmDelete}
				isLoading={isDeleting}
			/>
		</div>
	);
};

export default UsersPage;
