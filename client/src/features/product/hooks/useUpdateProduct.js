import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct as updateProductService } from "../services/product.js";
import useToast from "../../../shared/hooks/useToast.js";

/**
 * Hook to update a product
 * @param {Object} options - Custom options
 * @param {string[]} options.invalidateKeys - Query keys to invalidate on success
 */
export default function useUpdateProduct({ invalidateKeys = ["products"] } = {}) {
	const queryClient = useQueryClient();
	const { showSuccess, showError } = useToast();

	const { mutate, isPending, error } = useMutation({
		mutationFn: ({ id, product }) => updateProductService(id, product),
		onSuccess: () => {
			invalidateKeys.forEach(key => {
				queryClient.invalidateQueries({ queryKey: [key] });
			});
			showSuccess("Product updated successfully!");
		},
		onError: (err) => {
			showError(err?.response?.data?.message || "Failed to update product");
		},
	});

	return {
		updateProduct: mutate,
		isUpdating: isPending,
		error,
	};
}
