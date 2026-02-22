import { useQuery } from "@tanstack/react-query";
import { getUserFullDetails } from "../services/admin.js";

const useUserDetails = (userId) => {
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["admin-user-details", userId],
    queryFn: () => getUserFullDetails(userId),
    enabled: !!userId,
  });

  const user = response?.data?.data || null;

  return {
    user,
    loading: isLoading,
    error,
    refetch
  };
};

export default useUserDetails;
