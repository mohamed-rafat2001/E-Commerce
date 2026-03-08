import { PageHeader, Button, Card, Skeleton, Badge, DataTable, EmptyState } from '../../../shared/ui/index.js';
import { FiPlus, FiUser, FiMoreVertical, FiEye, FiTrash2 } from 'react-icons/fi';
import { useUsersPage } from '../hooks/index.js';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import UserFormModal from '../components/users/UserFormModal.jsx';
import UsersStats from '../components/users/UsersStats.jsx';
import UsersFilter from '../components/users/UsersFilter.jsx';

const UsersPage = () => {
  const {
    // State
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    selectedUser,
    setSelectedUser,
    isModalOpen,
    setIsModalOpen,
    userToDelete,
    setUserToDelete,
    currentPage,
    setCurrentPage,

    // Data
    filteredUsers,
    paginatedUsers,
    totalPages,
    stats,
    currUser,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    // Functions
    handleConfirmDelete,
    handleViewUser,
    handleEditUser,
    handleSubmitUser
  } = useUsersPage();

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold overflow-hidden border border-gray-200">
            {row.avatar?.secure_url ? (
              <img src={row.avatar.secure_url} alt="" className="w-full h-full object-cover" />
            ) : (
              row.firstName?.[0] || 'U'
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-none">{row.firstName} {row.lastName}</span>
            <span className="text-xs text-gray-400 mt-1">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      render: (row) => (
        <Badge variant={row.role === 'admin' ? 'primary' : row.role === 'seller' ? 'info' : 'default'}>
          {row.role.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'error'}>
          {row.active ? 'Active' : 'Banned'}
        </Badge>
      )
    },
    {
      header: 'Joined',
      render: (row) => <span className="text-gray-500 font-medium">{new Date(row.createdAt).toLocaleDateString()}</span>
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="sm" onClick={() => handleViewUser(row)} icon={<FiEye />} />
          <Button variant="ghost" size="sm" onClick={() => handleEditUser(row)} icon={<FiMoreVertical />} />
          <Button variant="ghost" size="sm" onClick={() => setUserToDelete(row)} icon={<FiTrash2 />} className="text-red-400 hover:text-red-600" />
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton variant="text" className="w-1/4 h-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton variant="card" count={4} />
        </div>
        <Skeleton variant="card" className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Account Management"
        subtitle="Full administrative control over user accounts, permissions, and roles."
        actions={
          <Button
            onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
            icon={<FiPlus className="w-5 h-5" />}
            className="shadow-xl"
          >
            Create New User
          </Button>
        }
      />

      <UsersStats stats={stats} />

      <Card padding="none" className="overflow-hidden">
        <UsersFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {filteredUsers.length > 0 ? (
          <DataTable
            columns={columns}
            data={paginatedUsers}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            currentPage={currentPage}
          />
        ) : (
          <EmptyState
            icon={<FiUser className="w-12 h-12" />}
            title="No users found"
            message="Your search didn't return any results. Try adjusting your filters."
          />
        )}
      </Card>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSubmit={handleSubmitUser}
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
