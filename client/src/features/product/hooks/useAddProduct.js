import { addProduct } from "../../../services/product.js";
import useMutationFactory from "../../../hooks/useMutationFactory.jsx";
export default function useAddToCart() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		addProduct,
		"products",
		{ title: "Addd Failed", message: "Something wrong,please try again" },
		{ title: "Added Successful", message: "Product added to your products" }
	);
	return { error, data, addProd: mutate, isLoading };
}
