import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPayoutMethod } from "../services/seller.js";
import toast from "react-hot-toast";

/**
 * Hook to add payout method to seller profile
 */
export default function useAddPayoutMethod() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: addPayoutMethod,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seller-profile"] });
			toast.success("Payout method added successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to add payout method");
		},
	});

	return {
		addPayoutMethod: mutate,
		isAdding: isPending,
		error,
	};
}
