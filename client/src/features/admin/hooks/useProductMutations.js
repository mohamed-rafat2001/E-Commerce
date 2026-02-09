import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct, deleteProduct } from "../services/admin.js";
import toast from "react-hot-toast";

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: ({ id, data }) => updateProduct(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-products"] });
			toast.success("Product updated successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to update product");
		},
	});

	return {
		updateProduct: mutate,
		isUpdating: isPending,
		error,
	};
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-products"] });
			toast.success("Product deleted successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to delete product");
		},
	});

	return {
		deleteProduct: mutate,
		isDeleting: isPending,
		error,
	};
}
