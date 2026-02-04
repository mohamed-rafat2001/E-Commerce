import { updateProduct } from "../services/product.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
export default function useUpdateProduct() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		updateProduct,
		"products",
		{ title: "Updated Failed", message: "Something wrong,please try again" },
		{ title: "Updated Successful", message: "Product Updated." }
	);
	return { error, data, updateProduct: mutate, isLoading };
}
