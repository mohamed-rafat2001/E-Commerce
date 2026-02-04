import { deleteProducts } from "../services/product.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
export default function useDeleteAllProduct() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteProducts,
		"products",
		{ title: "Deleted Failed", message: "Something wrong,please try again" },
		{
			title: "Deleted Successful",
			message: "All Products Deleted.",
		}
	);
	return { error, data, deleteAllProducts: mutate, isLoading };
}
