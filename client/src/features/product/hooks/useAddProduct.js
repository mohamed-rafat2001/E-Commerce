import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct as addProductService } from "../services/product.js";
import useToast from "../../../shared/hooks/useToast.js";

/**
 * Hook to add a new product
 * @param {Object} options - Custom options
 * @param {string[]} options.invalidateKeys - Query keys to invalidate on success
 */
export default function useAddProduct({ invalidateKeys = ["products"] } = {}) {
	const queryClient = useQueryClient();
	const { showSuccess, showError } = useToast();

	const { mutate, isPending, error } = useMutation({
		mutationFn: addProductService,
		onSuccess: () => {
			invalidateKeys.forEach(key => {
				queryClient.invalidateQueries({ queryKey: [key] });
			});
			showSuccess("Product added successfully!");
		},
		onError: (err) => {
			showError(err?.response?.data?.message || "Failed to add product");
		},
	});

	return {
		addProduct: mutate,
		isAdding: isPending,
		error,
	};
}
