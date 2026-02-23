import { Button, LoadingSpinner } from '../../../shared/ui/index.js';
import { FiPlus } from 'react-icons/fi';
import { useUsersPage } from '../hooks/index.js';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import UserFormModal from '../components/users/UserFormModal.jsx';
import UsersStats from '../components/users/UsersStats.jsx';
import UsersFilter from '../components/users/UsersFilter.jsx';
import UsersTable from '../components/users/UsersTable.jsx';

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
    handleUpdateField,
    handleConfirmDelete,
    handleViewUser,
    handleEditUser,
    handleSubmitUser
  } = useUsersPage();

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
      <UsersStats stats={stats} />

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 overflow-hidden">
        <UsersFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <UsersTable 
          filteredUsers={filteredUsers}
          paginatedUsers={paginatedUsers}
          handleUpdateField={handleUpdateField}
          handleEditUser={handleEditUser}
          handleViewUser={handleViewUser}
          setUserToDelete={setUserToDelete}
          currUser={currUser}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

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
