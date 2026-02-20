import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSellerProfile } from "../services/seller.js";
import toast from "react-hot-toast";

/**
 * Hook to update seller profile
 */
export default function useUpdateSellerProfile() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: updateSellerProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seller-profile"] });
			queryClient.invalidateQueries({ queryKey: ["sellerDashboardStats"] });
			toast.success("Profile updated successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to update profile");
		},
	});

	return {
		updateProfile: mutate,
		isUpdating: isPending,
		error,
	};
}
