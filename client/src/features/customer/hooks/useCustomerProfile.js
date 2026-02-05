import { useQuery } from "@tanstack/react-query";
import { getCustomerProfileFunc } from "../services/customerService.js";

/**
 * Hook to get customer profile and addresses
 */
export default function useCustomerProfile() {
	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["customerProfile"],
		queryFn: getCustomerProfileFunc,
	});

	const customer = response?.data?.data;

	return {
		customer,
		addresses: customer?.addresses || [],
		isLoading,
		error,
	};
}
