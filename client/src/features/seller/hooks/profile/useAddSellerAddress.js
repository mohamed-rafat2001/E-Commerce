import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSellerAddress } from "../../services/seller.js";
import toast from "react-hot-toast";

/**
 * Hook to add address to seller profile
 */
export default function useAddSellerAddress() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: addSellerAddress,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seller-profile"] });
			toast.success("Address added successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to add address");
		},
	});

	return {
		addAddress: mutate,
		isAdding: isPending,
		error,
	};
}
