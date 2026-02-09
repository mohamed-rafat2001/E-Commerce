import { useState, useEffect } from 'react';
import { useAdminUsers } from './index.js';

const useUserDetails = (userId) => {
  const { users, isLoading: isUsersLoading, refetch } = useAdminUsers();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (users && users.length > 0) {
      const foundUser = users.find(u => u._id === userId);
      setUser(foundUser || null);
      setLoading(false);
    } else if (!isUsersLoading) {
      // Attempt to refetch if user not found in current list
      refetch();
    }
  }, [users, userId, isUsersLoading, refetch]);

  // Simulate loading user data if not in the list
  useEffect(() => {
    if (!user && !isUsersLoading && userId) {
      // In a real app, you'd make a specific API call to fetch user by ID
      // For now, we'll rely on the list data
      refetch();
    }
  }, [user, isUsersLoading, userId, refetch]);

  return {
    user,
    loading: loading || isUsersLoading,
    refetch
  };
};

export default useUserDetails;