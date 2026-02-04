import { getProduct } from "../services/product.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
export default function useGetProduct() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		getProduct,
		"products",
		{ title: "Product not found", message: "Something wrong,please try again" },
		{ title: "", message: "" }
	);
	return { error, data, getProduct: mutate, isLoading };
}
