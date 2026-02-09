import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../services/seller.js";
import toast from "react-hot-toast";

/**
 * Hook to delete a product
 */
export default function useDeleteProduct() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seller-products"] });
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
