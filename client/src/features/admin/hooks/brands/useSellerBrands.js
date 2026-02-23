import { useQuery } from "@tanstack/react-query";
import { getAllBrands } from "../../services/admin.js";

const useSellerBrands = (sellerId, page = 1, limit = 5) => {
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["admin-seller-brands", sellerId, page, limit],
    queryFn: () => getAllBrands({ 
        page, 
        limit, 
        sellerId, // Filter by sellerId
        sort: '-createdAt'
    }),
    enabled: !!sellerId,
    keepPreviousData: true,
  });

  const brands = response?.data?.data || [];
  const total = response?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    brands,
    total,
    totalPages,
    loading: isLoading,
    error,
    refetch
  };
};

export default useSellerBrands;