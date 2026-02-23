import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminUsers from './useAdminUsers.js';
import { useCreateUser, useUpdateUser, useDeleteUser } from './useUserMutations.js';
import useCurrentUser from '../../../user/hooks/useCurrentUser.js';
import { ITEMS_PER_PAGE } from '../../components/users/userConstants.js';

const useUsersPage = () => {
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

  const users = useMemo(() => allUsers || [], [allUsers]);

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

  useEffect(() => { setCurrentPage(1); }, [searchQuery, roleFilter, statusFilter]);

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
      deleteUser(userToDelete._id, { onSuccess: () => setUserToDelete(null) });
    }
  };

  const handleViewUser = (user) => {
    navigate(`/admin/users/${user._id}`);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmitUser = (data) => {
    if (selectedUser) {
      updateUser({ id: selectedUser._id, data }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createUser(data, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  return {
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
    users,
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
  };
};

export default useUsersPage;