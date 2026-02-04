import { addToCart } from "../services/cart.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
export default function useAddToCart() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		addToCart,
		"cart",
		{ title: "Addd Failed", message: "Something wrong,please try again" },
		{ title: "Added Successful", message: "Product added to your cart" }
	);
	return { error, data, addToCart: mutate, isLoading };
}
