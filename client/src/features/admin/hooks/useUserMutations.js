import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, deleteUser } from "../services/admin.js";
import toast from "react-hot-toast";

/**
 * Hook to update a user
 */
export function useUpdateUser() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: ({ id, data }) => updateUser(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			toast.success("User updated successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to update user");
		},
	});

	return {
		updateUser: mutate,
		isUpdating: isPending,
		error,
	};
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			toast.success("User deleted successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to delete user");
		},
	});

	return {
		deleteUser: mutate,
		isDeleting: isPending,
		error,
	};
}
