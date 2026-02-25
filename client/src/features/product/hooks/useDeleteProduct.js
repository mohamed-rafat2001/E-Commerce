import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletProduct as deleteProductService } from "../services/product.js";
import useToast from "../../../shared/hooks/useToast.js";

/**
 * Hook to delete a product
 * @param {Object} options - Custom options
 * @param {string[]} options.invalidateKeys - Query keys to invalidate on success
 */
export default function useDeleteProduct({ invalidateKeys = ["seller-products"] } = {}) {
	const queryClient = useQueryClient();
	const { showSuccess, showError } = useToast();

	const { mutate, isPending, error } = useMutation({
		mutationFn: deleteProductService,
		onSuccess: () => {
			invalidateKeys.forEach(key => {
				queryClient.invalidateQueries({ queryKey: [key] });
			});
			showSuccess("Product deleted successfully!");
		},
		onError: (err) => {
			showError(err?.response?.data?.message || "Failed to delete product");
		},
	});

	return {
		deleteProduct: mutate,
		isDeleting: isPending,
		error,
	};
}
