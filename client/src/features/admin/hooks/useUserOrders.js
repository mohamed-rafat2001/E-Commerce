// Simple hook to return loading state
const useUserOrders = (userId) => {
  return {
    data: [],
    isLoading: false,
    isError: false,
    error: null
  };
};

export default useUserOrders;