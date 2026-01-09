import { deletProduct } from "../../../services/product.js";
import useMutationFactory from "../../../hooks/useMutationFactory.jsx";
export default function useDeleteProduct() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		deletProduct,
		"products",
		{ title: "Deleted Failed", message: "Something wrong,please try again" },
		{
			title: "Deleted Successful",
			message: "Product Deleted from your products.",
		}
	);
	return { error, data, deletProduct: mutate, isLoading };
}
