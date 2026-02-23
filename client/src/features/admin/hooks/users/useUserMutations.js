import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser } from "../../services/admin.js";
import toast from "react-hot-toast";

/**
 * Hook to create a user
 */
export function useCreateUser() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: createUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			toast.success("User created successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to create user");
		},
	});

	return {
		createUser: mutate,
		isCreating: isPending,
		error,
	};
}

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
