import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
	createCategory, 
	updateCategory, 
	deleteCategory 
} from "../services/admin.js";
import { toast } from "react-hot-toast";

/**
 * Hook for creating a category
 */
export function useCreateCategory() {
	const queryClient = useQueryClient();

	const { mutate: addCategory, isLoading: isCreating } = useMutation({
		mutationFn: createCategory,
		onSuccess: (response) => {
			toast.success(response.message || "Category created successfully! 🎉");
			queryClient.invalidateQueries(["admin-categories"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Failed to create category");
		},
	});

	return { addCategory, isCreating };
}

/**
 * Hook for updating a category
 */
export function useUpdateCategory() {
	const queryClient = useQueryClient();

	const { mutate: editCategory, isLoading: isUpdating } = useMutation({
		mutationFn: ({ id, data }) => updateCategory(id, data),
		onSuccess: (response) => {
			toast.success("Category updated successfully! ✨");
			queryClient.invalidateQueries(["admin-categories"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Failed to update category");
		},
	});

	return { editCategory, isUpdating };
}

/**
 * Hook for deleting a category
 */
export function useDeleteCategory() {
	const queryClient = useQueryClient();

	const { mutate: removeCategory, isLoading: isDeleting } = useMutation({
		mutationFn: deleteCategory,
		onSuccess: (response) => {
			toast.success(response.message || "Category deleted successfully!");
			queryClient.invalidateQueries(["admin-categories"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Failed to delete category");
		},
	});

	return { removeCategory, isDeleting };
}
