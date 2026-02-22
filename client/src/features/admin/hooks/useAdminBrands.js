import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAllBrands } from "../services/admin.js";

const useAdminBrands = () => {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "-createdAt";

  // Construct populate parameter
  // We need sellerId populated, and within sellerId, we need userId populated
  const populate = JSON.stringify({
    path: "sellerId",
    populate: { path: "userId", select: "firstName lastName email" }
  });

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["admin-brands", page, limit, search, sort],
    queryFn: () => getAllBrands({ page, limit, search, sort, populate }),
    keepPreviousData: true,
  });

  const brands = response?.data?.data || [];
  const total = response?.data?.total || 0;

  return {
    brands,
    total,
    loading: isLoading,
    error,
    refetch
  };
};

export default useAdminBrands;