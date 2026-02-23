import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProducts as deleteProductsService } from "../services/product.js";
import useToast from "../../../shared/hooks/useToast.js";

/**
 * Hook to delete all products
 * @param {Object} options - Custom options
 * @param {string[]} options.invalidateKeys - Query keys to invalidate on success
 */
export default function useDeleteAllProducts({ invalidateKeys = ["products"] } = {}) {
	const queryClient = useQueryClient();
	const { showSuccess, showError } = useToast();

	const { mutate, isPending, error } = useMutation({
		mutationFn: deleteProductsService,
		onSuccess: () => {
			invalidateKeys.forEach(key => {
				queryClient.invalidateQueries({ queryKey: [key] });
			});
			showSuccess("All products deleted successfully!");
		},
		onError: (err) => {
			showError(err?.response?.data?.message || "Failed to delete products");
		},
	});

	return {
		deleteAllProducts: mutate,
		isDeleting: isPending,
		error,
	};
}
