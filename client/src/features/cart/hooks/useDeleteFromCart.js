import { deleteFromCart } from "../services/cart.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
export default function useDeleteFromCart() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteFromCart,
		"cart",
		{ title: "delete Failed", message: "Something wrong,please try again" },
		{ title: "deleted Successful", message: "Product deleted from your cart" }
	);
	return { error, data, deleteFromCart: mutate, isLoading };
}
