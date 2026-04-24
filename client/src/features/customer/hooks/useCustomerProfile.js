import { useQuery } from "@tanstack/react-query";
import { getCustomerProfileFunc } from "../services/customerService.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";

/**
 * Hook to get customer profile and addresses
 */
export default function useCustomerProfile() {
	const { isAuthenticated } = useCurrentUser();

	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["customerProfile"],
		queryFn: getCustomerProfileFunc,
		enabled: isAuthenticated,
	});

	const customer = response?.data?.data;

	return {
		customer,
		addresses: customer?.addresses || [],
		isLoading,
		error,
	};
}
