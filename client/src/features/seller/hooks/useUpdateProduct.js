import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../services/seller.js";
import toast from "react-hot-toast";

/**
 * Hook to update an existing product
 */
export default function useUpdateProduct() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: ({ id, product }) => updateProduct(id, product),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seller-products"] });
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
