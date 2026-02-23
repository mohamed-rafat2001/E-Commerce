import { useQuery } from "@tanstack/react-query";
import { getSellerProfile } from "../../services/seller.js";

/**
 * Hook to fetch seller's own profile
 */
export default function useSellerProfile() {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["seller-profile"],
		queryFn: getSellerProfile,
		staleTime: 60000,
	});

	const profile = response?.data?.data || null;

	return {
		profile,
		isLoading,
		error,
		refetch,
	};
}
