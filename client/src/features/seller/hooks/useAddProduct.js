import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../services/seller.js";
import toast from "react-hot-toast";

/**
 * Hook to add a new product
 */
export default function useAddProduct() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: addProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seller-products"] });
			toast.success("Product added successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to add product");
		},
	});

	return {
		addProduct: mutate,
		isAdding: isPending,
		error,
	};
}
